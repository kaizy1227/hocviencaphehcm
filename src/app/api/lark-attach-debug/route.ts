import { NextResponse } from 'next/server';
import { getLarkToken } from '@/lib/lark';

export const dynamic = 'force-dynamic';

const LARK_API = 'https://open.larksuite.com/open-apis';

export async function GET() {
  const token    = await getLarkToken();
  const appToken = process.env.LARK_BASE_APP_TOKEN!;
  const tableId  = process.env.LARK_TABLE_ID!;
  const h        = { Authorization: `Bearer ${token}` };

  // Fetch all records
  const recRes = await fetch(
    `${LARK_API}/bitable/v1/apps/${appToken}/tables/${tableId}/records?page_size=100&view_id=vewMHUtKed`,
    { headers: h, cache: 'no-store' },
  );
  const recJson = await recRes.json();
  const items: any[] = recJson?.data?.items ?? [];

  const summary = await Promise.all(items.map(async item => {
    const f = item.fields;
    const nameArr: any[] = f['Tên HV'] ?? f['Tên học viên'] ?? [];
    const name = nameArr[0]?.text ?? '(no name)';

    const rawDate = f['Ngày'];
    const date = typeof rawDate === 'number'
      ? new Date(rawDate).toLocaleDateString('vi-VN')
      : String(rawDate ?? '');

    const attachments: any[] = f['Hình ảnh trao bằng'] ?? [];
    const attachInfo = attachments.map((a: any) => ({
      name: a.name,
      type: a.type,
      file_token: a.file_token ?? null,
      has_tmp_url: !!a.tmp_url,
      tmp_url_snippet: a.tmp_url ? (a.tmp_url as string).slice(0, 80) : null,
    }));

    // Try resolving the first displayable image
    const img = attachments.find((a: any) =>
      a.type === 'image/jpeg' || a.type === 'image/jpg' ||
      a.type === 'image/png' || a.type === 'image/webp' ||
      /\.(jpg|jpeg|png|webp)$/i.test(a.name ?? '')
    ) ?? attachments[0] ?? null;

    let resolveResult: string | null = null;
    let downloadUrl: string | null = null;
    if (img?.tmp_url) {
      try {
        const r = await fetch(img.tmp_url, { headers: h, cache: 'no-store' });
        const j = await r.json();
        downloadUrl = j?.data?.tmp_download_urls?.[0]?.tmp_download_url ?? null;
        resolveResult = downloadUrl ? 'OK via tmp_url' : `tmp_url failed: code=${j?.code} msg=${j?.msg}`;
      } catch (e: any) {
        resolveResult = `tmp_url exception: ${e.message}`;
      }
    } else if (img?.file_token) {
      try {
        const r = await fetch(
          `${LARK_API}/drive/v1/medias/${img.file_token}/tmp_download_url`,
          { headers: h, cache: 'no-store' },
        );
        const j = await r.json();
        downloadUrl = j?.data?.tmp_download_urls?.[0]?.tmp_download_url ?? null;
        resolveResult = downloadUrl ? 'OK via file_token (no extra)' : `file_token failed: code=${j?.code} msg=${j?.msg}`;
      } catch (e: any) {
        resolveResult = `file_token exception: ${e.message}`;
      }
    } else {
      resolveResult = 'no img attachment';
    }

    const downloadDomain = downloadUrl ? (() => { try { return new URL(downloadUrl!).hostname; } catch { return null; } })() : null;
    // Show enough of the URL to compare auth params (no full signed URL)
    const downloadUrlPreview = downloadUrl ? downloadUrl.slice(0, 200) : null;

    return { name, date, attachCount: attachments.length, resolveResult, downloadDomain, downloadUrlPreview };
  }));

  return NextResponse.json({ total: items.length, summary });
}
