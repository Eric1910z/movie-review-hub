import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Eye, Play, Search, Filter, ChevronDown, Calendar, Star, Trash2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getImageUrl } from '../services/tmdb';
import { WatchlistItem } from '../types';
import * as authService from '../services/auth';
import { formatDate, formatVoteAverage } from '../utils/helpers';

const WatchlistPage: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);
  const [filter, setFilter] = useState<'all' | 'watchlist' | 'watching' | 'watched'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (user) {
      setWatchlist(authService.getWatchlist(user.id));
    }
  }, [user]);

  const handleRemove = (itemId: string) => {
    if (user) {
      authService.removeFromWatchlist(user.id, itemId);
      setWatchlist(authService.getWatchlist(user.id));
    }
  };

  const handleStatusChange = (itemId: string, status: WatchlistItem['status']) => {
    if (user) {
      authService.updateWatchlistItemStatus(user.id, itemId, status);
      setWatchlist(authService.getWatchlist(user.id));
    }
  };

  const filteredWatchlist = watchlist.filter((item) => {
    if (filter !== 'all' && item.status !== filter) return false;
    if (searchQuery && !item.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const stats = {
    total: watchlist.length,
    watchlist: watchlist.filter((w) => w.status === 'watchlist').length,
    watching: watchlist.filter((w) => w.status === 'watching').length,
    watched: watchlist.filter((w) => w.status === 'watched').length,
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <Heart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            تسجيل الدخول مطلوب
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            يجب عليك تسجيل الدخول أولاً للوصول إلى قائمة المشاهدة
          </p>
          <Link
            to="/login"
            className="inline-block bg-red-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-600 transition-colors"
          >
            تسجيل الدخول
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">قائمة المشاهدة</h1>
          <p className="text-gray-600 dark:text-gray-400">
            تتبع الأفلام التي تريد مشاهدتها وما شاهدته
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
            <p className="text-gray-500 dark:text-gray-400 text-sm">الإجمالي</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
            <p className="text-gray-500 dark:text-gray-400 text-sm flex items-center gap-2">
              <Eye className="w-4 h-4 text-blue-500" />
              أريد مشاهدته
            </p>
            <p className="text-2xl font-bold text-blue-500">{stats.watchlist}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
            <p className="text-gray-500 dark:text-gray-400 text-sm flex items-center gap-2">
              <Play className="w-4 h-4 text-yellow-500" />
              أشاهده حالياً
            </p>
            <p className="text-2xl font-bold text-yellow-500">{stats.watching}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
            <p className="text-gray-500 dark:text-gray-400 text-sm flex items-center gap-2">
              <Heart className="w-4 h-4 text-green-500" />
              شاهدته
            </p>
            <p className="text-2xl font-bold text-green-500">{stats.watched}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث في قائمتك..."
              className="w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-900 dark:text-white"
            />
          </div>
          <div className="flex gap-2">
            {(['all', 'watchlist', 'watching', 'watched'] as const).map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filter === status
                    ? 'bg-red-500 text-white'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                {status === 'all' ? 'الكل' : status === 'watchlist' ? 'أريد مشاهدته' : status === 'watching' ? 'أشاهده' : 'شاهدته'}
              </button>
            ))}
          </div>
        </div>

        {/* Watchlist Items */}
        {filteredWatchlist.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredWatchlist.map((item) => (
              <div
                key={item.id}
                className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow"
              >
                <Link to={`/movie/${item.tmdb_id}`} className="flex">
                  <img
                    src={item.poster_path ? getImageUrl(item.poster_path, 'w342') : 'https://via.placeholder.com/228x342?text=No+Image'}
                    alt={item.title}
                    className="w-32 h-48 object-cover"
                  />
                  <div className="flex-1 p-4">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
                      {item.title}
                    </h3>
                    <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 text-sm mb-3">
                      {item.release_date && (
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {item.release_date.split('-')[0]}
                        </span>
                      )}
                      {item.vote_average > 0 && (
                        <span className="flex items-center gap-1 text-yellow-500">
                          <Star className="w-4 h-4 fill-yellow-500" />
                          {formatVoteAverage(item.vote_average)}
                        </span>
                      )}
                    </div>

                    {/* Status Badge */}
                    <div className="mb-3">
                      <select
                        value={item.status}
                        onChange={(e) => handleStatusChange(item.id, e.target.value as WatchlistItem['status'])}
                        onClick={(e) => e.stopPropagation()}
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          item.status === 'watchlist'
                            ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                            : item.status === 'watching'
                            ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                            : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                        }`}
                      >
                        <option value="watchlist">أريد مشاهدته</option>
                        <option value="watching">أشاهده حالياً</option>
                        <option value="watched">شاهدته</option>
                      </select>
                    </div>

                    <p className="text-xs text-gray-400">
                      أضيف {new Date(item.added_at).toLocaleDateString('ar')}
                    </p>
                  </div>
                </Link>
                <button
                  onClick={() => handleRemove(item.id)}
                  className="w-full py-3 border-t border-gray-100 dark:border-gray-700 text-gray-500 hover:text-red-500 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center justify-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  إزالة
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <Heart className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              {filter === 'all' ? 'قائمتك فارغة' : `لا توجد عناصر في "${filter === 'watchlist' ? 'أريد مشاهدته' : filter === 'watching' ? 'أشاهده' : 'شاهدته'}"`}
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              ابدأ بإضافة أفلام إلى قائمتك
            </p>
            <Link
              to="/discover"
              className="inline-flex items-center gap-2 bg-red-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-600 transition-colors"
            >
              <Search className="w-4 h-4" />
              استكشف الأفلام
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default WatchlistPage;