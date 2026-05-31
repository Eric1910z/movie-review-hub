import React, { useState, useEffect, useCallback } from 'react';
import { Search, X } from 'lucide-react';
import { searchMulti } from '../../services/tmdb';
import { getImageUrl } from '../../services/tmdb';
import { Link } from 'react-router-dom';

interface SearchBarProps {
  className?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ className = '' }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = useCallback(async (searchQuery: string) => {
    if (searchQuery.length < 2) {
      setResults([]);
      return;
    }

    setIsLoading(true);
    try {
      const data = await searchMulti(searchQuery, 1);
      // Filter out TV shows and keep only movies and people
      const filtered = data.results.filter(
        (item: any) => item.media_type === 'movie' || item.media_type === 'person'
      );
      setResults(filtered.slice(0, 8));
      setIsOpen(true);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      handleSearch(query);
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [query, handleSearch]);

  const handleClear = () => {
    setQuery('');
    setResults([]);
    setIsOpen(false);
  };

  const getMediaTypeLabel = (mediaType: string) => {
    return mediaType === 'movie' ? 'فيلم' : 'شخص';
  };

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="ابحث عن أفلام أو ممثلين..."
          className="w-full pl-10 pr-10 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors"
          onFocus={() => query.length >= 2 && setIsOpen(true)}
        />
        {query && (
          <button
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-900 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 z-50 max-h-96 overflow-y-auto">
            {isLoading ? (
              <div className="p-4 text-center text-gray-500">
                <div className="animate-pulse">جاري البحث...</div>
              </div>
            ) : results.length > 0 ? (
              <ul className="py-2">
                {results.map((item) => (
                  <li key={item.id}>
                    <Link
                      to={item.media_type === 'movie' ? `/movie/${item.id}` : `/person/${item.id}`}
                      onClick={() => {
                        setIsOpen(false);
                        setQuery('');
                      }}
                      className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    >
                      <img
                        src={item.poster_path || item.profile_path
                          ? getImageUrl(item.poster_path || item.profile_path, 'w92')
                          : 'https://via.placeholder.com/92x138?text=No+Image'
                        }
                        alt={item.title || item.name}
                        className="w-12 h-16 object-cover rounded-md"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 dark:text-white truncate">
                          {item.title || item.name}
                        </p>
                        <p className="text-sm text-gray-500">
                          {item.release_date || item.known_for_department || item.known_for?.[0]?.title || ''}
                        </p>
                        <span className="inline-block mt-1 px-2 py-0.5 text-xs rounded bg-red-500 text-white">
                          {getMediaTypeLabel(item.media_type)}
                        </span>
                      </div>
                      {item.vote_average > 0 && (
                        <span className="text-yellow-500 font-bold">
                          {item.vote_average.toFixed(1)}
                        </span>
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="p-4 text-center text-gray-500">
                لم يتم العثور على نتائج
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default SearchBar;