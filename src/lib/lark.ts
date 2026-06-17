const LARK_API = 'https://open.larksuite.com/open-apis';
const TRAO_BANG_VIEW = 'vewMHUtKed';
const LOP_HOC_TABLE  = 'tblZo3DU3xfBX8Wy';
const LOP_HOC_VIEW   = 'vewi5T4FsC';

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

function isDisplayable(a: any): boolean {
  return (
    a.type === 'image/jpeg' || a.type === 'image/jpg' ||
    a.type === 'image/png' || a.type === 'image/webp' ||
    /\.(jpg|jpeg|png|webp)$/i.test(a.name ?? '')
  );
}

// Resolve a single attachment's download URL.
// Uses tmp_url directly when available; falls back to constructing the endpoint
// from file_token + extraParam (needed for newly uploaded attachments that lack tmp_url).
async function resolveAttachmentUrl(
  token: string,
  attachment: any,
  extraParam = '',
): Promise<string | null> {
  if (!attachment) return null;

  const endpoint = attachment.tmp_url ?? (
    attachment.file_token
      ? `${LARK_API}/drive/v1/medias/${attachment.file_token}/tmp_download_url` +
        (extraParam ? `?extra=${encodeURIComponent(extraParam)}` : '')
      : null
  );
  if (!endpoint) return null;

  try {
    const res = await fetch(endpoint, {
      headers: { Authorization: `Bearer ${token}` },
      cache: 'no-store',
    });
    const json = await res.json();
    return json?.data?.tmp_download_urls?.[0]?.tmp_download_url ?? null;
  } catch {
    return null;
  }
}

// Extract the `extra` query param from the first attachment that has tmp_url.
// This param encodes the bitable context and is the same for all attachments in the same table.
function extractExtraParam(attachments: any[]): string {
  for (const a of attachments) {
    if (a.tmp_url) {
      try {
        const extra = new URL(a.tmp_url).searchParams.get('extra');
        if (extra) return extra;
      } catch {}
    }
  }
  return '';
}

// ─── Trao Bằng ───────────────────────────────────────────────────────────────

export interface LarkStudent {
  id: string;
  name: string;
  date: string;
  course: string;
  photoUrl: string | null;
}

export async function fetchLarkStudents(): Promise<LarkStudent[]> {
  const token = await getLarkToken();
  const appToken = process.env.LARK_BASE_APP_TOKEN!;
  const tableId  = process.env.LARK_TABLE_ID!;

  const recordRes = await fetch(
    `${LARK_API}/bitable/v1/apps/${appToken}/tables/${tableId}/records?page_size=100&view_id=${TRAO_BANG_VIEW}`,
    { headers: { Authorization: `Bearer ${token}` }, cache: 'no-store' },
  );

  const json = await recordRes.json();
  if (json.code !== 0) throw new Error(`Lark records error: ${json.msg}`);

  const items: any[] = json.data?.items ?? [];

  // Extract extra param once from any record that has tmp_url — reused as fallback
  const allAttachments = items.flatMap(item => item.fields['Hình ảnh trao bằng'] ?? []);
  const extraParam = extractExtraParam(allAttachments);

  const results = await Promise.all(
    items.map(async item => {
      const f = item.fields;
      const nameArr: any[] = f['Tên HV'] ?? f['Tên học viên'] ?? [];
      const name = nameArr[0]?.text ?? '';

      const rawDate = f['Ngày'];
      const date = typeof rawDate === 'number'
        ? new Date(rawDate).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })
        : '';

      const courseRaw = f['Khóa học copy'];
      const course = typeof courseRaw === 'string'
        ? courseRaw
        : (Array.isArray(courseRaw) ? courseRaw[0]?.text ?? courseRaw[0] ?? '' : '');

      const attachments: any[] = f['Hình ảnh trao bằng'] ?? [];
      const img = attachments.find(isDisplayable) ?? null;
      const photoUrl = await resolveAttachmentUrl(token, img, extraParam);

      return { id: item.record_id, name, date, course: String(course), photoUrl };
    }),
  );

  return results.filter(s => !!s.name);
}

// ─── Video Truyền Thông ───────────────────────────────────────────────────────

