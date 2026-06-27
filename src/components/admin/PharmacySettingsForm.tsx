'use client';

import React from 'react';
import { Settings, Save, RefreshCw } from 'lucide-react';

interface PharmacySettingsFormProps {
  pharmacyNameAr: string;
  setPharmacyNameAr: (val: string) => void;
  pharmacyNameEn: string;
  setPharmacyNameEn: (val: string) => void;
  whatsappNumber: string;
  setWhatsappNumber: (val: string) => void;
  phone: string;
  setPhone: (val: string) => void;
  addressAr: string;
  setAddressAr: (val: string) => void;
  openingHoursAr: string;
  setOpeningHoursAr: (val: string) => void;
  newAdminPassword: string;
  setNewAdminPassword: (val: string) => void;
  isSavingSettings: boolean;
  handleSaveSettings: (e: React.FormEvent) => void;
}

export default function PharmacySettingsForm({
  pharmacyNameAr,
  setPharmacyNameAr,
  pharmacyNameEn,
  setPharmacyNameEn,
  whatsappNumber,
  setWhatsappNumber,
  phone,
  setPhone,
  addressAr,
  setAddressAr,
  openingHoursAr,
  setOpeningHoursAr,
  newAdminPassword,
  setNewAdminPassword,
  isSavingSettings,
  handleSaveSettings
}: PharmacySettingsFormProps) {
  return (
    <form onSubmit={handleSaveSettings} className="bg-white rounded-3xl border border-gray-100 p-6 md:p-8 shadow-sm space-y-5">
      <h2 className="text-lg font-black text-brand-primary mb-1 flex items-center gap-2 border-b border-gray-50 pb-4">
        <Settings className="w-5 h-5 text-brand-secondary" />
        <span>إعدادات الصيدلية العامة</span>
      </h2>

      <div>
        <label className="block text-xs font-bold text-gray-700 mb-1.5">اسم الصيدلية (بالعربية)</label>
        <input
          type="text"
          required
          value={pharmacyNameAr}
          onChange={(e) => setPharmacyNameAr(e.target.value)}
          className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 focus:border-brand-primary focus:bg-white rounded-xl focus:outline-none text-sm text-gray-900 transition-all"
        />
      </div>

      <div>
        <label className="block text-xs font-bold text-gray-700 mb-1.5">اسم الصيدلية (بالإنجليزية)</label>
        <input
          type="text"
          required
          value={pharmacyNameEn}
          onChange={(e) => setPharmacyNameEn(e.target.value)}
          className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 focus:border-brand-primary focus:bg-white rounded-xl focus:outline-none text-sm text-gray-900 transition-all font-sans"
        />
      </div>

      <div>
        <label className="block text-xs font-bold text-gray-700 mb-1.5">رقم واتساب (تلقي الطلبات والروشتات)</label>
        <input
          type="text"
          required
          placeholder="مثال: +201001234567"
          value={whatsappNumber}
          onChange={(e) => setWhatsappNumber(e.target.value)}
          className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 focus:border-brand-primary focus:bg-white rounded-xl focus:outline-none text-sm text-gray-900 transition-all font-sans"
        />
        <span className="text-[10px] text-gray-400 mt-1 block">ملاحظة: اكتب الرقم بالصيغة الدولية متضمناً كود الدولة (مثل +20).</span>
      </div>

      <div>
        <label className="block text-xs font-bold text-gray-700 mb-1.5">رقم هاتف الاتصال المباشر</label>
        <input
          type="text"
          required
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 focus:border-brand-primary focus:bg-white rounded-xl focus:outline-none text-sm text-gray-900 transition-all font-sans"
        />
      </div>

      <div>
        <label className="block text-xs font-bold text-gray-700 mb-1.5">العنوان الجغرافي</label>
        <input
          type="text"
          required
          value={addressAr}
          onChange={(e) => setAddressAr(e.target.value)}
          className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 focus:border-brand-primary focus:bg-white rounded-xl focus:outline-none text-sm text-gray-900 transition-all"
        />
      </div>

      <div>
        <label className="block text-xs font-bold text-gray-700 mb-1.5">مواعيد وساعات العمل</label>
        <input
          type="text"
          required
          value={openingHoursAr}
          onChange={(e) => setOpeningHoursAr(e.target.value)}
          className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 focus:border-brand-primary focus:bg-white rounded-xl focus:outline-none text-sm text-gray-900 transition-all"
        />
      </div>

      <div className="border-t border-gray-50 pt-4">
        <label className="block text-xs font-bold text-rose-700 mb-1.5">تغيير كلمة مرور الإدارة (اختياري)</label>
        <input
          type="password"
          placeholder="اتركها فارغة إذا لم ترغب في التغيير"
          value={newAdminPassword}
          onChange={(e) => setNewAdminPassword(e.target.value)}
          className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 focus:border-rose-500 focus:bg-white rounded-xl focus:outline-none text-sm text-gray-900 transition-all font-sans"
        />
      </div>

      <div className="pt-2">
        <button
          type="submit"
          disabled={isSavingSettings}
          className="w-full bg-brand-primary hover:bg-teal-900 text-white font-bold py-3 px-4 rounded-xl shadow-md transition-all duration-300 flex items-center justify-center gap-2 text-sm border border-teal-800 cursor-pointer"
        >
          {isSavingSettings ? (
            <>
              <RefreshCw className="w-5 h-5 animate-spin" />
              <span>جاري حفظ الإعدادات...</span>
            </>
          ) : (
            <>
              <Save className="w-5 h-5" />
              <span>حفظ كافة التعديلات</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}
