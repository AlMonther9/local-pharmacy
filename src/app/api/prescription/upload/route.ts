import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { ensureUploadDir } from '@/lib/upload-utils';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    
    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    // Generate random reference code
    const randCode = 'ESLAM-' + Math.floor(1000 + Math.random() * 9000);
    
    // Get file extension
    const ext = path.extname(file.name) || '.png';
    const filename = `${randCode}${ext}`;
    
    // Get writeable upload directory
    const uploadDir = await ensureUploadDir();
    
    // Write buffer to file system
    const buffer = Buffer.from(await file.arrayBuffer());
    const filePath = path.join(uploadDir, filename);
    await fs.writeFile(filePath, buffer);
    
    // Serve dynamically through the API route
    const fileUrl = `/api/uploads/prescriptions/${filename}`;
    
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
