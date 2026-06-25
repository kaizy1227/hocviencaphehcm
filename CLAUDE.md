# Học Viện Cà Phê HCM — Next.js Project

## Stack
- Next.js 16 App Router, TypeScript, Vanilla CSS (`src/app/globals.css`)
- Supabase (auth + DB): `@supabase/ssr`, `createBrowserClient`
- Font: Be Vietnam Pro. Icons: Tabler Icons CDN (`ti ti-*`)
- Deploy: `vercel deploy --prod` (cwd = project root)
- Live: `https://hocviencaphehcm-next.vercel.app`

## Routes & nguồn dữ liệu
| Route | Dữ liệu |
|-------|---------|
| `/` | Supabase `courses` |
| `/gioi-thieu` | Static |
| `/cong-thuc` | Supabase (auth-protected) |
| `/nguyen-lieu` | Supabase `products` |
| `/dung-cu` | Supabase `dung_cu` |
| `/hinh-anh/trao-bang` | Lark Base API |
| `/hinh-anh/lop-hoc` | Lark Base API |
| `/admin` | Supabase (role=admin) |
| `/login` | Supabase Auth |
| `/dang-ky` | Supabase `leads` |

## Key files
- `src/components/Navbar.tsx` — Navbar, 2 dropdowns click-based (spRef+spOpen, ddRef+ddOpen)
- `src/app/globals.css` — Toàn bộ CSS (CSS vars ở đầu file)
- `src/app/admin/page.tsx` — Admin panel: 5 tabs (leads/students/content/products/tools)
- `src/app/nguyen-lieu/page.tsx` — Template bảng giá (dung-cu reuse cùng pattern)
- `src/app/dung-cu/page.tsx` — Bảng giá dụng cụ
- `src/lib/lark.ts` — Lark API: getLarkToken, fetchLarkStudents, fetchLarkClassSessions
- `src/proxy.ts` — Middleware (Next.js 16 dùng `proxy` export, không phải `middleware`)

## Supabase
- Tables: `leads`, `students`, `courses`, `products`, `dung_cu`
- Admin: phone `0834790555` → `0834790555@hocviencaphehcm.vn`, `app_metadata.role === 'admin'`
- `dung_cu`: 119 sản phẩm, ảnh static tại `/public/images/dung-cu/`
- `products`: ảnh upload vào Supabase Storage bucket `products`
- RLS: `dung_cu` + `products` có policy "Public read" (select không cần auth)

## CSS variables quan trọng
```css
--accent: #B05A10
--bg-dark: #1E0C04
--bg-alt: #F5EDE1
--nav-h: 64px  /* padding-top cho tất cả page chính */
```

## CSS class prefixes
- `nl-` Nguyên Liệu/Dụng Cụ · `tb-` Trao Bằng · `lh-` Lớp Học
- `ct-` Công Thức · `gv-` Giảng Viên · `admin-` Admin · `nav-`/`mob-` Navbar

## Navbar patterns
- 2 dropdowns click-based: "Sản Phẩm" và "Hình Ảnh" — mỗi cái có `xxxRef` + `xxxOpen` state + outside-click useEffect
- Mobile: accordion với `expanded` state + `toggle(key)`
- Logo: chỉ `<img>`, không text

## ⚠️ LARK API QUOTA — ĐỌC TRƯỚC KHI THAY ĐỔI LARK CODE

**Giới hạn: 10.000 lượt/tháng** (reset đầu tháng). Tháng đầu đã hết sạch trong vài ngày.

### Chi phí mỗi thao tác
| Thao tác | Lượt API |
|----------|----------|
| `getLarkToken()` | 1 (cached 90 phút) |
| Fetch 1 page records (page_size=100) | 1 |
| `fetchLarkRecipes()` — 105 món | 2 (pagination) + 105 (attachment) = **~107/lần gọi** |
| `fetchLarkStudents()` — ~20 HV | 1 + 20 (attachment) = **~21/lần gọi** |
| `fetchLarkClassSessions()` | 1 + n ảnh = **biến đổi** |
| `fetchLarkVideos()` | 1 + n file = **biến đổi** |

