import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Film, User, Loader2 } from 'lucide-react';
import { searchMulti, getImageUrl } from '../services/tmdb';

interface SearchResult {
  id: number;
  media_type: 'movie' | 'person';
  title?: string;
  name?: string;
  poster_path?: string;
  profile_path?: string;
  overview?: string;
  release_date?: string;
  known_for_department?: string;
}

const SearchPage: React.FC = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const debounceTimer = setTimeout(async () => {
      if (query.length < 2) {
        setResults([]);
        return;
      }

      setLoading(true);
      try {
        const data = await searchMulti(query, 1);
        const filtered = data.results.filter(
          (item: any) => item.media_type === 'movie' || item.media_type === 'person'
        );
        setResults(filtered.slice(0, 20));
      } catch (error) {
        console.error('Search error:', error);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [query]);

  const handleResultClick = (result: SearchResult) => {
    if (result.media_type === 'movie') {
      navigate(`/movie/${result.id}`);
    } else {
      navigate(`/person/${result.id}`);
    }
  };

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        {/* Search Header */}
        <div className="max-w-2xl mx-auto mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 text-center">
            البحث
          </h1>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="ابحث عن أفلام أو ممثلين..."
              className="w-full pl-12 pr-4 py-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-900 dark:text-white text-lg"
              autoFocus
            />
          </div>
        </div>

        {/* Results */}
        <div className="max-w-4xl mx-auto">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 text-red-500 animate-spin" />
            </div>
          ) : results.length > 0 ? (
            <div className="space-y-3">
              {results.map((result) => (
                <button
                  key={result.id}
                  onClick={() => handleResultClick(result)}
                  className="w-full flex items-center gap-4 p-4 bg-white dark:bg-gray-800 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-right"
                >
                  <img
                    src={getImageUrl(
                      result.poster_path || result.profile_path || '',
                      'w185'
                    )}
                    alt={result.title || result.name}
                    className="w-16 h-24 object-cover rounded-lg"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                      {result.title || result.name}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`px-2 py-0.5 rounded text-xs ${
                        result.media_type === 'movie'
                          ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400'
                          : 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
                      }`}>
                        {result.media_type === 'movie' ? 'فيلم' : result.known_for_department}
                      </span>
                      {result.release_date && (
                        <span className="text-gray-500 text-sm">
                          {result.release_date.split('-')[0]}
                        </span>
                      )}
                    </div>
                    {result.overview && (
                      <p className="text-gray-500 dark:text-gray-400 text-sm mt-2 line-clamp-2">
                        {result.overview}
                      </p>
                    )}
                  </div>
                </button>
              ))}
            </div>
          ) : query.length >= 2 ? (
            <div className="text-center py-12">
              <Film className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                لا توجد نتائج
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                جرب البحث بكلمات مختلفة
              </p>
            </div>
          ) : (
            <div className="text-center py-12">
              <Search className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                ابدأ البحث
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                اكتب اسم فيلم أو ممثل للبدء
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchPage;