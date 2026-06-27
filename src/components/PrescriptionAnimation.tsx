'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText, 
  Check, 
  MessageCircle, 
  Search, 
  ShieldCheck, 
  Sparkles,
  HeartPulse
} from 'lucide-react';

export default function PrescriptionAnimation() {
  const [stage, setStage] = useState<'scan' | 'match' | 'action'>('scan');

  // Animation Loop Choreography
  useEffect(() => {
    const cycle = async () => {
      // Stage 1: Scanning (Duration: 2.8s)
      setStage('scan');
      await new Promise(resolve => setTimeout(resolve, 2800));

      // Stage 2: Product Match (Duration: 2.2s)
      setStage('match');
      await new Promise(resolve => setTimeout(resolve, 2200));

      // Stage 3: Call to Action (Duration: 3.5s)
      setStage('action');
      await new Promise(resolve => setTimeout(resolve, 3500));

      // Restart Loop
      cycle();
    };

    cycle();
    return () => {};
  }, []);

  return (
    <motion.div
      className="relative w-full max-w-[340px] sm:max-w-[380px] h-[340px] sm:h-[380px] flex items-center justify-center select-none"
      style={{ perspective: 1200 }}
      whileHover={{ rotateY: -6, rotateX: 6, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 200, damping: 20 }}
    >
      {/* Dynamic Background Glows */}
      <div className="absolute inset-0 bg-gradient-to-tr from-teal-500/10 to-sky-400/5 rounded-3xl blur-2xl pointer-events-none" />

      {/* STAGE 1: The Floating Prescription Card */}
      <AnimatePresence mode="wait">
        {stage === 'scan' && (
          <motion.div
            key="prescription-card"
            initial={{ opacity: 0, scale: 0.9, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -15 }}
            transition={{ type: 'spring', duration: 0.6 }}
            className="w-full bg-[#FAF9F5] border border-teal-900/10 rounded-2xl p-5 shadow-xl relative overflow-hidden flex flex-col justify-between h-[280px]"
          >
            {/* Vintage Grid Paper Header Pattern */}
            <div className="absolute top-0 right-0 left-0 h-1 bg-gradient-to-l from-brand-primary to-brand-secondary" />
            
            {/* Header */}
            <div className="flex justify-between items-center border-b border-teal-900/5 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-teal-50 flex items-center justify-center text-brand-primary border border-teal-100/50">
                  <HeartPulse className="w-4.5 h-4.5" />
                </div>
                <div>
                  <h4 className="text-xs font-black text-brand-primary">روشتة طبية معتمدة</h4>
                  <p className="text-[9px] text-gray-400 font-sans">EGYPT PHARMACY STANDARD</p>
                </div>
              </div>
              <div className="text-[10px] font-bold text-teal-800 bg-teal-50 border border-teal-100/40 px-2 py-0.5 rounded">
                عيادة الباطنة
              </div>
            </div>

            {/* Doctor's Mock Scribble (RTL lines) */}
            <div className="space-y-3.5 my-4 flex-grow text-right">
              {/* Row 1 */}
              <div className="flex justify-between items-center">
                <div className="h-2 w-2/3 bg-gray-200/80 rounded-full animate-pulse" />
                <span className="text-[10px] text-gray-400 font-bold">Rx</span>
              </div>
              {/* Row 2 */}
              <div className="h-2 w-1/2 bg-gray-200/80 rounded-full" />
              {/* Row 3 */}
              <div className="h-2 w-3/4 bg-gray-200/80 rounded-full" />
              {/* Row 4 */}
              <div className="flex items-center gap-1.5 mt-2">
                <Sparkles className="w-3 h-3 text-brand-secondary animate-pulse" />
                <span className="text-[10px] font-bold text-brand-primary">قراءة الروشتة ذكياً...</span>
              </div>
            </div>

            {/* Stamp Footer */}
            <div className="flex justify-between items-end border-t border-teal-900/5 pt-2">
              <div className="w-9 h-9 rounded-full border-2 border-dashed border-teal-600/30 flex items-center justify-center text-teal-600/30 text-[8px] font-bold uppercase rotate-12">
                APPROVED
              </div>
              <div className="text-left">
                <div className="h-1.5 w-12 bg-gray-200 rounded-full mb-1" />
                <div className="h-1.5 w-8 bg-gray-200 rounded-full" />
              </div>
            </div>

            {/* Glowing Laser Scan Line */}
            <motion.div
              initial={{ top: '0%' }}
              animate={{ top: '99%' }}
              transition={{ duration: 2.2, ease: "easeInOut" }}
              className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-brand-secondary to-transparent shadow-[0_0_8px_#7dd3fc]"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* STAGE 2 & 3: The Match Reveal & Action Buttons */}
      <AnimatePresence>
        {(stage === 'match' || stage === 'action') && (
          <div className="absolute inset-0 flex flex-col justify-center items-center gap-4">
            
            {/* The Product Match Card */}
            <motion.div
              key="match-card"
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -20 }}
              transition={{ type: 'spring', stiffness: 120, damping: 14 }}
              className="w-full bg-white border border-gray-100 rounded-2xl p-5 shadow-2xl relative overflow-hidden flex flex-col justify-between h-[200px]"
            >
              {/* Top Details */}
              <div className="flex justify-between items-start">
                <span className="flex items-center gap-1 text-[10px] font-bold text-brand-success bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-lg">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  تم العثور على الدواء
                </span>
                <span className="text-[10px] font-bold text-gray-400">مخزون صيدلية المنذر</span>
              </div>

              {/* Medication Block */}
              <div className="my-4 text-right flex gap-3 items-center justify-end">
                <div className="text-right">
                  <h3 className="text-base sm:text-lg font-black text-brand-primary leading-tight">
                    بنادول إكسترا 500 ملجم
                  </h3>
                  <p className="text-xs text-gray-400 font-sans tracking-wide">Panadol Extra (500mg)</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-teal-50 border border-teal-100/50 flex items-center justify-center text-brand-primary shrink-0">
                  <FileText className="w-6 h-6" />
                </div>
              </div>

              {/* Price & Pulsing Check */}
              <div className="flex justify-between items-center border-t border-gray-50 pt-3">
                <div className="flex items-baseline gap-0.5">
                  <span className="text-xl font-black text-brand-primary">٥٠.٠٠</span>
                  <span className="text-[10px] font-bold text-teal-800">ج.م</span>
                </div>

                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-brand-success">متوفر بالمخزن</span>
                  <div className="w-6 h-6 rounded-full bg-brand-success flex items-center justify-center text-white shadow-md shadow-emerald-500/20">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                </div>
              </div>
            </motion.div>

            {/* STAGE 3: Low-Friction WhatsApp Action Pill */}
            <AnimatePresence>
              {stage === 'action' && (
                <motion.div
                  key="action-pill"
                  initial={{ opacity: 0, y: 15, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ type: 'spring', stiffness: 150, damping: 12, delay: 0.1 }}
                  className="w-full max-w-[260px] bg-brand-whatsapp hover:bg-emerald-600 text-white font-extrabold py-3 px-4 rounded-full shadow-lg shadow-emerald-600/10 flex items-center justify-center gap-2 text-xs sm:text-sm cursor-pointer transition-colors duration-300"
                >
                  <MessageCircle className="w-4 h-4 fill-white" />
                  <span>احجز الآن عبر واتساب</span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
