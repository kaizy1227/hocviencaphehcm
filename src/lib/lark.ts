const LARK_API = 'https://open.larksuite.com/open-apis';

// Lark lưu ngày dạng Unix ms (UTC). Vercel chạy UTC+0 nên toLocaleDateString()
// sẽ lùi 1 ngày so với Vietnam (UTC+7). Fix: cộng +7h vào timestamp rồi dùng UTC getters.
function larkDateToVN(ms: number): string {
  const d = new Date(ms + 7 * 3_600_000); // shift về UTC+7
  const dd = String(d.getUTCDate()).padStart(2, '0');
  const mm = String(d.getUTCMonth() + 1).padStart(2, '0');
  return `${dd}/${mm}/${d.getUTCFullYear()}`;
}
// Chuyển Lark Unix ms → "yyyy-mm-dd" (cho Postgres DATE type)
function larkDateToISO(ms: number): string {
  const d = new Date(ms + 7 * 3_600_000);
  const yyyy = d.getUTCFullYear();
  const mm = String(d.getUTCMonth() + 1).padStart(2, '0');
  const dd = String(d.getUTCDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

// Base "Quản lý công việc" (Wiki-base). Hardcode để tránh lỗi BOM/copy nhầm 0↔O từ env.
const TRAO_BANG_TABLE = 'tblp4LF3honii8KL'; // "Danh sách học viên chốt khóa học"
const TRAO_BANG_VIEW  = 'vewMHUtKed';        // view "Hình ảnh trao bằng"
const LOP_HOC_TABLE   = 'tblZo3DU3xfBX8Wy';  // "Thời khóa biểu lớp học"
const LOP_HOC_VIEW    = 'vewi5T4FsC';

// ─── In-memory cache (server RAM) ────────────────────────────────────────────
// Mục đích: tiết kiệm quota Lark API (giới hạn 10.000 lượt/tháng).
// TTL = 10 phút — đủ fresh cho dữ liệu ít thay đổi (ảnh, công thức, lớp học).
// KHÔNG xóa hoặc bypass cache này trừ khi có lý do rõ ràng.
const CACHE_TTL = 10 * 60 * 1000; // 10 phút

let _tokenCache: { value: string; expiresAt: number } | null = null;
let _recipesCache: { data: LarkRecipe[]; expiresAt: number } | null = null;
let _studentsCache: { data: LarkStudent[]; expiresAt: number } | null = null;
let _videosCache: { data: LarkVideo[]; expiresAt: number } | null = null;
let _classesCache: { data: LarkClassSession[]; expiresAt: number } | null = null;

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
    a.type === 'image/heic' || a.type === 'image/heif' ||
    /\.(jpg|jpeg|png|webp|heic|heif)$/i.test(a.name ?? '')
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

// Trích tên khóa học từ field Lookup/text. Bỏ qua giá trị dạng option-id (optXXXX).
function extractCourseText(raw: any): string {
  if (!raw) return '';
  if (typeof raw === 'string') return /^opt[A-Za-z0-9]+$/.test(raw) ? '' : raw;
  if (Array.isArray(raw)) {
    return raw
      .map(v => (typeof v === 'string' ? v : v?.text ?? ''))
      .filter(s => s && !/^opt[A-Za-z0-9]+$/.test(s))
      .join(', ');
  }
  return raw?.text ?? '';
}

export interface LarkStudent {
  id: string;
  name: string;
  date: string;
  course: string;
  photoUrl: string | null;
}

export async function fetchLarkStudents(): Promise<LarkStudent[]> {
  if (_studentsCache && Date.now() < _studentsCache.expiresAt) return _studentsCache.data;

  const token = await getLarkToken();
  const appToken = process.env.LARK_TRAO_BANG_APP_TOKEN ?? process.env.LARK_BASE_APP_TOKEN!;

  const recordRes = await fetch(
    `${LARK_API}/bitable/v1/apps/${appToken}/tables/${TRAO_BANG_TABLE}/records?page_size=100&view_id=${TRAO_BANG_VIEW}`,
    { headers: { Authorization: `Bearer ${token}` }, cache: 'no-store' },
  );

  const json = await recordRes.json();
  if (json.code !== 0) throw new Error(`Lark records error: ${json.msg}`);

  const allItems: any[] = json.data?.items ?? [];

  // Chỉ lấy record có ảnh trao bằng — bỏ qua record trống ảnh
  const items = allItems.filter(item =>
    (item.fields['Hình ảnh trao bằng'] ?? []).some(isDisplayable),
  );

  // Extract extra param once from any record that has tmp_url — reused as fallback
  const allAttachments = items.flatMap(item => item.fields['Hình ảnh trao bằng'] ?? []);
  const extraParam = extractExtraParam(allAttachments);

  const results = await Promise.all(
    items.map(async item => {
      const f = item.fields;
      const nameArr: any[] = f['Tên HV'] ?? f['Tên học viên'] ?? [];
      const name = (nameArr[0]?.text ?? '').trim();

      const rawDate = f['Ngày'];
      const date = typeof rawDate === 'number'
        ? larkDateToVN(rawDate)
        : '';

      const course = extractCourseText(f['Khóa học copy']) || extractCourseText(f['Khóa học']);

      const attachments: any[] = f['Hình ảnh trao bằng'] ?? [];
      const img = attachments.find(isDisplayable) ?? null;
      const photoUrl = await resolveAttachmentUrl(token, img, extraParam);

      return { id: item.record_id, name, date, course: String(course), photoUrl };
    }),
  );

  const filtered = results.filter(s => !!s.name && !!s.photoUrl);
  _studentsCache = { data: filtered, expiresAt: Date.now() + CACHE_TTL };
  return filtered;
}

// Incremental version — chỉ xử lý attachment của record chưa có trong DB.
// existingIds: Set<lark_id> đã tồn tại → bỏ qua, không tốn thêm lượt API.
export async function fetchLarkStudentsNew(existingIds: Set<string>): Promise<LarkStudent[]> {
  const token = await getLarkToken();
  const appToken = process.env.LARK_TRAO_BANG_APP_TOKEN ?? process.env.LARK_BASE_APP_TOKEN!;

  const recordRes = await fetch(
    `${LARK_API}/bitable/v1/apps/${appToken}/tables/${TRAO_BANG_TABLE}/records?page_size=100&view_id=${TRAO_BANG_VIEW}`,
    { headers: { Authorization: `Bearer ${token}` }, cache: 'no-store' },
  );
  const json = await recordRes.json();
  if (json.code !== 0) throw new Error(`Lark records error: ${json.msg}`);

  const items: any[] = json.data?.items ?? [];

  // Chỉ xử lý record chưa có trong DB VÀ có ảnh
  const newItems = items.filter(item =>
    !existingIds.has(item.record_id) &&
    (item.fields['Hình ảnh trao bằng'] ?? []).some(isDisplayable),
  );

  if (newItems.length === 0) return [];

  const allAttachments = newItems.flatMap(item => item.fields['Hình ảnh trao bằng'] ?? []);
  const extraParam = extractExtraParam(allAttachments);

  const results = await Promise.all(
    newItems.map(async item => {
      const f = item.fields;
      const nameArr: any[] = f['Tên HV'] ?? f['Tên học viên'] ?? [];
      const name = (nameArr[0]?.text ?? '').trim();

      const rawDate = f['Ngày'];
      const date = typeof rawDate === 'number'
        ? larkDateToVN(rawDate)
        : '';

      const course = extractCourseText(f['Khóa học copy']) || extractCourseText(f['Khóa học']);

      const attachments: any[] = f['Hình ảnh trao bằng'] ?? [];
      const img = attachments.find(isDisplayable) ?? null;
      const photoUrl = await resolveAttachmentUrl(token, img, extraParam);

      return { id: item.record_id, name, date, course: String(course), photoUrl };
    }),
  );

  return results.filter(s => !!s.name && !!s.photoUrl);
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
  if (_videosCache && Date.now() < _videosCache.expiresAt) return _videosCache.data;

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
        ? larkDateToVN(rawDate)
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

  _videosCache = { data: results, expiresAt: Date.now() + CACHE_TTL };
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
  ingredients: string; // raw "Nguyên liệu tổng hợp" text — pipe-separated, each entry "Name/ unit/ price: qty"
  courses: string[];
}

export async function fetchLarkRecipes(): Promise<LarkRecipe[]> {
  if (_recipesCache && Date.now() < _recipesCache.expiresAt) return _recipesCache.data;

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

      const ingredients = f['Nguyên liệu tổng hợp']?.[0]?.text ?? '';

      const attachments: any[] = (f['Hình ảnh món'] ?? []).filter(isDisplayable);
      const img      = attachments[0] ?? null;
      const photoUrl = img ? await resolveAttachmentUrl(token, img, extraParam) : null;

      return { id: item.record_id, name, category, photoUrl, instructions, totalCost, recipe, ingredients, courses };
    })
  );

  const filtered = results.filter(r => !!r.name);
  _recipesCache = { data: filtered, expiresAt: Date.now() + CACHE_TTL };
  return filtered;
}

