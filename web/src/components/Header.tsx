import { useState } from 'react';
import { Menu, X, LogOut, Home, Newspaper, Shield } from 'lucide-react';

interface HeaderProps {
  transparent?: boolean;
}

export default function Header({ transparent = false }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  // Mock auth state - replace with your actual authService
  const isAuthenticated = false; // authService.isAuthenticated();
  
  const handleLogout = () => {
    // authService.logout();
    // navigate('/');
    console.log('Logout clicked');
    setIsMenuOpen(false);
  };

  const handleNavClick = () => {
    setIsMenuOpen(false);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 ${
        transparent ? 'bg-transparent backdrop-blur-xl shadow-lg' : 'bg-white/25 backdrop-blur-xl '
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <a href="/" className="flex items-center space-x-2 sm:space-x-4 flex-shrink-0">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center shadow-lg">
              <span className="text-yellow-400 text-xl sm:text-2xl font-bold">★</span>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-gray-900 font-bold text-base sm:text-lg leading-tight drop-shadow-sm">
                Colegiul Național "Frații Buzești"
              </h1>
              <p className="text-gray-700 text-xs sm:text-sm drop-shadow-sm">Erasmus+ Projects</p>
            </div>
            <div className="block sm:hidden">
              <h1 className="text-gray-900 font-bold text-sm leading-tight drop-shadow-sm">
                Frații Buzești
              </h1>
              <p className="text-gray-700 text-xs drop-shadow-sm">Erasmus+</p>
            </div>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a
              href="/"
              className="text-gray-800 hover:text-blue-600 transition-colors font-medium drop-shadow-sm"
            >
              Home
            </a>
            <a
              href="/news"
              className="text-gray-800 hover:text-blue-600 transition-colors font-medium drop-shadow-sm"
            >
              News
            </a>
            {isAuthenticated ? (
              <>
                <a
                  href="/admin"
                  className="text-gray-800 hover:text-blue-600 transition-colors font-medium drop-shadow-sm"
                >
                  Admin
                </a>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 text-gray-800 hover:text-red-600 transition-colors font-medium drop-shadow-sm"
                >
                  <LogOut size={18} />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <a
                href="/login"
                className="px-5 py-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-all font-medium shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                Login
              </a>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-white/20 backdrop-blur-sm transition-colors shadow-md"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <X size={24} className="text-gray-800 drop-shadow-sm" />
            ) : (
              <Menu size={24} className="text-gray-800 drop-shadow-sm" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden pb-4 animate-fadeIn">
            <nav className="flex flex-col space-y-1 bg-white/80 backdrop-blur-xl rounded-2xl shadow-2xl p-4 border border-white/40">
              <a
                href="/"
                onClick={handleNavClick}
                className="flex items-center space-x-3 px-4 py-3 rounded-xl text-gray-800 hover:bg-blue-50/80 hover:text-blue-600 transition-all font-medium backdrop-blur-sm"
              >
                <Home size={20} />
                <span>Home</span>
              </a>
              <a
                href="/news"
                onClick={handleNavClick}
                className="flex items-center space-x-3 px-4 py-3 rounded-xl text-gray-800 hover:bg-blue-50/80 hover:text-blue-600 transition-all font-medium backdrop-blur-sm"
              >
                <Newspaper size={20} />
                <span>News</span>
              </a>
              {isAuthenticated ? (
                <>
                  <a
                    href="/admin"
                    onClick={handleNavClick}
                    className="flex items-center space-x-3 px-4 py-3 rounded-xl text-gray-800 hover:bg-blue-50/80 hover:text-blue-600 transition-all font-medium backdrop-blur-sm"
                  >
                    <Shield size={20} />
                    <span>Admin</span>
                  </a>
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-3 px-4 py-3 rounded-xl text-gray-800 hover:bg-red-50/80 hover:text-red-600 transition-all font-medium text-left w-full backdrop-blur-sm"
                  >
                    <LogOut size={20} />
                    <span>Logout</span>
                  </button>
                </>
              ) : (
                <a
                  href="/login"
                  onClick={handleNavClick}
                  className="flex items-center justify-center space-x-2 px-4 py-3 mt-2 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all"
                >
                  <span>Login</span>
                </a>
              )}
            </nav>
          </div>
        )}
      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
      `}</style>
    </header>
  );
}