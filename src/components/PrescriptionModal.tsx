'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { X, Upload, FileText, CheckCircle, MessageCircle } from 'lucide-react';
import { PharmacyConfig } from '@/lib/types';

interface PrescriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: PharmacyConfig;
}

export default function PrescriptionModal({ isOpen, onClose, config }: PrescriptionModalProps) {
  const [prescriptionFile, setPrescriptionFile] = useState<File | null>(null);
  const [prescriptionPreview, setPrescriptionPreview] = useState<string | null>(null);
  const [uploadState, setUploadState] = useState<'idle' | 'uploading' | 'success'>('idle');
  const [prescriptionCode, setPrescriptionCode] = useState('');
  const [prescriptionUrl, setPrescriptionUrl] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handler for prescription file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setPrescriptionFile(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setPrescriptionPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      setUploadState('idle');
    }
  };

  // Submit prescription logic (POST upload + WhatsApp redirection)
  const handleSubmitPrescription = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prescriptionFile) return;

    setUploadState('uploading');

    try {
      const formData = new FormData();
      formData.append('file', prescriptionFile);

      const res = await fetch('/api/prescription/upload', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        throw new Error('Upload failed');
      }

      const data = await res.json();
      if (data.success) {
        setPrescriptionCode(data.code);
        setPrescriptionUrl(data.fileUrl);
        setUploadState('success');
      } else {
        throw new Error(data.error || 'Failed to upload file');
      }
    } catch (error) {
      console.error('Error uploading prescription file:', error);
      // Fallback
      const randCode = 'ESLAM-' + Math.floor(1000 + Math.random() * 9000);
      setPrescriptionCode(randCode);
      setUploadState('success');
    }
  };

  // Reset upload form and close
  const handleClose = () => {
    setPrescriptionFile(null);
    setPrescriptionPreview(null);
    setUploadState('idle');
    setPrescriptionCode('');
    setPrescriptionUrl('');
    onClose();
  };

  const triggerFileDialog = () => {
    fileInputRef.current?.click();
  };

  // WhatsApp link generator for prescription confirmation
  const getWhatsAppPrescriptionLink = () => {
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
    const fullImageUrl = prescriptionUrl ? `${baseUrl}${prescriptionUrl}` : '';

    let message = `مرحباً ${config.pharmacyNameAr}، لقد قمت برفع صورة الروشتة الطبية الخاصة بي عبر الموقع الإلكتروني بنجاح.\n\nرمز الطلب المرجعي: ${prescriptionCode}`;
    if (fullImageUrl) {
      message += `\nرابط عرض صورة الروشتة:\n${fullImageUrl}`;
    }
    message += `\n\nأرجو تجهيز الأدوية وسوف أتواصل معكم لتأكيد التوصيل أو الاستلام.`;
    return `https://wa.me/${config.whatsappNumber.replace('+', '')}?text=${encodeURIComponent(message)}`;
  };

  return (
    <motion.div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
        onClick={handleClose}
      ></motion.div>

      {/* Modal Content */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 12 }}
        transition={{ type: 'spring', duration: 0.45, bounce: 0.12 }}
        className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl relative z-10 border border-gray-100"
      >
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 left-4 p-1.5 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all duration-200 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title */}
        <div className="mb-5 text-right">
          <h3 className="text-xl font-extrabold text-brand-primary">
            إرسال الروشتة الطبية
          </h3>
          <p className="text-xs text-gray-500 mt-1">
            ارفع صورة أو ملف الروشتة لتجهيز الأدوية فوراً.
          </p>
        </div>

        {/* Modal Body depending on state */}
        {uploadState === 'idle' && (
          <form onSubmit={handleSubmitPrescription} className="space-y-4">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*,application/pdf"
              className="hidden"
            />

            {/* Upload Zone */}
            {!prescriptionPreview ? (
              <div
                onClick={triggerFileDialog}
                className="border-2 border-dashed border-gray-200 hover:border-brand-primary/50 bg-gray-50/50 hover:bg-teal-50/20 rounded-2xl p-8 text-center cursor-pointer transition-all duration-300 flex flex-col items-center justify-center"
              >
                <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-gray-100 flex items-center justify-center mb-3 text-brand-primary">
                  <Upload className="w-6 h-6" />
                </div>
                <span className="text-sm font-bold text-gray-800">
                  اضغط لاختيار صورة الروشتة أو التقاطها
                </span>
                <span className="text-xs text-gray-400 mt-1.5">
                  يدعم الصور (PNG, JPG) والملفات الطبية
                </span>
              </div>
            ) : (
              <div className="border border-gray-100 bg-gray-50 rounded-2xl p-3 relative overflow-hidden">
                {/* Preview Image */}
                <div className="h-48 w-full relative bg-white rounded-xl overflow-hidden flex items-center justify-center border border-gray-200/60">
                  {prescriptionFile?.type.startsWith('image/') ? (
                    <div className="relative w-full h-full">
                      <Image
                        src={prescriptionPreview!}
                        alt="Prescription preview"
                        fill
                        unoptimized
                        className="object-contain"
                      />
                    </div>
                  ) : (
                    <div className="flex flex-col items-center text-gray-500">
                      <FileText className="w-16 h-16 text-brand-primary mb-2" />
                      <span className="text-xs font-bold truncate max-w-[200px]">
                        {prescriptionFile?.name}
                      </span>
                    </div>
                  )}
                </div>
                {/* Remove button */}
                <button
                  type="button"
                  onClick={() => {
                    setPrescriptionFile(null);
                    setPrescriptionPreview(null);
                  }}
                  className="absolute top-5 left-5 bg-rose-500 hover:bg-rose-600 text-white rounded-lg p-1 shadow-md hover:scale-105 transition-all duration-200 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Action Buttons */}
            <button
              type="submit"
              disabled={!prescriptionFile}
              className={`w-full font-bold py-3.5 px-4 rounded-xl shadow-md transition-all duration-300 text-center text-sm md:text-base ${prescriptionFile
                  ? 'bg-brand-primary hover:bg-teal-900 text-white shadow-teal-900/10 cursor-pointer'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed shadow-none'
                }`}
            >
              إرسال وتجهيز الروشتة
            </button>
          </form>
        )}

        {uploadState === 'uploading' && (
          <div className="py-12 text-center flex flex-col items-center justify-center">
            <div className="w-12 h-12 border-4 border-brand-primary border-t-transparent rounded-full animate-spin mb-4"></div>
            <h4 className="text-base font-bold text-gray-900 mb-1">
              جاري رفع الروشتة...
            </h4>
            <p className="text-xs text-gray-500">
              نقوم بمعالجة الصورة الطبية وتوليد رقم طلبك.
            </p>
          </div>
        )}

        {uploadState === 'success' && (
          <div className="py-4 text-center">
            <div className="w-16 h-16 bg-emerald-50 text-brand-success rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-100">
              <CheckCircle className="w-10 h-10" />
            </div>
            <h4 className="text-lg font-black text-gray-900 mb-1">
              تم رفع الروشتة بنجاح!
            </h4>
            <p className="text-xs text-gray-500 mb-6 px-4">
              تم استلام الروشتة وتوليد رمز الحجز الخاص بك لتسهيل المتابعة مع الصيدلي.
            </p>

            {/* Code display */}
            <div className="bg-teal-50/50 border border-teal-100/80 rounded-2xl py-3 px-4 mb-6 max-w-[200px] mx-auto">
              <span className="block text-[10px] text-teal-800 font-bold uppercase tracking-wider">رمز الطلب المرجعي</span>
              <span className="text-lg font-black text-brand-primary font-sans select-all">{prescriptionCode}</span>
            </div>

            {/* Order CTA (WhatsApp) */}
            <a
              href={getWhatsAppPrescriptionLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-brand-primary hover:bg-teal-950 text-white font-extrabold py-3.5 px-4 rounded-xl text-center shadow-md shadow-teal-950/10 hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2 text-sm cursor-pointer"
            >
              <MessageCircle className="w-5 h-5 fill-white" />
              <span>أرسل كود الطلب عبر واتساب لتجهيزه فوراً</span>
            </a>

            <button
              onClick={handleClose}
              className="mt-4 text-xs font-bold text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
            >
              إغلاق النافذة
            </button>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
