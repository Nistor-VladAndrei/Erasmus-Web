import { Link, useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import { authService } from '../services/auth.ts';

interface HeaderProps {
  transparent?: boolean;
}

export default function Header({ transparent = false }: HeaderProps) {
  const navigate = useNavigate();
  const isAuthenticated = authService.isAuthenticated();

  const handleLogout = () => {
    authService.logout();
    navigate('/');
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 h-20 ${
        transparent ? 'bg-transparent' : 'glass'
      }`}
    >
      <div className="container mx-auto px-6 h-full">
        <div className="flex items-center justify-between h-full">
          <Link to="/" className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-eu-blue to-blue-600 flex items-center justify-center">
              <span className="text-eu-yellow text-2xl font-bold">★</span>
            </div>
            <div>
              <h1 className="text-black font-bold text-lg leading-tight">
                Colegiul Național "Frații Buzești"
              </h1>
              <p className="text-black/70 text-sm">Erasmus+ Projects</p>
            </div>
          </Link>

          <nav className="flex items-center space-x-8">
            <Link
              to="/"
              className="text-black hover:text-eu-yellow transition-colors font-medium"
            >
              Home
            </Link>
            <Link
              to="/news"
              className="text-black hover:text-eu-yellow transition-colors font-medium"
            >
              News
            </Link>
            {isAuthenticated ? (
              <>
                <Link
                  to="/admin"
                  className="text-black hover:text-eu-yellow transition-colors font-medium"
                >
                  Admin
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 text-black hover:text-red-300 transition-colors"
                >
                  <LogOut size={18} />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="px-4 py-2 rounded-lg glass-strong text-black hover:bg-white/30 transition-colors font-medium"
              >
                Login
              </Link>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}