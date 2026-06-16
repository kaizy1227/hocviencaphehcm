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
