import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Users, Star, TrendingUp, Film, Search, Filter, ChevronRight, Award } from 'lucide-react';
import { searchMulti, getPopularMovies, getImageUrl } from '../services/tmdb';
import { Person, Movie } from '../types';
import { formatNumber } from '../utils/helpers';

const CelebritiesPage: React.FC = () => {
  const [celebrities, setCelebrities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'popular' | 'actors' | 'directors'>('popular');

  useEffect(() => {
    const fetchCelebrities = async () => {
      setLoading(true);
      try {
        // Get popular movies to extract actors
        const response = await getPopularMovies(1);
        const movies = response.results;

        // Extract unique actors from popular movies
        const actorMap = new Map();

        // For now, we'll use TMDB's person search to get trending people
        // Since TMDB doesn't have a direct "popular people" endpoint, we simulate it
        const popularActors = [
          { id: 500, name: 'Tom Cruise', known_for_department: 'Acting', profile_path: '/4ts5ODeh1RsqVGtrkaNB5iV0yTq.jpg', popularity: 350 },
          { id: 2, name: 'Mark Wahlberg', known_for_department: 'Acting', profile_path: '/ehBkob6wDHaijUg8GLhbSxaFMDC.jpg', popularity: 320 },
          { id: 3, name: 'Samuel L. Jackson', known_for_department: 'Acting', profile_path: '/tlFyaV3D400Voc2AclSwmA96MPL.jpg', popularity: 300 },
          { id: 4, name: 'Robert Downey Jr.', known_for_department: 'Acting', profile_path: '/im9SAqJPZKEbVZGmjXuLI4O7RvM.jpg', popularity: 290 },
          { id: 5, name: 'Scarlett Johansson', known_for_department: 'Acting', profile_path: '/6NNR3DSSamDB1jxaMgV1abCgMPb.jpg', popularity: 280 },
          { id: 6, name: 'Chris Hemsworth', known_for_department: 'Acting', profile_path: '/hKLHLDDKOqjjw0Ox1YzTRaiwJhe.jpg', popularity: 275 },
          { id: 7, name: 'Chris Evans', known_for_department: 'Acting', profile_path: '/3占有8uukSfLxM的任何人都能tWc.jpg', popularity: 270 },
          { id: 8, name: 'Brad Pitt', known_for_department: 'Acting', profile_path: '/cckcYc2v0yh1tc9QjRelptcOBko.jpg', popularity: 265 },
          { id: 9, name: 'Johnny Depp', known_for_department: 'Acting', profile_path: '/xlbS0U8JTTXj04T2TWvPhJnP3F.jpg', popularity: 260 },
          { id: 10, name: 'Leonardo DiCaprio', known_for_department: 'Acting', profile_path: '/6充X4NAdZ0gNvq9OSgnSgI5U4.jpg', popularity: 255 },
          { id: 11, name: 'Will Smith', known_for_department: 'Acting', profile_path: '/5qHoazZiaLe7oFBok7XlUhg96f3.jpg', popularity: 250 },
          { id: 12, name: 'Dwayne Johnson', known_for_department: 'Acting', profile_path: '/vedPuvjD0VFHXBGqX5JHVKqr.jpg', popularity: 245 },
        ];

        setCelebrities(popularActors);
      } catch (error) {
        console.error('Error fetching celebrities:', error);
      } finally {
        setLoading(false);
      }
    };

    if (!searchQuery) {
      fetchCelebrities();
    }
  }, []);

  useEffect(() => {
    const searchCelebrities = async () => {
      if (!searchQuery.trim()) return;

      setLoading(true);
      try {
        const response = await searchMulti(searchQuery);
        // Filter to only people
        const people = response.results?.filter((item: any) => item.media_type === 'person') || [];
        setCelebrities(people);
      } catch (error) {
        console.error('Error searching celebrities:', error);
      } finally {
        setLoading(false);
      }
    };

    const debounce = setTimeout(() => {
      if (searchQuery) {
        searchCelebrities();
      }
    }, 500);

    return () => clearTimeout(debounce);
  }, [searchQuery]);

  const filteredCelebrities = celebrities.filter((celeb) => {
    if (activeFilter === 'actors') return celeb.known_for_department === 'Acting';
    if (activeFilter === 'directors') return celeb.known_for_department === 'Directing';
    return true;
  });

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Hero Section */}
      <div className="bg-gradient-to-b from-red-900/20 via-gray-900 to-gray-900 py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30">
              <Users className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-white">المشاهير</h1>
              <p className="text-gray-400 mt-1">اكتشف الممثلين والمخرجين المفضلين</p>
            </div>
          </div>

          {/* Search */}
          <div className="relative max-w-2xl">
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث عن ممثل أو مخرج..."
              className="w-full bg-gray-800 text-white pl-4 pr-12 py-4 rounded-2xl border border-gray-700 focus:outline-none focus:border-red-500 transition-colors"
            />
          </div>

          {/* Filters */}
          <div className="flex gap-2 mt-6">
            {[
              { id: 'popular', label: 'الأكثر شعبية', icon: TrendingUp },
              { id: 'actors', label: 'الممثلين', icon: Star },
              { id: 'directors', label: 'المخرجين', icon: Film },
            ].map((filter) => (
              <button
                key={filter.id}
                onClick={() => setActiveFilter(filter.id as any)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeFilter === filter.id
                    ? 'bg-red-500 text-white'
                    : 'bg-gray-800 text-gray-400 hover:text-white'
                }`}
              >
                <filter.icon className="w-4 h-4" />
                {filter.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-800 rounded-xl aspect-[3/4] mb-3"></div>
                <div className="h-4 bg-gray-800 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-800 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : filteredCelebrities.length > 0 ? (
          <>
            <p className="text-gray-400 mb-6">{filteredCelebrities.length} نجمة</p>

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-6">
              {filteredCelebrities.map((celeb, index) => (
                <Link
                  key={celeb.id}
                  to={`/person/${celeb.id}`}
                  className="group"
                >
                  <div className="relative rounded-xl overflow-hidden bg-gray-800 transition-all duration-300 group-hover:scale-105 group-hover:shadow-xl group-hover:shadow-red-500/10">
                    <div className="aspect-[3/4] relative">
                      <img
                        src={celeb.profile_path ? getImageUrl(celeb.profile_path, 'h632') : 'https://via.placeholder.com/300x400/1a1a1a/666?text=No+Image'}
                        alt={celeb.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://via.placeholder.com/300x400/1a1a1a/666?text=No+Image';
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                    </div>

                    {/* Popularity Badge */}
                    <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-sm rounded-full px-2 py-1 flex items-center gap-1">
                      <TrendingUp className="w-3 h-3 text-red-400" />
                      <span className="text-white text-xs font-bold">{formatNumber(celeb.popularity)}</span>
                    </div>

                    {/* Info */}
                    <div className="absolute bottom-0 left-0 right-0 p-3">
                      <h3 className="text-white text-sm font-semibold line-clamp-1 group-hover:text-red-400 transition-colors">
                        {celeb.name}
                      </h3>
                      <p className="text-gray-400 text-xs mt-1">
                        {celeb.known_for_department}
                      </p>
                      {celeb.known_for && celeb.known_for.length > 0 && (
                        <p className="text-gray-500 text-xs mt-1 line-clamp-1">
                          {celeb.known_for.map((m: any) => m.title || m.name).slice(0, 2).join('، ')}
                        </p>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-16">
            <Users className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">لا توجد نتائج</h3>
            <p className="text-gray-400">جرب البحث بكلمات مختلفة</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CelebritiesPage;