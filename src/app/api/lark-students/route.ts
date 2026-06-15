import { NextResponse } from 'next/server';
import { fetchLarkStudents } from '@/lib/lark';

// Revalidate every 10 minutes — tmp_urls from Lark last ~30 min
export const revalidate = 600;

export async function GET() {
  if (!process.env.LARK_APP_ID) {
    return NextResponse.json({ students: [] });
  }
  try {
    const students = await fetchLarkStudents();
    return NextResponse.json({ students });
  } catch (err) {
    console.error('[lark-students]', err);
    return NextResponse.json({ students: [] });
  }
}
