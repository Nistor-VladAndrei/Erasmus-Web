import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Globe, Users, Award } from 'lucide-react';
import Header from '../components/Header.tsx';
import EUStarAnimation from '../components/EUStarAnimation.tsx';
import GlassCard from '../components/GlassCard.tsx';

export default function Landing() {
  return (
    <div className="min-h-screen">
      <Header transparent />

      {/* Hero Section with Star Animation */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <EUStarAnimation />
        
        <div className="relative z-10 text-center px-6 max-w-4xl">
          <motion.h1
            className="text-5xl md:text-7xl font-bold text-white mb-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
          >
            Building Bridges Through Education
          </motion.h1>
          <motion.p
            className="text-xl md:text-2xl text-white/90 mb-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.7 }}
          >
            Erasmus+ Programs at Colegiul Național "Frații Buzești"
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.9 }}
          >
            <Link
              to="/news"
              className="inline-flex items-center space-x-2 px-8 py-4 glass-strong rounded-full text-white font-semibold hover:bg-white/30 transition-all transform hover:scale-105"
            >
              <span>Explore Our Projects</span>
              <ArrowRight size={20} />
            </Link>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex items-start justify-center p-2">
            <div className="w-1 h-3 bg-white/50 rounded-full" />
          </div>
        </motion.div>
      </section>

      {/* About Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <GlassCard className="p-12">
              <h2 className="text-4xl font-bold text-white mb-6 text-center">
                About Our Erasmus+ Programs
              </h2>
              <p className="text-white/80 text-lg leading-relaxed mb-8">
                Colegiul Național "Frații Buzești" is proud to participate in the Erasmus+ program, 
                fostering international collaboration and cultural exchange. Our projects connect students 
                and teachers with partners across Europe, creating opportunities for personal growth, 
                professional development, and cross-cultural understanding.
              </p>
              <div className="grid md:grid-cols-3 gap-8 mt-12">
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-eu-yellow to-yellow-600 flex items-center justify-center">
                    <Globe className="text-eu-blue" size={32} />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">
                    International Partnerships
                  </h3>
                  <p className="text-white/70">
                    Collaborating with schools across Europe
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-eu-yellow to-yellow-600 flex items-center justify-center">
                    <Users className="text-eu-blue" size={32} />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">
                    Student Mobility
                  </h3>
                  <p className="text-white/70">
                    Exchange programs and study visits
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-eu-yellow to-yellow-600 flex items-center justify-center">
                    <Award className="text-eu-blue" size={32} />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">
                    Professional Development
                  </h3>
                  <p className="text-white/70">
                    Teacher training and workshops
                  </p>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <GlassCard className="p-12 text-center">
              <h2 className="text-3xl font-bold text-white mb-4">
                Stay Updated with Our Latest News
              </h2>
              <p className="text-white/80 text-lg mb-8">
                Follow our journey as we share stories, experiences, and achievements 
                from our Erasmus+ programs.
              </p>
              <Link
                to="/news"
                className="inline-flex items-center space-x-2 px-8 py-4 bg-gradient-to-r from-eu-blue to-blue-600 rounded-lg text-white font-semibold hover:shadow-lg transition-all transform hover:scale-105"
              >
                <span>View All News</span>
                <ArrowRight size={20} />
              </Link>
            </GlassCard>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
