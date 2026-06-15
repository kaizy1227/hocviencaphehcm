const LARK_API = 'https://open.larksuite.com/open-apis';

// Module-level cache — survives across requests in the same server process
let _tokenCache: { value: string; expiresAt: number } | null = null;

export async function getLarkToken(): Promise<string> {
  if (_tokenCache && Date.now() < _tokenCache.expiresAt) return _tokenCache.value;

  const res = await fetch(`${LARK_API}/auth/v3/tenant_access_token/internal`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      app_id: process.env.LARK_APP_ID,
      app_secret: process.env.LARK_APP_SECRET,
    }),
    cache: 'no-store',
  });
  const json = await res.json();
  if (json.code !== 0) throw new Error(`Lark token error: ${json.msg}`);

  // Token valid 2h; we refresh after 1.5h to stay safe
  _tokenCache = { value: json.tenant_access_token, expiresAt: Date.now() + 5_400_000 };
  return _tokenCache.value;
}

export interface LarkStudent {
  id: string;
  name: string;
  date: string;
  course: string;
  photoUrl: string;
}

export async function fetchLarkStudents(): Promise<LarkStudent[]> {
  const token = await getLarkToken();
  const appToken = process.env.LARK_BASE_APP_TOKEN;
  const tableId = process.env.LARK_TABLE_ID;

  const res = await fetch(
    `${LARK_API}/bitable/v1/apps/${appToken}/tables/${tableId}/records?page_size=100`,
    { headers: { Authorization: `Bearer ${token}` }, cache: 'no-store' },
  );
  const json = await res.json();
  if (json.code !== 0) throw new Error(`Lark records error: ${json.msg}`);

  const items: any[] = json.data?.items ?? [];

  return items
    .map(item => {
      const f = item.fields;

      // Try multiple field name variants — will fix after seeing debug output
      const name =
        f['Họ và tên'] ?? f['Tên học viên'] ?? f['Tên'] ?? f['Name'] ?? '';

      const rawDate =
        f['Ngày trao bằng'] ?? f['Ngày'] ?? f['Date'] ?? '';
      const date = typeof rawDate === 'number'
        ? new Date(rawDate).toLocaleDateString('vi-VN')
        : String(rawDate);

      const courseRaw = f['Khóa học'] ?? f['Course'] ?? '';
      const course = Array.isArray(courseRaw)
        ? courseRaw.map((c: any) => c?.text ?? c).join(', ')
        : String(courseRaw);

      // Attachment field — first file's tmp_url
      const attachments: any[] =
        f['Hình ảnh'] ?? f['Ảnh'] ?? f['Photo'] ?? f['Attachment'] ?? [];
      const photoUrl: string | null =
        Array.isArray(attachments) && attachments.length > 0
          ? (attachments[0].tmp_url ?? null)
          : null;

      return { id: item.record_id, name, date, course, photoUrl };
    })
    .filter((s): s is LarkStudent => !!s.name && !!s.photoUrl);
}
