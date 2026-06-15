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

  // Fetch records from "Hình ảnh trao bằng" view
  const res = await fetch(
    `${LARK_API}/bitable/v1/apps/${appToken}/tables/${tableId}/records?page_size=100&view_id=${VIEW_ID}`,
    { headers: { Authorization: `Bearer ${token}` }, cache: 'no-store' },
  );
  const json = await res.json();
  if (json.code !== 0) throw new Error(`Lark records error: ${json.msg}`);

  const items: any[] = json.data?.items ?? [];

  // Collect file_tokens for the best image in each record
  const fileTokens: string[] = [];
  const recordTokenMap: Record<string, string> = {};
  let extraParam = '';

  for (const item of items) {
    const attachments: any[] = item.fields['Hình ảnh trao bằng'] ?? [];
    // Prefer jpg, fallback to any image
    const img =
      attachments.find(a => a.type === 'image/jpeg' || /\.(jpg|jpeg)$/i.test(a.name ?? '')) ??
      attachments.find(a => /\.(png|webp|heic)$/i.test(a.name ?? '')) ??
      attachments[0];

    if (img?.file_token) {
      fileTokens.push(img.file_token);
      recordTokenMap[item.record_id] = img.file_token;
      // Extract extra param from first attachment's tmp_url (has correct rev)
      if (!extraParam && img.tmp_url) {
        try {
          extraParam = new URL(img.tmp_url).searchParams.get('extra') ?? '';
        } catch {}
      }
    }
  }

  // Batch get real CDN download URLs
  const tokenUrlMap: Record<string, string> = {};
  if (fileTokens.length > 0) {
    const urlRes = await fetch(
      `${LARK_API}/drive/v1/medias/batch_get_tmp_download_url?file_tokens=${fileTokens.join(',')}&extra=${extraParam}`,
      { headers: { Authorization: `Bearer ${token}` }, cache: 'no-store' },
    );
    const urlJson = await urlRes.json();
    if (urlJson.code === 0) {
      for (const entry of urlJson.data?.tmp_download_urls ?? []) {
        tokenUrlMap[entry.file_token] = entry.tmp_download_url;
      }
    }
  }

  return items
    .map(item => {
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

      const fileToken = recordTokenMap[item.record_id];
      const photoUrl = fileToken ? (tokenUrlMap[fileToken] ?? null) : null;

      return { id: item.record_id, name, date, course: '', photoUrl };
    })
    .filter((s): s is LarkStudent => !!s.name && !!s.photoUrl);
}
