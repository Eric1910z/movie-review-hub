import { User, WatchlistItem, UserPreferences } from '../types';

const USERS_KEY = 'moviehub_users';
const CURRENT_USER_KEY = 'moviehub_current_user';
const WATCHLIST_KEY = 'moviehub_watchlist';
const RATINGS_KEY = 'moviehub_ratings';
const REVIEWS_KEY = 'moviehub_reviews';

// User Management
export const getUsers = (): Record<string, User & { password: string }> => {
  const users = localStorage.getItem(USERS_KEY);
  return users ? JSON.parse(users) : {};
};

export const saveUsers = (users: Record<string, User & { password: string }>) => {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

export const createUser = (email: string, username: string, password: string): User => {
  const users = getUsers();
  if (users[email]) {
    throw new Error('Email already exists');
  }

  const newUser: User & { password: string } = {
    id: `user_${Date.now()}`,
    email,
    username,
    display_name: username,
    avatar_url: `https://ui-avatars.com/api/?name=${encodeURIComponent(username)}&background=random`,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    password, // In production, this should be hashed
    preferences: {
      theme: 'system',
      language: 'en',
      notifications: true,
    },
  };

  users[email] = newUser;
  saveUsers(users);

  const { password: _, ...userWithoutPassword } = newUser;
  return userWithoutPassword as User;
};

export const authenticateUser = (email: string, password: string): User | null => {
  const users = getUsers();
  const user = users[email];

  if (user && user.password === password) {
    const { password: _, ...userWithoutPassword } = user;
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userWithoutPassword));
    return userWithoutPassword as User;
  }
  return null;
};

export const logoutUser = () => {
  localStorage.removeItem(CURRENT_USER_KEY);
};

export const getCurrentUser = (): User | null => {
  const user = localStorage.getItem(CURRENT_USER_KEY);
  return user ? JSON.parse(user) : null;
};

export const updateUserPreferences = (userId: string, preferences: Partial<UserPreferences>) => {
  const users = getUsers();
  const email = Object.keys(users).find(key => users[key].id === userId);

  if (email && users[email]) {
    users[email].preferences = { ...users[email].preferences, ...preferences };
    users[email].updated_at = new Date().toISOString();
    saveUsers(users);

    // Update current user in storage
    const currentUser = getCurrentUser();
    if (currentUser && currentUser.id === userId) {
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(users[email]));
    }
  }
};

// Watchlist Management
export const getWatchlist = (userId: string): WatchlistItem[] => {
  const watchlist = localStorage.getItem(`${WATCHLIST_KEY}_${userId}`);
  return watchlist ? JSON.parse(watchlist) : [];
};

export const addToWatchlist = (userId: string, item: Omit<WatchlistItem, 'id' | 'user_id' | 'added_at'>): WatchlistItem => {
  const watchlist = getWatchlist(userId);
  const newItem: WatchlistItem = {
    ...item,
    id: `watchlist_${Date.now()}`,
    user_id: userId,
    added_at: new Date().toISOString(),
  };
  watchlist.push(newItem);
  localStorage.setItem(`${WATCHLIST_KEY}_${userId}`, JSON.stringify(watchlist));
  return newItem;
};

export const updateWatchlistItemStatus = (userId: string, itemId: string, status: WatchlistItem['status']) => {
  const watchlist = getWatchlist(userId);
  const index = watchlist.findIndex(item => item.id === itemId);
  if (index !== -1) {
    watchlist[index].status = status;
    if (status === 'watched') {
      watchlist[index].watched_at = new Date().toISOString();
    }
    localStorage.setItem(`${WATCHLIST_KEY}_${userId}`, JSON.stringify(watchlist));
  }
};

export const removeFromWatchlist = (userId: string, itemId: string) => {
  const watchlist = getWatchlist(userId);
  const filtered = watchlist.filter(item => item.id !== itemId);
  localStorage.setItem(`${WATCHLIST_KEY}_${userId}`, JSON.stringify(filtered));
};

// Ratings
export const getRatings = (userId: string): Record<number, number> => {
  const ratings = localStorage.getItem(`${RATINGS_KEY}_${userId}`);
  return ratings ? JSON.parse(ratings) : {};
};

export const rateMovie = (userId: string, movieId: number, rating: number) => {
  const ratings = getRatings(userId);
  ratings[movieId] = rating;
  localStorage.setItem(`${RATINGS_KEY}_${userId}`, JSON.stringify(ratings));
};

export const getMovieRating = (userId: string, movieId: number): number | null => {
  const ratings = getRatings(userId);
  return ratings[movieId] ?? null;
};

// Reviews
export interface Review {
  id: string;
  userId: string;
  movieId: number;
  content: string;
  rating: number;
  createdAt: string;
  updatedAt: string;
}

export const getReviews = (userId: string): Review[] => {
  const reviews = localStorage.getItem(`${REVIEWS_KEY}_${userId}`);
  return reviews ? JSON.parse(reviews) : [];
};

export const getAllReviewsForMovie = (movieId: number): (Review & { user: User })[] => {
  const users = getUsers();
  const allReviews: (Review & { user: User })[] = [];

  Object.values(users).forEach(user => {
    const reviews = getReviews(user.id);
    reviews.filter(r => r.movieId === movieId).forEach(review => {
      const { password: _, ...userWithoutPassword } = user;
      allReviews.push({ ...review, user: userWithoutPassword as User });
    });
  });

  return allReviews.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
};

export const addReview = (userId: string, movieId: number, content: string, rating: number): Review => {
  const reviews = getReviews(userId);
  const newReview: Review = {
    id: `review_${Date.now()}`,
    userId,
    movieId,
    content,
    rating,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  reviews.push(newReview);
  localStorage.setItem(`${REVIEWS_KEY}_${userId}`, JSON.stringify(reviews));
  return newReview;
};

export const updateReview = (userId: string, reviewId: string, content: string, rating: number): Review | null => {
  const reviews = getReviews(userId);
  const index = reviews.findIndex(r => r.id === reviewId);
  if (index !== -1) {
    reviews[index] = {
      ...reviews[index],
      content,
      rating,
      updatedAt: new Date().toISOString(),
    };
    localStorage.setItem(`${REVIEWS_KEY}_${userId}`, JSON.stringify(reviews));
    return reviews[index];
  }
  return null;
};

export const deleteReview = (userId: string, reviewId: string) => {
  const reviews = getReviews(userId);
  const filtered = reviews.filter(r => r.id !== reviewId);
  localStorage.setItem(`${REVIEWS_KEY}_${userId}`, JSON.stringify(filtered));
};

export const checkWatchlistItem = (userId: string, tmdbId: number): WatchlistItem | null => {
  const watchlist = getWatchlist(userId);
  return watchlist.find(item => item.tmdb_id === tmdbId) || null;
};