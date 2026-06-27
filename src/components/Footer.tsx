'use client';

import React from 'react';
import Image from 'next/image';
import { Settings } from 'lucide-react';
import { PharmacyConfig } from '@/lib/types';

interface FooterProps {
  config: PharmacyConfig;
}

export default function Footer({ config }: FooterProps) {
  return (
    <footer className="bg-brand-primary text-teal-100 py-8 border-t border-teal-800 text-xs sm:text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md overflow-hidden bg-white flex items-center justify-center border border-teal-800 shrink-0">
            <Image src="/logo.png" alt="Logo" width={24} height={24} className="w-full h-full object-cover scale-105" />
          </div>
          <span className="font-extrabold text-white text-sm">{config.pharmacyNameAr}</span>
          <span className="text-teal-600 text-xs">|</span>
          <span className="text-teal-300 text-xs">جميع الحقوق محفوظة © 2026</span>
        </div>

        <div className="flex items-center gap-4">
          <a href="/admin/upload" className="hover:text-white transition-colors duration-200 flex items-center gap-1">
            <Settings className="w-3.5 h-3.5 text-brand-secondary" />
            <span>لوحة التحكم والإدارة</span>
          </a>
          <span className="text-teal-800">|</span>
          <a href="#catalog" className="hover:text-white transition-colors duration-200">
            كتالوج المنتجات
          </a>
          <span className="text-teal-800">|</span>
          <span className="text-teal-400">صنع خصيصاً لصيدليات مصر 🇪🇬</span>
        </div>
      </div>
    </footer>
  );
}
