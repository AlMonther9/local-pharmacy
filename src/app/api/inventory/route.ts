import { NextResponse } from 'next/server';
import { getPharmacyInventory } from '@/lib/inventory-service';

export async function GET() {
  try {
    const items = await getPharmacyInventory();
    return NextResponse.json(items);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to fetch inventory' }, { status: 500 });
  }
}
