'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Upload, X, AlertCircle, Pill, Sparkles, Heart, Activity } from 'lucide-react';
import { PharmacyItem, PharmacyConfig } from '@/lib/types';
import Header from './Header';
import ProductCard from './ProductCard';
import PrescriptionModal from './PrescriptionModal';
import ContactSection from './ContactSection';
import Footer from './Footer';
import PrescriptionAnimation from './PrescriptionAnimation';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.16, 1, 0.3, 1] as any
    }
  }
};

interface CatalogProps {
  initialItems: PharmacyItem[];
  config: PharmacyConfig;
}

export default function Catalog({ initialItems, config }: CatalogProps) {
  // Inventory state
  const [items] = useState<PharmacyItem[]>(initialItems);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('كل المنتجات');
  const [showUploadModal, setShowUploadModal] = useState(false);

  // Derive categories from items
  const categories = useMemo(() => {
    const list = new Set<string>();
    items.forEach(item => {
      if (item.category) list.add(item.category);
    });
    return ['كل المنتجات', ...Array.from(list)];
  }, [items]);

  // Filtered products list
  const filteredItems = useMemo(() => {
    return items.filter(item => {
      // Category filter
      if (selectedCategory !== 'كل المنتجات' && item.category !== selectedCategory) {
        return false;
      }
      // Search filter (Arabic name, English name, category)
      if (searchQuery.trim() === '') return true;

      const query = searchQuery.toLowerCase().trim();
      const nameAr = item.nameNameAr.toLowerCase();
      const nameEn = (item.nameNameEn || '').toLowerCase();
      const cat = item.category.toLowerCase();
      const desc = (item.descriptionAr || '').toLowerCase();

      return nameAr.includes(query) || nameEn.includes(query) || cat.includes(query) || desc.includes(query);
    });
  }, [items, selectedCategory, searchQuery]);

  return (
    <div className="grow flex flex-col">
      {/* Header and Top Banner */}
      <Header config={config} onUploadClick={() => setShowUploadModal(true)} />

      {/* Hero Section */}
      <section className="relative overflow-hidden py-10 md:py-20 bg-linear-to-b from-[#FAF9F5] via-[#FCFBF8] to-brand-bg px-4 sm:px-6">

        {/* Creative Ambient Radial Background Glows */}
        <div className="absolute top-0 left-1/4 w-[400px] h-[400px] bg-radial-gradient from-teal-500/[0.07] to-transparent rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-10 right-1/4 w-[500px] h-[500px] bg-radial-gradient from-brand-secondary/[0.12] to-transparent rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[350px] h-[350px] bg-radial-gradient from-amber-100/[0.15] to-transparent rounded-full blur-[100px] pointer-events-none" />

        {/* Elegant Curvy SVG Background Lines */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-0 opacity-60" viewBox="0 0 1440 600" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M-100,120 C300,10 600,280 1000,130 C1300,30 1500,180 1600,80" stroke="#115E59" strokeWidth="1" strokeOpacity="0.08" fill="none" />
          <path d="M-50,220 C400,80 500,420 1100,220 C1350,120 1500,320 1600,270" stroke="#7DD3FC" strokeWidth="1" strokeDasharray="4 4" strokeOpacity="0.18" fill="none" />
          <path d="M100,380 C600,280 800,530 1300,380" stroke="#115E59" strokeWidth="1.5" strokeOpacity="0.04" fill="none" />
        </svg>

        {/* Floating Creative Wellness Elements */}
        {/* Floating Pill Icon */}
        <motion.div
          animate={{
            y: [0, -15, 0],
            rotate: [0, 15, 0]
          }}
          transition={{
            repeat: Infinity,
            duration: 6,
            ease: "easeInOut"
          }}
          className="absolute top-12 left-[12%] text-teal-800/10 pointer-events-none hidden md:block"
        >
          <Pill className="w-12 h-12" />
        </motion.div>

        {/* Floating Sparkles Icon */}
        {/* <motion.div
          animate={{
            y: [0, 12, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{
            repeat: Infinity,
            duration: 5,
            ease: "easeInOut",
            delay: 1
          }}
          className="absolute top-[25%] right-[8%] text-brand-secondary/30 pointer-events-none hidden lg:block"
        >
          <Sparkles className="w-8 h-8" />
        </motion.div> */}

        {/* Floating Heart Icon */}
        <motion.div
          animate={{
            y: [0, -8, 0],
            rotate: [0, -10, 0]
          }}
          transition={{
            repeat: Infinity,
            duration: 7,
            ease: "easeInOut",
            delay: 0.5
          }}
          className="absolute bottom-16 left-[5%] text-teal-900/[0.06] pointer-events-none hidden md:block"
        >
          <Heart className="w-10 h-10 fill-teal-900/[0.02]" />
        </motion.div>

        {/* Floating Activity Pulse Icon */}
        <motion.div
          animate={{
            scale: [1, 1.08, 1],
            opacity: [0.15, 0.25, 0.15]
          }}
          transition={{
            repeat: Infinity,
            duration: 4,
            ease: "easeInOut"
          }}
          className="absolute bottom-[35%] right-[42%] text-brand-secondary pointer-events-none hidden lg:block"
        >
          <Activity className="w-7 h-7" />
        </motion.div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center relative z-10">

          {/* Right Column: Text & CTA Buttons */}
          <motion.div
            className="lg:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-right"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div
              className="border-r-2 border-brand-secondary pr-3 mb-4 text-xs md:text-sm text-brand-primary font-black"
              variants={itemVariants}
            >
              نخدمكم برعاية وأمان على مدار الساعة
            </motion.div>

            <motion.h2
              className="text-2xl md:text-5xl font-black text-brand-primary leading-tight mb-3 w-full"
              variants={itemVariants}
            >
              طلب وتجهيز الدواء <br /> أصبح{" "}
              <span className="relative inline-block px-1">
                أسهل
                <svg className="absolute -bottom-3 md:-bottom-3.5 right-0 left-0 w-full h-3 pointer-events-none" viewBox="0 0 100 12" preserveAspectRatio="none" fill="none" xmlns="http://www.w3.org/2000/svg">
                  {/* First hand-drawn curve */}
                  <motion.path
                    d="M 3,5 C 30,10 65,2 97,5"
                    stroke="#115E59"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ delay: 0.8, duration: 0.8, ease: "easeOut" }}
                  />
                  {/* Second crossing curve */}
                  <motion.path
                    d="M 8,8 C 35,4 70,10 94,6"
                    stroke="#115E59"
                    strokeWidth="2"
                    strokeLinecap="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ delay: 0.95, duration: 0.75, ease: "easeOut" }}
                  />
                </svg>
              </span>
            </motion.h2>

            <motion.p
              className="text-xs md:text-lg text-gray-600 max-w-2xl mb-6 font-medium leading-relaxed"
              variants={itemVariants}
            >
              تصفح الكتالوج المباشر، ابحث عن أدويتك أو قم برفع صورتها الطبية (الروشتة) ونقوم بتجهيز طلبيتك للتوصيل الفوري أو الاستلام.
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row justify-center lg:justify-start items-center gap-3 w-full max-w-md"
              variants={itemVariants}
            >
              <a
                href="#catalog"
                className="w-full sm:w-auto bg-brand-primary hover:bg-teal-900 text-white font-bold py-3.5 px-6 rounded-2xl shadow-lg shadow-teal-900/10 hover:shadow-xl transition-all duration-300 text-center text-sm md:text-base cursor-pointer shrink-0"
              >
                تصفح كتالوج الأدوية
              </a>
              <button
                onClick={() => setShowUploadModal(true)}
                className="w-full sm:w-auto bg-white hover:bg-gray-50 text-brand-primary border border-brand-primary/10 hover:border-brand-primary/30 font-bold py-3.5 px-6 rounded-2xl transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer text-sm md:text-base shrink-0"
              >
                <Upload className="w-4.5 h-4.5 text-brand-primary" />
                <span>ارفع الروشتة الآن</span>
              </button>
            </motion.div>
          </motion.div>

          {/* Left Column: Interactive Micro-Animation Container */}
          <div className="lg:col-span-5 flex justify-center items-center w-full">
            <motion.div
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              className="w-full flex justify-center"
            >
              <PrescriptionAnimation />
            </motion.div>
          </div>

        </div>
      </section>

      {/* Catalog & Search Section */}
      <main id="catalog" className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-6 md:py-8 grow overflow-hidden">

        {/* Search and Quick Actions Bar */}
        <div className="w-full bg-white rounded-2xl border border-gray-100 shadow-sm p-4 md:p-6 mb-6 md:mb-8 animate-fade-in-up overflow-hidden">
          <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center w-full">
            {/* Search Input */}
            <div className="relative grow w-full">
              <span className="absolute inset-y-0 right-0 flex items-center pr-3.5 pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </span>
              <input
                type="text"
                placeholder="ابحث باسم الدواء باللغة العربية أو الإنجليزية أو بالقسم..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pr-11 pl-4 py-3.5 bg-gray-50 border border-gray-200 focus:border-brand-primary focus:bg-white rounded-xl text-base text-gray-900 focus:outline-none transition-all duration-200"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-400 hover:text-gray-600 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Results counter */}
            <div className="flex items-center justify-between md:justify-end gap-2 text-xs md:text-sm text-gray-500 shrink-0 font-medium bg-gray-50 px-3 py-2.5 rounded-xl border border-gray-100/50">
              <span>المنتجات المطابقة:</span>
              <span className="text-brand-primary font-bold text-sm md:text-base">{filteredItems.length}</span>
            </div>
          </div>

          {/* Horizontally scrollable Category Tabs */}
          <div className="mt-5 border-t border-gray-50 pt-4 w-full overflow-hidden">
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1 scroll-smooth w-full">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4.5 py-2.5 rounded-full text-sm font-bold shrink-0 transition-all duration-300 cursor-pointer ${selectedCategory === category
                    ? 'bg-brand-primary text-white shadow-sm shadow-teal-900/10'
                    : 'bg-gray-50 hover:bg-gray-100 text-gray-600 border border-gray-200/60'
                    }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Product Grid */}
        {filteredItems.length > 0 ? (
          <motion.div
            layout="position"
            className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6"
          >
            <AnimatePresence mode="popLayout">
              {filteredItems.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, scale: 0.96, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.96, y: 10 }}
                  transition={{ duration: 0.35, ease: 'easeOut' }}
                >
                  <ProductCard item={item} config={config} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center max-w-md mx-auto shadow-sm">
            <div className="w-16 h-16 bg-teal-50 text-brand-primary rounded-full flex items-center justify-center mx-auto mb-4 border border-teal-100">
              <AlertCircle className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-extrabold text-gray-900 mb-1">
              لم يتم العثور على أدوية مطابقة
            </h3>
            <p className="text-sm text-gray-500 mb-6">
              تأكد من كتابة الاسم بشكل صحيح، أو ابحث في تصنيف آخر.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('كل المنتجات');
              }}
              className="bg-brand-primary hover:bg-teal-900 text-white font-bold py-2 px-5 rounded-xl transition-all duration-300 text-sm cursor-pointer"
            >
              عرض جميع الأدوية
            </button>
          </div>
        )}
      </main>

      {/* Prescription Upload Modal */}
      <AnimatePresence>
        {showUploadModal && (
          <PrescriptionModal
            isOpen={showUploadModal}
            onClose={() => setShowUploadModal(false)}
            config={config}
          />
        )}
      </AnimatePresence>

      {/* Map, Contacts & Local SEO Info */}
      <ContactSection config={config} />

      {/* Footer */}
      <Footer config={config} />
    </div>
  );
}
