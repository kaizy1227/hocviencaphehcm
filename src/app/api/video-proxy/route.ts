import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const ALLOWED_HOSTS = ['.larksuite.com', '.feishu.cn', '.sg.larksuite.com'];

export async function GET(req: NextRequest) {
  const rawUrl = req.nextUrl.searchParams.get('url');
  if (!rawUrl) return new NextResponse('missing url', { status: 400 });

  try {
    const parsed = new URL(rawUrl);
    const allowed = ALLOWED_HOSTS.some(h => parsed.hostname.endsWith(h));
    if (!allowed) return new NextResponse('forbidden host', { status: 403 });
  } catch {
    return new NextResponse('invalid url', { status: 400 });
  }

  try {
    // Chỉ lấy 2MB đầu — đủ để browser đọc moov atom (faststart) và render frame đầu
    const upstream = await fetch(rawUrl, {
      headers: { Range: 'bytes=0-2097151' },
    });

    const data = await upstream.arrayBuffer();
    const contentType = upstream.headers.get('Content-Type') ?? 'video/mp4';

    return new NextResponse(data, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'private, max-age=300',
      },
    });
  } catch (e: any) {
    return new NextResponse(e.message ?? 'proxy error', { status: 500 });
  }
}
