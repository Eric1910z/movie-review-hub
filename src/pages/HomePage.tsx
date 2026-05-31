import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Play, Star, TrendingUp, Flame, Calendar, Clock, Users, Award, Trophy } from 'lucide-react';
import { getTrendingMovies, getPopularMovies, getTopRatedMovies, getUpcomingMovies, getImageUrl } from '../services/tmdb';
import { Movie } from '../types';
import MovieCard from '../components/movie/MovieCard';
import { formatVoteAverage, formatRuntime, getYear, formatNumber } from '../utils/helpers';

const HomePage: React.FC = () => {
  const [trending, setTrending] = useState<Movie[]>([]);
  const [popular, setPopular] = useState<Movie[]>([]);
  const [topRated, setTopRated] = useState<Movie[]>([]);
  const [upcoming, setUpcoming] = useState<Movie[]>([]);
  const [heroMovie, setHeroMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [trendingData, popularData, topRatedData, upcomingData] = await Promise.all([
          getTrendingMovies('week'),
          getPopularMovies(1).then(r => r.results),
          getTopRatedMovies(1).then(r => r.results),
          getUpcomingMovies(1).then(r => r.results),
        ]);

        setTrending(trendingData);
        setPopular(popularData);
        setTopRated(topRatedData);
        setUpcoming(upcomingData);
        setHeroMovie(trendingData[0] || popularData[0]);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-red-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-500 dark:text-gray-400">جاري تحميل المحتوى...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      {heroMovie && (
        <section className="relative h-[550px] md:h-[650px] overflow-hidden">
          <div className="absolute inset-0">
            <img
              src={heroMovie.backdrop_path ? getImageUrl(heroMovie.backdrop_path, 'w1280') : 'https://via.placeholder.com/1920x1080?text=No+Backdrop'}
              alt={heroMovie.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 hero-gradient" />
          </div>

          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12">
            <div className="container mx-auto">
              <div className="max-w-3xl animate-fadeIn">
                <div className="flex items-center gap-3 mb-4">
                  <span className="bg-gradient-to-r from-red-500 to-red-600 text-white text-sm px-4 py-1.5 rounded-full flex items-center gap-2 shadow-lg shadow-red-500/30">
                    <Flame className="w-4 h-4" />
                    الأكثر مشاهدة
                  </span>
                  {heroMovie.vote_average > 0 && (
                    <span className="flex items-center gap-1 bg-black/50 backdrop-blur-sm px-3 py-1.5 rounded-full">
                      <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                      <span className="text-white font-bold">{formatVoteAverage(heroMovie.vote_average)}</span>
                      <span className="text-white/70 text-sm">({formatNumber(heroMovie.vote_count)})</span>
                    </span>
                  )}
                </div>

                <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 drop-shadow-lg">
                  {heroMovie.title}
                </h1>

                <p className="text-gray-200 text-lg md:text-xl mb-6 line-clamp-2 md:line-clamp-3 drop-shadow">
                  {heroMovie.overview}
                </p>

                <div className="flex flex-wrap gap-3">
                  <Link
                    to={`/movie/${heroMovie.id}`}
                    className="flex items-center gap-2 bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-red-600 hover:to-red-700 transition-all shadow-lg shadow-red-500/30 hover:shadow-red-500/50"
                  >
                    <Play className="w-5 h-5" />
                    عرض التفاصيل
                  </Link>
                  <button className="flex items-center gap-2 bg-white/20 backdrop-blur text-white px-6 py-3 rounded-xl font-semibold hover:bg-white/30 transition-all border border-white/20">
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 4v16m8-8H4" />
                    </svg>
                    إضافة للقائمة
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      <div className="container mx-auto px-4 py-8 md:py-12 space-y-12 md:space-y-16">
        {/* Trending Movies */}
        <section className="animate-slideUp">
          <div className="flex items-center justify-between mb-6 md:mb-8">
            <div className="flex items-center gap-3 md:gap-4">
              <div className="w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center shadow-lg shadow-red-500/30">
                <TrendingUp className="w-6 h-6 md:w-7 md:h-7 text-white" />
              </div>
              <div>
                <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">الأفلام الرائجة</h2>
                <p className="text-gray-500 dark:text-gray-400 text-sm">الأكثر مشاهدة هذا الأسبوع</p>
              </div>
            </div>
            <Link to="/movies?sort=trending" className="flex items-center gap-1 text-red-500 hover:text-red-600 font-medium group">
              عرض الكل
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          <div className="flex gap-4 md:gap-6 overflow-x-auto pb-4 scrollbar-hide">
            {trending.slice(0, 10).map((movie, index) => (
              <div key={movie.id} className="relative">
                {index < 3 && (
                  <div className="absolute top-2 right-2 z-10 bg-gradient-to-r from-yellow-400 to-yellow-500 text-black w-7 h-7 rounded-full flex items-center justify-center font-bold text-sm shadow-lg">
                    {index + 1}
                  </div>
                )}
                <MovieCard key={movie.id} movie={movie} size="medium" />
              </div>
            ))}
          </div>
        </section>

        {/* Popular Movies */}
        <section className="animate-slideUp" style={{ animationDelay: '0.1s' }}>
          <div className="flex items-center justify-between mb-6 md:mb-8">
            <div className="flex items-center gap-3 md:gap-4">
              <div className="w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30">
                <Users className="w-6 h-6 md:w-7 md:h-7 text-white" />
              </div>
              <div>
                <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">الأفلام الشائعة</h2>
                <p className="text-gray-500 dark:text-gray-400 text-sm">الأكثر إعجاباً من الجمهور</p>
              </div>
            </div>
            <Link to="/movies?sort=popular" className="flex items-center gap-1 text-blue-500 hover:text-blue-600 font-medium group">
              عرض الكل
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          <div className="flex gap-4 md:gap-6 overflow-x-auto pb-4 scrollbar-hide">
            {popular.slice(0, 10).map((movie) => (
              <MovieCard key={movie.id} movie={movie} size="medium" />
            ))}
          </div>
        </section>

        {/* Top Rated Movies with Trophy */}
        <section className="animate-slideUp" style={{ animationDelay: '0.2s' }}>
          <div className="flex items-center justify-between mb-6 md:mb-8">
            <div className="flex items-center gap-3 md:gap-4">
              <div className="w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg shadow-yellow-500/30">
                <Trophy className="w-6 h-6 md:w-7 md:h-7 text-white" />
              </div>
              <div>
                <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">الأعلى تقييماً</h2>
                <p className="text-gray-500 dark:text-gray-400 text-sm">أفضل الأفلام حسب التقييم</p>
              </div>
            </div>
            <Link to="/top250" className="flex items-center gap-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-black px-4 py-2 rounded-xl font-semibold hover:from-yellow-400 hover:to-orange-400 transition-all shadow-lg">
              <Trophy className="w-4 h-4" />
              أفضل 250
            </Link>
          </div>
          <div className="flex gap-4 md:gap-6 overflow-x-auto pb-4 scrollbar-hide">
            {topRated.slice(0, 10).map((movie, index) => (
              <div key={movie.id} className="relative">
                <div className="absolute top-2 left-2 z-10 bg-gradient-to-r from-yellow-400 to-yellow-500 text-black w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shadow-lg">
                  #{index + 1}
                </div>
                <MovieCard key={movie.id} movie={movie} size="medium" />
              </div>
            ))}
          </div>
        </section>

        {/* Upcoming Movies */}
        <section className="animate-slideUp" style={{ animationDelay: '0.3s' }}>
          <div className="flex items-center justify-between mb-6 md:mb-8">
            <div className="flex items-center gap-3 md:gap-4">
              <div className="w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/30">
                <Calendar className="w-6 h-6 md:w-7 md:h-7 text-white" />
              </div>
              <div>
                <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">قريباً في السينما</h2>
                <p className="text-gray-500 dark:text-gray-400 text-sm">أفلام قادمة لا تفوتها</p>
              </div>
            </div>
            <Link to="/movies?sort=upcoming" className="flex items-center gap-1 text-purple-500 hover:text-purple-600 font-medium group">
              عرض الكل
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
            {upcoming.slice(0, 10).map((movie) => (
              <MovieCard key={movie.id} movie={movie} size="medium" />
            ))}
          </div>
        </section>

        {/* Stats Section */}
        <section className="bg-gradient-to-r from-red-500 via-red-600 to-red-700 rounded-3xl p-8 md:p-12 text-white relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-64 h-64 bg-white rounded-full -translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full translate-x-1/3 translate-y-1/3"></div>
          </div>
          <div className="relative grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl md:text-5xl font-bold mb-2">500K+</div>
              <div className="text-white/80 font-medium">فيلم</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold mb-2">10K+</div>
              <div className="text-white/80 font-medium">ممثل ومخرج</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold mb-2">1M+</div>
              <div className="text-white/80 font-medium">مراجعة</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold mb-2">100K+</div>
              <div className="text-white/80 font-medium">مستخدم</div>
            </div>
          </div>
        </section>

        {/* Categories Quick Access */}
        <section className="animate-slideUp" style={{ animationDelay: '0.4s' }}>
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-6 md:mb-8">استكشف حسب التصنيف</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-4">
            {[
              { id: 28, name: 'أكشن', color: 'bg-gradient-to-br from-red-500 to-red-600' },
              { id: 35, name: 'كوميديا', color: 'bg-gradient-to-br from-yellow-500 to-yellow-600' },
              { id: 18, name: 'دراما', color: 'bg-gradient-to-br from-blue-500 to-blue-600' },
              { id: 27, name: 'رعب', color: 'bg-gradient-to-br from-purple-500 to-purple-600' },
              { id: 10749, name: 'رومانسي', color: 'bg-gradient-to-br from-pink-500 to-pink-600' },
              { id: 878, name: 'خيال علمي', color: 'bg-gradient-to-br from-cyan-500 to-cyan-600' },
              { id: 53, name: 'إثارة', color: 'bg-gradient-to-br from-orange-500 to-orange-600' },
              { id: 16, name: 'أنيميشن', color: 'bg-gradient-to-br from-green-500 to-green-600' },
              { id: 99, name: 'وثائقي', color: 'bg-gradient-to-br from-indigo-500 to-indigo-600' },
              { id: 10752, name: 'حربي', color: 'bg-gradient-to-br from-gray-600 to-gray-700' },
              { id: 9648, name: 'غموض', color: 'bg-gradient-to-br from-teal-500 to-teal-600' },
              { id: 12, name: 'مغامرات', color: 'bg-gradient-to-br from-amber-500 to-amber-600' },
            ].map((genre) => (
              <Link
                key={genre.id}
                to={`/discover?genre=${genre.id}`}
                className={`${genre.color} text-white text-center py-4 px-3 rounded-2xl font-semibold hover:scale-105 transition-transform shadow-lg hover:shadow-xl`}
              >
                {genre.name}
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default HomePage;