### Quy tắc bắt buộc
1. **KHÔNG dùng `cache: 'no-store'` trừ khi dữ liệu thay đổi liên tục** — dùng in-memory cache hoặc ISR
2. **In-memory cache đã có trong `lark.ts`** (`_recipesCache`, `_studentsCache`...) — TTL 10 phút. KHÔNG xóa cache này
3. **Mỗi lần gọi `/api/lark-recipes` tốn ~107 lượt** — page đã cache client-side (chỉ fetch 1 lần khi load)
4. **Trước khi thêm field mới** (attachment/lookup): ước tính số lượt tăng thêm và báo cho user
5. **Không gọi Lark API trực tiếp trong terminal để test** — mỗi node script debug tốn 1+ lượt
6. **Khi quota gần hết** (>8.000 lượt): cảnh báo user ngay, không tiếp tục thêm Lark features

### Cách kiểm tra quota còn lại
Vào: `https://nsgwlr013491.sg.larksuite.com/admin/billing/equity-data` → mục "API usage"

### Tối ưu đã có
- `_tokenCache`: token cached 90 phút (1 lượt thay vì 1 lượt/request)
- `_recipesCache`, `_studentsCache`, v.v.: data cached 10 phút trong RAM server

## Lark attachment URL flow
```
attachment.tmp_url  →  fetch(Bearer token)  →  data.tmp_download_urls[0].tmp_download_url
```
- Gọi từng attachment riêng (batch không work)
- Fallback: `extractExtraParam()` lấy `extra` param từ record khác → `/drive/v1/medias/{file_token}/tmp_download_url?extra=...`
- Field đúng cho lớp học: `Ảnh lớp học Copy` (không phải `Ảnh lớp học`)

## Public images
- `giangvienLiem.jpg` — Thầy Đoàn Hồng Liêm
- `giangvienAn.jpg` — Thầy Bùi Trần Thiên Ân
- `images/dung-cu/` — 119 ảnh dụng cụ (trích từ Google Doc, không cần upload thủ công)

---

## [Session 2026-06-19] Kiến trúc đã chốt

### Tab "Khóa Học" & "Dịch Vụ" — navbar items, không phải on-page tabs

**Quyết định:** "Khóa Học" và "Dịch Vụ" là 2 link trong `nav-left` của Navbar, không phải tab button trong page. User muốn chúng nằm ngang hàng "Trang Chủ", "Giới Thiệu".

**Cơ chế:**
- `Khóa Học` → `href="/#courses"` (tab mặc định)
- `Dịch Vụ` → `href="/?tab=dich-vu#courses"` (URL param để switch tab)
- `page.tsx` đọc param bằng `useEffect` + `window.location.search` (không dùng `useSearchParams` để tránh cần Suspense boundary):
  ```tsx
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('tab') === 'dich-vu') setCourseTab('services');
  }, []);
  ```
- State: `const [courseTab, setCourseTab] = useState<'courses' | 'services'>('courses');`
- Section `#courses` và `#services` đã **gộp thành 1 section** `id="courses"`. Section `#services` đã xóa hoàn toàn.
- Tất cả link `/#services` trong Footer/Navbar đã đổi thành `/#courses`.

**CSS thừa:** `.hp-tabs`, `.hp-tab-btn` trong `globals.css` — đã thêm nhưng on-page tab buttons đã bị xóa, có thể dọn dẹp sau.

---

## Việc đang làm dở / Pending

1. **`trao_bang_insert.sql`** — file đã tạo tại gốc project, chưa chạy. User cần vào Supabase SQL Editor và chạy thủ công. File insert 18 học viên local với `lark_id LIKE 'local_%'`.

2. **Lark permission thiếu** — App `cli_a9b909147e38deee` cần thêm scope `bitable:app:readonly` trong Lark Developer Console. Chưa fix, user đồng ý để sau.

3. **Nav overflow** — `nav-left` hiện có 7 items (Trang Chủ, Giới Thiệu, Khóa Học, Dịch Vụ, Công Thức, Công Thức 2, Kho CT). Chưa test responsive trên màn hình trung bình (1024px–1280px). Nếu bị overflow thì cần bỏ bớt hoặc dùng dropdown.
