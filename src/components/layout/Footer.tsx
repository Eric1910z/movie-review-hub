import React from 'react';
import { Link } from 'react-router-dom';
import { Film, Github, Twitter, Mail } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 dark:bg-gray-950 border-t border-gray-800">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <Film className="w-8 h-8 text-red-500" />
              <span className="text-xl font-bold text-white">MovieReviewHub</span>
            </Link>
            <p className="text-gray-400 text-sm">
              وجهتك النهائية لاستكشاف الأفلام، كتابة المراجعات، ومشاركة تجربتك السينمائية مع مجتمع من عشاق السينما.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">روابط سريعة</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-400 hover:text-red-500 transition-colors">
                  الرئيسية
                </Link>
              </li>
              <li>
                <Link to="/movies" className="text-gray-400 hover:text-red-500 transition-colors">
                  الأفلام الشائعة
                </Link>
              </li>
              <li>
                <Link to="/discover" className="text-gray-400 hover:text-red-500 transition-colors">
                  اكتشاف
                </Link>
              </li>
              <li>
                <Link to="/watchlist" className="text-gray-400 hover:text-red-500 transition-colors">
                  قائمة المشاهدة
                </Link>
              </li>
            </ul>
          </div>

          {/* Genres */}
          <div>
            <h3 className="text-white font-semibold mb-4">التصنيفات</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/discover?genre=28" className="text-gray-400 hover:text-red-500 transition-colors">
                  أكشن
                </Link>
              </li>
              <li>
                <Link to="/discover?genre=35" className="text-gray-400 hover:text-red-500 transition-colors">
                  كوميديا
                </Link>
              </li>
              <li>
                <Link to="/discover?genre=27" className="text-gray-400 hover:text-red-500 transition-colors">
                  رعب
                </Link>
              </li>
              <li>
                <Link to="/discover?genre=10749" className="text-gray-400 hover:text-red-500 transition-colors">
                  رومانسي
                </Link>
              </li>
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h3 className="text-white font-semibold mb-4">تواصل معنا</h3>
            <div className="flex gap-4">
              <a
                href="#"
                className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-gray-700 transition-colors"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-gray-700 transition-colors"
              >
                <Github className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-gray-700 transition-colors"
              >
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-800 text-center text-gray-500 text-sm">
          <p>
            © {new Date().getFullYear()} MovieReviewHub. جميع الحقوق محفوظة.
          </p>
          <p className="mt-2">
            البيانات مقدمة من{' '}
            <a
              href="https://www.themoviedb.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-red-500 hover:text-red-400"
            >
              TMDb
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;