import { NextResponse } from 'next/server';
import { getLarkToken } from '@/lib/lark';

const LARK_API = 'https://open.larksuite.com/open-apis';

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
    const appToken = process.env.LARK_BASE_APP_TOKEN;
    const tableId = process.env.LARK_TABLE_ID;
    const h = { Authorization: `Bearer ${token}` };

    // List tables in this base
    const tablesRes = await fetch(`${LARK_API}/bitable/v1/apps/${appToken}/tables`, {
      headers: h, cache: 'no-store',
    });
    const tablesJson = await safeJson(tablesRes);

    // Fetch 2 records to see field names
    const recRes = await fetch(
      `${LARK_API}/bitable/v1/apps/${appToken}/tables/${tableId}/records?page_size=2`,
      { headers: h, cache: 'no-store' },
    );
    const recJson = await safeJson(recRes);

    return NextResponse.json({ appToken, tableId, tables: tablesJson?.data, records: recJson });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
