import path from 'path';
import fs from 'fs/promises';

export function getUploadDir() {
  // Use /tmp for serverless Vercel environments
  if (process.env.VERCEL || process.env.NODE_ENV === 'production') {
    return path.join('/tmp', 'uploads', 'prescriptions');
  }
  return path.join(process.cwd(), 'public', 'uploads', 'prescriptions');
}

export async function ensureUploadDir() {
  const dir = getUploadDir();
  try {
    await fs.mkdir(dir, { recursive: true });
  } catch (err) {
    console.error('Error ensuring upload directory exists:', err);
  }
  return dir;
}
