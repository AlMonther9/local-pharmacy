'use client';

import React, { useState, useRef } from 'react';
import { 
  FileSpreadsheet, 
  HelpCircle, 
  Save, 
  Upload, 
  AlertCircle, 
  Info, 
  RefreshCw 
} from 'lucide-react';
import Papa from 'papaparse';
import { PharmacyItem } from '@/lib/types';
import { normalizeCsvRow } from '@/lib/csv-helper';

interface SyncSettingsProps {
  syncSource: 'local-csv' | 'google-sheets';
  setSyncSource: (val: 'local-csv' | 'google-sheets') => void;
  googleSheetId: string;
  setGoogleSheetId: (val: string) => void;
  isSavingSettings: boolean;
  handleSaveSettings: (e: React.FormEvent) => void;
  onSaveInventory: (items: PharmacyItem[]) => Promise<boolean>;
}

export default function SyncSettings({
  syncSource,
  setSyncSource,
  googleSheetId,
  setGoogleSheetId,
  isSavingSettings,
  handleSaveSettings,
  onSaveInventory
}: SyncSettingsProps) {
  // Local CSV parsing states
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [parsedItems, setParsedItems] = useState<PharmacyItem[]>([]);
  const [csvError, setCsvError] = useState('');
  const [isUploadingCsv, setIsUploadingCsv] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Drag and drop events
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.name.endsWith('.csv')) {
        processCsvFile(file);
      } else {
        setCsvError('يرجى اختيار ملف بصيغة CSV فقط.');
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processCsvFile(e.target.files[0]);
    }
  };

  // Process CSV File with PapaParse
  const processCsvFile = (file: File) => {
    setCsvFile(file);
    setCsvError('');
    setParsedItems([]);
    
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        if (results.errors && results.errors.length > 0) {
          console.warn('CSV parsing warnings:', results.errors);
        }
        
        if (!results.data || results.data.length === 0) {
          setCsvError('الملف فارغ أو غير صالح.');
          return;
        }

        const items = results.data.map(row => normalizeCsvRow(row));
        setParsedItems(items);
      },
      error: (error) => {
        setCsvError('حدث خطأ أثناء قراءة الملف: ' + error.message);
      }
    });
  };

  const handleUploadSubmit = async () => {
    if (parsedItems.length === 0) return;
    setIsUploadingCsv(true);
    const success = await onSaveInventory(parsedItems);
    setIsUploadingCsv(false);
    if (success) {
      setCsvFile(null);
      setParsedItems([]);
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-gray-100 p-6 md:p-8 shadow-sm">
      <h2 className="text-lg font-black text-brand-primary mb-2 flex items-center gap-2">
        <FileSpreadsheet className="w-5 h-5 text-brand-secondary" />
        <span>مزامنة وتغذية مخزون المنتجات</span>
      </h2>
      <p className="text-xs text-gray-500 mb-6 font-medium">
        اختر طريقة استيراد الأدوية والمنتجات المناسبة لصيدليتك من الخيارين أدناه:
      </p>

      {/* Sync source selector tabs */}
      <div className="grid grid-cols-2 gap-3 p-1.5 bg-gray-50 rounded-2xl mb-8 border border-gray-200/50">
        <button
          type="button"
          onClick={() => setSyncSource('google-sheets')}
          className={`py-3 px-4 rounded-xl text-xs md:text-sm font-black transition-all duration-300 cursor-pointer ${
            syncSource === 'google-sheets'
              ? 'bg-white text-brand-primary shadow-sm border border-gray-200/30'
              : 'text-gray-500 hover:text-gray-800'
          }`}
        >
          جداول جوجل (Google Sheets)
        </button>
        <button
          type="button"
          onClick={() => setSyncSource('local-csv')}
          className={`py-3 px-4 rounded-xl text-xs md:text-sm font-black transition-all duration-300 cursor-pointer ${
            syncSource === 'local-csv'
              ? 'bg-white text-brand-primary shadow-sm border border-gray-200/30'
              : 'text-gray-500 hover:text-gray-800'
          }`}
        >
          ملف CSV محلي (POS Export)
        </button>
      </div>

      {/* Option A: Google Sheets Sync view */}
      {syncSource === 'google-sheets' && (
        <div className="space-y-6">
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-2">معرف جدول بيانات جوجل (Spreadsheet ID)</label>
            <input
              type="text"
              placeholder="مثال: 1tD2mF5WlYVwR3V-qB5C3tF_1F9Sg68T5Hk5Xo-Y46M8"
              value={googleSheetId}
              onChange={(e) => setGoogleSheetId(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 focus:border-brand-primary focus:bg-white rounded-xl focus:outline-none text-sm text-gray-900 transition-all font-sans"
            />
          </div>

          {/* Helpful Instruction Accordion */}
          <div className="bg-teal-50/50 border border-teal-100/50 rounded-2xl p-4.5">
            <h4 className="text-xs font-bold text-brand-primary flex items-center gap-1.5 mb-2.5">
              <HelpCircle className="w-4 h-4 text-brand-secondary shrink-0" />
              <span>كيفية ربط جدول بيانات جوجل بالصيدلية؟</span>
            </h4>
            <ol className="text-xs text-teal-900 space-y-2 list-decimal list-inside pr-1 font-medium leading-relaxed">
              <li>أنشئ جدول بيانات جديد بـ Google Sheets يحتوي على الأعمدة المطلوبة باللغة العربية أو الإنجليزية.</li>
              <li>اضغط على زر <span className="font-bold">مشاركة (Share)</span> بأعلى اليسار، واجعله متاحاً لـ <span className="font-bold">"أي شخص لديه الرابط" (Anyone with the link can view)</span>.</li>
              <li>انسخ رمز المعرف الطويل الموجود بداخل رابط الملف. الرابط يكون بالشكل التالي:
                <div className="bg-white/80 p-2 rounded-lg border border-teal-100 font-sans text-[10px] break-all my-1.5 select-all text-gray-600">
                  https://docs.google.com/spreadsheets/d/<span className="font-black text-brand-primary underline">معرف_الملف_الخاص_بك</span>/edit...
                </div>
              </li>
              <li>الصق المعرف في الحقل أعلاه واضغط على زر حفظ الإعدادات. سيتم تفعيل المزامنة وتحديث كتالوج الصيدلية تلقائياً كل ١٠ دقائق.</li>
            </ol>
          </div>

          <div className="flex justify-end pt-3">
            <button
              onClick={handleSaveSettings}
              disabled={isSavingSettings || !googleSheetId}
              className="bg-brand-primary hover:bg-teal-900 text-white font-bold py-3 px-6 rounded-xl shadow-md transition-all duration-300 flex items-center gap-2 text-sm border border-teal-800 cursor-pointer"
            >
              <Save className="w-4 h-4 text-brand-secondary" />
              <span>حفظ إعدادات المزامنة</span>
            </button>
          </div>
        </div>
      )}

      {/* Option B: Local CSV Sync view */}
      {syncSource === 'local-csv' && (
        <div className="space-y-6">
          {/* Drag and Drop Zone */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-3xl p-8 text-center cursor-pointer transition-all duration-300 flex flex-col items-center justify-center ${
              isDragOver 
                ? 'border-brand-primary bg-teal-50/20' 
                : 'border-gray-200 hover:border-brand-primary/50 bg-gray-50/50 hover:bg-teal-50/10'
            }`}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".csv"
              className="hidden"
            />
            <div className="w-12 h-12 bg-white rounded-2xl shadow-sm border border-gray-100 flex items-center justify-center mb-3 text-brand-primary">
              <Upload className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-bold text-gray-800 mb-1">
              اسحب ملف مخزون CSV هنا أو اضغط للتصفح
            </h4>
            <p className="text-xs text-gray-400 font-medium">
              يدعم ملفات POS المصدرة بصيغة CSV فقط.
            </p>
          </div>

          {csvError && (
            <div className="bg-rose-50 border border-rose-100 rounded-xl p-3 flex items-center gap-2 text-xs font-semibold text-brand-error">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{csvError}</span>
            </div>
          )}

          {/* CSV Instructions Info */}
          <div className="bg-gray-50 border border-gray-100 rounded-2xl p-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-2">
              <h4 className="text-xs font-bold text-gray-700 flex items-center gap-1.5">
                <Info className="w-4 h-4 text-brand-primary shrink-0" />
                <span>تنسيق الأعمدة المطلوبة بالملف (CSV Headers):</span>
              </h4>
              <a 
                href="/sample-inventory.csv" 
                download="sample-inventory.csv"
                className="text-[11px] text-brand-primary hover:underline font-bold bg-teal-50 px-2.5 py-1 rounded-lg border border-teal-100/50"
              >
                📥 تحميل نموذج CSV جاهز للتجربة
              </a>
            </div>
            <p className="text-xs text-gray-500 leading-relaxed font-medium">
              البرنامج ذكي ويقبل العناوين بالعربية أو الإنجليزية. يفضل تواجد الأعمدة التالية:
              <br />
              <span className="font-mono bg-white px-1.5 py-0.5 rounded border border-gray-200 text-[10px] mt-1 inline-block">
                id, nameNameAr, nameNameEn, category, price, isAvailable, descriptionAr
              </span>
              <br />
              أو المقابل لها بالعربية مثل: <span className="font-bold">اسم الدواء، الاسم بالإنجليزية، التصنيف، السعر، متوفر، وصف الدواء</span>.
            </p>
          </div>

          {/* CSV Preview Table */}
          {parsedItems.length > 0 && (
            <div className="space-y-4 border-t border-gray-100 pt-5 animate-in fade-in duration-200">
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="text-xs font-bold text-gray-700">معاينة البيانات المحللة</h4>
                  <p className="text-[10px] text-gray-400 font-medium">تم رصد {parsedItems.length} دواء متاح للرفع</p>
                </div>
                <span className="bg-teal-50 text-brand-primary text-[10px] font-bold px-2.5 py-1 rounded-lg">
                  معاينة أولى 5 منتجات
                </span>
              </div>

              <div className="border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-right border-collapse text-xs">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-100 text-gray-600 font-bold">
                        <th className="py-2.5 px-3">اسم الدواء</th>
                        <th className="py-2.5 px-3">القسم</th>
                        <th className="py-2.5 px-3 text-center">السعر</th>
                        <th className="py-2.5 px-3 text-center">التوفر</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50 bg-white">
                      {parsedItems.slice(0, 5).map((item, idx) => (
                        <tr key={idx} className="hover:bg-gray-50/50">
                          <td className="py-2.5 px-3">
                            <div className="font-bold text-gray-800">{item.nameNameAr}</div>
                            {item.nameNameEn && <div className="text-[10px] text-gray-400 font-sans">{item.nameNameEn}</div>}
                          </td>
                          <td className="py-2.5 px-3 text-gray-500 font-medium">{item.category}</td>
                          <td className="py-2.5 px-3 text-center font-bold text-brand-primary">{item.price} ج.م</td>
                          <td className="py-2.5 px-3 text-center">
                            <span className={`inline-block w-2 h-2 rounded-full ${item.isAvailable ? 'bg-brand-success' : 'bg-brand-error'}`}></span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setCsvFile(null);
                    setParsedItems([]);
                  }}
                  className="bg-white hover:bg-gray-50 text-gray-500 border border-gray-200 font-bold py-2.5 px-4 rounded-xl text-xs transition-colors cursor-pointer"
                >
                  إلغاء الملف
                </button>
                
                <button
                  onClick={handleUploadSubmit}
                  disabled={isUploadingCsv}
                  className="bg-brand-success hover:bg-emerald-700 text-white font-bold py-2.5 px-6 rounded-xl shadow-md transition-all duration-300 flex items-center gap-2 text-xs border border-emerald-600 cursor-pointer"
                >
                  {isUploadingCsv ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>جاري حفظ المخزون...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>حفظ ورفع المخزون الحالي</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
