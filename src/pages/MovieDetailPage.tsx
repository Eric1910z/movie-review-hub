import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Star, Play, Calendar, Clock, Plus, Check, Heart, Share2, ThumbsUp,
  ChevronDown, ChevronUp, Film, User, ArrowLeft, MessageSquare, AlertCircle
} from 'lucide-react';
import {
  getMovieDetails, getMovieCredits, getMovieReviews, getMovieVideos,
  getMovieRecommendations, getImageUrl
} from '../services/tmdb';
import { MovieDetails, Person, MovieCast, CrewMember, Review } from '../types';
import { formatDate, formatRuntime, formatVoteAverage, formatNumber, getYear } from '../utils/helpers';
import { useAuth } from '../context/AuthContext';
import * as authService from '../services/auth';
import Rating from '../components/common/Rating';
import MovieCard from '../components/movie/MovieCard';
import { Movie } from '../types';

const MovieDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user, isAuthenticated } = useAuth();
  const [movie, setMovie] = useState<MovieDetails | null>(null);
  const [cast, setCast] = useState<MovieCast[]>([]);
  const [crew, setCrew] = useState<CrewMember[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [trailer, setTrailer] = useState<any>(null);
  const [recommendations, setRecommendations] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFullOverview, setShowFullOverview] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [userRating, setUserRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [watchlistStatus, setWatchlistStatus] = useState<'watchlist' | 'watched' | 'watching' | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      try {
        const movieId = parseInt(id);
        const [movieData, creditsData, reviewsData, videosData, recommendationsData] = await Promise.all([
          getMovieDetails(movieId),
          getMovieCredits(movieId),
          getMovieReviews(movieId),
          getMovieVideos(movieId),
          getMovieRecommendations(movieId),
        ]);

        setMovie(movieData);
        setCast(creditsData.cast.slice(0, 20));
        setCrew(creditsData.crew.slice(0, 10));
        setReviews(reviewsData.results);

        // Find trailer
        const officialTrailer = videosData.results.find(
          v => v.type === 'Trailer' && v.site === 'YouTube'
        ) || videosData.results.find(v => v.site === 'YouTube');
        setTrailer(officialTrailer);

        setRecommendations(recommendationsData.results.slice(0, 12));
      } catch (error) {
        console.error('Error fetching movie details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  useEffect(() => {
    if (user && movie) {
      const status = authService.checkWatchlistItem(user.id, movie.id);
      if (status) {
        setWatchlistStatus(status.status);
      }
      const rating = authService.getMovieRating(user.id, movie.id);
      if (rating) {
        setUserRating(rating);
      }
    }
  }, [user, movie]);

  const handleAddToWatchlist = (status: 'watchlist' | 'watched' | 'watching') => {
    if (!user || !movie) return;

    const existingItem = authService.checkWatchlistItem(user.id, movie.id);
    if (existingItem) {
      authService.updateWatchlistItemStatus(user.id, existingItem.id, status);
    } else {
      authService.addToWatchlist(user.id, {
        tmdb_id: movie.id,
        media_type: 'movie',
        title: movie.title,
        poster_path: movie.poster_path,
        release_date: movie.release_date,
        vote_average: movie.vote_average,
        status,
      });
    }
    setWatchlistStatus(status);
  };

  const handleRateMovie = (rating: number) => {
    if (!user || !movie) return;
    authService.rateMovie(user.id, movie.id, rating);
    setUserRating(rating);
  };

  const handleSubmitReview = async () => {
    if (!user || !movie || !reviewText.trim()) return;

    setIsSubmitting(true);
    try {
      authService.addReview(user.id, movie.id, reviewText.trim(), userRating);
      const allReviews = authService.getAllReviewsForMovie(movie.id);
      setReviews(allReviews.map(r => ({
        id: r.id,
        author: r.user.username,
        author_details: {
          name: r.user.display_name,
          username: r.user.username,
          avatar_path: r.user.avatar_url,
          rating: r.rating,
        },
        content: r.content,
        created_at: r.createdAt,
        updated_at: r.updatedAt,
        url: '',
      })));
      setReviewText('');
      setUserRating(0);
      setShowReviewForm(false);
    } catch (error) {
      console.error('Error submitting review:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-red-500 border-t-transparent"></div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">الفيلم غير موجود</h2>
          <Link to="/" className="text-red-500 hover:text-red-600 mt-4 inline-block">
            العودة للرئيسية
          </Link>
        </div>
      </div>
    );
  }

  const director = crew.find(c => c.job === 'Director');
  const writer = crew.find(c => c.department === 'Writing');

  return (
    <div className="min-h-screen">
      {/* Backdrop */}
      <div className="relative h-[400px] md:h-[500px]">
        <div className="absolute inset-0">
          <img
            src={movie.backdrop_path ? getImageUrl(movie.backdrop_path, 'w1280') : 'https://via.placeholder.com/1920x1080?text=No+Backdrop'}
            alt={movie.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/80 to-transparent" />
        </div>

        <div className="absolute top-4 left-4">
          <Link
            to="/"
            className="flex items-center gap-2 text-white/80 hover:text-white bg-black/30 backdrop-blur-sm px-4 py-2 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            العودة
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 -mt-48 relative z-10">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Poster */}
          <div className="flex-shrink-0 mx-auto lg:mx-0">
            <img
              src={movie.poster_path ? getImageUrl(movie.poster_path, 'w500') : 'https://via.placeholder.com/500x750?text=No+Image'}
              alt={movie.title}
              className="w-64 md:w-80 rounded-xl shadow-2xl"
            />
          </div>

          {/* Details */}
          <div className="flex-1">
            <div className="bg-gray-900/80 backdrop-blur-sm rounded-2xl p-6 md:p-8">
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">{movie.title}</h1>
              {movie.tagline && (
                <p className="text-gray-400 italic mb-4">{movie.tagline}</p>
              )}

              {/* Rating & Actions */}
              <div className="flex flex-wrap items-center gap-4 mb-6">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 bg-yellow-500 text-white px-3 py-1.5 rounded-lg">
                    <Star className="w-5 h-5 fill-white" />
                    <span className="font-bold text-lg">{formatVoteAverage(movie.vote_average)}</span>
                  </div>
                  <span className="text-gray-400 text-sm">{formatNumber(movie.vote_count)} صوت</span>
                </div>

                {userRating > 0 && (
                  <div className="flex items-center gap-2">
                    <span className="text-gray-400">تقييمي:</span>
                    <span className="text-yellow-500 font-bold">{userRating}</span>
                  </div>
                )}
              </div>

              {/* Quick Info */}
              <div className="flex flex-wrap gap-4 mb-6">
                {movie.release_date && (
                  <div className="flex items-center gap-2 text-gray-300">
                    <Calendar className="w-4 h-4" />
                    {formatDate(movie.release_date)}
                  </div>
                )}
                {movie.runtime > 0 && (
                  <div className="flex items-center gap-2 text-gray-300">
                    <Clock className="w-4 h-4" />
                    {formatRuntime(movie.runtime)}
                  </div>
                )}
                {movie.status && (
                  <span className={`px-3 py-1 rounded text-sm ${
                    movie.status === 'Released' ? 'bg-green-500' : 'bg-yellow-500'
                  } text-white`}>
                    {movie.status === 'Released' ? 'تم الإصدار' : movie.status}
                  </span>
                )}
              </div>

              {/* Genres */}
              {movie.genres.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {movie.genres.map((genre) => (
                    <Link
                      key={genre.id}
                      to={`/discover?genre=${genre.id}`}
                      className="px-4 py-1.5 bg-gray-700 hover:bg-gray-600 text-white rounded-full text-sm transition-colors"
                    >
                      {genre.name}
                    </Link>
                  ))}
                </div>
              )}

              {/* Overview */}
              {movie.overview && (
                <div className="mb-6">
                  <h3 className="text-xl font-semibold text-white mb-2">القصة</h3>
                  <p className={`text-gray-300 leading-relaxed ${!showFullOverview && 'line-clamp-3'}`}>
                    {movie.overview}
                  </p>
                  {movie.overview.length > 300 && (
                    <button
                      onClick={() => setShowFullOverview(!showFullOverview)}
                      className="text-red-500 hover:text-red-400 mt-2 flex items-center gap-1"
                    >
                      {showFullOverview ? (
                        <>
                          <ChevronUp className="w-4 h-4" />
                          عرض أقل
                        </>
                      ) : (
                        <>
                          <ChevronDown className="w-4 h-4" />
                          عرض المزيد
                        </>
                      )}
                    </button>
                  )}
                </div>
              )}

              {/* User Rating Section */}
              {isAuthenticated && (
                <div className="bg-gray-800 rounded-xl p-4 mb-6">
                  <h4 className="text-white font-medium mb-3">قيم هذا الفيلم</h4>
                  <Rating
                    initialRating={userRating}
                    onChange={handleRateMovie}
                    size="lg"
                  />
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3">
                {trailer && (
                  <a
                    href={`https://www.youtube.com/watch?v=${trailer.key}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 bg-red-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-600 transition-colors"
                  >
                    <Play className="w-5 h-5" />
                    مشاهدة الإعلان
                  </a>
                )}

                {isAuthenticated && (
                  <>
                    <button
                      onClick={() => handleAddToWatchlist('watchlist')}
                      className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-colors ${
                        watchlistStatus === 'watchlist'
                          ? 'bg-green-500 text-white'
                          : 'bg-gray-700 text-white hover:bg-gray-600'
                      }`}
                    >
                      <Plus className="w-5 h-5" />
                      أريد مشاهدته
                    </button>
                    <button
                      onClick={() => handleAddToWatchlist('watching')}
                      className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-colors ${
                        watchlistStatus === 'watching'
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-700 text-white hover:bg-gray-600'
                      }`}
                    >
                      <Play className="w-5 h-5" />
                      أشاهده حالياً
                    </button>
                    <button
                      onClick={() => handleAddToWatchlist('watched')}
                      className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-colors ${
                        watchlistStatus === 'watched'
                          ? 'bg-yellow-500 text-white'
                          : 'bg-gray-700 text-white hover:bg-gray-600'
                      }`}
                    >
                      <Check className="w-5 h-5" />
                      شاهدته
                    </button>
                  </>
                )}

                <button className="flex items-center gap-2 bg-gray-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-600 transition-colors">
                  <Heart className="w-5 h-5" />
                  مفضل
                </button>
                <button className="flex items-center gap-2 bg-gray-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-600 transition-colors">
                  <Share2 className="w-5 h-5" />
                  مشاركة
                </button>
              </div>
            </div>

            {/* Cast & Crew */}
            {cast.length > 0 && (
              <div className="bg-gray-900/80 backdrop-blur-sm rounded-2xl p-6 md:p-8 mt-6">
                <h3 className="text-xl font-semibold text-white mb-4">الممثلون</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {cast.map((actor) => (
                    <Link
                      key={actor.id}
                      to={`/person/${actor.id}`}
                      className="group"
                    >
                      <img
                        src={actor.profile_path ? getImageUrl(actor.profile_path, 'w185') : 'https://via.placeholder.com/185x278?text=No+Image'}
                        alt={actor.name}
                        className="w-full aspect-[2/3] object-cover rounded-lg group-hover:scale-105 transition-transform"
                      />
                      <h4 className="text-white font-medium mt-2 truncate">{actor.name}</h4>
                      <p className="text-gray-400 text-sm truncate">{actor.character}</p>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Director & Writer */}
            {(director || writer) && (
              <div className="bg-gray-900/80 backdrop-blur-sm rounded-2xl p-6 md:p-8 mt-6">
                <h3 className="text-xl font-semibold text-white mb-4">الفريق</h3>
                <div className="space-y-4">
                  {director && (
                    <Link to={`/person/${director.id}`} className="flex items-center gap-4 group">
                      <User className="w-10 h-10 text-gray-400" />
                      <div>
                        <p className="text-gray-400 text-sm">المخرج</p>
                        <p className="text-white font-medium group-hover:text-red-500 transition-colors">{director.name}</p>
                      </div>
                    </Link>
                  )}
                  {writer && (
                    <div className="flex items-center gap-4">
                      <User className="w-10 h-10 text-gray-400" />
                      <div>
                        <p className="text-gray-400 text-sm">الكاتب</p>
                        <p className="text-white font-medium">{writer.name}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Reviews Section */}
            <div className="bg-gray-900/80 backdrop-blur-sm rounded-2xl p-6 md:p-8 mt-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-white flex items-center gap-2">
                  <MessageSquare className="w-5 h-5" />
                  المراجعات ({reviews.length})
                </h3>
                {isAuthenticated && !showReviewForm && (
                  <button
                    onClick={() => setShowReviewForm(true)}
                    className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
                  >
                    كتابة مراجعة
                  </button>
                )}
              </div>

              {/* Review Form */}
              {showReviewForm && (
                <div className="bg-gray-800 rounded-xl p-4 mb-6">
                  <h4 className="text-white font-medium mb-4">اكتب مراجعتك</h4>
                  <div className="mb-4">
                    <label className="block text-gray-300 text-sm mb-2">تقييمي</label>
                    <Rating initialRating={userRating} onChange={setUserRating} size="md" />
                  </div>
                  <textarea
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    placeholder="اكتب مراجعتك هنا..."
                    rows={4}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg p-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 mb-4"
                  />
                  <div className="flex gap-3">
                    <button
                      onClick={handleSubmitReview}
                      disabled={isSubmitting || !reviewText.trim()}
                      className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? 'جاري الإرسال...' : 'إرسال'}
                    </button>
                    <button
                      onClick={() => {
                        setShowReviewForm(false);
                        setReviewText('');
                        setUserRating(0);
                      }}
                      className="bg-gray-700 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition-colors"
                    >
                      إلغاء
                    </button>
                  </div>
                </div>
              )}

              {/* Reviews List */}
              {reviews.length > 0 ? (
                <div className="space-y-4">
                  {reviews.map((review) => (
                    <div key={review.id} className="bg-gray-800 rounded-xl p-4">
                      <div className="flex items-center gap-3 mb-3">
                        <img
                          src={review.author_details.avatar_path || `https://ui-avatars.com/api/?name=${review.author}&background=random`}
                          alt={review.author}
                          className="w-10 h-10 rounded-full"
                        />
                        <div>
                          <p className="text-white font-medium">{review.author_details.name || review.author}</p>
                          <div className="flex items-center gap-2">
                            {review.author_details.rating && (
                              <span className="text-yellow-500 text-sm flex items-center gap-1">
                                <Star className="w-4 h-4 fill-yellow-500" />
                                {review.author_details.rating}
                              </span>
                            )}
                            <span className="text-gray-400 text-sm">
                              {new Date(review.created_at).toLocaleDateString('ar')}
                            </span>
                          </div>
                        </div>
                      </div>
                      <p className="text-gray-300 leading-relaxed">{review.content}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400 text-center py-8">
                  لا توجد مراجعات حتى الآن. كن أول من يكتب مراجعة!
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Recommendations */}
        {recommendations.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-white mb-6">أفلام مشابهة قد تعجبك</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {recommendations.map((movie) => (
                <MovieCard key={movie.id} movie={movie} size="small" />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MovieDetailPage;