// ─── Lớp Học ─────────────────────────────────────────────────────────────────

export interface LarkClassSession {
  id: string;
  date: string;
  course: string;
  siSo: string;
  studentNames: string;
  giangVien: string;
  photos: string[];
}

// Cột ảnh mới đã lọc ảnh đẹp thủ công trong Lark
const LOP_HOC_PHOTO_FIELD = 'Ảnh lớp học (lọc ảnh đẹp)';

// Trích danh sách text từ field link/formula/single-select.
// Ưu tiên text_arr (link fields) để tách tên sạch, trim khoảng trắng + ký tự xuống dòng.
function extractTextList(raw: any): string {
  if (raw == null) return '';
  if (typeof raw === 'string') return raw.trim();
  if (typeof raw === 'number') return String(raw);
  if (Array.isArray(raw)) {
    return raw.flatMap(v => {
      if (typeof v === 'string') return [v];
      if (typeof v === 'number') return [String(v)];
      if (Array.isArray(v?.text_arr)) return v.text_arr;
      if (v?.text) return [v.text];
      if (v?.name) return [v.name];
      return [];
    }).map((s: any) => String(s).trim()).filter(Boolean).join(', ');
  }
  if (raw?.value != null) return extractTextList(raw.value);
  return (raw?.text ?? '').trim();
}

