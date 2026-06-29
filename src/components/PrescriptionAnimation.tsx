'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Upload,
  CheckCircle,
  MessageCircle,
  FileText,
  Sparkles,
  ArrowUp,
  FileCheck
} from 'lucide-react';

// Configuration for blob border radius states (curvy & uneven)
const blobShapes = {
  upload: '42% 58% 70% 30% / 45% 45% 55% 55%',
  code: '58% 42% 38% 62% / 50% 60% 40% 50%',
  whatsapp: '45% 55% 35% 65% / 55% 38% 62% 45%',
};

// Stage glow gradients - using primary brand teal
const stageGlows = {
  upload: 'from-brand-primary/20 via-brand-primary/5 to-transparent',
  code: 'from-brand-primary/20 via-brand-primary/5 to-transparent',
  whatsapp: 'from-brand-primary/25 via-brand-primary/10 to-transparent',
};

export default function PrescriptionAnimation() {
  const [stage, setStage] = useState<'upload' | 'code' | 'whatsapp'>('upload');
  const [splashKey, setSplashKey] = useState(0);

  // Auto-play choreography (runs continuously, no hover pause)
  useEffect(() => {
    let active = true;
    let timer: NodeJS.Timeout;
    let timeElapsed = 0;
    const stageDuration = 5000; // 5 seconds per stage

    const tick = () => {
      if (!active) return;

      timeElapsed += 100;
      if (timeElapsed >= stageDuration) {
        timeElapsed = 0;
        setStage((prev) => {
          const next = prev === 'upload' ? 'code' : prev === 'code' ? 'whatsapp' : 'upload';
          setSplashKey(k => k + 1);
          return next;
        });
      }

      timer = setTimeout(tick, 100);
    };

    tick();

    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, []);

  const handleStageSelect = (newStage: 'upload' | 'code' | 'whatsapp') => {
    setStage(newStage);
    setSplashKey(k => k + 1);
  };

  return (
    <div className="relative w-full max-w-[360px] sm:max-w-[400px] flex flex-col items-center gap-6 select-none">
      {/* Top Section: Morphing Blob and Curved Timeline */}
      <div className="relative w-full h-[220px] flex items-center justify-center">

        {/* Stage Glow Background */}
        <AnimatePresence mode="wait">
          <motion.div
            key={stage}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.8 }}
            className={`absolute inset-0 bg-radial-gradient ${stageGlows[stage]} rounded-full blur-3xl pointer-events-none z-0`}
          />
        </AnimatePresence>

        {/* Ripple Splash Effect (Triggers on Stage Change) */}
        <AnimatePresence>
          <motion.div
            key={`ripple-${splashKey}`}
            initial={{ scale: 0.7, opacity: 0.8 }}
            animate={{ scale: 1.8, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.1, ease: 'easeOut' }}
            className="absolute w-36 h-36 border-2 rounded-full pointer-events-none z-10 border-brand-primary/30"
          />
        </AnimatePresence>

        {/* Splash Particles (Triggers on Stage Change) */}
        <AnimatePresence>
          <div key={`particles-${splashKey}`} className="absolute inset-0 pointer-events-none z-20">
            {stage === 'upload' && (
              <>
                {/* File Uploading particles */}
                <motion.div
                  initial={{ x: 0, y: 0, scale: 0, opacity: 0 }}
                  animate={{ x: -75, y: -65, scale: 1, opacity: [0, 1, 1, 0] }}
                  transition={{ duration: 1.2, ease: 'easeOut' }}
                  className="absolute left-1/2 top-1/2 -ml-3 -mt-3 bg-white p-2 rounded-lg border border-teal-100 shadow-sm text-brand-primary"
                >
                  <Upload className="w-3.5 h-3.5" />
                </motion.div>
                <motion.div
                  initial={{ x: 0, y: 0, scale: 0, opacity: 0 }}
                  animate={{ x: 80, y: -50, scale: 0.9, opacity: [0, 1, 1, 0] }}
                  transition={{ duration: 1.4, ease: 'easeOut', delay: 0.1 }}
                  className="absolute left-1/2 top-1/2 -ml-3 -mt-3 bg-white p-2 rounded-lg border border-teal-100 shadow-sm text-brand-primary"
                >
                  <ArrowUp className="w-3.5 h-3.5" />
                </motion.div>
                <motion.div
                  initial={{ x: 0, y: 0, scale: 0, opacity: 0 }}
                  animate={{ x: -60, y: 65, scale: 0.8, opacity: [0, 1, 1, 0] }}
                  transition={{ duration: 1.3, ease: 'easeOut', delay: 0.15 }}
                  className="absolute left-1/2 top-1/2 -ml-3 -mt-3 bg-teal-50/80 p-2 rounded-lg border border-teal-100 shadow-sm text-brand-primary"
                >
                  <Sparkles className="w-3 h-3" />
                </motion.div>
              </>
            )}

            {stage === 'code' && (
              <>
                {/* Code Confirmation particles */}
                <motion.div
                  initial={{ x: 0, y: 0, scale: 0, opacity: 0 }}
                  animate={{ x: -80, y: -45, scale: 1, opacity: [0, 1, 1, 0] }}
                  transition={{ duration: 1.2, ease: 'easeOut' }}
                  className="absolute left-1/2 top-1/2 -ml-3 -mt-3 bg-white p-2 rounded-lg border border-teal-100/50 shadow-sm text-brand-primary"
                >
                  <FileCheck className="w-3.5 h-3.5" />
                </motion.div>
                <motion.div
                  initial={{ x: 0, y: 0, scale: 0, opacity: 0 }}
                  animate={{ x: 75, y: -65, scale: 0.95, opacity: [0, 1, 1, 0] }}
                  transition={{ duration: 1.3, ease: 'easeOut', delay: 0.05 }}
                  className="absolute left-1/2 top-1/2 -ml-3 -mt-3 bg-teal-50 p-2 rounded-lg border border-teal-100/50 shadow-sm text-brand-primary"
                >
                  <CheckCircle className="w-3.5 h-3.5" />
                </motion.div>
                <motion.div
                  initial={{ x: 0, y: 0, scale: 0, opacity: 0 }}
                  animate={{ x: 60, y: 60, scale: 0.85, opacity: [0, 1, 1, 0] }}
                  transition={{ duration: 1.5, ease: 'easeOut', delay: 0.15 }}
                  className="absolute left-1/2 top-1/2 -ml-3 -mt-3 bg-white p-1.5 rounded-lg border border-teal-100/50 shadow-sm text-brand-primary"
                >
                  <span className="text-[8px] font-black tracking-wider">OK</span>
                </motion.div>
              </>
            )}

            {stage === 'whatsapp' && (
              <>
                {/* WhatsApp message particles */}
                <motion.div
                  initial={{ x: 0, y: 0, scale: 0, opacity: 0 }}
                  animate={{ x: -75, y: -60, scale: 1.1, opacity: [0, 1, 1, 0] }}
                  transition={{ duration: 1.2, ease: 'easeOut' }}
                  className="absolute left-1/2 top-1/2 -ml-3 -mt-3 bg-white p-2 rounded-lg border border-teal-100/50 shadow-sm text-brand-primary"
                >
                  <MessageCircle className="w-3.5 h-3.5 fill-brand-primary" />
                </motion.div>
                <motion.div
                  initial={{ x: 0, y: 0, scale: 0, opacity: 0 }}
                  animate={{ x: 80, y: -45, scale: 0.9, opacity: [0, 1, 1, 0] }}
                  transition={{ duration: 1.4, ease: 'easeOut', delay: 0.08 }}
                  className="absolute left-1/2 top-1/2 -ml-3 -mt-3 bg-teal-50 p-2 rounded-lg border border-teal-100/50 shadow-sm text-brand-primary"
                >
                  <Sparkles className="w-3 h-3" />
                </motion.div>
                <motion.div
                  initial={{ x: 0, y: 0, scale: 0, opacity: 0 }}
                  animate={{ x: -65, y: 55, scale: 0.85, opacity: [0, 1, 1, 0] }}
                  transition={{ duration: 1.3, ease: 'easeOut', delay: 0.18 }}
                  className="absolute left-1/2 top-1/2 -ml-3 -mt-3 bg-white p-2 rounded-lg border border-teal-100/50 shadow-sm text-brand-primary"
                >
                  <span className="text-[9px] font-bold">💬</span>
                </motion.div>
              </>
            )}
          </div>
        </AnimatePresence>

        {/* Secondary Brand Color Glassmorphic Backdrop Blur Ring */}
        <div className="absolute w-48 h-48 sm:w-52 sm:h-52 bg-brand-secondary/10 rounded-full blur-[2px] backdrop-blur-md border border-brand-secondary/20 pointer-events-none z-0 animate-pulse" style={{ animationDuration: '3s' }} />

        {/* The Curvy, Morphing Doctor Blob */}
        <motion.div
          animate={{
            borderRadius: blobShapes[stage],
            y: [0, -6, 0],
            rotate: stage === 'upload' ? 0 : stage === 'code' ? 4 : -4
          }}
          transition={{
            borderRadius: { type: 'spring', stiffness: 80, damping: 15 },
            y: { repeat: Infinity, duration: 4, ease: 'easeInOut' },
            rotate: { type: 'spring', stiffness: 60, damping: 12 }
          }}
          className="relative w-40 h-40 sm:w-44 sm:h-44 bg-teal-900/10 border-3 border-white shadow-2xl overflow-hidden z-10 select-none group"
        >
          {/* Inner overlay gradient */}
          <div className="absolute inset-0 bg-linear-to-t from-teal-950/20 via-transparent to-transparent z-10" />

          {/* Pharmacist Image */}
          <img
            src="/doctor.png"
            alt="صيدلي صيدليات د. إسلام"
            className="w-full h-full object-cover pointer-events-none group-hover:scale-105 transition-transform duration-500"
          />
        </motion.div>

        {/* Curved Step Indicator (01, 02, 03) */}
        <div className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 flex flex-col items-center justify-between h-40 w-12 z-20">

          {/* SVG Curvy Dashed Timeline Behind Indicators */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-40" viewBox="0 0 50 160" fill="none">
            <path d="M 40,10 C 15,40 10,120 40,150" stroke="#115E59" strokeWidth="2" strokeDasharray="3 3" />
          </svg>

          {/* Step 1 Indicator */}
          <div
            style={{ transform: 'translateX(20px)' }}
            className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all duration-300 shadow-md ${stage === 'upload'
              ? 'bg-brand-primary text-white border-2 border-white scale-110 ring-2 ring-brand-primary/30'
              : 'bg-white text-brand-primary border border-brand-primary/10'
              }`}
          >
            01
          </div>

          {/* Step 2 Indicator */}
          <div
            style={{ transform: 'translateX(10px)' }}
            className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all duration-300 shadow-md ${stage === 'code'
              ? 'bg-brand-primary text-white border-2 border-white scale-110 ring-2 ring-brand-primary/30'
              : 'bg-white text-brand-primary border border-brand-primary/10'
              }`}
          >
            02
          </div>

          {/* Step 3 Indicator */}
          <div
            style={{ transform: 'translateX(20px)' }}
            className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all duration-300 shadow-md ${stage === 'whatsapp'
              ? 'bg-brand-primary text-white border-2 border-white scale-110 ring-2 ring-brand-primary/30'
              : 'bg-white text-brand-primary border border-brand-primary/10'
              }`}
          >
            03
          </div>

        </div>
      </div>

      {/* Bottom Section: Steps Description Card (Glassmorphic) with stable fixed height */}
      <div className="w-full relative h-[185px]">
        <AnimatePresence mode="wait">
          {stage === 'upload' && (
            <motion.div
              key="stage-upload"
              initial={{ opacity: 0, y: 15, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -15, scale: 0.98 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              className="absolute inset-0 w-full bg-[#FAF9F5]/90 backdrop-blur-md border border-brand-primary/10 rounded-2xl p-5 shadow-xl flex flex-col justify-between"
            >
              <div>
                <span className="text-[9px] font-extrabold text-brand-primary bg-teal-50 border border-teal-100 px-2 py-0.5 rounded-md">
                  الخطوة الأولى: رفع الروشتة
                </span>
                <h3 className="text-sm sm:text-base font-black text-brand-primary mt-2.5 text-right">
                  ارفع صورة أو ملف الروشتة الطبية
                </h3>
                <p className="text-[11px] text-gray-500 mt-1 text-right leading-relaxed font-bold">
                  التقط صورة للروشتة بهاتفك أو اختر ملف الوصفة الطبية بشكل آمن تماماً لنقوم بتفريغها.
                </p>
              </div>

              {/* Action Box */}
              <div className="mt-4 border border-dashed border-brand-primary/15 bg-white/60 rounded-xl py-2 flex items-center justify-center gap-2">
                <Upload className="w-4 h-4 text-brand-primary animate-bounce" />
                <span className="text-[9px] font-bold text-brand-primary">اسحب الروشتة أو اضغط للاختيار</span>
              </div>
            </motion.div>
          )}

          {stage === 'code' && (
            <motion.div
              key="stage-code"
              initial={{ opacity: 0, y: 15, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -15, scale: 0.98 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              className="absolute inset-0 w-full bg-[#FAF9F5]/90 backdrop-blur-md border border-brand-primary/10 rounded-2xl p-5 shadow-xl flex flex-col justify-between"
            >
              <div>
                <span className="text-[9px] font-extrabold text-brand-primary bg-teal-50 border border-teal-100 px-2 py-0.5 rounded-md">
                  الخطوة الثانية: كود الطلب
                </span>
                <h3 className="text-sm sm:text-base font-black text-brand-primary mt-2.5 text-right">
                  توليد كود التتبع الفوري
                </h3>
                <p className="text-[11px] text-gray-500 mt-1 text-right leading-relaxed font-bold">
                  يقوم النظام بتسجيل وتأكيد استلام الملف فوراً وتوليد كود مرجعي فريد لمتابعة دوائك.
                </p>
              </div>

              {/* Action Box */}
              <div className="mt-4 bg-white/70 border border-brand-primary/10 rounded-xl px-3.5 py-2.5 flex justify-between items-center shadow-xs">
                <div className="flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-brand-primary" />
                  <span className="text-[9px] font-bold text-gray-600">جاهز للإرسال</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-black text-brand-primary tracking-wide font-sans">ESLAM-4821</span>
                  <div className="w-6 h-6 rounded bg-teal-50 flex items-center justify-center text-brand-primary">
                    <FileText className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {stage === 'whatsapp' && (
            <motion.div
              key="stage-whatsapp"
              initial={{ opacity: 0, y: 15, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -15, scale: 0.98 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              className="absolute inset-0 w-full bg-[#FAF9F5]/90 backdrop-blur-md border border-brand-primary/10 rounded-2xl p-5 shadow-xl flex flex-col justify-between"
            >
              <div>
                <span className="text-[9px] font-extrabold text-brand-primary bg-teal-50 border border-teal-100 px-2 py-0.5 rounded-md">
                  الخطوة الثالثة: التأكيد عبر واتساب
                </span>
                <h3 className="text-sm sm:text-base font-black text-brand-primary mt-2.5 text-right">
                  تجهيز الدواء والتأكيد الفوري
                </h3>
                <p className="text-[11px] text-gray-500 mt-1 text-right leading-relaxed font-bold">
                  اضغط على الزر لفتح محادثة واتساب مع الصيدلي لإرسال كود الروشتة والبدء في التحضير المباشر.
                </p>
              </div>

              {/* Action Box */}
              <div className="mt-4 w-full bg-white/40 rounded-xl">
                <a
                  href="https://wa.me/201068359667?text=%D9%85%D8%B1%D8%AD%D8%A8%D8%A7%D9%8B%20%D8%B5%D9%8A%D8%AF%D9%84%D9%8A%D8%A9%20%D8%AF.%20%D8%A5%D8%B3%D9%84%D8%A7%D9%85%D8%8C%20%D9%84%D9%82%D8%AF%20%D9%82%D9%85%D8%AA%20%D8%A8%D8%B1%D9%81%D8%B9%20%D8%A7%D9%84%D8%B1%D9%85%D8%B2%20%D8%A7%D9%84%D9%85%D8%B1%D8%AC%D8%B9%D9%8A%3A%20ESLAM-4821"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-brand-primary hover:bg-teal-950 text-white font-extrabold py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 text-[11px] cursor-pointer shadow-md shadow-brand-primary/10 transition-all duration-300 hover:scale-[1.01]"
                >
                  <MessageCircle className="w-3.5 h-3.5 fill-white" />
                  <span>تأكيد الروشتة عبر واتساب</span>
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
