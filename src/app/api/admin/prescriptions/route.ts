import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function GET(req: NextRequest) {
  try {
    const uploadDir = path.join(process.cwd(), 'public/uploads/prescriptions');
    
    // If folder doesn't exist, return empty list
    try {
      await fs.access(uploadDir);
    } catch {
      return NextResponse.json({ prescriptions: [] });
    }

    const files = await fs.readdir(uploadDir);
    
    const list = await Promise.all(
      files.map(async (file) => {
        const filePath = path.join(uploadDir, file);
        const stats = await fs.stat(filePath);
        return {
          code: path.basename(file, path.extname(file)),
          filename: file,
          url: `/uploads/prescriptions/${file}`,
          createdAt: stats.mtime.toISOString(),
          size: stats.size
        };
      })
    );

    // Sort by newest first
    list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return NextResponse.json({ prescriptions: list });
  } catch (error) {
    console.error('Error reading prescriptions directory:', error);
    return NextResponse.json({ error: 'Failed to read prescriptions list' }, { status: 500 });
  }
}
