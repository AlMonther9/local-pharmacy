import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    
    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    // Generate random reference code
    const randCode = 'MONTHER-' + Math.floor(1000 + Math.random() * 9000);
    
    // Get file extension
    const ext = path.extname(file.name) || '.png';
    const filename = `${randCode}${ext}`;
    
    // Directory path in public uploads
    const uploadDir = path.join(process.cwd(), 'public/uploads/prescriptions');
    
    // Ensure directory exists
    await fs.mkdir(uploadDir, { recursive: true });
    
    // Write buffer to file system
    const buffer = Buffer.from(await file.arrayBuffer());
    const filePath = path.join(uploadDir, filename);
    await fs.writeFile(filePath, buffer);
    
    const fileUrl = `/uploads/prescriptions/${filename}`;
    
    return NextResponse.json({ 
      success: true, 
      code: randCode, 
      fileUrl 
    });
  } catch (error) {
    console.error('Error uploading prescription:', error);
    return NextResponse.json({ error: 'Failed to process upload' }, { status: 500 });
  }
}
