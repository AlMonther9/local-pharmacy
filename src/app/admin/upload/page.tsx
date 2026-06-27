'use client';

import React, { useState, useEffect } from 'react';
import { CheckCircle2, AlertCircle, RefreshCw, X } from 'lucide-react';
import { PharmacyConfig, PharmacyItem } from '@/lib/types';

import AdminLoginForm from '@/components/admin/AdminLoginForm';
import AdminHeader from '@/components/admin/AdminHeader';
import SyncSettings from '@/components/admin/SyncSettings';
import PharmacySettingsForm from '@/components/admin/PharmacySettingsForm';

export default function AdminPage() {
  // Auth state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  // Configuration settings
  const [config, setConfig] = useState<PharmacyConfig | null>(null);
  const [isLoadingConfig, setIsLoadingConfig] = useState(true);

  // Local form values
  const [syncSource, setSyncSource] = useState<'local-csv' | 'google-sheets'>('local-csv');
  const [googleSheetId, setGoogleSheetId] = useState('');
  const [pharmacyNameAr, setPharmacyNameAr] = useState('');
  const [pharmacyNameEn, setPharmacyNameEn] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [phone, setPhone] = useState('');
  const [addressAr, setAddressAr] = useState('');
  const [openingHoursAr, setOpeningHoursAr] = useState('');
  const [newAdminPassword, setNewAdminPassword] = useState('');

  // Global action status
  const [actionSuccess, setActionSuccess] = useState('');
  const [actionError, setActionError] = useState('');
  const [isSavingSettings, setIsSavingSettings] = useState(false);

  // Uploaded prescriptions list
  const [prescriptions, setPrescriptions] = useState<{ code: string; filename: string; url: string; createdAt: string; size: number }[]>([]);
  const [isLoadingPrescriptions, setIsLoadingPrescriptions] = useState(false);

  // Check sessionStorage for existing auth
  useEffect(() => {
    const savedPassword = sessionStorage.getItem('admin_pwd');
    if (savedPassword) {
      verifyPassword(savedPassword, true);
    } else {
      setIsLoadingConfig(false);
    }
  }, []);

  // Fetch config once authenticated
  const fetchConfig = async () => {
    try {
      const res = await fetch('/api/config');
      if (res.ok) {
        const data = await res.json();
        setConfig(data);
        setSyncSource(data.syncSource);
        setGoogleSheetId(data.googleSheetId);
        setPharmacyNameAr(data.pharmacyNameAr);
        setPharmacyNameEn(data.pharmacyNameEn);
        setWhatsappNumber(data.whatsappNumber);
        setPhone(data.phone);
        setAddressAr(data.addressAr);
        setOpeningHoursAr(data.openingHoursAr);
      }
    } catch (err) {
      console.error('Failed to load configuration:', err);
    } finally {
      setIsLoadingConfig(false);
    }
  };

  const fetchPrescriptions = async () => {
    setIsLoadingPrescriptions(true);
    try {
      const res = await fetch('/api/admin/prescriptions');
      if (res.ok) {
        const data = await res.json();
        setPrescriptions(data.prescriptions || []);
      }
    } catch (err) {
      console.error('Failed to load prescriptions:', err);
    } finally {
      setIsLoadingPrescriptions(false);
    }
  };

  // Password verification
  const verifyPassword = async (pwd: string, bypassSession = false) => {
    setIsVerifying(true);
    setAuthError('');
    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: pwd })
      });
      const data = await res.json();

      if (res.ok && data.authenticated) {
        setIsAuthenticated(true);
        if (!bypassSession) {
          sessionStorage.setItem('admin_pwd', pwd);
        }
        await fetchConfig();
        await fetchPrescriptions();
      } else {
        setAuthError(data.error || 'كلمة المرور غير صحيحة');
        if (bypassSession) {
          sessionStorage.removeItem('admin_pwd');
          setIsLoadingConfig(false);
        }
      }
    } catch (err) {
      setAuthError('حدث خطأ في الاتصال بالخادم');
      setIsLoadingConfig(false);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwordInput.trim()) return;
    verifyPassword(passwordInput);
  };

  const handleLogout = () => {
    sessionStorage.removeItem('admin_pwd');
    setIsAuthenticated(false);
    setPasswordInput('');
    setConfig(null);
  };

  // Trigger cache revalidation on the home route
  const triggerRevalidate = async () => {
    try {
      // Fetch home page with no-cache in background to refresh ISR cache
      await fetch('/', { cache: 'no-store' });
    } catch (e) {
      console.warn('ISR revalidation trigger background failed', e);
    }
  };

  // Upload inventory items to backend
  const handleSaveInventory = async (items: PharmacyItem[]): Promise<boolean> => {
    setActionSuccess('');
    setActionError('');

    const pwd = sessionStorage.getItem('admin_pwd') || '';

    try {
      const res = await fetch('/api/inventory/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          password: pwd,
          items
        })
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setActionSuccess(`تم حفظ المخزون بنجاح! تم تحميل ${data.count} منتج.`);
        await triggerRevalidate();
        return true;
      } else {
        setActionError(data.error || 'فشل حفظ المخزون');
        return false;
      }
    } catch (err) {
      setActionError('حدث خطأ في الاتصال بالخادم أثناء الحفظ');
      return false;
    }
  };

  // Save Config Settings
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingSettings(true);
    setActionSuccess('');
    setActionError('');

    const pwd = sessionStorage.getItem('admin_pwd') || '';

    const updatedPayload: any = {
      syncSource,
      googleSheetId,
      pharmacyNameAr,
      pharmacyNameEn,
      whatsappNumber,
      phone,
      addressAr,
      openingHoursAr,
    };

    // If changing password
    if (newAdminPassword.trim()) {
      updatedPayload.adminPassword = newAdminPassword;
    }

    try {
      const res = await fetch('/api/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          password: pwd,
          ...updatedPayload
        })
      });

      const data = await res.json();

      if (res.ok) {
        setActionSuccess('تم حفظ إعدادات الصيدلية بنجاح!');
        if (newAdminPassword.trim()) {
          sessionStorage.setItem('admin_pwd', newAdminPassword);
          setNewAdminPassword('');
        }
        setConfig(data);
        await triggerRevalidate();
      } else {
        setActionError(data.error || 'فشل حفظ الإعدادات');
      }
    } catch (err) {
      setActionError('حدث خطأ في الاتصال بالخادم أثناء الحفظ');
    } finally {
      setIsSavingSettings(false);
    }
  };

  // 1. Unauthenticated Login screen
  if (!isAuthenticated) {
    return (
      <AdminLoginForm
        passwordInput={passwordInput}
        setPasswordInput={setPasswordInput}
        showPassword={showPassword}
        setShowPassword={setShowPassword}
        authError={authError}
        isVerifying={isVerifying}
        handleLoginSubmit={handleLoginSubmit}
      />
    );
  }

  // 2. Loading config settings state spinner
  if (isLoadingConfig) {
    return (
      <div className="min-h-screen bg-brand-bg flex items-center justify-center">
        <div className="text-center flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-brand-primary border-t-transparent rounded-full animate-spin mb-4"></div>
          <span className="text-sm font-bold text-gray-600">جاري تحميل إعدادات لوحة التحكم...</span>
        </div>
      </div>
    );
  }

  // 3. Authenticated Dashboard Layout
  return (
    <div className="min-h-screen bg-brand-bg flex flex-col">
      {/* Top Header Navigation */}
      <AdminHeader handleLogout={handleLogout} />

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 grow grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

        {/* Alerts Center */}
        <div className="lg:col-span-12 space-y-4 empty:hidden">
          {actionSuccess && (
            <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-4 flex items-start gap-3 text-sm font-bold text-brand-success shadow-sm animate-in slide-in-from-top-4 duration-300">
              <CheckCircle2 className="w-5 h-5 shrink-0 text-brand-success mt-0.5" />
              <div className="grow">
                <span>{actionSuccess}</span>
              </div>
              <button onClick={() => setActionSuccess('')} className="text-brand-success/70 hover:text-brand-success cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>
          )}

          {actionError && (
            <div className="bg-rose-50 border border-rose-100 rounded-2xl p-4 flex items-start gap-3 text-sm font-bold text-brand-error shadow-sm animate-in slide-in-from-top-4 duration-300">
              <AlertCircle className="w-5 h-5 shrink-0 text-brand-error mt-0.5" />
              <div className="grow">
                <span>{actionError}</span>
              </div>
              <button onClick={() => setActionError('')} className="text-brand-error/70 hover:text-brand-error cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>

        {/* Sync Settings Column */}
        <section className="lg:col-span-7 space-y-6">
          <SyncSettings
            syncSource={syncSource}
            setSyncSource={setSyncSource}
            googleSheetId={googleSheetId}
            setGoogleSheetId={setGoogleSheetId}
            isSavingSettings={isSavingSettings}
            handleSaveSettings={handleSaveSettings}
            onSaveInventory={handleSaveInventory}
          />
        </section>

        {/* Pharmacy General Settings Form Column */}
        <section className="lg:col-span-5">
          <PharmacySettingsForm
            pharmacyNameAr={pharmacyNameAr}
            setPharmacyNameAr={setPharmacyNameAr}
            pharmacyNameEn={pharmacyNameEn}
            setPharmacyNameEn={setPharmacyNameEn}
            whatsappNumber={whatsappNumber}
            setWhatsappNumber={setWhatsappNumber}
            phone={phone}
            setPhone={setPhone}
            addressAr={addressAr}
            setAddressAr={setAddressAr}
            openingHoursAr={openingHoursAr}
            setOpeningHoursAr={setOpeningHoursAr}
            newAdminPassword={newAdminPassword}
            setNewAdminPassword={setNewAdminPassword}
            isSavingSettings={isSavingSettings}
            handleSaveSettings={handleSaveSettings}
          />
        </section>

        {/* Uploaded Prescriptions List Section */}
        <section className="lg:col-span-12 bg-white rounded-3xl border border-gray-100 shadow-xs p-6 mt-2">
          <div className="flex justify-between items-center mb-6">
            <button
              onClick={fetchPrescriptions}
              disabled={isLoadingPrescriptions}
              className="text-xs font-bold text-brand-primary hover:text-teal-950 flex items-center gap-1.5 cursor-pointer bg-teal-50 border border-teal-100/50 hover:bg-teal-100/40 px-3 py-1.5 rounded-xl transition-all"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoadingPrescriptions ? 'animate-spin' : ''}`} />
              <span>تحديث القائمة</span>
            </button>
            <div className="text-right">
              <h3 className="text-lg font-extrabold text-brand-primary">📋 الروشتات الطبية المرفوعة من العملاء</h3>
              <p className="text-xs text-gray-400 mt-1">اضغط على عرض الروشتة لمراجعة صورة الوصفة الطبية التي أرسلها العميل</p>
            </div>
          </div>

          {isLoadingPrescriptions ? (
            <div className="py-12 text-center text-gray-500 font-bold text-sm">جاري تحميل الروشتات المرفوعة...</div>
          ) : prescriptions.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-right border-collapse">
                <thead>
                  <tr className="border-b border-gray-100 text-xs font-extrabold text-gray-400">
                    <th className="pb-3 text-left">الإجراء</th>
                    <th className="pb-3">حجم الملف</th>
                    <th className="pb-3">تاريخ الرفع</th>
                    <th className="pb-3">كود الطلب المرجعي</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 text-sm font-semibold text-gray-700">
                  {prescriptions.map((p) => (
                    <tr key={p.code} className="hover:bg-gray-50/50 transition-colors">
                      <td className="py-4 text-left">
                        <a
                          href={p.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-brand-primary hover:bg-teal-950 text-white text-xs font-bold px-4 py-2 rounded-xl transition-all inline-block cursor-pointer shadow-sm shadow-teal-950/5"
                        >
                          عرض الروشتة ↗
                        </a>
                      </td>
                      <td className="py-4 text-gray-500 font-sans">
                        {(p.size / 1024).toFixed(1)} KB
                      </td>
                      <td className="py-4 text-gray-500 font-sans">
                        {new Date(p.createdAt).toLocaleString('ar-EG', {
                          dateStyle: 'medium',
                          timeStyle: 'short'
                        })}
                      </td>
                      <td className="py-4 font-bold text-teal-950 font-sans">
                        {p.code}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="py-12 text-center text-gray-400 font-bold text-sm bg-gray-50/30 rounded-2xl border border-dashed border-gray-100">
              لا توجد روشتات طبية مرفوعة حالياً.
            </div>
          )}
        </section>

      </main>
    </div>
  );
}