export async function fetchLarkClassSessions(): Promise<LarkClassSession[]> {
  if (_classesCache && Date.now() < _classesCache.expiresAt) return _classesCache.data;

  const token    = await getLarkToken();
  const appToken = process.env.LARK_BASE_APP_TOKEN!;

  const recordRes = await fetch(
    `${LARK_API}/bitable/v1/apps/${appToken}/tables/${LOP_HOC_TABLE}/records?page_size=100&view_id=${LOP_HOC_VIEW}`,
    { headers: { Authorization: `Bearer ${token}` }, cache: 'no-store' },
  );

  const json = await recordRes.json();
  if (json.code !== 0) throw new Error(`Lark class records error: ${json.msg}`);

  const allItems: any[] = json.data?.items ?? [];

  // Chỉ lấy buổi học có ảnh đẹp — bỏ qua record trống ảnh
  const items = allItems.filter(item =>
    (item.fields[LOP_HOC_PHOTO_FIELD] ?? []).some(isDisplayable),
  );

  const allAttachments = items.flatMap(item => item.fields[LOP_HOC_PHOTO_FIELD] ?? []);
  const extraParam = extractExtraParam(allAttachments);

  const results = await Promise.all(
    items.map(async item => {
      const f = item.fields;

      const rawDate = f['Ngày học'];
      const date = typeof rawDate === 'number'
        ? larkDateToVN(rawDate)
        : (typeof rawDate === 'string' ? rawDate : '');

      const course       = extractTextList(f['Khóa học']);
      const siSo         = extractTextList(f['Sỉ số']);
      const studentNames = extractTextList(f['Danh sách học viên']);
      const giangVien    = extractTextList(f['Họ & Tên Giảng Viên']);

      const attachments: any[] = (f[LOP_HOC_PHOTO_FIELD] ?? []).filter(isDisplayable);
      const photoUrls = await Promise.all(attachments.map(a => resolveAttachmentUrl(token, a, extraParam)));
      const photos = photoUrls.filter((u): u is string => !!u);

      return { id: item.record_id, date, course, siSo, studentNames, giangVien, photos };
    }),
  );

  const filtered = results.filter(s => s.photos.length > 0);
  _classesCache = { data: filtered, expiresAt: Date.now() + CACHE_TTL };
  return filtered;
}

