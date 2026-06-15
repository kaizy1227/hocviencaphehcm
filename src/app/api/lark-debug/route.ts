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
    const h = { Authorization: `Bearer ${token}` };

    const [r1, r2, r3] = await Promise.all([
      fetch(`${LARK_API}/wiki/v2/nodes?token=${WIKI_TOKEN}`, { headers: h, cache: 'no-store' }).then(safeJson),
      fetch(`${LARK_API}/wiki/v1/nodes/${WIKI_TOKEN}`, { headers: h, cache: 'no-store' }).then(safeJson),
      fetch(`${LARK_API}/drive/v1/metas/batch_query`, {
        method: 'POST',
        headers: { ...h, 'Content-Type': 'application/json' },
        body: JSON.stringify({ request_docs: [{ doc_token: WIKI_TOKEN, doc_type: 'wiki' }], with_url: true }),
        cache: 'no-store',
      }).then(safeJson),
    ]);

    const appToken =
      r1?.data?.node?.obj_token ||
      r2?.data?.node?.obj_token ||
      r3?.data?.metas?.[0]?.doc_token ||
      null;

    return NextResponse.json({ appToken, nodes_v2: r1, nodes_v1: r2, drive_meta: r3 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
