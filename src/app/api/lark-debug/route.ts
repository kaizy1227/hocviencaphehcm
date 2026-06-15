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

    // Step 1: look up wiki node → get bitable app_token
    const wikiRes = await fetch(
      `${LARK_API}/wiki/v2/spaces/nodes?token=${WIKI_TOKEN}`,
      { headers: { Authorization: `Bearer ${token}` }, cache: 'no-store' },
    );
    const wikiJson = await wikiRes.json();

    if (wikiJson.code !== 0) {
      return NextResponse.json({ step: 'wiki_lookup_failed', wikiJson });
    }

    const node = wikiJson.data?.node;
    const appToken = node?.obj_token;  // bitable app_token
    const objType  = node?.obj_type;   // should be "bitable"

    if (!appToken) {
      return NextResponse.json({ step: 'no_obj_token', node });
    }

    // Step 2: list all tables inside this base
    const tablesRes = await fetch(
      `${LARK_API}/bitable/v1/apps/${appToken}/tables`,
      { headers: { Authorization: `Bearer ${token}` }, cache: 'no-store' },
    );
    const tablesJson = await tablesRes.json();

    // Step 3: peek 2 records from the table_id we have
    const tableId = process.env.LARK_TABLE_ID;
    const recRes = await fetch(
      `${LARK_API}/bitable/v1/apps/${appToken}/tables/${tableId}/records?page_size=2`,
      { headers: { Authorization: `Bearer ${token}` }, cache: 'no-store' },
    );
    const recJson = await recRes.json();

    return NextResponse.json({ objType, appToken, tables: tablesJson.data, records: recJson });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