// Incremental — chỉ resolve ảnh của buổi học CHƯA có trong DB.
// existingIds: Set<lark_id> đã tồn tại → bỏ qua, không tốn thêm lượt API.
export async function fetchLarkClassSessionsNew(existingIds: Set<string>): Promise<LarkClassSession[]> {
  const token    = await getLarkToken();
  const appToken = process.env.LARK_BASE_APP_TOKEN!;

  const recordRes = await fetch(
    `${LARK_API}/bitable/v1/apps/${appToken}/tables/${LOP_HOC_TABLE}/records?page_size=100&view_id=${LOP_HOC_VIEW}`,
    { headers: { Authorization: `Bearer ${token}` }, cache: 'no-store' },
  );

  const json = await recordRes.json();
  if (json.code !== 0) throw new Error(`Lark class records error: ${json.msg}`);

  const items: any[] = json.data?.items ?? [];

  // Chỉ xử lý buổi học CHƯA có trong DB VÀ có ảnh đẹp
  const newItems = items.filter(item =>
    !existingIds.has(item.record_id) &&
    (item.fields[LOP_HOC_PHOTO_FIELD] ?? []).some(isDisplayable),
  );

  if (newItems.length === 0) return [];

  const allAttachments = newItems.flatMap(item => item.fields[LOP_HOC_PHOTO_FIELD] ?? []);
  const extraParam = extractExtraParam(allAttachments);

  const results = await Promise.all(
    newItems.map(async item => {
      const f = item.fields;

      const rawDate = f['Ngày học'];
      const date = typeof rawDate === 'number'
        ? larkDateToVN(rawDate)
        : (typeof rawDate === 'string' ? rawDate : '');

      const course       = extractTextList(f['Khóa học']);
      const siSo         = extractTextList(f['Sỉ số']);
      const studentNames = extractTextList(f['Danh sách học viên']);
      const giangVien    = extractTextList(f['Họ & Tên Giảng Viên']);

      const attachments: any[] = (f[LOP_HOC_PHOTO_FIELD] ?? []).filter(isDisplayable);
      const photoUrls = await Promise.all(attachments.map(a => resolveAttachmentUrl(token, a, extraParam)));
      const photos = photoUrls.filter((u): u is string => !!u);

      return { id: item.record_id, date, course, siSo, studentNames, giangVien, photos };
    }),
  );

  return results.filter(s => s.photos.length > 0);
}

// ─── Thời Khóa Biểu (lightweight — không resolve ảnh, tiết kiệm quota) ────────
// Dùng cho cron sync-lich-hoc: 1 token + 1 records fetch = 2 lượt/ngày.

function normalizeLarkCourse(raw: string): string {
  const up = raw.toUpperCase().trim();
  if (up.startsWith('CÔNG TÁC') || up.startsWith('CONG TAC')) return 'Công tác';
  if (up.startsWith('TEST MÓN') || up.startsWith('THỬ MÓN') || up.startsWith('TEST MON') || up.startsWith('THU MON')) return 'Thử món';
  if (up.startsWith('GIẢNG VIÊN OFF') || up.startsWith('GIANG VIEN OFF')) return 'Giảng viên off';
  return raw;
}

export interface LarkScheduleEntry {
  id: string;
  isoDate: string;   // "yyyy-mm-dd" cho Postgres DATE
  course: string;
  siSo: number | null;
  giangVien: string;
}

export async function fetchLarkClassSchedule(): Promise<LarkScheduleEntry[]> {
  const token    = await getLarkToken();
  const appToken = process.env.LARK_BASE_APP_TOKEN!;
  const all: LarkScheduleEntry[] = [];
  let pageToken = '';

  do {
    const base = `${LARK_API}/bitable/v1/apps/${appToken}/tables/${LOP_HOC_TABLE}/records?page_size=100`;
    const url  = pageToken ? `${base}&page_token=${pageToken}` : base;
    const res  = await fetch(url, { headers: { Authorization: `Bearer ${token}` }, cache: 'no-store' });
    const json = await res.json();
    if (json.code !== 0) throw new Error(`Lark schedule error: ${json.msg}`);

    for (const item of (json.data?.items ?? [])) {
      const f         = item.fields;
      const rawDate   = f['Ngày học'];
      const isoDate   = typeof rawDate === 'number' ? larkDateToISO(rawDate) : '';
      const rawCourse = extractTextList(f['Khóa học']) || extractTextList(f['Dự kiến khóa học?']) || '';
      const course    = normalizeLarkCourse(rawCourse);
      const siSoRaw   = extractTextList(f['Sỉ số']);
      const siSo      = siSoRaw ? (parseInt(siSoRaw) || null) : null;
      const giangVien = extractTextList(f['Họ & Tên Giảng Viên']);
      if (isoDate && course) all.push({ id: item.record_id, isoDate, course, siSo, giangVien });
    }

    pageToken = json.data?.has_more ? json.data.page_token : '';
  } while (pageToken);

  return all;
}

// ─── Thống kê Khách hàng (Base "Quản lý công việc" — Bên ngoài) ───────────────
// Đếm khóa học / dịch vụ đã chốt. KHÔNG resolve ảnh → mỗi page = 1 lượt.
// 1.838 bản ghi ≈ 19 page + 1 token ≈ 20 lượt/lần. Chạy 1 lần/sáng qua cron.
const KHACH_HANG_APP_TOKEN = 'Rg8DbDEOSaZsEls6vkylfx2ngrf';
const KHACH_HANG_TABLE     = 'tbl9RhlOHmdqjTa3';

