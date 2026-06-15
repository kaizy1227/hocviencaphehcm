import { NextResponse } from 'next/server';
import { getLarkToken } from '@/lib/lark';

const LARK_API = 'https://open.larksuite.com/open-apis';
const WIKI_TOKEN = 'HHFpwTjphiUo49kN3HJl9fc5gm1';

async function safeJson(res: Response) {
  const text = await res.text();
  try { return JSON.parse(text); } catch { return { _raw: text.slice(0, 300) }; }
}

export async function GET() {
  if (!process.env.LARK_APP_ID) {
    return NextResponse.json({ error: 'LARK_APP_ID not set' }, { status: 400 });
  }
  try {
    const token = await getLarkToken();
    const h = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' };

    // Get drive metadata for the wiki node — returns obj_token (bitable app_token)
    const metaRes = await fetch(`${LARK_API}/drive/v1/metas/batch_query`, {
      method: 'POST',
      headers: h,
      body: JSON.stringify({
        request_docs: [{ doc_token: WIKI_TOKEN, doc_type: 'wiki' }],
        with_url: true,
      }),
      cache: 'no-store',
    });
    const metaJson = await safeJson(metaRes);

    // The wiki meta may return the base obj_token under extra_info or title
    const meta = metaJson?.data?.metas?.[0];

    // Also try listing wiki spaces to find our space_id, then get node info
    const spacesRes = await fetch(`${LARK_API}/wiki/v2/spaces?page_size=20`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: 'no-store',
    });
    const spacesJson = await safeJson(spacesRes);

    // If we got spaces, try to find node in first space
    let nodeInfo = null;
    const spaces: any[] = spacesJson?.data?.items ?? [];
    for (const space of spaces.slice(0, 3)) {
      const nodeRes = await fetch(
        `${LARK_API}/wiki/v2/spaces/${space.space_id}/nodes/${WIKI_TOKEN}`,
        { headers: { Authorization: `Bearer ${token}` }, cache: 'no-store' }
      );
      const nodeJson = await safeJson(nodeRes);
      if (nodeJson?.code === 0) { nodeInfo = nodeJson.data?.node; break; }
    }

    const appToken = nodeInfo?.obj_token ?? null;

    return NextResponse.json({ appToken, nodeInfo, meta, spaces: spacesJson?.data });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
