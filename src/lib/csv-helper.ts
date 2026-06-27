import { PharmacyItem } from './types';

// Helper to normalize parsed CSV rows into PharmacyItem objects (safe for server and client)
export function normalizeCsvRow(row: any): PharmacyItem {
  const getVal = (keys: string[]) => {
    for (const key of Object.keys(row)) {
      if (keys.some(k => key.toLowerCase().trim() === k.toLowerCase() || key.trim() === k)) {
        return row[key];
      }
    }
    return undefined;
  };

  const idVal = getVal(['id', 'الرمز', 'كود', 'رقم', 'المعرف']);
  const nameArVal = getVal(['nameNameAr', 'name_ar', 'الاسم بالعربي', 'الاسم العربي', 'الاسم', 'اسم الدواء', 'الاسم العربي للدواء', 'اسم المنتج بالعربية', 'الاسم بالعربية']);
  const nameEnVal = getVal(['nameNameEn', 'name_en', 'الاسم بالانجليزي', 'الاسم الانجليزي', 'الاسم بالإنجليزية', 'اسم المنتج بالإنجليزية', 'الاسم بالإنجليزية']);
  const categoryVal = getVal(['category', 'التصنيف', 'الفئة', 'القسم', 'نوع المنتج']);
  const priceVal = getVal(['price', 'السعر', 'سعر', 'سعر المنتج']);
  const availVal = getVal(['isAvailable', 'available', 'متوفر', 'متاح', 'حالة التوفر', 'الاحقية']);
  const descVal = getVal(['descriptionAr', 'description', 'الوصف', 'وصف', 'الجرعة', 'التفاصيل', 'وصف الدواء']);

  // Handle availability conversion
  let isAvailable = true;
  if (availVal !== undefined) {
    const s = String(availVal).toLowerCase().trim();
    if (s === 'false' || s === '0' || s === 'لا' || s === 'غير متوفر' || s === 'غير متاح' || s === 'out of stock' || s === 'نافذ') {
      isAvailable = false;
    }
  }

  // Handle price conversion
  let price = 0;
  if (priceVal !== undefined) {
    // Remove non-numeric characters except decimals
    price = parseFloat(String(priceVal).replace(/[^\d.]/g, '')) || 0;
  }

  return {
    id: idVal ? String(idVal).trim() : 'item-' + Math.random().toString(36).substring(2, 9),
    nameNameAr: nameArVal ? String(nameArVal).trim() : 'دواء غير مسمى',
    nameNameEn: nameEnVal ? String(nameEnVal).trim() : undefined,
    category: categoryVal ? String(categoryVal).trim() : 'عام',
    price: price,
    isAvailable: isAvailable,
    descriptionAr: descVal ? String(descVal).trim() : undefined
  };
}