const VIDEO_TABLE = 'tblOEswQ1BKcuJc2';
const VIDEO_VIEW  = 'vewi5SvmuY';

function isPlayable(a: any): boolean {
  return (
    /^video\/mp4$/i.test(a.type ?? '') ||
    /^video\/webm$/i.test(a.type ?? '') ||
    /\.(mp4|webm|m4v)$/i.test(a.name ?? '')
  );
}

function isNonPlayableVideo(a: any): boolean {
  return (
    /^video\//i.test(a.type ?? '') ||
    /\.(mov|avi|mkv|3gp|hevc)$/i.test(a.name ?? '')
  ) && !isPlayable(a);
}

export interface LarkVideo {
  id: string;
  title: string;
  channel: string;
  date: string;
  videoUrl: string | null;
  thumbnailUrl: string | null;
  downloadUrl: string | null;
  videoName: string | null;   // tên file gốc, dùng để map thumbnail local
}

export async function fetchLarkVideos(): Promise<LarkVideo[]> {
  const token    = await getLarkToken();
  const appToken = process.env.LARK_BASE_APP_TOKEN!;

  const res = await fetch(
    `${LARK_API}/bitable/v1/apps/${appToken}/tables/${VIDEO_TABLE}/records?page_size=100&view_id=${VIDEO_VIEW}`,
    { headers: { Authorization: `Bearer ${token}` }, cache: 'no-store' },
  );
  const json = await res.json();
  if (json.code !== 0) throw new Error(`Lark video records error: ${json.msg}`);

  const items: any[] = json.data?.items ?? [];
  const allAttachments = items.flatMap(item => item.fields['Tệp tin đính kèm'] ?? []);
  const extraParam = extractExtraParam(allAttachments);

  const results = await Promise.all(
    items.map(async item => {
      const f = item.fields;

      const title = Array.isArray(f['Content'])
        ? f['Content'].map((t: any) => t.text ?? '').join('')
        : String(f['Content'] ?? '');

      const channelRaw = f['Kênh'];
      const channel = Array.isArray(channelRaw)
        ? channelRaw.map((t: any) => t.text ?? '').join('')
        : String(channelRaw ?? '');

      const rawDate = f['Ngày'];
      const date = typeof rawDate === 'number'
        ? new Date(rawDate).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })
        : '';

      const attachments: any[] = f['Tệp tin đính kèm'] ?? [];
      const vid = attachments.find(isPlayable) ?? null;
      const mov = vid ? null : (attachments.find(isNonPlayableVideo) ?? null);
      const img = attachments.find(isDisplayable) ?? null;
      const [videoUrl, downloadUrl, thumbnailUrl] = await Promise.all([
        resolveAttachmentUrl(token, vid, extraParam),
        resolveAttachmentUrl(token, mov, extraParam),
        resolveAttachmentUrl(token, img, extraParam),
      ]);

      const videoName = (vid ?? mov)?.name ?? null;
      return { id: item.record_id, title, channel, date, videoUrl, thumbnailUrl, downloadUrl, videoName };
    }),
  );

  return results;
}

// ─── Công Thức 2 (Lark Base) ─────────────────────────────────────────────────

const RECIPE2_TABLE = 'tblGmHbYtQ1alxRM';
const RECIPE2_VIEW  = 'vewJutYwRr';

export interface LarkRecipe {
  id: string;
  name: string;
  category: string;
  photoUrl: string | null;
  instructions: string;
  totalCost: number | null;
  recipe: string;
  courses: string[];
}

