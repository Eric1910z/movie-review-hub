import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Search, Menu, X, User, LogOut, Settings, Heart, Film, Trophy, Compass, Clapperboard, Users } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import SearchBar from '../search/SearchBar';

const Header: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('.user-menu-container')) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  const handleLogout = () => {
    logout();
    setIsUserMenuOpen(false);
    navigate('/');
  };

  const navItems = [
    { path: '/', label: 'الرئيسية', icon: Film },
    { path: '/movies', label: 'الأفلام', icon: Clapperboard },
    { path: '/celebrities', label: 'المشاهير', icon: Users },
    { path: '/discover', label: 'اكتشاف', icon: Compass },
    { path: '/top250', label: 'أفضل 250', icon: Trophy },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${
      scrolled
        ? 'bg-white/95 dark:bg-[#0f0f0f]/95 backdrop-blur-xl shadow-lg border-b border-gray-100 dark:border-gray-800'
        : 'bg-white dark:bg-[#0f0f0f]'
    }`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center shadow-lg shadow-red-500/30 group-hover:shadow-red-500/50 transition-shadow">
                <Film className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full border-2 border-white dark:border-gray-800"></div>
            </div>
            <div className="flex flex-col">
              <span className="text-lg lg:text-xl font-bold bg-gradient-to-r from-red-500 to-red-600 bg-clip-text text-transparent">
                MovieReviewHub
              </span>
              <span className="text-[10px] lg:text-xs text-gray-500 dark:text-gray-400 hidden sm:block">
                اكتشف قيم شارك
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-all duration-300 ${
                  isActive(item.path)
                    ? 'bg-red-500 text-white shadow-lg shadow-red-500/30'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-red-500'
                }`}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </Link>
            ))}
            {isAuthenticated && (
              <Link
                to="/watchlist"
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-all duration-300 ${
                  isActive('/watchlist')
                    ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/30'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-blue-500'
                }`}
              >
                <Heart className="w-4 h-4" />
                قائمتي
              </Link>
            )}
          </nav>

          {/* Search Bar */}
          <div className="hidden md:block flex-1 max-w-md mx-4 lg:mx-8">
            <SearchBar />
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-2 lg:gap-4">
            {/* Mobile Search Button */}
            <button
              className="md:hidden p-2 lg:p-3 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              onClick={() => navigate('/search')}
            >
              <Search className="w-5 h-5" />
            </button>

            {isAuthenticated ? (
              <div className="relative user-menu-container">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 p-1.5 lg:p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  <img
                    src={user?.avatar_url}
                    alt={user?.username}
                    className="w-8 h-8 lg:w-10 lg:h-10 rounded-xl object-cover ring-2 ring-red-500/20"
                  />
                  <span className="hidden sm:block text-gray-700 dark:text-gray-300 font-medium">
                    {user?.username}
                  </span>
                </button>

                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-[#1a1a1a] rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-800 overflow-hidden animate-scaleIn">
                    <div className="px-4 py-3 bg-gradient-to-r from-red-500 to-red-600">
                      <p className="font-semibold text-white">{user?.display_name}</p>
                      <p className="text-white/80 text-sm">{user?.email}</p>
                    </div>
                    <div className="py-2">
                      <Link
                        to="/watchlist"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                      >
                        <Heart className="w-5 h-5 text-pink-500" />
                        قائمة المشاهدة
                      </Link>
                      <Link
                        to="/settings"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                      >
                        <Settings className="w-5 h-5 text-blue-500" />
                        الإعدادات
                      </Link>
                    </div>
                    <div className="border-t border-gray-200 dark:border-gray-700 py-2">
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 w-full px-4 py-3 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                      >
                        <LogOut className="w-5 h-5" />
                        تسجيل الخروج
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-red-500 transition-colors font-medium hidden sm:block"
                >
                  تسجيل الدخول
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 lg:px-6 lg:py-2.5 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl font-semibold hover:from-red-600 hover:to-red-700 transition-all shadow-lg shadow-red-500/25 hover:shadow-red-500/40"
                >
                  إنشاء حساب
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden p-2 lg:p-3 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-gray-200 dark:border-gray-800">
            <nav className="flex flex-col gap-2">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${
                    isActive(item.path)
                      ? 'bg-red-500 text-white'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  {item.label}
                </Link>
              ))}
              {isAuthenticated && (
                <Link
                  to="/watchlist"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${
                    isActive('/watchlist')
                      ? 'bg-blue-500 text-white'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  <Heart className="w-5 h-5" />
                  قائمة المشاهدة
                </Link>
              )}
              <div className="mt-2 px-2">
                <SearchBar />
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;