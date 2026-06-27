import { NextResponse } from 'next/server';
import { getPharmacyConfig, updatePharmacyConfig } from '@/lib/inventory-service';

export async function GET() {
  try {
    const config = await getPharmacyConfig();
    // Exclude password in standard GET response for safety
    const safeConfig = { ...config };
    delete safeConfig.adminPassword;
    return NextResponse.json(safeConfig);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to fetch config' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { password, ...newConfig } = body;
    
    const currentConfig = await getPharmacyConfig();
    
    // Verify password
    if (password !== currentConfig.adminPassword) {
      return NextResponse.json({ error: 'كلمة المرور غير صحيحة' }, { status: 401 });
    }
    
    const updated = await updatePharmacyConfig(newConfig);
    
    // Return config without password
    const safeConfig = { ...updated };
    delete safeConfig.adminPassword;
    
    return NextResponse.json(safeConfig);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to update config' }, { status: 500 });
  }
}
