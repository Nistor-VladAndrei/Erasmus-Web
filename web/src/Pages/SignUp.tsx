import { useState, FormEvent } from 'react';
import { motion } from 'framer-motion';
import { LogIn, Loader2, Lock, Mail, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAnimation } from 'framer-motion';
import toast from 'react-hot-toast';
import Header from '../components/Header.tsx';
import { authAPI } from '../services/api.ts';
import { authService } from '../services/auth.ts';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
}

function GlassCard({ children, className = "" }: GlassCardProps) {
  return (
    <div className={`backdrop-blur-xl bg-white/90 border border-gray-200 shadow-2xl ${className}`}>
      {children}
    </div>
  );
}

export default function SignUp() {
    const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setIsLoading(true);

  try {
    const response = await authAPI.signup(email, password);
    authService.setToken(response.access_token);
    authService.setUser(response.user);
    toast.success('SignUp successful!');
  } catch (error: any) {
    toast.error(error.response?.data?.message || 'SignUp failed.');
  } finally {
    setIsLoading(false);
  }
};

   return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-100 rounded-full filter blur-3xl opacity-30 -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-100 rounded-full filter blur-3xl opacity-30 translate-x-1/2 translate-y-1/2" />
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-blue-50 rounded-full filter blur-3xl opacity-20" />
      </div>

      {/* Animated Grid Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }} />
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 sm:px-6 py-24 md:py-32">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="w-full max-w-md mx-auto"
        >
          <GlassCard className="rounded-3xl overflow-hidden">
            {/* Header Section */}
            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-6 sm:p-8 text-center relative overflow-hidden">
              <motion.div
                className="absolute inset-0 opacity-10"
                animate={{
                  backgroundPosition: ['0% 0%', '100% 100%'],
                }}
                transition={{
                  duration: 20,
                  repeat: Infinity,
                  repeatType: 'reverse',
                }}
                style={{
                  backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
                  backgroundSize: '50px 50px',
                }}
              />
              
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ duration: 0.8, delay: 0.2, type: "spring" }}
                className="relative"
              >
                <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-3 sm:mb-4 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <ShieldCheck className="text-white" size={32} />
                </div>
              </motion.div>
              
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="text-2xl sm:text-3xl font-bold text-white mb-2"
              >
                Student SignUp Portal
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="text-white/90 font-light text-sm sm:text-base"
              >
                Sign Up to manage articles and content
              </motion.p>
            </div>

            {/* Form Section */}
            <div className="p-6 sm:p-8">
              <div className="space-y-5 sm:space-y-6">
                {/* Email Field */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                >
                  <label htmlFor="email" className="block text-gray-700 font-medium mb-2 text-sm">
                    Name
                  </label>
                  <div className="relative">
                    <Mail 
                      className={`absolute left-4 top-1/2 transform -translate-y-1/2 transition-colors ${
                        focusedField === 'email' ? 'text-blue-600' : 'text-gray-400'
                      }`} 
                      size={20} 
                    />
                    <motion.input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onFocus={() => setFocusedField('email')}
                      onBlur={() => setFocusedField(null)}
                      required
                      whileFocus={{ scale: 1.01 }}
                      className="w-full pl-11 sm:pl-12 pr-4 py-3 text-sm sm:text-base rounded-xl border-2 border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-all bg-white"
                      placeholder="admin@fratii-buzesti.ro"
                    />
                  </div>
                </motion.div>

                {/* Password Field */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.7 }}
                >
                  <label htmlFor="password" className="block text-gray-700 font-medium mb-2 text-sm">
                    Password
                  </label>
                  <div className="relative">
                    <Lock 
                      className={`absolute left-4 top-1/2 transform -translate-y-1/2 transition-colors ${
                        focusedField === 'password' ? 'text-blue-600' : 'text-gray-400'
                      }`} 
                      size={20} 
                    />
                    <motion.input
                      type="password"
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onFocus={() => setFocusedField('password')}
                      onBlur={() => setFocusedField(null)}
                      required
                      minLength={6}
                      whileFocus={{ scale: 1.01 }}
                      className="w-full pl-11 sm:pl-12 pr-4 py-3 text-sm sm:text-base rounded-xl border-2 border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-all bg-white"
                      placeholder="••••••••"
                    />
                  </div>
                </motion.div>

                {/* Submit Button */}
                <motion.button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isLoading}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.8 }}
                  whileHover={{ scale: isLoading ? 1 : 1.01 }}
                  whileTap={{ scale: isLoading ? 1 : 0.98 }}
                  className="w-full px-6 py-3 sm:py-4 text-sm sm:text-base bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl text-white font-semibold hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 relative overflow-hidden group"
                >
                  <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity" />
                  {isLoading ? (
                    <>
                      <Loader2 className="animate-spin" size={20} />
                      <span>Signing in...</span>
                    </>
                  ) : (
                    <>
                      <LogIn size={20} />
                      <span>Sign Up</span>
                    </>
                  )}
                </motion.button>
              </div>

              {/* Demo Credentials */}
              {/*
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.9 }}
                className="mt-6 sm:mt-8"
              >
                <GlassCard className="p-4 rounded-xl bg-blue-50/50 border-blue-200">
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Lock className="text-blue-600" size={16} />
                    </div>
                    <div>
                      <p className="text-gray-700 text-sm font-semibold mb-1">
                        Demo Credentials
                      </p>
                      <p className="text-gray-600 text-xs leading-relaxed">
                        <strong>Email:</strong> admin@fratii-buzesti.ro<br />
                        <strong>Password:</strong> admin123
                      </p>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
              */}
            </div>
          </GlassCard>

          {/* Footer Text */}
          
        </motion.div>
      </div>

      {/* Floating Elements - Hidden on mobile for better performance */}
      <motion.div
        className="hidden md:block absolute top-20 left-20 w-4 h-4 rounded-full bg-blue-400 opacity-40"
        animate={{
          y: [0, -30, 0],
          x: [0, 20, 0],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <motion.div
        className="hidden md:block absolute bottom-40 right-32 w-6 h-6 rounded-full bg-indigo-400 opacity-30"
        animate={{
          y: [0, 40, 0],
          x: [0, -30, 0],
        }}
        transition={{
          duration: 7,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <motion.div
        className="hidden lg:block absolute top-1/3 right-20 w-3 h-3 rounded-full bg-blue-300 opacity-50"
        animate={{
          y: [0, -20, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
    </div>
  );
}