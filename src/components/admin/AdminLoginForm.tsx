'use client';

import React from 'react';
import { Lock, Eye, EyeOff, AlertCircle, RefreshCw, ChevronLeft, ArrowRight } from 'lucide-react';

interface AdminLoginFormProps {
  passwordInput: string;
  setPasswordInput: (val: string) => void;
  showPassword: boolean;
  setShowPassword: (val: boolean) => void;
  authError: string;
  isVerifying: boolean;
  handleLoginSubmit: (e: React.FormEvent) => void;
}

export default function AdminLoginForm({
  passwordInput,
  setPasswordInput,
  showPassword,
  setShowPassword,
  authError,
  isVerifying,
  handleLoginSubmit
}: AdminLoginFormProps) {
  return (
    <div className="min-h-screen bg-brand-bg flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-2xl max-w-md w-full relative overflow-hidden animate-in fade-in duration-300">
        <div className="absolute top-0 right-0 left-0 h-2 bg-linear-to-l from-brand-primary to-brand-secondary"></div>

        <div className="text-center mb-8 mt-2">
          <div className="w-14 h-14 bg-teal-50 text-brand-primary rounded-2xl flex items-center justify-center mx-auto mb-4 border border-teal-100/50 shadow-sm">
            <Lock className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-black text-brand-primary">لوحة إدارة الصيدلية</h1>
          <p className="text-xs text-gray-500 mt-1.5 font-medium">يرجى إدخال كلمة المرور للوصول لإعدادات المخزون والمزامنة</p>
        </div>

        <form onSubmit={handleLoginSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">كلمة مرور الإدارة</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                className="w-full pr-4 pl-12 py-3 bg-gray-50 border border-gray-200 focus:border-brand-primary focus:bg-white rounded-xl focus:outline-none text-base text-gray-900 transition-all font-sans"
                disabled={isVerifying}
                autoFocus
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {authError && (
            <div className="bg-rose-50 border border-rose-100 rounded-xl p-3 flex items-center gap-2 text-xs font-semibold text-brand-error animate-shake">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{authError}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={isVerifying || !passwordInput}
            className={`w-full font-bold py-3 px-4 rounded-xl shadow-md transition-all duration-300 text-center flex items-center justify-center gap-2 text-sm md:text-base cursor-pointer ${passwordInput && !isVerifying
                ? 'bg-brand-primary hover:bg-teal-900 text-white shadow-teal-900/10'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed shadow-none'
              }`}
          >
            {isVerifying ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin" />
                <span>جاري التحقق...</span>
              </>
            ) : (
              <>
                <span>دخول لوحة التحكم</span>
                <ChevronLeft className="w-5 h-5" />
              </>
            )}
          </button>
        </form>

        <div className="text-center mt-6 pt-5 border-t border-gray-50">
          <a href="/" className="text-xs font-bold text-gray-400 hover:text-brand-primary flex items-center justify-center gap-1 transition-colors">
            <ArrowRight className="w-4 h-4" />
            <span>العودة للموقع الرئيسي</span>
          </a>
        </div>
      </div>
    </div>
  );
}
