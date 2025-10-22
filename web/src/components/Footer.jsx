import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';

export default function Footer() {
  const redirectToLinkedIn = () => {
    window.open('https://www.linkedin.com/in/vlad-nistor-6b6129216/', '_blank', 'noopener,noreferrer');
  };

  return (
    <>
      <footer className="bg-gradient-to-b from-gray-50 to-gray-100 border-t border-gray-200 py-16 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="mb-8">
                <h3 className="text-3xl font-bold text-gray-900 mb-4">
                  Colegiul Național "Frații Buzești"
                </h3>
                <p className="text-gray-600 text-lg">
                  Craiova, România
                </p>
              </div>

              <div className="flex items-center justify-center space-x-2 text-gray-600 mb-8">
                <span className="text-lg">Made with</span>
                <Heart size={20} className="text-red-500 fill-current animate-pulse" />
                <span className="text-lg">by</span>
                <button
                  onClick={redirectToLinkedIn}
                  className="text-lg font-semibold text-blue-600 hover:text-blue-700 transition-colors underline decoration-blue-600/30 hover:decoration-blue-600 underline-offset-4 cursor-pointer"
                >
                  Vlad Nistor
                </button>
              </div>

              <div className="text-gray-500 text-sm">
                <p>&copy; 2025 Erasmus+ Program. All rights reserved.</p>
              </div>
            </motion.div>
          </div>
        </div>
      </footer>
    </>
  );
}