'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Upload, 
  CheckCircle, 
  MessageCircle, 
  FileText,
  Smartphone
} from 'lucide-react';

export default function PrescriptionAnimation() {
  const [stage, setStage] = useState<'upload' | 'code' | 'whatsapp'>('upload');

  // Animation Loop Choreography with deliberate longer pauses
  useEffect(() => {
    let active = true;
    
    const cycle = async () => {
      if (!active) return;
      // Stage 1: Upload (Duration: 3.5s)
      setStage('upload');
      await new Promise(resolve => setTimeout(resolve, 3500));

      if (!active) return;
      // Stage 2: Code Generation (Duration: 3.5s)
      setStage('code');
      await new Promise(resolve => setTimeout(resolve, 3500));

      if (!active) return;
      // Stage 3: Send via WhatsApp (Duration: 5s)
      setStage('whatsapp');
      await new Promise(resolve => setTimeout(resolve, 5000));

      if (active) {
        cycle();
      }
    };

    cycle();
    return () => {
      active = false;
    };
  }, []);

  return (
    <motion.div
      className="relative w-full max-w-[340px] sm:max-w-[380px] h-[340px] sm:h-[380px] flex items-center justify-center select-none"
      style={{ perspective: 1200 }}
      whileHover={{ rotateY: -4, rotateX: 4, scale: 1.01 }}
      transition={{ type: "spring", stiffness: 200, damping: 25 }}
    >
      {/* Dynamic Background Glows matching brand system */}
      <div className="absolute inset-0 bg-gradient-to-tr from-teal-800/5 to-brand-secondary/5 rounded-3xl blur-2xl pointer-events-none" />

      <AnimatePresence mode="wait">
        {/* STAGE 1: Uploading the Prescription */}
        {stage === 'upload' && (
          <motion.div
            key="upload-stage"
            initial={{ opacity: 0, scale: 0.96, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -10 }}
            transition={{ type: 'spring', duration: 0.5 }}
            className="w-full bg-[#FAF9F5] border border-teal-900/10 rounded-3xl p-6 shadow-xl flex flex-col justify-between h-[280px]"
          >
            <div>
              <span className="text-[10px] font-bold text-brand-primary bg-teal-50 border border-teal-100/50 px-2.5 py-1 rounded-lg">
                الخطوة الأولى: رفع الروشتة
              </span>
              <h3 className="text-base sm:text-lg font-black text-brand-primary mt-3 text-right">
                ارفع صورة أو ملف الروشتة الطبية
              </h3>
              <p className="text-xs text-gray-500 mt-1.5 text-right leading-relaxed">
                التقط صورة للروشتة بهاتفك أو اختر ملف الوصفة الطبية من جهازك بشكل آمن تماماً.
              </p>
            </div>

            {/* Visual Action Indicator */}
            <div className="border border-dashed border-teal-900/15 bg-white/50 rounded-2xl p-4 flex flex-col items-center justify-center gap-2">
              <motion.div
                animate={{ y: [0, -6, 0] }}
                transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center text-brand-primary border border-teal-100/50"
              >
                <Upload className="w-5 h-5" />
              </motion.div>
              <span className="text-[10px] font-bold text-gray-400">اسحب الملف أو اضغط هنا للاختيار</span>
            </div>
          </motion.div>
        )}

        {/* STAGE 2: Code Generation */}
        {stage === 'code' && (
          <motion.div
            key="code-stage"
            initial={{ opacity: 0, scale: 0.96, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -10 }}
            transition={{ type: 'spring', duration: 0.5 }}
            className="w-full bg-[#FAF9F5] border border-teal-900/10 rounded-3xl p-6 shadow-xl flex flex-col justify-between h-[280px]"
          >
            <div>
              <span className="text-[10px] font-bold text-brand-primary bg-teal-50 border border-teal-100/50 px-2.5 py-1 rounded-lg">
                الخطوة الثانية: كود الطلب
              </span>
              <h3 className="text-base sm:text-lg font-black text-brand-primary mt-3 text-right">
                إنشاء كود مرجعي فوري للطلب
              </h3>
              <p className="text-xs text-gray-500 mt-1.5 text-right leading-relaxed">
                يقوم النظام بتأكيد استلام الملف وتوليد رمز تتبع فريد لطلبك.
              </p>
            </div>

            {/* Generated Code Display */}
            <div className="bg-white border border-teal-900/5 rounded-2xl p-4 flex justify-between items-center shadow-sm">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-brand-success" />
                <span className="text-xs font-bold text-brand-primary">جاهز للإرسال</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-black text-brand-primary tracking-wide font-sans">MONTHER-4821</span>
                <div className="w-8 h-8 rounded-lg bg-teal-50 flex items-center justify-center text-brand-primary">
                  <FileText className="w-4.5 h-4.5" />
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* STAGE 3: WhatsApp Confirm */}
        {stage === 'whatsapp' && (
          <motion.div
            key="whatsapp-stage"
            initial={{ opacity: 0, scale: 0.96, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -10 }}
            transition={{ type: 'spring', duration: 0.5 }}
            className="w-full bg-[#FAF9F5] border border-teal-900/10 rounded-3xl p-6 shadow-xl flex flex-col justify-between h-[280px]"
          >
            <div>
              <span className="text-[10px] font-bold text-brand-primary bg-teal-50 border border-teal-100/50 px-2.5 py-1 rounded-lg">
                الخطوة الثالثة: إرسال الكود للفرع
              </span>
              <h3 className="text-base sm:text-lg font-black text-brand-primary mt-3 text-right">
                تأكيد وتجهيز الطلب عبر واتساب
              </h3>
              <p className="text-xs text-gray-500 mt-1.5 text-right leading-relaxed">
                اضغط على زر الإرسال لفتح محادثة واتساب مع الصيدلي لإرسال كود الروشتة والبدء في تحضير دوائك.
              </p>
            </div>

            {/* CTA matching brand system */}
            <div className="w-full bg-white border border-teal-900/5 rounded-2xl p-3 shadow-xs">
              <a
                href="https://wa.me/201068359667?text=%D9%85%D8%B1%D8%AD%D8%A8%D8%A7%D9%8B%20%D8%B5%D9%8A%D8%AF%D9%84%D9%8A%D8%A9%20%D9%85%D9%86%D8%B0%D8%B1%D8%8C%20%D9%84%D9%82%D8%AF%20%D9%82%D9%85%D8%AA%20%D8%A8%D8%B1%D9%81%D8%B9%20%D8%A7%D9%84%D8%B1%D9%85%D8%B2%20%D8%A7%D9%84%D9%85%D8%B1%D8%AC%D8%B9%D9%8A%3A%20MONTHER-4821"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-brand-primary hover:bg-teal-950 text-white font-extrabold py-3 px-4 rounded-xl flex items-center justify-center gap-2 text-xs sm:text-sm cursor-pointer shadow-md shadow-teal-950/10 transition-all duration-300"
              >
                <MessageCircle className="w-4 h-4 fill-white" />
                <span>إرسال كود الروشتة عبر واتساب</span>
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
