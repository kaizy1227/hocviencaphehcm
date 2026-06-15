import { NextResponse } from 'next/server';
import { fetchLarkStudents } from '@/lib/lark';

export const dynamic = 'force-dynamic';

export async function GET() {
  if (!process.env.LARK_APP_ID) {
    return NextResponse.json({ students: [] });
  }
  try {
    const students = await fetchLarkStudents();
    return NextResponse.json({ students });
  } catch (err: any) {
    console.error('[lark-students]', err);
    return NextResponse.json({ students: [] });
  }
}
