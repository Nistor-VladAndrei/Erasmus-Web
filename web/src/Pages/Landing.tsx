import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Globe, Users, Award, MapPin, Calendar, Heart } from 'lucide-react';
import Header from '../components/Header.tsx';
import EUStarAnimation from '../components/EUStarAnimation.tsx';
import GlassCard from '../components/GlassCard.tsx';
import { useEffect, useState } from 'react';

const latestNews = [
  {
    id: 1,
    title: "Student Exchange Program in Barcelona",
    date: "2025-10-15",
    excerpt: "Our students participated in a week-long cultural exchange program, exploring innovation and creativity.",
    image: "https://images.unsplash.com/photo-1562095241-8c6714fd4178?w=800&q=80"
  },
  {
    id: 2,
    title: "Teacher Training Workshop in Berlin",
    date: "2025-10-10",
    excerpt: "Educators enhanced their skills in digital teaching methodologies and modern pedagogical approaches.",
    image: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&q=80"
  },
  {
    id: 3,
    title: "International Project Week Success",
    date: "2025-10-05",
    excerpt: "Students from five countries collaborated on sustainability projects, creating lasting friendships.",
    image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&q=80"
  }
];

// Partners data
const partners = [
  { name: "Germany", city: "Berlin", flag: "🇩🇪" },
  { name: "Spain", city: "Barcelona", flag: "🇪🇸" },
  { name: "France", city: "Paris", flag: "🇫🇷" },
  { name: "Italy", city: "Rome", flag: "🇮🇹" },
  { name: "Poland", city: "Warsaw", flag: "🇵🇱" },
  { name: "Greece", city: "Athens", flag: "🇬🇷" }
];

