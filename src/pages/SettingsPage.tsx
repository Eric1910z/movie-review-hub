import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Settings, Moon, Sun, Monitor, Bell, BellOff, Globe, User, Shield, Palette } from 'lucide-react';
import * as authService from '../services/auth';

const SettingsPage: React.FC = () => {
  const { user, isAuthenticated, updatePreferences } = useAuth();
  const { theme, setTheme } = useTheme();
  const [notifications, setNotifications] = useState(true);
  const [language, setLanguage] = useState('ar');

  useEffect(() => {
    if (user) {
      setNotifications(user.preferences.notifications);
      setLanguage(user.preferences.language);
    }
  }, [user]);

  const handleThemeChange = (newTheme: 'light' | 'dark' | 'system') => {
    setTheme(newTheme);
    if (user) {
      updatePreferences({ theme: newTheme });
    }
  };

  const handleNotificationsChange = () => {
    const newValue = !notifications;
    setNotifications(newValue);
    if (user) {
      updatePreferences({ notifications: newValue });
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <Settings className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            تسجيل الدخول مطلوب
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            يجب عليك تسجيل الدخول للوصول إلى الإعدادات
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">الإعدادات</h1>

          {/* Profile Section */}
          <section className="bg-white dark:bg-gray-800 rounded-xl p-6 mb-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">الملف الشخصي</h2>
            </div>
            <div className="flex items-center gap-4">
              <img
                src={user?.avatar_url}
                alt={user?.username}
                className="w-20 h-20 rounded-full object-cover"
              />
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {user?.display_name}
                </h3>
                <p className="text-gray-500 dark:text-gray-400">{user?.email}</p>
                <p className="text-gray-400 dark:text-gray-500 text-sm">
                  عضو منذ {user?.created_at ? new Date(user.created_at).toLocaleDateString('ar') : ''}
                </p>
              </div>
            </div>
          </section>

          {/* Appearance Section */}
          <section className="bg-white dark:bg-gray-800 rounded-xl p-6 mb-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
                <Palette className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">المظهر</h2>
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 dark:text-gray-300 mb-3">المظهر</label>
              <div className="grid grid-cols-3 gap-3">
                <button
                  onClick={() => handleThemeChange('light')}
                  className={`flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-colors ${
                    theme === 'light'
                      ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                  }`}
                >
                  <Sun className={`w-8 h-8 ${theme === 'light' ? 'text-red-500' : 'text-gray-400'}`} />
                  <span className={`text-sm font-medium ${theme === 'light' ? 'text-red-500' : 'text-gray-600 dark:text-gray-400'}`}>
                    مضيء
                  </span>
                </button>
                <button
                  onClick={() => handleThemeChange('dark')}
                  className={`flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-colors ${
                    theme === 'dark'
                      ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                  }`}
                >
                  <Moon className={`w-8 h-8 ${theme === 'dark' ? 'text-red-500' : 'text-gray-400'}`} />
                  <span className={`text-sm font-medium ${theme === 'dark' ? 'text-red-500' : 'text-gray-600 dark:text-gray-400'}`}>
                    مظلم
                  </span>
                </button>
                <button
                  onClick={() => handleThemeChange('system')}
                  className={`flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-colors ${
                    theme === 'system'
                      ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                  }`}
                >
                  <Monitor className={`w-8 h-8 ${theme === 'system' ? 'text-red-500' : 'text-gray-400'}`} />
                  <span className={`text-sm font-medium ${theme === 'system' ? 'text-red-500' : 'text-gray-600 dark:text-gray-400'}`}>
                    تلقائي
                  </span>
                </button>
              </div>
            </div>
          </section>

          {/* Notifications Section */}
          <section className="bg-white dark:bg-gray-800 rounded-xl p-6 mb-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                <Bell className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">الإشعارات</h2>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-gray-900 dark:text-white font-medium">إشعارات البريد الإلكتروني</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  استلام إشعارات عند صدور أفلام جديدة أو عند تحديثات الحساب
                </p>
              </div>
              <button
                onClick={handleNotificationsChange}
                className={`relative w-14 h-8 rounded-full transition-colors ${
                  notifications ? 'bg-red-500' : 'bg-gray-300 dark:bg-gray-600'
                }`}
              >
                <span
                  className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full shadow transition-transform ${
                    notifications ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </section>

          {/* Language Section */}
          <section className="bg-white dark:bg-gray-800 rounded-xl p-6 mb-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                <Globe className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">اللغة</h2>
            </div>

            <div>
              <label className="block text-gray-700 dark:text-gray-300 mb-3">اللغة المفضلة</label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full md:w-64 px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-900 dark:text-white"
              >
                <option value="ar">العربية</option>
                <option value="en">English</option>
              </select>
            </div>
          </section>

          {/* Privacy & Security */}
          <section className="bg-white dark:bg-gray-800 rounded-xl p-6 mb-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-yellow-500 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">الخصوصية والأمان</h2>
            </div>

            <div className="space-y-4">
              <button className="w-full flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                <span className="text-gray-900 dark:text-white font-medium">تغيير كلمة المرور</span>
                <span className="text-gray-400">›</span>
              </button>
              <button className="w-full flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                <span className="text-gray-900 dark:text-white font-medium">إدارة الجلسات</span>
                <span className="text-gray-400">›</span>
              </button>
              <button className="w-full flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                <span className="text-gray-900 dark:text-white font-medium">تصدير البيانات</span>
                <span className="text-gray-400">›</span>
              </button>
            </div>
          </section>

          {/* About */}
          <section className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <div className="text-center">
              <h3 className="text-gray-900 dark:text-white font-semibold mb-2">MovieReviewHub</h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                الإصدار 1.0.0 | البيانات مقدمة من TMDb
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;