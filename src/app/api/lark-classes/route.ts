import { NextResponse } from 'next/server';
import { fetchLarkClassSessions } from '@/lib/lark';

export const dynamic = 'force-dynamic';

export async function GET() {
  if (!process.env.LARK_APP_ID) return NextResponse.json({ sessions: [] });
  try {
    const sessions = await fetchLarkClassSessions();
    return NextResponse.json({ sessions });
  } catch (err: any) {
    console.error('[lark-classes]', err);
    return NextResponse.json({ sessions: [], error: err?.message ?? String(err) });
  }
}
