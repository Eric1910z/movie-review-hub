import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import HomePage from './pages/HomePage';
import MovieDetailPage from './pages/MovieDetailPage';
import PersonPage from './pages/PersonPage';
import MoviesPage from './pages/MoviesPage';
import DiscoverPage from './pages/DiscoverPage';
import WatchlistPage from './pages/WatchlistPage';
import SettingsPage from './pages/SettingsPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import SearchPage from './pages/SearchPage';
import Top250Page from './pages/Top250Page';
import CelebritiesPage from './pages/CelebritiesPage';

function App() {
  return (
    <Router>
      <AuthProvider>
        <ThemeProvider>
          <div className="min-h-screen bg-gray-900 dark:bg-gray-900 transition-colors">
            <Header />
            <main className="min-h-[calc(100vh-200px)]">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/movie/:id" element={<MovieDetailPage />} />
                <Route path="/person/:id" element={<PersonPage />} />
                <Route path="/movies" element={<MoviesPage />} />
                <Route path="/discover" element={<DiscoverPage />} />
                <Route path="/watchlist" element={<WatchlistPage />} />
                <Route path="/settings" element={<SettingsPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/search" element={<SearchPage />} />
                <Route path="/top250" element={<Top250Page />} />
                <Route path="/celebrities" element={<CelebritiesPage />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </ThemeProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;