export async function fetchLarkRecipes(): Promise<LarkRecipe[]> {
  const token    = await getLarkToken();
  const appToken = process.env.LARK_BASE_APP_TOKEN!;

  let allItems: any[] = [];
  let pageToken = '';

  do {
    const url = `${LARK_API}/bitable/v1/apps/${appToken}/tables/${RECIPE2_TABLE}/records?page_size=100&view_id=${RECIPE2_VIEW}` +
      (pageToken ? `&page_token=${pageToken}` : '');
    const res  = await fetch(url, { headers: { Authorization: `Bearer ${token}` }, cache: 'no-store' });
    const json = await res.json();
    if (json.code !== 0) throw new Error(`Lark recipes error: ${json.msg}`);
    allItems  = [...allItems, ...(json.data?.items ?? [])];
    pageToken = json.data?.has_more ? (json.data.page_token ?? '') : '';
  } while (pageToken);

  const allAttachments = allItems.flatMap(item => item.fields['Hình ảnh món'] ?? []);
  const extraParam = extractExtraParam(allAttachments);

  const results = await Promise.all(
    allItems.map(async item => {
      const f = item.fields;
      const name        = String(f['Tên món'] ?? '');
      const category    = String(f['Phân loại'] ?? '');
      const instructions = String(f['Hướng dẫn pha chế'] ?? '');
      const totalCost   = typeof f['Tổng cost'] === 'number' ? Math.round(f['Tổng cost']) : null;
      const recipe      = String(f['Công thức'] ?? '');
      const raw         = f['Khóa học'];
      const courses: string[] = Array.isArray(raw) ? raw.map(String) : (raw ? [String(raw)] : []);

      const attachments: any[] = (f['Hình ảnh món'] ?? []).filter(isDisplayable);
      const img      = attachments[0] ?? null;
      const photoUrl = img ? await resolveAttachmentUrl(token, img, extraParam) : null;

      return { id: item.record_id, name, category, photoUrl, instructions, totalCost, recipe, courses };
    })
  );

  return results.filter(r => !!r.name);
}

// ─── Lớp Học ─────────────────────────────────────────────────────────────────

export interface LarkClassSession {
  id: string;
  date: string;
  course: string;
  className: string;
  studentNames: string;
  photos: string[];
}

export async function fetchLarkClassSessions(): Promise<LarkClassSession[]> {
  const token    = await getLarkToken();
  const appToken = process.env.LARK_BASE_APP_TOKEN!;

  const recordRes = await fetch(
    `${LARK_API}/bitable/v1/apps/${appToken}/tables/${LOP_HOC_TABLE}/records?page_size=100&view_id=${LOP_HOC_VIEW}`,
    { headers: { Authorization: `Bearer ${token}` }, cache: 'no-store' },
  );

  const json = await recordRes.json();
  if (json.code !== 0) throw new Error(`Lark class records error: ${json.msg}`);

  const items: any[] = json.data?.items ?? [];

  const allAttachments = items.flatMap(item => item.fields['Ảnh lớp học Copy'] ?? []);
  const extraParam = extractExtraParam(allAttachments);

  const results = await Promise.all(
    items.map(async item => {
      const f = item.fields;

      const rawDate = f['Ngày học'];
      const date = typeof rawDate === 'number'
        ? new Date(rawDate).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })
        : (typeof rawDate === 'string' ? rawDate : '');

      const courseRaw = f['Khóa học'];
      let course = '';
      if (Array.isArray(courseRaw)) {
        course = courseRaw.map((v: any) => {
          if (v?.text) return v.text;
          if (typeof v === 'string') return v;
          return '';
        }).filter(Boolean).join(', ');
      } else if (typeof courseRaw === 'string') {
        course = courseRaw;
      }

      const classNameArr: any[] = f['Mã lớp học'] ?? [];
      const className = typeof classNameArr === 'string'
        ? classNameArr
        : (classNameArr[0]?.text ?? classNameArr[0] ?? '');

      const tkbRaw = f['Mã TKB'];
      let studentNames = '';
      if (Array.isArray(tkbRaw)) {
        studentNames = tkbRaw.map((v: any) => v?.text ?? (typeof v === 'string' ? v : '')).filter(Boolean).join(', ');
      } else if (typeof tkbRaw === 'string') {
        studentNames = tkbRaw;
      }

      const attachments: any[] = (f['Ảnh lớp học Copy'] ?? []).filter(isDisplayable);
      const photoUrls = await Promise.all(attachments.map(a => resolveAttachmentUrl(token, a, extraParam)));
      const photos = photoUrls.filter((u): u is string => !!u);

      return { id: item.record_id, date, course, className: String(className), studentNames, photos };
    }),
  );

  return results.filter(s => s.photos.length > 0);
}
