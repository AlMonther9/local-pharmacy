'use client';

import React from 'react';
import { ArrowRight, LogOut } from 'lucide-react';

interface AdminHeaderProps {
  handleLogout: () => void;
}

export default function AdminHeader({ handleLogout }: AdminHeaderProps) {
  return (
    <header className="bg-white border-b border-gray-100 shadow-sm sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-brand-primary flex items-center justify-center text-white font-bold">
            ⚙️
          </div>
          <div>
            <h1 className="text-base sm:text-lg font-black text-brand-primary">لوحة تحكم الصيدلية</h1>
            <p className="text-[11px] text-gray-500 font-medium">مرحبا بك في مركز إدارة البيانات والمزامنة</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <a 
            href="/"
            className="hidden sm:flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-brand-primary bg-gray-50 hover:bg-gray-100/80 px-3.5 py-2 rounded-xl border border-gray-200/50 transition-all duration-200"
          >
            <ArrowRight className="w-4 h-4" />
            <span>عرض الموقع</span>
          </a>

          <button
            onClick={handleLogout}
            className="flex items-center gap-1 text-xs font-bold text-rose-600 hover:bg-rose-50 hover:border-rose-100 border border-transparent px-3 py-2 rounded-xl transition-all duration-200 cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>خروج</span>
          </button>
        </div>
      </div>
    </header>
  );
}
