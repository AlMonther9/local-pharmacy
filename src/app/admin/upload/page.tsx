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

      </main>
    </div>
  );
}
