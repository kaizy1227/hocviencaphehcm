import { NextResponse } from 'next/server';
import { getLarkToken } from '@/lib/lark';

const LARK_API = 'https://open.larksuite.com/open-apis';
const VIEW_ID = 'vewMHUtKed';

async function safeJson(res: Response) {
  const text = await res.text();
  try { return JSON.parse(text); } catch { return { _raw: text.slice(0, 500) }; }
}

export async function GET() {
  if (!process.env.LARK_APP_ID) {
    return NextResponse.json({ error: 'LARK_APP_ID not set' }, { status: 400 });
  }
  try {
    const token = await getLarkToken();
    const appToken = process.env.LARK_BASE_APP_TOKEN;
    const tableId = process.env.LARK_TABLE_ID;
    const h = { Authorization: `Bearer ${token}` };

    // Step 1: fetch 1 record from view
    const recRes = await fetch(
      `${LARK_API}/bitable/v1/apps/${appToken}/tables/${tableId}/records?page_size=1&view_id=${VIEW_ID}`,
      { headers: h, cache: 'no-store' },
    );
    const recJson = await safeJson(recRes);
    const item = recJson?.data?.items?.[0];
    const attachments: any[] = item?.fields?.['Hình ảnh trao bằng'] ?? [];
    const firstImg = attachments.find((a: any) => a.file_token) ?? attachments[0];
    const fileToken = firstImg?.file_token ?? null;
    const tmpUrlRaw = firstImg?.tmp_url ?? null;

    let extraParam = '';
    if (tmpUrlRaw) {
      try { extraParam = new URL(tmpUrlRaw).searchParams.get('extra') ?? ''; } catch {}
    }

    // Step 2: try batch_get_tmp_download_url
    let batchResult = null;
    if (fileToken) {
      const batchRes = await fetch(
        `${LARK_API}/drive/v1/medias/batch_get_tmp_download_url?file_tokens=${fileToken}&extra=${extraParam}`,
        { headers: h, cache: 'no-store' },
      );
      batchResult = await safeJson(batchRes);
    }

    // Step 3: try direct download URL
    let downloadResult = null;
    if (fileToken) {
      const dlRes = await fetch(
        `${LARK_API}/drive/v1/medias/${fileToken}/download`,
        { headers: h, cache: 'no-store', redirect: 'manual' },
      );
      downloadResult = { status: dlRes.status, location: dlRes.headers.get('location') };
    }

    const name = item?.fields?.['Tên HV']?.[0]?.text ?? item?.fields?.['Tên học viên']?.[0]?.text ?? null;

    return NextResponse.json({
      name, fileToken, extraParam, batchResult, downloadResult,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
