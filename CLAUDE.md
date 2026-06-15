# Học Viện Cà Phê HCM — Next.js Project

## Stack
- Next.js 16 App Router, TypeScript, Vanilla CSS (`src/app/globals.css`)
- Supabase (auth + DB): `@supabase/ssr`, `createBrowserClient`
- Font: Be Vietnam Pro. Icons: Tabler Icons CDN (`ti ti-*`)
- Branch: `nextjs` on `kaizy1227/hocviencaphehcm`

## Key files
- `src/app/page.tsx` — Trang chủ (courses từ Supabase + static fallback)
- `src/app/gioi-thieu/page.tsx` — Giới thiệu + giảng viên
- `src/app/cong-thuc/page.tsx` — Công thức (auth-protected)
- `src/app/admin/page.tsx` — Admin panel (leads/students/courses tabs)
- `src/app/globals.css` — Toàn bộ CSS, CSS variables ở đầu file
- `src/proxy.ts` — Middleware (Next.js 16 dùng `proxy` thay `middleware`, export `proxy()`)
- `src/lib/supabase/client.ts` — `createBrowserClient`

## Deploy
```
vercel --prod --scope vuthanhhais-projects --yes
```

## Supabase
- URL: `NEXT_PUBLIC_SUPABASE_URL` (xem `.env.local`)
- Tables: `leads` (đăng ký tư vấn), `students` (học viên), `courses` (khóa học)
- Admin phone: `0834790555` → email `0834790555@hocviencaphehcm.vn`
- Admin role: `user.app_metadata?.role === 'admin'`

## Courses pattern
- `TONG_HOP_DISPLAY` — static display data (emoji, image, style)
- DB `courses` table — editable data (price, desc, duration)
- Merge by name match in `useEffect`
- Categories: `tong-hop` | `chuyen-de` | `kinh-doanh`

## CSS conventions
- Variables: `--accent: #B05A10`, `--bg-dark: #1E0C04`, `--bg-alt: #F5EDE1`
- Edit tool thường lỗi CRLF → dùng PowerShell regex replace cho CSS blocks lớn

## Instructors (public/images/)
- `giangvien_Liem.jpg` — Đoàn Hồng Liêm, Trưởng PĐT, cựu QL Phúc Long
- `giangvien_An.jpg` — Bùi Trần Thiên Ân, chuyên gia sáng tạo đồ uống, nền tảng nghệ thuật