export default function Landing() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
    <div className="min-h-screen bg-white">
      {/* Hero Section with Star Animation */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-blue-50 to-white">
        <div className="absolute inset-0 opacity-30">
          <EUStarAnimation />
        </div>
        
        <motion.div 
          className="relative z-10 text-center px-6 max-w-5xl"
          style={{ y: scrollY * 0.5 }}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            <h1 className="text-6xl md:text-8xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-gray-900 bg-clip-text text-transparent mb-6 leading-tight">
              Building Bridges
            </h1>
            <h2 className="text-4xl md:text-6xl font-light text-gray-700 mb-8">
              Through Education
            </h2>
          </motion.div>
          
          <motion.p
            className="text-xl md:text-2xl text-gray-600 mb-12 font-light"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
          >
            Erasmus+ Programs at Colegiul Național "Frații Buzești"
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.7 }}
          >
            <Link
              to="/news"
              className="inline-flex items-center space-x-3 px-10 py-5 bg-blue-600 text-white rounded-full font-medium hover:bg-blue-700 transition-all transform hover:scale-105 hover:shadow-xl"
            >
              <span>Explore Our Projects</span>
              <ArrowRight size={22} />
            </Link>
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-12 left-1/2 transform -translate-x-1/2"
          animate={{ y: [0, 12, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className="w-7 h-12 border-2 border-gray-400 rounded-full flex items-start justify-center p-2">
            <div className="w-1.5 h-4 bg-gray-400 rounded-full" />
          </div>
        </motion.div>
      </section>

      {/* Mission Section */}
      <section className="py-32 px-6 bg-white">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true, margin: "-100px" }}
            className="text-center mb-20"
          >
            <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Our Mission
            </h2>
            <div className="w-24 h-1 bg-blue-600 mx-auto mb-8" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true, margin: "-100px" }}
          >
            <GlassCard className="p-16 rounded-3xl">
              <p className="text-gray-700 text-2xl leading-relaxed mb-12 text-center font-light">
                We foster international collaboration and cultural exchange through the Erasmus+ program, 
                connecting students and teachers with partners across Europe to create opportunities for 
                personal growth, professional development, and cross-cultural understanding.
              </p>
              
              <div className="grid md:grid-cols-3 gap-12 mt-16">
                {[
                  { icon: Globe, title: "International Partnerships", desc: "Collaborating with schools across Europe", color: "blue" },
                  { icon: Users, title: "Student Mobility", desc: "Exchange programs and study visits", color: "indigo" },
                  { icon: Award, title: "Professional Development", desc: "Teacher training and workshops", color: "blue" }
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    className="text-center group"
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: i * 0.1 }}
                    viewport={{ once: true }}
                    whileHover={{ y: -10 }}
                  >
                    <div className={`w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-${item.color}-500 to-${item.color}-600 flex items-center justify-center transform group-hover:scale-110 transition-transform shadow-lg`}>
                      <item.icon className="text-white" size={40} />
                    </div>
                    <h3 className="text-2xl font-semibold text-gray-900 mb-3">
                      {item.title}
                    </h3>
                    <p className="text-gray-600 text-lg">
                      {item.desc}
                    </p>
                  </motion.div>
                ))}
              </div>
            </GlassCard>
          </motion.div>
        </div>
      </section>

      {/* Latest News Section */}
      <section className="py-32 px-6 bg-gradient-to-b from-white to-blue-50">
        <div className="container mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true, margin: "-100px" }}
            className="text-center mb-20"
          >
            <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Latest News
            </h2>
            <div className="w-24 h-1 bg-blue-600 mx-auto mb-8" />
            <p className="text-gray-600 text-xl font-light">
              Stay updated with our recent activities and achievements
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {latestNews.map((news, i) => (
              <motion.div
                key={news.id}
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                viewport={{ once: true, margin: "-100px" }}
                whileHover={{ y: -10 }}
                className="group cursor-pointer"
              >
                <GlassCard className="overflow-hidden rounded-2xl h-full">
                  <div className="relative h-56 overflow-hidden">
                    <img 
                      src={news.image} 
                      alt={news.title}
                      className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  </div>
                  <div className="p-8">
                    <div className="flex items-center text-gray-500 text-sm mb-4">
                      <Calendar size={16} className="mr-2" />
                      <span>{new Date(news.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                    </div>
                    <h3 className="text-2xl font-semibold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors">
                      {news.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed mb-6">
                      {news.excerpt}
                    </p>
                    <span className="inline-flex items-center text-blue-600 font-medium group-hover:gap-3 gap-2 transition-all">
                      Read more <ArrowRight size={18} />
                    </span>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
            className="text-center mt-16"
          >
            <Link
              to="/news"
              className="inline-flex items-center space-x-3 px-10 py-5 bg-white text-blue-600 border-2 border-blue-600 rounded-full font-medium hover:bg-blue-600 hover:text-white transition-all transform hover:scale-105 shadow-lg"
            >
              <span>View All News</span>
              <ArrowRight size={22} />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Partners Section */}
      <section className="py-32 px-6 bg-white">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true, margin: "-100px" }}
            className="text-center mb-20"
          >
            <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Our Partners
            </h2>
            <div className="w-24 h-1 bg-blue-600 mx-auto mb-8" />
            <p className="text-gray-600 text-xl font-light">
              Collaborating with institutions across Europe
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
            {partners.map((partner, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                viewport={{ once: true, margin: "-100px" }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="group"
              >
                <GlassCard className="p-8 rounded-2xl text-center hover:shadow-2xl transition-shadow">
                  <div className="text-6xl mb-4 transform group-hover:scale-110 transition-transform">
                    {partner.flag}
                  </div>
                  <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                    {partner.name}
                  </h3>
                  <div className="flex items-center justify-center text-gray-600">
                    <MapPin size={16} className="mr-1" />
                    <span>{partner.city}</span>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
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
                <span className="text-lg font-semibold text-blue-600">Vlad Nistor</span>
              </div>

              <div className="text-gray-500 text-sm">
                <p>&copy; 2025 Erasmus+ Program. All rights reserved.</p>
              </div>
            </motion.div>
          </div>
        </div>
      </footer>
    </div>
    </>
  );
}