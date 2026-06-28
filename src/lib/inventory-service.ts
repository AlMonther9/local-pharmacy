import fs from 'fs/promises';
import path from 'path';
import Papa from 'papaparse';
import { PharmacyConfig, PharmacyItem } from './types';
import { normalizeCsvRow } from './csv-helper';

const configPath = path.join(process.cwd(), 'src/data/config.json');
const localInventoryPath = path.join(process.cwd(), 'src/data/local-inventory.json');

// Helper to check if file exists
async function fileExists(filePath: string): Promise<boolean> {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

// Get configurations
export async function getPharmacyConfig(): Promise<PharmacyConfig> {
  try {
    if (await fileExists(configPath)) {
      const data = await fs.readFile(configPath, 'utf-8');
      return JSON.parse(data) as PharmacyConfig;
    }
  } catch (error) {
    console.error('Error reading config file:', error);
  }
  
  // Fallback default config
  return {
    syncSource: 'local-csv',
    googleSheetId: '1tD2mF5WlYVwR3V-qB5C3tF_1F9Sg68T5Hk5Xo-Y46M8',
    whatsappNumber: '+201068359667',
    pharmacyNameAr: "صيدلية د. إسلام",
    pharmacyNameEn: "Dr. Eslam's Pharmacy",
    addressAr: "XCMV+5JH, Unnamed Road, New Cairo 3, Cairo Governorate 4713552",
    openingHoursAr: "مفتوح ٢٤ ساعة طوال أيام الأسبوع",
    phone: "01068359667"
  };
}

// Update configuration settings
export async function updatePharmacyConfig(newConfig: Partial<PharmacyConfig>): Promise<PharmacyConfig> {
  const current = await getPharmacyConfig();
  const updated = { ...current, ...newConfig };
  await fs.writeFile(configPath, JSON.stringify(updated, null, 2), 'utf-8');
  return updated;
}

// Get inventory items using the active sync source
export async function getPharmacyInventory(): Promise<PharmacyItem[]> {
  const config = await getPharmacyConfig();
  
  if (config.syncSource === 'google-sheets') {
    try {
      const sheetUrl = `https://docs.google.com/spreadsheets/d/${config.googleSheetId}/export?format=csv`;
      
      // Fetch public Google Sheet CSV with Next.js ISR cache option (10 mins)
      const res = await fetch(sheetUrl, {
        next: { revalidate: 600 },
        headers: {
          'Cache-Control': 'no-cache',
        }
      });

      if (!res.ok) {
        throw new Error(`Failed to fetch sheet. Status: ${res.status}`);
      }

      const csvText = await res.text();
      
      const parsed = Papa.parse(csvText, {
        header: true,
        skipEmptyLines: true,
      });

      if (parsed.errors && parsed.errors.length > 0) {
        console.warn('CSV parsing warnings:', parsed.errors);
      }

      if (parsed.data && parsed.data.length > 0) {
        const items = parsed.data.map(row => normalizeCsvRow(row));
        return items;
      }
    } catch (error) {
      console.error('Error fetching/parsing Google Sheets, falling back to local inventory:', error);
    }
  }

  // Option B: Read from local storage / file system
  try {
    if (await fileExists(localInventoryPath)) {
      const data = await fs.readFile(localInventoryPath, 'utf-8');
      return JSON.parse(data) as PharmacyItem[];
    }
  } catch (error) {
    console.error('Error reading local inventory file:', error);
  }

  return [];
}

// Update local inventory file (invoked by /admin/upload CSV ingestion)
export async function updateLocalInventory(items: PharmacyItem[]): Promise<void> {
  await fs.writeFile(localInventoryPath, JSON.stringify(items, null, 2), 'utf-8');
}
