// Person Cache Service - Handles caching for actors and directors
const CACHE_PREFIX = 'mr_person_';
const CACHE_EXPIRY = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds

export interface CachedPerson {
  id: number;
  data: any;
  cachedAt: number;
}

export interface PersonCredits {
  id: number;
  cast: any[];
  crew: any[];
  cachedAt: number;
}

// Get cached person data
export const getCachedPerson = (personId: number): any | null => {
  try {
    const cached = localStorage.getItem(`${CACHE_PREFIX}${personId}`);
    if (!cached) return null;

    const parsedCache: CachedPerson = JSON.parse(cached);
    const now = Date.now();

    // Check if cache is still valid
    if (now - parsedCache.cachedAt > CACHE_EXPIRY) {
      localStorage.removeItem(`${CACHE_PREFIX}${personId}`);
      localStorage.removeItem(`${CACHE_PREFIX}credits_${personId}`);
      return null;
    }

    return parsedCache.data;
  } catch (error) {
    console.error('Error reading person cache:', error);
    return null;
  }
};

// Set cached person data
export const setCachedPerson = (personId: number, data: any): void => {
  try {
    const cacheData: CachedPerson = {
      id: personId,
      data,
      cachedAt: Date.now(),
    };
    localStorage.setItem(`${CACHE_PREFIX}${personId}`, JSON.stringify(cacheData));
  } catch (error) {
    console.error('Error saving person cache:', error);
  }
};

// Get cached person credits
export const getCachedPersonCredits = (personId: number): any | null => {
  try {
    const cached = localStorage.getItem(`${CACHE_PREFIX}credits_${personId}`);
    if (!cached) return null;

    const parsedCache: PersonCredits = JSON.parse(cached);
    const now = Date.now();

    if (now - parsedCache.cachedAt > CACHE_EXPIRY) {
      localStorage.removeItem(`${CACHE_PREFIX}credits_${personId}`);
      return null;
    }

    return { cast: parsedCache.cast, crew: parsedCache.crew };
  } catch (error) {
    console.error('Error reading person credits cache:', error);
    return null;
  }
};

// Set cached person credits
export const setCachedPersonCredits = (personId: number, cast: any[], crew: any[]): void => {
  try {
    const cacheData: PersonCredits = {
      id: personId,
      cast,
      crew,
      cachedAt: Date.now(),
    };
    localStorage.setItem(`${CACHE_PREFIX}credits_${personId}`, JSON.stringify(cacheData));
  } catch (error) {
    console.error('Error saving person credits cache:', error);
  }
};

// Clear all person cache
export const clearPersonCache = (): void => {
  try {
    const keys = Object.keys(localStorage);
    keys.forEach((key) => {
      if (key.startsWith(CACHE_PREFIX)) {
        localStorage.removeItem(key);
      }
    });
  } catch (error) {
    console.error('Error clearing person cache:', error);
  }
};

// Get cache statistics
export const getCacheStats = (): { count: number; oldestItem: number | null; newestItem: number | null } => {
  try {
    const keys = Object.keys(localStorage).filter((k) => k.startsWith(CACHE_PREFIX));
    if (keys.length === 0) return { count: 0, oldestItem: null, newestItem: null };

    let oldestItem: number | null = null;
    let newestItem: number | null = null;

    keys.forEach((key) => {
      try {
        const cached = JSON.parse(localStorage.getItem(key) || '{}');
        if (cached.cachedAt) {
          if (!oldestItem || cached.cachedAt < oldestItem) oldestItem = cached.cachedAt;
          if (!newestItem || cached.cachedAt > newestItem) newestItem = cached.cachedAt;
        }
      } catch (e) {
        // Skip invalid entries
      }
    });

    return { count: keys.length, oldestItem, newestItem };
  } catch (error) {
    return { count: 0, oldestItem: null, newestItem: null };
  }
};