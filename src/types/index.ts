// TMDB API Types
export interface Movie {
  id: number;
  title: string;
  original_title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
  vote_count: number;
  popularity: number;
  adult: boolean;
  genre_ids: number[];
  original_language: string;
  video: boolean;
}

export interface MovieDetails extends Movie {
  belongs_to_collection: any;
  budget: number;
  genres: Genre[];
  homepage: string;
  imdb_id: string;
  production_companies: ProductionCompany[];
  production_countries: ProductionCountry[];
  revenue: number;
  runtime: number;
  spoken_languages: SpokenLanguage[];
  status: string;
  tagline: string;
}

export interface Genre {
  id: number;
  name: string;
}

export interface ProductionCompany {
  id: number;
  logo_path: string | null;
  name: string;
  origin_country: string;
}

export interface ProductionCountry {
  iso_3166_1: string;
  name: string;
}

export interface SpokenLanguage {
  iso_639_1: string;
  name: string;
  english_name: string;
}

export interface Person {
  id: number;
  name: string;
  biography: string;
  birthday: string | null;
  deathday: string | null;
  place_of_birth: string | null;
  profile_path: string | null;
  known_for_department: string;
  popularity: number;
  gender: number;
  adult: boolean;
  imdb_id: string;
  homepage: string | null;
  also_known_as: string[];
  external_ids: {
    twitter_id?: string;
    instagram_id?: string;
    facebook_id?: string;
    tiktok_id?: string;
    youtube_id?: string;
    wikidata_id?: string;
    imdb_id?: string;
  };
}

export interface PersonCredits {
  cast: MovieCast[];
  crew: CrewMember[];
}

export interface MovieCast {
  id: number;
  name: string;
  original_name: string;
  character: string;
  credit_id: string;
  release_date: string;
  vote_count: number;
  video: boolean;
  adult: boolean;
  backdrop_path: string | null;
  genre_ids: number[];
  original_language: string;
  popularity: number;
  genre_names: string[];
  title: string;
  vote_average: number;
  overview: string;
  tagline: string | null;
  poster_path: string | null;
  profile_path: string | null;
  runtime: number;
  imdb_id: string;
  trailer: string | null;
}

export interface CrewMember {
  id: number;
  name: string;
  department: string;
  original_language: string;
  original_title: string;
  job: string;
  overview: string;
  genre_names: string[];
  poster_path: string | null;
  backdrop_path: string | null;
  trailer: string | null;
  video: boolean;
  vote_average: number;
  popularity: number;
  release_date: string;
  vote_count: number;
  adult: boolean;
  title: string;
  runtime: number;
  imdb_id: string;
}

export interface TVShow {
  id: number;
  name: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  first_air_date: string;
  vote_average: number;
  vote_count: number;
  genre_ids: number[];
  original_language: string;
  popularity: number;
}

export interface Review {
  id: string;
  author: string;
  author_details: AuthorDetails;
  content: string;
  created_at: string;
  updated_at: string;
  url: string;
}

export interface AuthorDetails {
  name: string;
  username: string;
  avatar_path: string | null;
  rating: number | null;
}

// User types
export interface User {
  id: string;
  email: string;
  username: string;
  display_name: string;
  avatar_url: string;
  created_at: string;
  updated_at: string;
  preferences: UserPreferences;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  language: string;
  notifications: boolean;
}

export interface WatchlistItem {
  id: string;
  user_id: string;
  tmdb_id: number;
  media_type: 'movie' | 'tv';
  title: string;
  poster_path: string | null;
  release_date: string;
  vote_average: number;
  status: 'watchlist' | 'watched' | 'watching';
  added_at: string;
  watched_at?: string;
}

// API Response types
export interface PaginatedResponse<T> {
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
}

export interface VideosResponse {
  id: number;
  results: Video[];
}

export interface Video {
  iso_639_1: string;
  iso_3166_1: string;
  name: string;
  key: string;
  site: string;
  size: number;
  type: string;
  official: boolean;
  published_at: string;
  id: string;
}

// Search types
export interface MultiSearchResponse {
  page: number;
  results: (Movie | TVShow | Person)[];
  total_pages: number;
  total_results: number;
}

// Image types
export interface ImagesResponse {
  backdrops: Image[];
  logos: Image[];
  posters: Image[];
  profiles: Image[];
}

export interface Image {
  aspect_ratio: number;
  height: number;
  iso_639_1: string | null;
  file_path: string;
  vote_average: number;
  vote_count: number;
  width: number;
}