import { Movie, MovieDetails, PaginatedResponse, Person, PersonCredits, Review, VideosResponse, ImagesResponse, MovieCast, CrewMember } from '../types';

const API_KEY = 'ea652c6414780a074f41f40b371f3eee';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';

export const getImageUrl = (path: string | null, size: 'w92' | 'w185' | 'w342' | 'w500' | 'w780' | 'w1280' | 'h632' | 'original' = 'w500'): string => {
  if (!path) return '/placeholder.png';
  return `${IMAGE_BASE_URL}/${size}${path}`;
};

// Movies
export const getTrendingMovies = async (timeWindow: 'day' | 'week' = 'week'): Promise<Movie[]> => {
  const response = await fetch(`${BASE_URL}/trending/movie/${timeWindow}?api_key=${API_KEY}`);
  const data = await response.json();
  return data.results;
};

export const getPopularMovies = async (page: number = 1): Promise<PaginatedResponse<Movie>> => {
  const response = await fetch(`${BASE_URL}/movie/popular?api_key=${API_KEY}&page=${page}`);
  return response.json();
};

export const getTopRatedMovies = async (page: number = 1): Promise<PaginatedResponse<Movie>> => {
  const response = await fetch(`${BASE_URL}/movie/top_rated?api_key=${API_KEY}&page=${page}`);
  return response.json();
};

export const getNowPlayingMovies = async (page: number = 1): Promise<PaginatedResponse<Movie>> => {
  const response = await fetch(`${BASE_URL}/movie/now_playing?api_key=${API_KEY}&page=${page}`);
  return response.json();
};

export const getUpcomingMovies = async (page: number = 1): Promise<PaginatedResponse<Movie>> => {
  const response = await fetch(`${BASE_URL}/movie/upcoming?api_key=${API_KEY}&page=${page}`);
  return response.json();
};

export const getMovieDetails = async (movieId: number): Promise<MovieDetails> => {
  const response = await fetch(`${BASE_URL}/movie/${movieId}?api_key=${API_KEY}&append_to_response=credits,images,videos`);
  return response.json();
};

export const getMovieCredits = async (movieId: number): Promise<{ cast: MovieCast[]; crew: CrewMember[] }> => {
  const response = await fetch(`${BASE_URL}/movie/${movieId}/credits?api_key=${API_KEY}`);
  return response.json();
};

export const getMovieReviews = async (movieId: number): Promise<{ results: Review[] }> => {
  const response = await fetch(`${BASE_URL}/movie/${movieId}/reviews?api_key=${API_KEY}`);
  return response.json();
};

export const getMovieVideos = async (movieId: number): Promise<VideosResponse> => {
  const response = await fetch(`${BASE_URL}/movie/${movieId}/videos?api_key=${API_KEY}`);
  return response.json();
};

export const getMovieImages = async (movieId: number): Promise<ImagesResponse> => {
  const response = await fetch(`${BASE_URL}/movie/${movieId}/images?api_key=${API_KEY}`);
  return response.json();
};

export const getMovieRecommendations = async (movieId: number): Promise<PaginatedResponse<Movie>> => {
  const response = await fetch(`${BASE_URL}/movie/${movieId}/recommendations?api_key=${API_KEY}`);
  return response.json();
};

export const getSimilarMovies = async (movieId: number): Promise<PaginatedResponse<Movie>> => {
  const response = await fetch(`${BASE_URL}/movie/${movieId}/similar?api_key=${API_KEY}`);
  return response.json();
};

// Discover/Search
export const discoverMovies = async (params: {
  page?: number;
  sort_by?: string;
  year?: number;
  genre?: number;
  vote_count_gte?: number;
  vote_average_gte?: number;
}): Promise<PaginatedResponse<Movie>> => {
  const queryParams = new URLSearchParams({
    api_key: API_KEY,
    page: String(params.page || 1),
    sort_by: params.sort_by || 'popularity.desc',
  });
  if (params.year) queryParams.append('primary_release_year', String(params.year));
  if (params.genre) queryParams.append('with_genres', String(params.genre));
  if (params.vote_count_gte) queryParams.append('vote_count.gte', String(params.vote_count_gte));
  if (params.vote_average_gte) queryParams.append('vote_average.gte', String(params.vote_average_gte));

  const response = await fetch(`${BASE_URL}/discover/movie?${queryParams}`);
  return response.json();
};

// Search
export const searchMulti = async (query: string, page: number = 1): Promise<PaginatedResponse<Movie | any>> => {
  const response = await fetch(`${BASE_URL}/search/multi?api_key=${API_KEY}&query=${encodeURIComponent(query)}&page=${page}`);
  return response.json();
};

export const searchMovies = async (query: string, page: number = 1): Promise<PaginatedResponse<Movie>> => {
  const response = await fetch(`${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}&page=${page}`);
  return response.json();
};

// People
export const getPersonDetails = async (personId: number): Promise<Person> => {
  const response = await fetch(`${BASE_URL}/person/${personId}?api_key=${API_KEY}&append_to_response=movie_credits,tv_credits`);
  return response.json();
};

export const getPersonMovieCredits = async (personId: number): Promise<PersonCredits> => {
  const response = await fetch(`${BASE_URL}/person/${personId}/movie_credits?api_key=${API_KEY}`);
  return response.json();
};

export const getPersonImages = async (personId: number): Promise<{ profiles: any[] }> => {
  const response = await fetch(`${BASE_URL}/person/${personId}/images?api_key=${API_KEY}`);
  return response.json();
};

// Genres
export const getMovieGenres = async (): Promise<{ genres: { id: number; name: string }[] }> => {
  const response = await fetch(`${BASE_URL}/genre/movie/list?api_key=${API_KEY}`);
  return response.json();
};

export const getTVGenres = async (): Promise<{ genres: { id: number; name: string }[] }> => {
  const response = await fetch(`${BASE_URL}/genre/tv/list?api_key=${API_KEY}`);
  return response.json();
};