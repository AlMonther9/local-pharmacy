import { NextResponse } from 'next/server';
import { getPharmacyConfig } from '@/lib/inventory-service';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { password } = body;
    
    if (!password) {
      return NextResponse.json({ authenticated: false, error: 'كلمة المرور مطلوبة' }, { status: 400 });
    }
    
    const currentConfig = await getPharmacyConfig();
    
    if (password === currentConfig.adminPassword) {
      return NextResponse.json({ authenticated: true });
    } else {
      return NextResponse.json({ authenticated: false, error: 'كلمة المرور غير صحيحة' }, { status: 401 });
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'حدث خطأ في الخادم' }, { status: 500 });
  }
}
