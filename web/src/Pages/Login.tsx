import { useState, FormEvent, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useAnimation } from 'framer-motion';
import { LogIn, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import Header from '../components/Header.tsx';
import GlassCard from '../components/GlassCard.tsx';
import { authAPI } from '../services/api.ts';
import { authService } from '../services/auth.ts';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Framer Motion controls
  const controls = useAnimation();

  // Define variants
  const containerVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  // Start animation after mount (safe for SSR / Strict Mode)
  useEffect(() => {
    let mounted = true;

    (async () => {
      // only start when component is still mounted
      if (!mounted) return;
      await controls.start('visible');
    })();

    return () => {
      mounted = false;
    };
  }, [controls]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await authAPI.login(email, password);
      authService.setToken(response.access_token);
      authService.setUser(response.user);
      toast.success('Login successful!');
      navigate('/admin');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <Header />

      <div className="min-h-screen flex items-center justify-center px-6 pt-16">
        <motion.div
          initial="hidden"
          animate={controls}
          variants={containerVariants}
          className="w-full max-w-md"
        >
          <GlassCard className="p-8">
            <div className="text-center mb-8">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-eu-blue to-blue-600 flex items-center justify-center">
                <LogIn className="text-eu-yellow" size={32} />
              </div>
              <h1 className="text-3xl font-bold text-white mb-2">Admin Login</h1>
              <p className="text-white/70">Sign in to manage articles and content</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-white font-medium mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-lg glass text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-eu-yellow"
                  placeholder="admin@fratii-buzesti.ro"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-white font-medium mb-2">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  className="w-full px-4 py-3 rounded-lg glass text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-eu-yellow"
                  placeholder="••••••••"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full px-6 py-3 bg-gradient-to-r from-eu-blue to-blue-600 rounded-lg text-white font-semibold hover:shadow-lg transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="animate-spin" size={20} />
                    <span>Signing in...</span>
                  </>
                ) : (
                  <>
                    <LogIn size={20} />
                    <span>Sign In</span>
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 p-4 glass rounded-lg">
              <p className="text-white/70 text-sm text-center">
                <strong>Demo credentials:</strong>
                <br />
                Email: admin@fratii-buzesti.ro
                <br />
                Password: admin123
              </p>
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </div>
  );
}
