export interface PharmacyItem {
  id: string;
  nameNameAr: string;      // Arabic medication name (e.g., بنادول إكسترا)
  nameNameEn?: string;     // Optional English name (e.g., Panadol Extra)
  category: string;        // e.g., أدوية, مستحضرات تجميل, رعاية صحية
  price: number;           // Price in EGP
  isAvailable: boolean;    // Availability state
  descriptionAr?: string;  // Simple Arabic description or dosage details
}

export interface PharmacyConfig {
  syncSource: 'local-csv' | 'google-sheets';
  googleSheetId: string;
  adminPassword?: string;
  whatsappNumber: string;
  pharmacyNameAr: string;
  pharmacyNameEn: string;
  addressAr: string;
  openingHoursAr: string;
  phone: string;
}
