'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Upload, X, AlertCircle } from 'lucide-react';
import { PharmacyItem, PharmacyConfig } from '@/lib/types';
import Header from './Header';
import ProductCard from './ProductCard';
import PrescriptionModal from './PrescriptionModal';
import ContactSection from './ContactSection';
import Footer from './Footer';

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
      <section className="relative overflow-hidden py-8 md:py-16 bg-linear-to-b from-[#FAF9F5] to-brand-bg px-4 sm:px-6">
        <motion.div
          className="max-w-5xl mx-auto text-center relative z-10"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.span
            className="inline-block bg-teal-50 border border-teal-100 text-brand-primary font-bold text-xs md:text-sm px-3.5 py-1.5 rounded-full mb-3.5"
            variants={itemVariants}
          >
            نخدمكم برعاية وأمان على مدار الساعة
          </motion.span>

          <motion.h2
            className="text-2xl md:text-5xl font-black text-brand-primary leading-tight mb-3"
            variants={itemVariants}
          >
            طلب وتجهيز الدواء في مصر <br /> أصبح <span className="relative inline-block px-1">أسهل<motion.span className="absolute bottom-[-6px] right-0 left-0 h-1 bg-brand-secondary rounded-full origin-right" initial={{ scaleX: 0, opacity: 0 }} animate={{ scaleX: 1, opacity: 1 }} transition={{ delay: 0.7, duration: 0.8, ease: [0.25, 1, 0.5, 1] as any }} /></span>
          </motion.h2>

          <motion.p
            className="text-xs md:text-lg text-gray-600 max-w-2xl mx-auto mb-6 font-medium leading-relaxed"
            variants={itemVariants}
          >
            تصفح الكتالوج المباشر، ابحث عن أدويتك أو قم برفع صورتها الطبية (الروشتة) ونقوم بتجهيز طلبيتك للتوصيل الفوري أو الاستلام.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row justify-center items-center gap-3 max-w-md mx-auto"
            variants={itemVariants}
          >
            <a
              href="#catalog"
              className="w-full sm:w-auto bg-brand-primary hover:bg-teal-900 text-white font-bold py-3 px-6 rounded-2xl shadow-lg shadow-teal-900/10 hover:shadow-xl transition-all duration-300 text-center text-sm md:text-base"
            >
              تصفح كتالوج الأدوية
            </a>
            <button
              onClick={() => setShowUploadModal(true)}
              className="w-full sm:w-auto bg-white hover:bg-gray-50 text-brand-primary border border-brand-primary/10 hover:border-brand-primary/30 font-bold py-3 px-6 rounded-2xl transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer text-sm md:text-base"
            >
              <Upload className="w-4.5 h-4.5 text-brand-primary" />
              <span>ارفع الروشتة الآن</span>
            </button>
          </motion.div>
        </motion.div>

        {/* Subtle Decorative Elements */}
        <div className="absolute top-1/2 left-0 transform -translate-y-1/2 -translate-x-1/3 w-72 h-72 rounded-full bg-teal-500/5 blur-3xl pointer-events-none"></div>
        <div className="absolute top-1/3 right-0 transform -translate-y-1/2 translate-x-1/3 w-72 h-72 rounded-full bg-brand-secondary/10 blur-3xl pointer-events-none"></div>
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
