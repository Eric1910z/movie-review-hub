import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Search, Filter, ChevronDown, SlidersHorizontal, X, Film, Calendar } from 'lucide-react';
import { discoverMovies, getMovieGenres, getImageUrl } from '../services/tmdb';
import { Movie, Genre } from '../types';
import MovieCard from '../components/movie/MovieCard';
import { formatVoteAverage, sortOptionsLabels } from '../utils/helpers';

const DiscoverPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [movies, setMovies] = useState<Movie[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  // Filter states
  const [selectedGenre, setSelectedGenre] = useState<string>(searchParams.get('genre') || '');
  const [selectedYear, setSelectedYear] = useState<string>(searchParams.get('year') || '');
  const [selectedSort, setSelectedSort] = useState<string>(searchParams.get('sort') || 'popularity.desc');
  const [minRating, setMinRating] = useState<number>(0);
  const [minVotes, setMinVotes] = useState<number>(0);
  const [query, setQuery] = useState(searchParams.get('q') || '');

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const data = await getMovieGenres();
        setGenres(data.genres);
      } catch (error) {
        console.error('Error fetching genres:', error);
      }
    };
    fetchGenres();
  }, []);

  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true);
      try {
        const params: any = {
          page,
          sort_by: selectedSort,
        };
        if (selectedGenre) params.genre = parseInt(selectedGenre);
        if (selectedYear) params.year = parseInt(selectedYear);
        if (minRating > 0) params.vote_average_gte = minRating;
        if (minVotes > 0) params.vote_count_gte = minVotes;

        const data = await discoverMovies(params);
        setMovies(data.results);
        setTotalPages(data.total_pages);
      } catch (error) {
        console.error('Error fetching movies:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, [page, selectedSort, selectedGenre, selectedYear, minRating, minVotes]);

  const handleFilterChange = () => {
    setPage(1);
    // Update URL params
    const params: Record<string, string> = {};
    if (selectedGenre) params.genre = selectedGenre;
    if (selectedYear) params.year = selectedYear;
    if (selectedSort !== 'popularity.desc') params.sort = selectedSort;
    if (query) params.q = query;
    setSearchParams(params);
  };

  useEffect(() => {
    handleFilterChange();
  }, [selectedGenre, selectedYear, selectedSort, query]);

  const clearFilters = () => {
    setSelectedGenre('');
    setSelectedYear('');
    setSelectedSort('popularity.desc');
    setMinRating(0);
    setMinVotes(0);
    setQuery('');
    setSearchParams({});
  };

  const hasActiveFilters = selectedGenre || selectedYear || minRating > 0 || minVotes > 0;

  const years = Array.from({ length: 50 }, (_, i) => new Date().getFullYear() - i);

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-3">
            <Film className="w-8 h-8 text-red-500" />
            استكشف الأفلام
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            اكتشف آلاف الأفلام حسب التصنيف والسنة والتقييم
          </p>
        </div>

        {/* Search & Filter Bar */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="ابحث عن فيلم..."
              className="w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-900 dark:text-white"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors ${
              showFilters || hasActiveFilters
                ? 'bg-red-500 text-white'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
            }`}
          >
            <SlidersHorizontal className="w-5 h-5" />
            الفلاتر
            {hasActiveFilters && <span className="ml-1 px-2 py-0.5 bg-white/20 rounded-full text-xs">*</span>}
          </button>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 mb-6 border border-gray-200 dark:border-gray-700">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Sort */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  الترتيب
                </label>
                <select
                  value={selectedSort}
                  onChange={(e) => setSelectedSort(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-900 dark:text-white"
                >
                  {Object.entries(sortOptionsLabels).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Genre */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  التصنيف
                </label>
                <select
                  value={selectedGenre}
                  onChange={(e) => setSelectedGenre(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-900 dark:text-white"
                >
                  <option value="">جميع التصنيفات</option>
                  {genres.map((genre) => (
                    <option key={genre.id} value={genre.id}>
                      {genre.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Year */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  السنة
                </label>
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-900 dark:text-white"
                >
                  <option value="">جميع السنوات</option>
                  {years.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>

              {/* Min Rating */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  الحد الأدنى للتقييم
                </label>
                <select
                  value={minRating}
                  onChange={(e) => setMinRating(parseFloat(e.target.value))}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-900 dark:text-white"
                >
                  <option value={0}>أي تقييم</option>
                  <option value={8}>8+</option>
                  <option value={7}>7+</option>
                  <option value={6}>6+</option>
                  <option value={5}>5+</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end mt-4">
              <button
                onClick={clearFilters}
                className="flex items-center gap-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              >
                <X className="w-4 h-4" />
                مسح الفلاتر
              </button>
            </div>
          </div>
        )}

        {/* Active Filters */}
        {hasActiveFilters && (
          <div className="flex flex-wrap gap-2 mb-6">
            {selectedGenre && (
              <span className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 dark:bg-gray-800 rounded-full text-sm">
                التصنيف: {genres.find(g => g.id === parseInt(selectedGenre))?.name}
                <button onClick={() => setSelectedGenre('')} className="text-gray-400 hover:text-gray-600">
                  <X className="w-4 h-4" />
                </button>
              </span>
            )}
            {selectedYear && (
              <span className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 dark:bg-gray-800 rounded-full text-sm">
                السنة: {selectedYear}
                <button onClick={() => setSelectedYear('')} className="text-gray-400 hover:text-gray-600">
                  <X className="w-4 h-4" />
                </button>
              </span>
            )}
            {minRating > 0 && (
              <span className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 dark:bg-gray-800 rounded-full text-sm">
                التقييم: {minRating}+
                <button onClick={() => setMinRating(0)} className="text-gray-400 hover:text-gray-600">
                  <X className="w-4 h-4" />
                </button>
              </span>
            )}
          </div>
        )}

        {/* Results Count */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-gray-600 dark:text-gray-400">
            {loading ? 'جاري البحث...' : `تم العثور على ${movies.length * totalPages} فيلم`}
          </p>
        </div>

        {/* Movies Grid */}
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
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {movies.map((movie) => (
                <MovieCard key={movie.id} movie={movie} size="large" />
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
              لا توجد نتائج
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              جرب تغيير الفلاتر للحصول على نتائج مختلفة
            </p>
            <button
              onClick={clearFilters}
              className="inline-flex items-center gap-2 bg-red-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-600 transition-colors"
            >
              <X className="w-4 h-4" />
              مسح الفلاتر
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DiscoverPage;