export interface KhachHangStats {
  khoaChotTotal: number;
  khoaChotMonth: number;
  dichVuChotTotal: number;
  dichVuChotMonth: number;
  dichVuBreakdown: Record<string, number>;
}

// Trích timestamp (ms) từ field ngày Lark — robust với number / {value} / array / string.
function extractDateMs(raw: any): number | null {
  if (raw == null) return null;
  if (typeof raw === 'number') return raw > 1e11 ? raw : null;
  if (Array.isArray(raw)) {
    for (const v of raw) { const m = extractDateMs(v); if (m != null) return m; }
    return null;
  }
  if (typeof raw === 'object') {
    if (typeof raw.value === 'number') return extractDateMs(raw.value);
    if (typeof raw.timestamp === 'number') return extractDateMs(raw.timestamp);
    return null;
  }
  if (typeof raw === 'string') {
    const n = Number(raw); if (!isNaN(n) && n > 1e11) return n;
    // dd/mm/yyyy hoặc d/m/yyyy (định dạng Lark text)
    const dmy = raw.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
    if (dmy) {
      const p = Date.parse(`${dmy[3]}-${dmy[2].padStart(2, '0')}-${dmy[1].padStart(2, '0')}`);
      if (!isNaN(p)) return p;
    }
    const p = Date.parse(raw); if (!isNaN(p)) return p;
  }
  return null;
}

// Field select/text → chuỗi. Field multi-select → nối bằng dấu phẩy.
function selectText(raw: any): string {
  if (raw == null) return '';
  if (typeof raw === 'string') return raw.trim();
  if (Array.isArray(raw)) {
    return raw.map(v => (typeof v === 'string' ? v : (v?.text ?? v?.name ?? ''))).filter(Boolean).join(', ').trim();
  }
  return String(raw?.text ?? raw?.name ?? raw ?? '').trim();
}

function fieldNonEmpty(raw: any): boolean {
  if (raw == null) return false;
  if (typeof raw === 'string') return raw.trim() !== '';
  if (Array.isArray(raw)) return raw.length > 0;
  if (typeof raw === 'object') return Object.keys(raw).length > 0;
  return !!raw;
}

export async function fetchLarkKhachHangStats(): Promise<KhachHangStats> {
  const token = await getLarkToken();

  // Mốc tháng hiện tại theo giờ VN (UTC+7)
  const vnNow = new Date(Date.now() + 7 * 3_600_000);
  const curY = vnNow.getUTCFullYear();
  const curM = vnNow.getUTCMonth();
  const inThisMonth = (ms: number | null) => {
    if (ms == null) return false;
    const d = new Date(ms + 7 * 3_600_000);
    return d.getUTCFullYear() === curY && d.getUTCMonth() === curM;
  };

  let khoaChotTotal = 0, khoaChotMonth = 0, dichVuChotTotal = 0, dichVuChotMonth = 0;
  const dichVuBreakdown: Record<string, number> = {};

  let pageToken = '';
  do {
    const base = `${LARK_API}/bitable/v1/apps/${KHACH_HANG_APP_TOKEN}/tables/${KHACH_HANG_TABLE}/records?page_size=500`;
    const url  = pageToken ? `${base}&page_token=${pageToken}` : base;
    const res  = await fetch(url, { headers: { Authorization: `Bearer ${token}` }, cache: 'no-store' });
    const json = await res.json();
    if (json.code !== 0) throw new Error(`Lark khách hàng error: ${json.msg}`);

    for (const item of (json.data?.items ?? [])) {
      const f = item.fields;
      const tinhTrang = selectText(f['Tình trạng']).toUpperCase();
      const isKhoaChot = tinhTrang.includes('ĐÃ CHỐT') || tinhTrang.includes('DA CHOT');
      const dichVuRaw = f['Dịch vụ đã chốt'];
      const hasDichVu = fieldNonEmpty(dichVuRaw);
      const dateMs = extractDateMs(f['Chứng từ thanh toán']);
      const thisMonth = inThisMonth(dateMs);

      if (isKhoaChot) { khoaChotTotal++; if (thisMonth) khoaChotMonth++; }
      if (hasDichVu) {
        dichVuChotTotal++;
        if (thisMonth) dichVuChotMonth++;
        const label = selectText(dichVuRaw);
        for (const part of label.split(',').map(s => s.trim()).filter(Boolean)) {
          dichVuBreakdown[part] = (dichVuBreakdown[part] ?? 0) + 1;
        }
      }
    }

    pageToken = json.data?.has_more ? (json.data.page_token ?? '') : '';
  } while (pageToken);

  return { khoaChotTotal, khoaChotMonth, dichVuChotTotal, dichVuChotMonth, dichVuBreakdown };
}
