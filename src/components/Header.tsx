'use client';

import React from 'react';
import Image from 'next/image';
import { Clock, MapPin, Phone, Upload, Settings } from 'lucide-react';
import { PharmacyConfig } from '@/lib/types';

interface HeaderProps {
  config: PharmacyConfig;
  onUploadClick: () => void;
}

export default function Header({ config, onUploadClick }: HeaderProps) {
  return (
    <>
      {/* Top Banner / Opening Info */}
      <div className="bg-brand-primary text-[#E6F4F1] py-1.5 px-3 border-b border-teal-800 text-[10px] sm:text-xs">
        <div className="max-w-7xl mx-auto flex justify-between items-center gap-2">
          <span className="flex items-center gap-1 font-medium">
            <Clock className="w-3.5 h-3.5 text-brand-secondary shrink-0" />
            <span>{config.openingHoursAr}</span>
          </span>
          
          <div className="flex items-center gap-3">
            <span className="hidden md:flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-brand-secondary shrink-0" />
              <span>{config.addressAr}</span>
            </span>
            <a 
              href={`tel:${config.phone}`} 
              className="flex items-center gap-1 bg-teal-800/60 hover:bg-teal-800 text-white py-0.5 px-2.5 rounded-full transition-all duration-300 font-bold"
            >
              <Phone className="w-3 h-3 text-brand-secondary shrink-0" />
              <span>اتصل: {config.phone}</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            {/* Logo/Icon Container */}
            <div className="w-10 h-10 rounded-xl overflow-hidden bg-white flex items-center justify-center shadow-md shadow-teal-900/10 border border-gray-100/50 shrink-0">
              <Image src="/logo.png" alt="Logo" width={40} height={40} className="w-full h-full object-cover scale-105" priority />
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-extrabold text-brand-primary tracking-tight leading-tight">
                {config.pharmacyNameAr}
              </h1>
              <p className="text-xs text-gray-500 font-sans tracking-wide">
                {config.pharmacyNameEn}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={onUploadClick}
              className="bg-brand-primary hover:bg-teal-900 text-white font-bold py-2 px-2.5 sm:px-4 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 flex items-center gap-1.5 text-xs sm:text-sm border border-teal-800 cursor-pointer shrink-0"
            >
              <Upload className="w-3.5 h-3.5 text-brand-secondary" />
              <span>إرسال روشتة</span>
            </button>
            
            <a
              href="/admin/upload"
              title="لوحة الإدارة"
              className="p-1.5 sm:p-2 rounded-xl text-gray-400 hover:text-brand-primary hover:bg-gray-50 border border-transparent hover:border-gray-100 transition-all duration-300"
            >
              <Settings className="w-4 h-4 sm:w-5 sm:h-5" />
            </a>
          </div>
        </div>
      </header>
    </>
  );
}
