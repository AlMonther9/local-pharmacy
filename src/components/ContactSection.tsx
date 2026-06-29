'use client';

import React from 'react';
import { MapPin, Clock, Smartphone } from 'lucide-react';
import { PharmacyConfig } from '@/lib/types';

interface ContactSectionProps {
  config: PharmacyConfig;
}

export default function ContactSection({ config }: ContactSectionProps) {
  return (
    <section id="contact" className="bg-white border-t border-gray-100 py-12 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">

        {/* Contact Details */}
        <div className="lg:col-span-5 flex flex-col justify-between">
          <div>
            <span className="inline-block bg-teal-50 border border-teal-100 text-brand-primary font-bold text-xs px-2.5 py-1 rounded-lg mb-3">
              📍 عنواننا وتفاصيل الاتصال
            </span>
            <h3 className="text-2xl font-extrabold text-brand-primary mb-5">
              تفضل بزيارتنا في {config.pharmacyNameAr}
            </h3>
            <p className="text-sm text-gray-600 mb-6 leading-relaxed">
              يسعدنا خدمتك واستقبالك في الفرع الرئيسي بالقاهرة. كما نوفر خدمة توصيل سريعة لكافة المناطق المحيطة بالتجمع الخامس عبر الواتساب أو الهاتف المباشر.
            </p>

            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center text-brand-primary shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs text-gray-400 font-bold">العنوان التفصيلي</h4>
                  <p className="text-sm font-semibold text-gray-800 mt-0.5">{config.addressAr}</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center text-brand-primary shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs text-gray-400 font-bold">مواعيد العمل</h4>
                  <p className="text-sm font-semibold text-gray-800 mt-0.5">{config.openingHoursAr}</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center text-brand-primary shrink-0">
                  <Smartphone className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs text-gray-400 font-bold">واتساب المباشر</h4>
                  <a
                    href={`https://wa.me/${config.whatsappNumber.replace('+', '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-bold text-brand-success hover:underline mt-0.5 block"
                  >
                    {config.whatsappNumber}
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-50 flex items-center gap-4 text-xs text-gray-400">
            <span className="font-semibold">توصيل للمنازل: التجمع الخامس، الرحاب، مدينتي، الشروق.</span>
          </div>
        </div>

        {/* Interactive Google Map Box */}
        <div className="lg:col-span-7 rounded-3xl overflow-hidden border border-gray-100 shadow-sm relative min-h-[300px]">
          {/* Stylized Google Maps Iframe */}
          <iframe
            src="https://maps.google.com/maps?q=29.9829375,31.4441094&z=15&output=embed&hl=ar"
            width="100%"
            height="100%"
            style={{ border: 0, minHeight: '350px' }}
            allowFullScreen={true}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title={`${config.pharmacyNameAr} القاهرة الجديدة`}
            className="grayscale-20 contrast-110 opacity-95"
          ></iframe>
        </div>

      </div>
    </section>
  );
}
