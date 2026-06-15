import { NextResponse } from 'next/server';
import { getLarkToken } from '@/lib/lark';

const LARK_API = 'https://open.larksuite.com/open-apis';
const VIEW_ID = 'vewMHUtKed';

async function safeJson(res: Response) {
  const text = await res.text();
  try { return JSON.parse(text); } catch { return { _raw: text.slice(0, 300) }; }
}

export async function GET() {
  const appToken = process.env.LARK_BASE_APP_TOKEN;
  const tableId  = process.env.LARK_TABLE_ID;
  const appId    = process.env.LARK_APP_ID;

  // Step 0: check env vars
  if (!appId || !appToken || !tableId) {
    return NextResponse.json({ step: 0, error: 'missing env vars', appId: !!appId, appToken: !!appToken, tableId: !!tableId });
  }

  const token = await getLarkToken();
  const h = { Authorization: `Bearer ${token}` };

  // Step 1: fetch records
  const recRes = await fetch(
    `${LARK_API}/bitable/v1/apps/${appToken}/tables/${tableId}/records?page_size=5&view_id=${VIEW_ID}`,
    { headers: h, cache: 'no-store' },
  );
  const recJson = await safeJson(recRes);
  const items: any[] = recJson?.data?.items ?? [];

  if (items.length === 0) {
    return NextResponse.json({ step: 1, error: 'no items', recJson });
  }

  // Step 2: extract file tokens
  const fileTokens: string[] = [];
  const recordTokenMap: Record<string, string> = {};
  let extraParam = '';

  for (const item of items) {
    const attachments: any[] = item.fields['Hình ảnh trao bằng'] ?? [];
    const img =
      attachments.find((a: any) => a.type === 'image/jpeg' || /\.(jpg|jpeg)$/i.test(a.name ?? '')) ??
      attachments.find((a: any) => /\.(png|webp|heic)$/i.test(a.name ?? '')) ??
      attachments[0];
    if (img?.file_token) {
      fileTokens.push(img.file_token);
      recordTokenMap[item.record_id] = img.file_token;
      if (!extraParam && img.tmp_url) {
        try { extraParam = new URL(img.tmp_url).searchParams.get('extra') ?? ''; } catch {}
      }
    }
  }

  if (fileTokens.length === 0) {
    const sampleFields = Object.keys(items[0]?.fields ?? {});
    return NextResponse.json({ step: 2, error: 'no file tokens found', sampleFields, sampleAttachments: items[0]?.fields?.['Hình ảnh trao bằng'] });
  }

  // Step 3: batch get tmp download URLs
  const batchRes = await fetch(
    `${LARK_API}/drive/v1/medias/batch_get_tmp_download_url?file_tokens=${fileTokens.join(',')}&extra=${encodeURIComponent(extraParam)}`,
    { headers: h, cache: 'no-store' },
  );
  const batchJson = await safeJson(batchRes);
  const tokenUrlMap: Record<string, string> = {};
  for (const entry of batchJson?.data?.tmp_download_urls ?? []) {
    tokenUrlMap[entry.file_token] = entry.tmp_download_url;
  }

  // Step 4: map records
  const mapped = items.map(item => {
    const f = item.fields;
    const nameArr: any[] = f['Tên HV'] ?? f['Tên học viên'] ?? [];
    const name = nameArr[0]?.text ?? '';
    const rawDate = f['Ngày'];
    const date = typeof rawDate === 'number'
      ? new Date(rawDate).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })
      : '';
    const fileToken = recordTokenMap[item.record_id];
    const photoUrl = fileToken ? (tokenUrlMap[fileToken] ?? null) : null;
    return { id: item.record_id, name, date, photoUrl, hasName: !!name, hasPhoto: !!photoUrl };
  });

  return NextResponse.json({
    step: 4,
    batchCode: batchJson?.code,
    tokenUrlMapSize: Object.keys(tokenUrlMap).length,
    mapped,
    extraParam,
  });
}
