import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Trophy, Star, TrendingUp, Film, ChevronRight, Medal, Crown, Award, Filter, Grid, List } from 'lucide-react';
import { getTopRatedMovies, getImageUrl } from '../services/tmdb';
import { Movie } from '../types';
import { formatVoteAverage, formatNumber, getYear } from '../utils/helpers';

const Top250Page: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'rating' | 'popularity' | 'votes'>('rating');

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        // Fetch top rated movies from multiple pages to get 250+
        const responses = await Promise.all([
          getTopRatedMovies(1),
          getTopRatedMovies(2),
          getTopRatedMovies(3),
        ]);

        const allMovies = [...responses[0].results, ...responses[1].results, ...responses[2].results];

        // Sort by vote_average descending
        allMovies.sort((a, b) => b.vote_average - a.vote_average);
        setMovies(allMovies.slice(0, 250));
      } catch (error) {
        console.error('Error fetching movies:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  const sortedMovies = [...movies].sort((a, b) => {
    switch (sortBy) {
      case 'popularity':
        return (b.popularity || 0) - (a.popularity || 0);
      case 'votes':
        return (b.vote_count || 0) - (a.vote_count || 0);
      default:
        return b.vote_average - a.vote_average;
    }
  });

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Crown className="w-5 h-5 text-yellow-400" />;
    if (rank === 2) return <Medal className="w-5 h-5 text-gray-300" />;
    if (rank === 3) return <Award className="w-5 h-5 text-amber-600" />;
    return <span className="text-sm font-bold text-gray-400">#{rank}</span>;
  };

  const getRankBadgeColor = (rank: number) => {
    if (rank === 1) return 'bg-gradient-to-br from-yellow-400 to-yellow-600 text-black';
    if (rank === 2) return 'bg-gradient-to-br from-gray-300 to-gray-400 text-black';
    if (rank === 3) return 'bg-gradient-to-br from-amber-500 to-amber-700 text-white';
    return 'bg-gray-700 text-gray-300';
  };

  const getCardBorderColor = (rank: number) => {
    if (rank === 1) return 'border-yellow-500/50';
    if (rank === 2) return 'border-gray-400/50';
    if (rank === 3) return 'border-amber-500/50';
    return 'border-gray-700/50';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-400">جاري تحميل قائمة أفضل 250...</p>
        </div>
      </div>
    );
  }

  const top250 = sortedMovies;

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Hero Section */}
      <div className="bg-gradient-to-b from-red-900/20 via-gray-900 to-gray-900 py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-center gap-6 mb-8">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg shadow-yellow-500/30">
                <Trophy className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-white">أفضل 250 فيلم</h1>
                <p className="text-gray-400 mt-1">أفضل الأفلام حسب تقييم المشاهدين</p>
              </div>
            </div>

            {/* View Controls */}
            <div className="flex items-center gap-4 md:ml-auto">
              {/* Sort */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-gray-800 text-white px-4 py-2 rounded-lg border border-gray-700 focus:outline-none focus:border-red-500"
              >
                <option value="rating">ترتيب حسب التقييم</option>
                <option value="popularity">ترتيب حسب الشعبية</option>
                <option value="votes">ترتيب حسب عدد الأصوات</option>
              </select>

              {/* View Mode */}
              <div className="flex bg-gray-800 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-md transition-colors ${viewMode === 'grid' ? 'bg-red-500 text-white' : 'text-gray-400 hover:text-white'}`}
                >
                  <Grid className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-md transition-colors ${viewMode === 'list' ? 'bg-red-500 text-white' : 'text-gray-400 hover:text-white'}`}
                >
                  <List className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 text-center border border-gray-700/50">
              <div className="text-3xl font-bold text-white">{top250.length}</div>
              <div className="text-gray-400 text-sm">إجمالي الأفلام</div>
            </div>
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 text-center border border-gray-700/50">
              <div className="text-3xl font-bold text-yellow-400">
                {(top250.reduce((sum, m) => sum + m.vote_average, 0) / top250.length).toFixed(1)}
              </div>
              <div className="text-gray-400 text-sm">متوسط التقييم</div>
            </div>
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 text-center border border-gray-700/50">
              <div className="text-3xl font-bold text-white">
                {formatNumber(top250.reduce((sum, m) => sum + m.vote_count, 0))}
              </div>
              <div className="text-gray-400 text-sm">إجمالي الأصوات</div>
            </div>
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 text-center border border-gray-700/50">
              <div className="text-3xl font-bold text-red-400">IMDb</div>
              <div className="text-gray-400 text-sm">مصدر البيانات</div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Top 10 Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <Crown className="w-6 h-6 text-yellow-500" />
            أفضل 10 أفلام
          </h2>

          {viewMode === 'grid' ? (
            <div className="grid grid-cols-2 md:grid-cols-5 lg:grid-cols-10 gap-4">
              {top250.slice(0, 10).map((movie, index) => (
                <Link
                  key={movie.id}
                  to={`/movie/${movie.id}`}
                  className="group relative"
                >
                  <div className={`relative rounded-xl overflow-hidden border-2 ${getCardBorderColor(index + 1)} transition-all duration-300 group-hover:scale-105 group-hover:shadow-xl group-hover:shadow-red-500/10`}>
                    <div className="absolute top-2 left-2 z-10">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shadow-lg ${getRankBadgeColor(index + 1)}`}>
                        {getRankIcon(index + 1)}
                      </div>
                    </div>
                    <img
                      src={movie.poster_path ? getImageUrl(movie.poster_path, 'w342') : 'https://via.placeholder.com/228x342/1a1a1a/666?text=No+Image'}
                      alt={movie.title}
                      className="w-full aspect-[2/3] object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-2">
                      <p className="text-white text-xs font-bold line-clamp-1">{movie.title}</p>
                      <div className="flex items-center gap-1 mt-1">
                        <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                        <span className="text-white text-xs font-bold">{formatVoteAverage(movie.vote_average)}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {top250.slice(0, 10).map((movie, index) => (
                <Link
                  key={movie.id}
                  to={`/movie/${movie.id}`}
                  className="flex items-center gap-4 bg-gray-800/50 hover:bg-gray-800 rounded-xl p-4 transition-colors border border-gray-700/50 group"
                >
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold ${getRankBadgeColor(index + 1)}`}>
                    {getRankIcon(index + 1)}
                  </div>
                  <div className="w-16 h-24 rounded-lg overflow-hidden bg-gray-700 flex-shrink-0">
                    <img
                      src={movie.poster_path ? getImageUrl(movie.poster_path, 'w185') : 'https://via.placeholder.com/185x278/1a1a1a/666?text=No'}
                      alt={movie.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-white font-semibold truncate group-hover:text-red-400 transition-colors">{movie.title}</h3>
                    <p className="text-gray-400 text-sm">{getYear(movie.release_date)}</p>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <div className="bg-yellow-500 text-black px-3 py-1.5 rounded-lg font-bold flex items-center gap-1">
                      <Star className="w-4 h-4 fill-black" />
                      {formatVoteAverage(movie.vote_average)}
                    </div>
                    <span className="text-gray-400 text-sm hidden sm:block">{formatNumber(movie.vote_count)} صوت</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Complete List */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <Film className="w-6 h-6 text-red-400" />
            القائمة الكاملة ({top250.length} فيلم)
          </h2>

          {viewMode === 'grid' ? (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {top250.slice(10).map((movie, index) => (
                <Link
                  key={movie.id}
                  to={`/movie/${movie.id}`}
                  className="group"
                >
                  <div className="relative rounded-xl overflow-hidden bg-gray-800 transition-all duration-300 group-hover:scale-105 group-hover:shadow-xl group-hover:shadow-red-500/10">
                    <div className="absolute top-2 left-2 z-10 bg-black/70 backdrop-blur-sm rounded-full px-2 py-1">
                      <span className="text-sm font-bold text-gray-300">#{index + 11}</span>
                    </div>
                    <img
                      src={movie.poster_path ? getImageUrl(movie.poster_path, 'w342') : 'https://via.placeholder.com/228x342/1a1a1a/666?text=No+Image'}
                      alt={movie.title}
                      className="w-full aspect-[2/3] object-cover"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-3">
                      <div className="flex items-center gap-1 mb-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                        <span className="text-white font-bold text-sm">{formatVoteAverage(movie.vote_average)}</span>
                      </div>
                      <h3 className="text-white text-sm font-medium line-clamp-2">{movie.title}</h3>
                      <p className="text-gray-400 text-xs mt-1">{getYear(movie.release_date)}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {top250.slice(10).map((movie, index) => (
                <Link
                  key={movie.id}
                  to={`/movie/${movie.id}`}
                  className="flex items-center gap-4 bg-gray-800/50 hover:bg-gray-800 rounded-xl p-4 transition-colors border border-gray-700/50 group"
                >
                  <div className="w-12 h-12 bg-gray-700/50 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-bold text-gray-300">#{index + 11}</span>
                  </div>
                  <div className="w-16 h-24 rounded-lg overflow-hidden bg-gray-700 flex-shrink-0">
                    <img
                      src={movie.poster_path ? getImageUrl(movie.poster_path, 'w185') : 'https://via.placeholder.com/185x278/1a1a1a/666?text=No'}
                      alt={movie.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-white font-semibold truncate group-hover:text-red-400 transition-colors">{movie.title}</h3>
                    <p className="text-gray-400 text-sm">{getYear(movie.release_date)}</p>
                    {movie.overview && (
                      <p className="text-gray-500 text-sm mt-1 line-clamp-1 hidden md:block">{movie.overview}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <div className="bg-yellow-500 text-black px-3 py-1.5 rounded-lg font-bold flex items-center gap-1">
                      <Star className="w-4 h-4 fill-black" />
                      {formatVoteAverage(movie.vote_average)}
                    </div>
                    <span className="text-gray-400 text-sm hidden md:block">{formatNumber(movie.vote_count)} صوت</span>
                    <ChevronRight className="w-5 h-5 text-gray-500 group-hover:text-white group-hover:translate-x-1 transition-all" />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Top250Page;