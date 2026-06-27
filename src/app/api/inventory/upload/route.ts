import { NextResponse } from 'next/server';
import { getPharmacyConfig, updateLocalInventory } from '@/lib/inventory-service';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { password, items } = body;
    
    if (!password) {
      return NextResponse.json({ error: 'كلمة المرور مطلوبة' }, { status: 400 });
    }
    
    const currentConfig = await getPharmacyConfig();
    
    // Verify password
    if (password !== currentConfig.adminPassword) {
      return NextResponse.json({ error: 'كلمة المرور غير صحيحة' }, { status: 401 });
    }
    
    if (!items || !Array.isArray(items)) {
      return NextResponse.json({ error: 'البيانات غير صالحة' }, { status: 400 });
    }
    
    await updateLocalInventory(items);
    
    return NextResponse.json({ success: true, count: items.length });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to upload inventory' }, { status: 500 });
  }
}
