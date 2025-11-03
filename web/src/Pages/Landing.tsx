import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { School, ArrowRight, Globe, Users, Award, MapPin, Calendar, Heart, Loader2 } from 'lucide-react';
import Header from '../components/Header.tsx';
import EUStarAnimation from '../components/EUStarAnimation.tsx';
import GlassCard from '../components/GlassCard.tsx';
import { useEffect, useState } from 'react';
import { Article } from '../Types/types.ts';
import { articlesAPI } from '../services/api.ts';
import { useQuery } from '@tanstack/react-query';

interface ArticleCardProps {
  article: Article;
  index: number;
  onClick: (article: Article) => void;
}



function ArticleCard({ article, index, onClick }: ArticleCardProps) {
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 60 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      whileHover={{ y: -10 }}
      className="group cursor-pointer h-full"
      onClick={() => onClick(article)}
    >
      <GlassCard className="overflow-hidden rounded-2xl h-full flex flex-col">
        {article.coverImageUrl && (
          <div className="relative h-64 overflow-hidden">
            <img
              src={article.coverImageUrl}
              alt={article.title}
              className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        )}
        <div className="p-8 flex-1 flex flex-col">
          <div className="flex items-center text-gray-500 text-sm mb-4">
            <Calendar size={16} className="mr-2" />
            <span>{formatDate(article.createdAt)}</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors line-clamp-2">
            {article.title}
          </h3>
          {article.excerpt && (
            <p className="text-gray-600 leading-relaxed mb-6 flex-1 line-clamp-3">
              {article.excerpt}
            </p>
          )}
          <div className="flex items-center justify-between mt-auto pt-6 border-t border-gray-200">
            <div className="flex items-center text-gray-500 text-sm">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-xs font-semibold mr-2">
                {article.author.username.charAt(0).toUpperCase()}
              </div>
              <span>{article.author.username.split('@')[0]}</span>
            </div>
            <span className="inline-flex items-center text-blue-600 font-medium group-hover:gap-3 gap-2 transition-all">
              Read <ArrowRight size={18} />
            </span>
          </div>
        </div>
      </GlassCard>
    </motion.div>
  );
}

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
   const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const { data, isLoading, error } = useQuery({
    queryKey: ['articles'],
    queryFn: () => articlesAPI.getAll(1, 3),
  });

  interface ArticlesResponse {
    data: Article[];
  }



  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const handleShare = async (article: Article) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: article.title,
          text: article.excerpt,
          url: window.location.href,
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (selectedArticle) {
      if(!scrolled) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setScrolled(true);
      }
      return (
        <>
          <div className="min-h-screen bg-white">
            {/* Hero Section with Cover Image */}
            <section className="relative h-[60vh] overflow-hidden">
              <motion.div
                initial={{ scale: 1.1 }}
                animate={{ scale: 1 }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                className="absolute inset-0"
              >
                {selectedArticle.coverImageUrl && (
                  <>
                    <img
                      src={selectedArticle.coverImageUrl}
                      alt={selectedArticle.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/70" />
                  </>
                )}
              </motion.div>
  
              <div className="relative z-10 h-full flex items-center p-6 md:p-12 pt-16 md:pt-20">
                <div className="max-w-4xl w-full">
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                    className="flex flex-col items-start"
                  >
                    <motion.button
                      onClick={() => {
                        setSelectedArticle(null)
                        setScrolled(false);
                      }}
                      className="inline-flex items-center space-x-2 text-white hover:text-blue-300 transition-colors bg-black/30 backdrop-blur-sm px-4 py-2 rounded-full mb-6"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.45, delay: 0.05 }}
                      whileHover={{ x: -4 }}
                    >
                      <ArrowRight size={20} className="rotate-180" />
                      <span>Back to Home</span>
                    </motion.button>
  
                    <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 leading-tight">
                      {selectedArticle.title}
                    </h1>
                    {selectedArticle.excerpt && (
                      <p className="text-xl text-white/90 font-light">
                        {selectedArticle.excerpt}
                      </p>
                    )}
                  </motion.div>
                </div>
              </div>
            </section>
  
            {/* Article Content */}
            <div className="py-16 px-6">
              <div className="container mx-auto max-w-4xl">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                >
                  <GlassCard className="rounded-3xl overflow-hidden">
                    <div className="p-8 md:p-12">
                      {/* Article Meta */}
                      <div className="flex flex-wrap items-center gap-6 text-gray-600 mb-12 pb-8 border-b border-gray-200">
                        <motion.div 
                          className="flex items-center space-x-2"
                          whileHover={{ scale: 1.05 }}
                        >
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-semibold">
                            {selectedArticle.author.username.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Author</p>
                            <p className="font-medium text-gray-900">{selectedArticle.author.username}</p>
                          </div>
                        </motion.div>
                        
                        <motion.div 
                          className="flex items-center space-x-2"
                          whileHover={{ scale: 1.05 }}
                        >
                          <Calendar size={20} className="text-blue-600" />
                          <div>
                            <p className="text-sm text-gray-500">Published</p>
                            <p className="font-medium text-gray-900">{formatDate(selectedArticle.createdAt)}</p>
                          </div>
                        </motion.div>
                        
                        <motion.button
                          onClick={() => handleShare(selectedArticle)}
                          className="ml-auto flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-full hover:shadow-lg transition-all"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <span>Share</span>
                          <ArrowRight size={18} />
                        </motion.button>
                      </div>
  
                      {/* Article Body */}
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.8, delay: 0.7 }}
                        className="prose prose-lg max-w-none"
                        dangerouslySetInnerHTML={{ __html: selectedArticle.content }}
                        style={{
                          color: '#374151',
                        }}
                      />
                    </div>
                  </GlassCard>
                </motion.div>
              </div>
            </div>
  
           
          </div>
        </>
      );
  }

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
                  { icon: Users, title: "Student Mobility", desc: "Exchange programs and study visits", color: "blue" },
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
          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-32"
            >
              <Loader2 className="animate-spin text-blue-600 mb-4" size={64} />
              <p className="text-gray-600 text-lg">Loading articles...</p>
            </motion.div>
          )}

          {data && (
          <div className="grid md:grid-cols-3 gap-8">
            {data.data.map((article: Article, index: number) => (
                  <ArticleCard 
                  key={article.id} 
                  article={article} 
                  index={index}
                  onClick={setSelectedArticle}
                  />
            ))}
          </div>
          )}

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
    </div>
    </>
  );
}