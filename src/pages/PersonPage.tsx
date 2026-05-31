import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft, Calendar, MapPin, Film, Tv, Star, ChevronDown, ChevronUp,
  Award, Globe, TrendingUp, Users, Bookmark,
  Twitter, Instagram, Facebook, ExternalLink
} from 'lucide-react';
import { getPersonDetails, getPersonMovieCredits, getPersonImages, getImageUrl } from '../services/tmdb';
import { getCachedPerson, setCachedPerson, getCachedPersonCredits, setCachedPersonCredits } from '../services/personCache';
import { Person } from '../types';
import { formatDate, formatNumber } from '../utils/helpers';

const PersonPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [person, setPerson] = useState<Person | null>(null);
  const [movieCredits, setMovieCredits] = useState<any>(null);
  const [personImages, setPersonImages] = useState<any>(null);
  const [showFullBio, setShowFullBio] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'movies' | 'images' | 'bio'>('movies');
  const [knownForFilter, setKnownForFilter] = useState<'all' | 'acting' | 'directing'>('all');
  const [stats, setStats] = useState<{ totalMovies: number; avgRating: number; directorCount: number }>({ totalMovies: 0, avgRating: 0, directorCount: 0 });

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      try {
        const personId = parseInt(id);

        // Try to get cached data first
        const cachedPerson = getCachedPerson(personId);
        const cachedCredits = getCachedPersonCredits(personId);

        if (cachedPerson && cachedCredits) {
          setPerson(cachedPerson);
          setMovieCredits(cachedCredits);
          calculateStats(cachedCredits.cast, cachedCredits.crew);
        }

        // Fetch fresh data
        const [personData, creditsData, imagesData] = await Promise.all([
          getPersonDetails(personId),
          getPersonMovieCredits(personId),
          getPersonImages(personId),
        ]);

        setPerson(personData);
        setMovieCredits(creditsData);
        setPersonImages(imagesData);

        // Update cache
        setCachedPerson(personId, personData);
        setCachedPersonCredits(personId, creditsData.cast, creditsData.crew);

        calculateStats(creditsData.cast, creditsData.crew);
      } catch (error) {
        console.error('Error fetching person details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const calculateStats = (cast: any[], crew: any[]) => {
    if (!cast || !crew) return;

    const totalMovies = cast.length + crew.filter((c: any) => c.department === 'Directing').length;
    const ratedMovies = cast.filter((m: any) => m.vote_count > 0);
    const avgRating = ratedMovies.length > 0
      ? ratedMovies.reduce((sum: number, m: any) => sum + m.vote_average, 0) / ratedMovies.length
      : 0;
    const directorMovies = crew.filter((c: any) => c.job === 'Director');

    setStats({
      totalMovies,
      avgRating: Math.round(avgRating * 10) / 10,
      directorCount: directorMovies.length
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-red-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-500 dark:text-gray-400">جاري تحميل الملف الشخصي...</p>
        </div>
      </div>
    );
  }

  if (!person) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-400">الشخص غير موجود</p>
          <Link to="/" className="text-red-500 hover:text-red-600 mt-4 inline-block">
            العودة للرئيسية
          </Link>
        </div>
      </div>
    );
  }

  // Separate acting and directing credits
  const actingMovies = movieCredits?.cast?.filter((c: any) => c.character) || [];
  const directedMovies = movieCredits?.crew?.filter((c: any) => c.job === 'Director') || [];

  // Get known for (most popular movies)
  const knownFor = [...actingMovies, ...directedMovies]
    .filter((m: any) => m.poster_path)
    .sort((a: any, b: any) => (b.popularity || 0) - (a.popularity || 0))
    .slice(0, 10);

  const filteredMovies = useMemo(() => {
    if (!movieCredits) return [];

    switch (knownForFilter) {
      case 'acting':
        return actingMovies;
      case 'directing':
        return directedMovies;
      default:
        return [...actingMovies, ...directedMovies].sort((a: any, b: any) =>
          new Date(b.release_date || b.first_air_date || 0).getTime() -
          new Date(a.release_date || a.first_air_date || 0).getTime()
        );
    }
  }, [movieCredits, knownForFilter, actingMovies, directedMovies]);

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Hero Background */}
      <div className="relative">
        <div className="absolute inset-0 h-96 bg-gradient-to-b from-red-900/20 to-gray-900"></div>

        {/* Main Header */}
        <div className="container mx-auto px-4 pt-8 relative">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            العودة
          </Link>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Profile Image */}
            <div className="flex-shrink-0 mx-auto lg:mx-0">
              <div className="relative">
                <img
                  src={person.profile_path ? getImageUrl(person.profile_path, 'h632') : 'https://via.placeholder.com/400x600?text=No+Image'}
                  alt={person.name}
                  className="w-64 md:w-80 rounded-xl shadow-2xl shadow-red-500/10"
                />
                {person.deathday && (
                  <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                    RIP
                  </div>
                )}
              </div>

              {/* Social Links */}
              <div className="mt-4 flex justify-center gap-3">
                {person.external_ids?.twitter_id && (
                  <a href={`https://twitter.com/${person.external_ids.twitter_id}`} target="_blank" rel="noopener noreferrer"
                    className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center text-gray-400 hover:text-white hover:bg-gray-700 transition-colors">
                    <Twitter className="w-5 h-5" />
                  </a>
                )}
                {person.external_ids?.instagram_id && (
                  <a href={`https://instagram.com/${person.external_ids.instagram_id}`} target="_blank" rel="noopener noreferrer"
                    className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center text-gray-400 hover:text-white hover:bg-gray-700 transition-colors">
                    <Instagram className="w-5 h-5" />
                  </a>
                )}
                {person.external_ids?.facebook_id && (
                  <a href={`https://facebook.com/${person.external_ids.facebook_id}`} target="_blank" rel="noopener noreferrer"
                    className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center text-gray-400 hover:text-white hover:bg-gray-700 transition-colors">
                    <Facebook className="w-5 h-5" />
                  </a>
                )}
                {person.homepage && (
                  <a href={person.homepage} target="_blank" rel="noopener noreferrer"
                    className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center text-gray-400 hover:text-white hover:bg-gray-700 transition-colors">
                    <Globe className="w-5 h-5" />
                  </a>
                )}
              </div>
            </div>

            {/* Info */}
            <div className="flex-1 text-center lg:text-left">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">{person.name}</h1>

              {person.also_known_as && person.also_known_as.length > 0 && (
                <p className="text-gray-400 mb-4">
                  {person.also_known_as.slice(0, 3).join(' • ')}
                </p>
              )}

              {person.known_for_department && (
                <span className="inline-block bg-gradient-to-r from-red-500 to-red-600 text-white text-sm px-4 py-1.5 rounded-full font-medium mb-6">
                  {person.known_for_department}
                </span>
              )}

              {/* Stats Bar */}
              <div className="flex flex-wrap justify-center lg:justify-start gap-4 mb-6">
                {person.birthday && (
                  <div className="flex items-center gap-2 bg-gray-800/50 px-4 py-2 rounded-lg">
                    <Calendar className="w-4 h-4 text-red-400" />
                    <span className="text-gray-300 text-sm">
                      {formatDate(person.birthday)}
                      {person.deathday ? ` - ${formatDate(person.deathday)}` : ''}
                    </span>
                  </div>
                )}
                {person.place_of_birth && (
                  <div className="flex items-center gap-2 bg-gray-800/50 px-4 py-2 rounded-lg">
                    <MapPin className="w-4 h-4 text-red-400" />
                    <span className="text-gray-300 text-sm">{person.place_of_birth}</span>
                  </div>
                )}
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-3 gap-4 mb-6 max-w-lg mx-auto lg:mx-0">
                <div className="bg-gray-800/50 rounded-xl p-4 text-center">
                  <TrendingUp className="w-6 h-6 text-red-400 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-white">{formatNumber(person.popularity)}</div>
                  <div className="text-gray-400 text-xs">الشعبية</div>
                </div>
                <div className="bg-gray-800/50 rounded-xl p-4 text-center">
                  <Film className="w-6 h-6 text-red-400 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-white">{stats.totalMovies}</div>
                  <div className="text-gray-400 text-xs">الأفلام</div>
                </div>
                <div className="bg-gray-800/50 rounded-xl p-4 text-center">
                  <Star className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-white">{stats.avgRating > 0 ? stats.avgRating : '-'}</div>
                  <div className="text-gray-400 text-xs">متوسط التقييم</div>
                </div>
              </div>

              {/* Biography Preview */}
              {person.biography && (
                <div className="bg-gray-800/30 rounded-xl p-4 mb-6">
                  <h3 className="text-white font-semibold mb-2">نبذة عن {person.name}</h3>
                  <p className={`text-gray-300 leading-relaxed ${!showFullBio && 'line-clamp-4'}`}>
                    {person.biography}
                  </p>
                  {person.biography.length > 300 && (
                    <button
                      onClick={() => setShowFullBio(!showFullBio)}
                      className="text-red-400 hover:text-red-300 mt-2 flex items-center gap-1 text-sm"
                    >
                      {showFullBio ? (
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
            </div>
          </div>
        </div>
      </div>

      {/* Content Tabs */}
      <div className="container mx-auto px-4 py-8">
        {/* Tab Navigation */}
        <div className="flex gap-2 mb-8 border-b border-gray-800">
          {[
            { id: 'movies', label: 'الأفلام', icon: Film, count: filteredMovies.length },
            { id: 'images', label: 'الصور', icon: Tv, count: personImages?.profiles?.length || 0 },
            { id: 'bio', label: 'السيرة الذاتية', icon: Users, count: null },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-red-500 text-red-400'
                  : 'border-transparent text-gray-400 hover:text-white'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
              {tab.count !== null && (
                <span className="bg-gray-800 text-gray-300 px-2 py-0.5 rounded-full text-xs">
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Movies Tab */}
        {activeTab === 'movies' && (
          <div>
            {/* Filter */}
            <div className="flex gap-2 mb-6">
              {[
                { id: 'all', label: 'الكل' },
                { id: 'acting', label: 'الأفلام كممثل' },
                { id: 'directing', label: 'الأفلام كمخرج' },
              ].map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => setKnownForFilter(filter.id as any)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    knownForFilter === filter.id
                      ? 'bg-red-500 text-white'
                      : 'bg-gray-800 text-gray-400 hover:text-white'
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>

            {/* Known For Section */}
            {knownForFilter === 'all' && knownFor.length > 0 && (
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                  <Award className="w-5 h-5 text-yellow-500" />
                  معروف بأفلامه
                </h3>
                <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                  {knownFor.slice(0, 10).map((movie: any) => (
                    <Link key={movie.id} to={`/movie/${movie.id}`} className="flex-shrink-0 w-36 group">
                      <img
                        src={movie.poster_path ? getImageUrl(movie.poster_path, 'w342') : 'https://via.placeholder.com/342x513?text=No+Image'}
                        alt={movie.title || movie.name}
                        className="w-full rounded-lg group-hover:scale-105 transition-transform"
                      />
                      <p className="text-white text-sm mt-2 truncate group-hover:text-red-400 transition-colors">
                        {movie.title || movie.name}
                      </p>
                      <p className="text-gray-400 text-xs truncate">
                        {movie.character || (movie.job)}
                      </p>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Full Filmography */}
            <div>
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <Film className="w-5 h-5 text-red-400" />
                Filmography ({filteredMovies.length})
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                {filteredMovies.slice(0, 24).map((movie: any) => (
                  <Link key={movie.id} to={`/movie/${movie.id}`} className="group">
                    <div className="relative aspect-[2/3] rounded-lg overflow-hidden bg-gray-800">
                      <img
                        src={movie.poster_path ? getImageUrl(movie.poster_path, 'w342') : 'https://via.placeholder.com/342x513?text=No+Image'}
                        alt={movie.title || movie.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      {movie.vote_average > 0 && (
                        <div className="absolute top-2 left-2 bg-black/70 px-2 py-0.5 rounded flex items-center gap-1">
                          <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                          <span className="text-white text-xs font-medium">{movie.vote_average.toFixed(1)}</span>
                        </div>
                      )}
                    </div>
                    <div className="mt-2">
                      <h4 className="text-white text-sm font-medium truncate group-hover:text-red-400 transition-colors">
                        {movie.title || movie.name}
                      </h4>
                      <p className="text-gray-400 text-xs">
                        {movie.character || movie.job}
                        {movie.release_date && ` • ${movie.release_date.split('-')[0]}`}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>

              {filteredMovies.length > 24 && (
                <div className="text-center mt-6">
                  <button className="bg-gray-800 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors">
                    عرض المزيد ({filteredMovies.length - 24})
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Images Tab */}
        {activeTab === 'images' && personImages && (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {personImages.profiles?.map((img: any, index: number) => (
              <div key={index} className="relative aspect-[2/3] rounded-lg overflow-hidden group">
                <img
                  src={getImageUrl(img.file_path, 'w342')}
                  alt={person.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
              </div>
            ))}
          </div>
        )}

        {/* Bio Tab */}
        {activeTab === 'bio' && (
          <div className="max-w-4xl">
            <div className="bg-gray-800/30 rounded-xl p-6">
              <h3 className="text-xl font-semibold text-white mb-4">السيرة الذاتية</h3>
              <div className="text-gray-300 leading-relaxed whitespace-pre-wrap">
                {person.biography || 'لا توجد سيرة ذاتية متاحة.'}
              </div>
            </div>

            {/* Personal Info */}
            <div className="bg-gray-800/30 rounded-xl p-6 mt-6">
              <h3 className="text-xl font-semibold text-white mb-4">معلومات شخصية</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {person.birthday && (
                  <div className="flex items-start gap-3">
                    <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-gray-400 text-sm">تاريخ الميلاد</p>
                      <p className="text-white">{formatDate(person.birthday)}</p>
                    </div>
                  </div>
                )}
                {person.place_of_birth && (
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-gray-400 text-sm">مكان الميلاد</p>
                      <p className="text-white">{person.place_of_birth}</p>
                    </div>
                  </div>
                )}
                {person.known_for_department && (
                  <div className="flex items-start gap-3">
                    <Film className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-gray-400 text-sm">معروف بـ</p>
                      <p className="text-white">{person.known_for_department}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PersonPage;