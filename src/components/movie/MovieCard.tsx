import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Play } from 'lucide-react';
import { Movie } from '../../types';
import { getImageUrl } from '../../services/tmdb';
import { formatVoteAverage, getYear } from '../../utils/helpers';

interface MovieCardProps {
  movie: Movie;
  size?: 'small' | 'medium' | 'large';
  showRating?: boolean;
}

const MovieCard: React.FC<MovieCardProps> = ({
  movie,
  size = 'medium',
  showRating = true,
}) => {
  const sizeClasses = {
    small: 'w-28',
    medium: 'w-44',
    large: 'w-64',
  };

  const imageHeights = {
    small: 'h-40',
    medium: 'h-64',
    large: 'h-96',
  };

  return (
    <Link to={`/movie/${movie.id}`} className="group">
      <div className={`${sizeClasses[size]} flex-shrink-0`}>
        <div className="relative rounded-lg overflow-hidden bg-gray-200 dark:bg-gray-700">
          <img
            src={
              movie.poster_path
                ? getImageUrl(movie.poster_path, 'w500')
                : 'https://via.placeholder.com/500x750?text=No+Image'
            }
            alt={movie.title}
            className={`w-full ${imageHeights[size]} object-cover group-hover:scale-105 transition-transform duration-300`}
          />
          {showRating && movie.vote_average > 0 && (
            <div className="absolute top-2 left-2 flex items-center gap-1 bg-black/70 px-2 py-1 rounded">
              <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
              <span className="text-white text-sm font-semibold">
                {formatVoteAverage(movie.vote_average)}
              </span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-4">
            <div className="flex items-center gap-2 bg-red-500 text-white px-3 py-1.5 rounded-full">
              <Play className="w-4 h-4" />
              <span className="text-sm font-medium">مشاهدة</span>
            </div>
          </div>
        </div>
        <div className="mt-2">
          <h3 className="font-semibold text-gray-900 dark:text-white text-sm truncate group-hover:text-red-500 transition-colors">
            {movie.title}
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {getYear(movie.release_date)}
          </p>
        </div>
      </div>
    </Link>
  );
};

export default MovieCard;