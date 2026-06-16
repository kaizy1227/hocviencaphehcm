import { NextResponse } from 'next/server';
import { fetchLarkVideos } from '@/lib/lark';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const videos = await fetchLarkVideos();
    return NextResponse.json({ ok: true, videos });
  } catch (err: any) {
    console.error('[api/videos]', err);
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
  }
}
