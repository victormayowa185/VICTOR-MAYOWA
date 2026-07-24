import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.KV_REST_API_URL,
  token: process.env.KV_REST_API_TOKEN,
});

const TIMEZONE = 'Africa/Lagos';

function getLagosDateAndHour() {
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: TIMEZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    hour12: false,
  });
  const parts = formatter.formatToParts(new Date());
  const map = {};
  parts.forEach((p) => { map[p.type] = p.value; });

  return {
    dateKey: `${map.year}-${map.month}-${map.day}`,
    hour: parseInt(map.hour, 10),
  };
}

async function fetchTwoArticles() {
  const params = new URLSearchParams({
    category: 'technology',
    language: 'en',
    pageSize: '20',
    apiKey: process.env.NEWSAPI_KEY,
  });

  const response = await fetch(`https://newsapi.org/v2/top-headlines?${params.toString()}`);
  const data = await response.json();

  if (data.status !== 'ok' || !data.articles) return [];

  return data.articles
    .filter((a) => a.urlToImage)
    .slice(0, 2)
    .map((a) => ({
      title: a.title,
      description: a.description,
      url: a.url,
      urlToImage: a.urlToImage,
    }));
}

export default async function handler(req, res) {
  console.log('DEBUG ENV CHECK:', {
    hasKvUrl: !!process.env.KV_REST_API_URL,
    hasKvToken: !!process.env.KV_REST_API_TOKEN,
    hasNewsKey: !!process.env.NEWSAPI_KEY,
  });

  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    const { dateKey, hour } = getLagosDateAndHour();
    const cacheKey = `daily-news:${dateKey}`;

    let picks = await redis.get(cacheKey);

    if (!picks || !Array.isArray(picks) || picks.length === 0) {
      picks = await fetchTwoArticles();
      if (picks.length > 0) {
        await redis.set(cacheKey, picks, { ex: 60 * 60 * 30 });
      }
    }

    if (!picks || picks.length === 0) {
      return res.status(200).json({ article: null });
    }

    const chosen = hour < 12 ? picks[0] : (picks[1] || picks[0]);

    return res.status(200).json({ article: chosen });
  } catch (error) {
    console.error('News cache error:', error);
    return res.status(200).json({ article: null });
  }
}