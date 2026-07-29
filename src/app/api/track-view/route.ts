import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// IPs in this comma-separated env var are never counted
const EXCLUDED_IPS = (process.env.EXCLUDED_IPS ?? '')
  .split(',')
  .map(s => s.trim())
  .filter(Boolean);

function getClientIp(req: NextRequest): string {
  const xff = req.headers.get('x-forwarded-for');
  if (xff) return xff.split(',')[0].trim();
  return req.headers.get('x-real-ip') ?? '';
}

function detectSource(referrer: string, host: string): string {
  if (!referrer) return 'direct';
  let ref: URL;
  try { ref = new URL(referrer); } catch { return 'khac'; }
  const h = ref.hostname.replace(/^www\./, '').toLowerCase();
  if (h === host || h.endsWith(`.${host}`)) return 'direct';
  if (h.includes('google')) return 'google';
  if (h.includes('facebook') || h.includes('fb.com')) return 'facebook';
  if (h.includes('zalo')) return 'zalo';
  if (h.includes('tiktok')) return 'tiktok';
  if (h.includes('instagram')) return 'instagram';
  if (h.includes('bing')) return 'bing';
  if (h.includes('yahoo')) return 'yahoo';
  return 'khac';
}

export async function POST(req: NextRequest) {
  // Skip internal traffic
  const clientIp = getClientIp(req);
  if (EXCLUDED_IPS.length > 0 && clientIp && EXCLUDED_IPS.includes(clientIp)) {
    return NextResponse.json({ ok: true, skipped: true });
  }

  const body = await req.json().catch(() => null);
  const path = typeof body?.path === 'string' ? body.path.slice(0, 300) : null;
  if (!path) return NextResponse.json({ error: 'missing path' }, { status: 400 });

  const referrer = typeof body?.referrer === 'string' ? body.referrer : '';
  const host = req.headers.get('host') || '';
  const source = detectSource(referrer, host);

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { error } = await supabase.from('page_views').insert({
    path,
    referrer: referrer ? referrer.slice(0, 500) : null,
    source,
  });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
