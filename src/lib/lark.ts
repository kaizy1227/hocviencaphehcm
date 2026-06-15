const LARK_API = 'https://open.larksuite.com/open-apis';
const VIEW_ID = 'vewMHUtKed'; // "Hình ảnh trao bằng" view

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
  const appToken = process.env.LARK_BASE_APP_TOKEN!;
  const tableId = process.env.LARK_TABLE_ID!;

  // Fetch all records from "Hình ảnh trao bằng" view
  const res = await fetch(
    `${LARK_API}/bitable/v1/apps/${appToken}/tables/${tableId}/records?page_size=100&view_id=${VIEW_ID}`,
    { headers: { Authorization: `Bearer ${token}` }, cache: 'no-store' },
  );
  const json = await res.json();
  if (json.code !== 0) throw new Error(`Lark records error: ${json.msg}`);

  const items: any[] = json.data?.items ?? [];

  // For each record, call its attachment's tmp_url directly (proven to work)
  const withPhotos = await Promise.all(
    items.map(async item => {
      const f = item.fields;

      const nameArr: any[] = f['Tên HV'] ?? f['Tên học viên'] ?? [];
      const name = nameArr[0]?.text ?? '';

      const rawDate = f['Ngày'];
      const date =
        typeof rawDate === 'number'
          ? new Date(rawDate).toLocaleDateString('vi-VN', {
              day: '2-digit', month: '2-digit', year: 'numeric',
            })
          : '';

      const attachments: any[] = f['Hình ảnh trao bằng'] ?? [];
      // Prefer jpg, then any image
      const img =
        attachments.find(a => a.type === 'image/jpeg' || /\.(jpg|jpeg)$/i.test(a.name ?? '')) ??
        attachments.find(a => /\.(png|webp|heic)$/i.test(a.name ?? '')) ??
        attachments[0];

      let photoUrl: string | null = null;
      if (img?.tmp_url) {
        try {
          const urlRes = await fetch(img.tmp_url, {
            headers: { Authorization: `Bearer ${token}` },
            cache: 'no-store',
          });
          const urlJson = await urlRes.json();
          photoUrl = urlJson?.data?.tmp_download_urls?.[0]?.tmp_download_url ?? null;
        } catch {}
      }

      return { id: item.record_id, name, date, course: '', photoUrl };
    }),
  );

  return withPhotos.filter((s): s is LarkStudent => !!s.name && !!s.photoUrl);
}
