import { NextResponse } from 'next/server';
import { getLarkToken } from '@/lib/lark';

const LARK_API = 'https://open.larksuite.com/open-apis';
const WIKI_TOKEN = 'HHFpwTjphiUo49kN3HJl9fc5gm1';

export async function GET() {
  if (!process.env.LARK_APP_ID) {
    return NextResponse.json({ error: 'LARK_APP_ID not set' }, { status: 400 });
  }
  try {
    const token = await getLarkToken();

    // Try 3 different wiki node endpoints to find the one that works
    const attempts: Record<string, any> = {};

    // Attempt 1: GET /wiki/v2/nodes (no space_id needed in some versions)
    const r1 = await fetch(`${LARK_API}/wiki/v2/nodes?token=${WIKI_TOKEN}`, {
      headers: { Authorization: `Bearer ${token}` }, cache: 'no-store',
    });
    attempts.nodes_v2 = await r1.json();

    // Attempt 2: GET /wiki/v1/nodes/{node_token}
    const r2 = await fetch(`${LARK_API}/wiki/v1/nodes/${WIKI_TOKEN}`, {
      headers: { Authorization: `Bearer ${token}` }, cache: 'no-store',
    });
    attempts.nodes_v1 = await r2.json();

    // Attempt 3: GET /drive/v1/metas (batch file meta lookup)
    const r3 = await fetch(`${LARK_API}/drive/v1/metas/batch_query`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ request_docs: [{ doc_token: WIKI_TOKEN, doc_type: 'wiki' }], with_url: true }),
      cache: 'no-store',
    });
    attempts.drive_meta = await r3.json();

    // Extract app_token from whichever succeeded
    const appToken =
      attempts.nodes_v2?.data?.node?.obj_token ||
      attempts.nodes_v1?.data?.node?.obj_token ||
      attempts.drive_meta?.data?.metas?.[0]?.doc_token ||
      null;

    return NextResponse.json({ appToken, attempts });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
