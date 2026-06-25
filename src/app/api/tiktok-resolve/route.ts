import { NextResponse } from 'next/server';

// Admin-only helper: dùng TikTok oEmbed (miễn phí, không cần key) để resolve 1 link TikTok
// (kể cả link rút gọn vt.tiktok.com) → lấy video_id, tiêu đề, thumbnail, tên kênh.
export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  const raw = new URL(req.url).searchParams.get('url')?.trim();
  if (!raw || !/tiktok\.com/i.test(raw)) {
    return NextResponse.json({ ok: false, error: 'Link TikTok không hợp lệ.' }, { status: 200 });
  }

  try {
    const res = await fetch(
      `https://www.tiktok.com/oembed?url=${encodeURIComponent(raw)}`,
      { headers: { 'User-Agent': 'Mozilla/5.0' }, next: { revalidate: 0 } }
    );

    if (!res.ok) {
      return NextResponse.json({ ok: false, error: `TikTok oEmbed lỗi ${res.status}` }, { status: 200 });
    }

    const d = await res.json();
    const html: string = d.html ?? '';
    const videoId =
      html.match(/data-video-id="(\d+)"/)?.[1] ||
      raw.match(/\/video\/(\d+)/)?.[1] ||
      '';
    const canonical = html.match(/cite="([^"]+)"/)?.[1] || raw;

    return NextResponse.json({
      ok: true,
      url: canonical,
      videoId,
      title: d.title ?? '',
      thumbnail: d.thumbnail_url ?? '',
      author: d.author_name ?? '',
    });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err.message }, { status: 200 });
  }
}
