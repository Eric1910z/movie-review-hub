import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Film, Grid, List, TrendingUp, Star, Calendar } from 'lucide-react';
import { getPopularMovies, getTopRatedMovies, getUpcomingMovies, getNowPlayingMovies } from '../services/tmdb';
import { Movie } from '../types';
import MovieCard from '../components/movie/MovieCard';

const MoviesPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const sortType = searchParams.get('sort') || 'popular';

  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true);
      try {
        let response;
        switch (sortType) {
          case 'top_rated':
            response = await getTopRatedMovies(page);
            break;
          case 'upcoming':
            response = await getUpcomingMovies(page);
            break;
          case 'now_playing':
            response = await getNowPlayingMovies(page);
            break;
          default:
            response = await getPopularMovies(page);
        }
        setMovies(response.results);
        setTotalPages(response.total_pages);
      } catch (error) {
        console.error('Error fetching movies:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, [page, sortType]);

  const sortOptions = [
    { value: 'popular', label: 'الأكثر شعبية', icon: TrendingUp },
    { value: 'top_rated', label: 'الأعلى تقييماً', icon: Star },
    { value: 'upcoming', label: 'القادمة', icon: Calendar },
    { value: 'now_playing', label: 'الآن في السينما', icon: Film },
  ];

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-3">
            <Film className="w-8 h-8 text-red-500" />
            الأفلام
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            اكتشف أحدث الأفلام وأكثرها شعبية
          </p>
        </div>

        {/* Sort Options */}
        <div className="flex flex-wrap gap-2 mb-6">
          {sortOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => {
                setSearchParams({ sort: option.value });
                setPage(1);
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                sortType === option.value
                  ? 'bg-red-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              <option.icon className="w-4 h-4" />
              {option.label}
            </button>
          ))}
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-gray-600 dark:text-gray-400">
            {loading ? 'جاري التحميل...' : `${movies.length} فيلم`}
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'grid'
                  ? 'bg-red-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
              }`}
            >
              <Grid className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'list'
                  ? 'bg-red-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
              }`}
            >
              <List className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Movies Grid/List */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {Array.from({ length: 20 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-200 dark:bg-gray-700 rounded-lg aspect-[2/3] mb-2"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : movies.length > 0 ? (
          <>
            <div className={viewMode === 'grid'
              ? 'grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6'
              : 'flex flex-col gap-4'
            }>
              {movies.map((movie) => (
                <MovieCard key={movie.id} movie={movie} size={viewMode === 'list' ? 'large' : 'medium'} />
              ))}
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-center gap-2 mt-12">
              <button
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
                className="px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                السابق
              </button>
              <span className="px-4 py-2 text-gray-900 dark:text-white">
                صفحة {page} من {totalPages}
              </span>
              <button
                onClick={() => setPage(Math.min(totalPages, page + 1))}
                disabled={page === totalPages}
                className="px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                التالي
              </button>
            </div>
          </>
        ) : (
          <div className="text-center py-16">
            <Film className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              لا توجد أفلام
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              جرب تحديد خيار آخر
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MoviesPage;