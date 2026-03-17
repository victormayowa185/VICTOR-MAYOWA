// src/utils/tourStorage.ts
const TOUR_STORAGE_KEY = 'blog-tour-index';

export const saveTourIndex = (index: number) => {
  localStorage.setItem(TOUR_STORAGE_KEY, index.toString());
};

export const loadTourIndex = (): number | null => {
  const saved = localStorage.getItem(TOUR_STORAGE_KEY);
  return saved ? parseInt(saved, 10) : null;
};

export const clearTourIndex = () => {
  localStorage.removeItem(TOUR_STORAGE_KEY);
};