'use client';

import React from 'react';
import { MessageCircle } from 'lucide-react';
import { PharmacyItem, PharmacyConfig } from '@/lib/types';

interface ProductCardProps {
  item: PharmacyItem;
  config: PharmacyConfig;
}

export default function ProductCard({ item, config }: ProductCardProps) {
  // WhatsApp link generator for product reservation
  const getWhatsAppProductLink = (item: PharmacyItem) => {
    const message = `مرحباً ${config.pharmacyNameAr}، أود حجز منتج: ${item.nameNameAr} ${item.nameNameEn ? `(${item.nameNameEn})` : ''} بسعر ${item.price} ج.م. هل هو متوفر للاستلام حالياً؟`;
    return `https://wa.me/${config.whatsappNumber.replace('+', '')}?text=${encodeURIComponent(message)}`;
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 hover:border-brand-primary/20 shadow-sm hover:shadow-lg hover:-translate-y-1.5 transition-all duration-500 ease-out flex flex-col justify-between overflow-hidden group h-full">
      {/* Card Header & Body */}
      <div className="p-3 sm:p-5">
        {/* Category & Status Badge */}
        <div className="flex justify-between items-center mb-2.5">
          <span className="text-[10px] sm:text-xs font-bold text-brand-primary bg-teal-50 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-lg">
            {item.category}
          </span>

          {item.isAvailable ? (
            <span className="flex items-center gap-1 text-[9px] sm:text-[11px] font-bold text-brand-success bg-emerald-50 border border-emerald-100 px-1.5 py-0.5 rounded-md shrink-0">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-success animate-pulse"></span>
              متوفر
            </span>
          ) : (
            <span className="flex items-center gap-1 text-[9px] sm:text-[11px] font-bold text-brand-error bg-rose-50 border border-rose-100 px-1.5 py-0.5 rounded-md shrink-0">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-error"></span>
              غير متوفر
            </span>
          )}
        </div>

        {/* Product Title */}
        <h3 className="text-sm sm:text-lg font-extrabold text-gray-900 group-hover:text-brand-primary transition-colors duration-200 leading-snug line-clamp-2">
          {item.nameNameAr}
        </h3>
        {item.nameNameEn && (
          <p className="text-[10px] sm:text-xs text-gray-400 font-sans tracking-wide mt-0.5 font-medium truncate">
            {item.nameNameEn}
          </p>
        )}

        {/* Description */}
        {item.descriptionAr && (
          <p className="text-[10px] sm:text-xs text-gray-500 mt-2.5 line-clamp-2 leading-relaxed">
            {item.descriptionAr}
          </p>
        )}
      </div>

      {/* Card Footer */}
      <div className="px-3 pb-3 pt-2 sm:px-5 sm:pb-5 sm:pt-3 border-t border-gray-50 bg-gray-50/50 flex flex-col gap-2 sm:gap-3">
        <div className="flex justify-between items-baseline">
          <span className="text-[10px] sm:text-xs text-gray-500 font-medium">السعر</span>
          <div className="flex items-baseline gap-0.5">
            <span className="text-base sm:text-xl font-black text-brand-primary">{item.price.toFixed(2)}</span>
            <span className="text-[10px] sm:text-xs font-bold text-teal-800">ج.م</span>
          </div>
        </div>

        {/* Order CTA (WhatsApp) */}
        <a
          href={getWhatsAppProductLink(item)}
          target="_blank"
          rel="noopener noreferrer"
          className={`w-full font-bold py-2 px-2.5 sm:py-2.5 sm:px-4 rounded-xl text-center transition-all duration-300 flex items-center justify-center gap-1 sm:gap-2 text-[10px] sm:text-xs md:text-sm cursor-pointer group/btn shrink-0 ${item.isAvailable
              ? 'bg-brand-primary hover:bg-teal-700 text-white shadow-sm hover:shadow-lg hover:shadow-teal-900/10'
              : 'bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-200/50'
            }`}
        >
          <MessageCircle className={`w-3.5 h-3.5 sm:w-4 sm:h-4 transition-all duration-300 group-hover/btn:scale-110 group-hover/btn:-rotate-6 shrink-0 ${item.isAvailable ? 'fill-white' : 'fill-gray-700'
            }`} />
          <span>{item.isAvailable ? 'طلب عبر واتساب' : 'استفسار'}</span>
        </a>
      </div>
    </div>
  );
}
