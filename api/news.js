export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    const params = new URLSearchParams({
      category: 'technology',
      language: 'en',
      pageSize: '10',
      apiKey: process.env.NEWSAPI_KEY,
    });

    const response = await fetch(`https://newsapi.org/v2/top-headlines?${params.toString()}`);
    const data = await response.json();

    if (data.status !== 'ok' || !data.articles || data.articles.length === 0) {
      return res.status(200).json({ article: null });
    }

    // Prefer the first article that actually has an image
    const withImage = data.articles.find((a) => a.urlToImage);
    const chosen = withImage || data.articles[0];

    return res.status(200).json({
      article: {
        title: chosen.title,
        description: chosen.description,
        url: chosen.url,
        urlToImage: chosen.urlToImage,
      },
    });
  } catch (error) {
    console.error('NewsAPI Error:', error);
    return res.status(500).json({ article: null, error: 'Failed to fetch news' });
  }
}