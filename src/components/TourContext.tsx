import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'; // 👈 type import for ReactNode
import { client } from '../sanity/client';
import type { SanityImageSource } from '@sanity/image-url'; // 👈 simplified import
import { loadTourIndex, saveTourIndex, clearTourIndex } from '../utils/tourStorage';
import { TOUR_QUERY } from '../components/tourQueries';

interface TourPost {
  _id: string;
  title: string;
  excerpt: string;
  slug: { current: string };
  mainImage?: SanityImageSource;
  liveDemoUrl?: string;
  publishedAt: string;
}

interface TourContextType {
  isTourActive: boolean;
  tourPosts: TourPost[];
  currentIndex: number;
  startTour: () => void;
  endTour: () => void;
  nextPost: () => void;
  prevPost: () => void;
  loading: boolean;
}

const TourContext = createContext<TourContextType | undefined>(undefined);

// eslint-disable-next-line react-refresh/only-export-components
export const useTour = () => {
  const context = useContext(TourContext);
  if (!context) throw new Error('useTour must be used within TourProvider');
  return context;
};

interface TourProviderProps {
  children: ReactNode;
}

export const TourProvider: React.FC<TourProviderProps> = ({ children }) => {
  const [isTourActive, setIsTourActive] = useState(false);
  const [tourPosts, setTourPosts] = useState<TourPost[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTourPosts = async () => {
      try {
        const data = await client.fetch(TOUR_QUERY);
        setTourPosts(data);
        const savedIndex = loadTourIndex();
        if (savedIndex !== null && savedIndex < data.length) {
          setCurrentIndex(savedIndex);
        }
      } catch (error) {
        console.error('Error fetching tour posts:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchTourPosts();
  }, []);

  const startTour = () => setIsTourActive(true);
  const endTour = () => {
    setIsTourActive(false);
    clearTourIndex();
  };

  const nextPost = () => {
    if (currentIndex < tourPosts.length - 1) {
      const newIndex = currentIndex + 1;
      setCurrentIndex(newIndex);
      saveTourIndex(newIndex);
    }
  };

  const prevPost = () => {
    if (currentIndex > 0) {
      const newIndex = currentIndex - 1;
      setCurrentIndex(newIndex);
      saveTourIndex(newIndex);
    }
  };

  const value = {
    isTourActive,
    tourPosts,
    currentIndex,
    startTour,
    endTour,
    nextPost,
    prevPost,
    loading,
  };

  return <TourContext.Provider value={value}>{children}</TourContext.Provider>;
};