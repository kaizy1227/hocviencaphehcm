import { NextResponse } from 'next/server';
import { getLarkToken } from '@/lib/lark';

// Dump first raw record so we can verify field names
export async function GET() {
  if (!process.env.LARK_APP_ID) {
    return NextResponse.json({ error: 'LARK_APP_ID not set' }, { status: 400 });
  }
  try {
    const token = await getLarkToken();
    const res = await fetch(
      `https://open.larksuite.com/open-apis/bitable/v1/apps/${process.env.LARK_BASE_APP_TOKEN}/tables/${process.env.LARK_TABLE_ID}/records?page_size=2`,
      { headers: { Authorization: `Bearer ${token}` }, cache: 'no-store' },
    );
    const json = await res.json();
    return NextResponse.json(json);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
