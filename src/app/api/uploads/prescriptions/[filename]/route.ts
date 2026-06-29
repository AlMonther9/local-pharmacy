import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { getUploadDir } from '@/lib/upload-utils';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ filename: string }> }
) {
  try {
    const { filename } = await params;
    const uploadDir = getUploadDir();
    const filePath = path.join(uploadDir, filename);

    try {
      const fileBuffer = await fs.readFile(filePath);
      
      // Resolve Content-Type
      const ext = path.extname(filename).toLowerCase();
      let contentType = 'image/png';
      if (ext === '.jpg' || ext === '.jpeg') {
        contentType = 'image/jpeg';
      } else if (ext === '.pdf') {
        contentType = 'application/pdf';
      }

      return new Response(fileBuffer, {
        headers: {
          'Content-Type': contentType,
          'Cache-Control': 'public, max-age=31536000, immutable',
        },
      });
    } catch {
      return NextResponse.json({ error: 'File not found' }, { status: 404 });
    }
  } catch (error) {
    console.error('Error serving prescription file:', error);
    return NextResponse.json({ error: 'Failed to serve file' }, { status: 500 });
  }
}
