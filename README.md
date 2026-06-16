# Học Viện Cà Phê HCM

Website chính thức của **Học Viện Cà Phê HCM** — đào tạo pha chế cà phê, trà sữa và tư vấn mở quán bài bản. Được xây dựng bằng Next.js 16 App Router, tích hợp Supabase và Lark Base API.

**Live:** https://hocviencaphehcm-next.vercel.app

---

## Tech Stack

| Layer | Công nghệ |
|-------|-----------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Vanilla CSS (`globals.css`) + CSS Variables |
| Font | Be Vietnam Pro (Google Fonts) |
| Icons | Tabler Icons CDN (`ti ti-*`) |
| Database & Auth | Supabase (`@supabase/ssr`) |
| Gallery API | Lark Base API |
| Video processing | fluent-ffmpeg + ffmpeg-static |
| Deploy | Vercel |

---

## Cài đặt và chạy

### 1. Cài dependencies

```bash
npm install
```

### 2. Tạo file `.env.local`

```env
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
LARK_APP_ID=...
LARK_APP_SECRET=...
```

### 3. Chạy môi trường dev

```bash
npm run dev
```

Mở [http://localhost:3000](http://localhost:3000)

### 4. Build production

```bash
npm run build
npm start
```

### 5. Deploy lên Vercel

```bash
vercel deploy --prod
```

---

## Cấu trúc thư mục chính

```
hocviencaphehcm-next/
├── src/
│   ├── app/
│   │   ├── page.tsx                  # Trang chủ
│   │   ├── layout.tsx                # Root layout
│   │   ├── globals.css               # Toàn bộ CSS (CSS vars ở đầu file)
│   │   ├── gioi-thieu/               # Trang giới thiệu (static)
│   │   ├── cong-thuc/                # Công thức pha chế (auth-protected)
│   │   ├── nguyen-lieu/              # Bảng giá nguyên liệu (Supabase)
│   │   ├── dung-cu/                  # Bảng giá dụng cụ (Supabase)
│   │   ├── hinh-anh/
│   │   │   ├── trao-bang/            # Ảnh trao bằng (Lark Base API)
│   │   │   └── lop-hoc/             # Ảnh lớp học (Lark Base API)
│   │   ├── video/                    # Trang video pha chế
│   │   ├── dang-ky/                  # Form đăng ký tư vấn
│   │   ├── dang-ky-hoc-vien/         # Form đăng ký học viên
│   │   ├── admin/                    # Admin panel (role=admin)
│   │   ├── login/                    # Đăng nhập Supabase Auth
│   │   └── api/
│   │       ├── videos/               # API lấy danh sách video
│   │       ├── video-proxy/          # Proxy stream video
│   │       ├── video-thumb/          # Tạo thumbnail từ ffmpeg
│   │       ├── lark-students/        # API học viên từ Lark
│   │       ├── lark-classes/         # API lớp học từ Lark
│   │       └── register-student/     # Đăng ký học viên
│   ├── components/
│   │   ├── Navbar.tsx                # Navbar với 2 dropdown click-based
│   │   ├── Footer.tsx                # Footer
│   │   ├── FloatingButtons.tsx       # Nút nổi (Zalo, FB, Phone, Back to top)
│   │   └── CartDrawer.tsx            # Giỏ hàng drawer
│   ├── context/
│   │   └── CartContext.tsx           # Cart state (React Context)
│   └── lib/
│       ├── lark.ts                   # Lark API helpers
│       └── supabase/
│           ├── client.ts             # Browser Supabase client
│           └── server.ts             # Server Supabase client
├── public/
│   ├── images/
│   │   ├── gallery/                  # Ảnh gallery (Life-styles, Concept-studio)
│   │   ├── courses/                  # Ảnh bảng giá khóa học
│   │   ├── products/                 # Ảnh nguyên liệu
│   │   ├── dung-cu/                  # Ảnh 119 dụng cụ
│   │   ├── services/                 # Ảnh gói kinh doanh
│   │   └── students/                 # Ảnh học viên
│   └── videos/                       # Video pha chế + thumbs/
├── CLAUDE.md                         # Ghi chú kỹ thuật cho AI assistant
└── package.json
```

---

## Tính năng đã có

### Trang công khai
- **Trang chủ** — Hero slideshow, stats, story strip, danh sách khóa học, menu đồ uống (marquee), carousel học viên, form đăng ký tư vấn
- **Giới Thiệu** — Câu chuyện học viện, thông tin giảng viên
- **Công Thức Pha Chế** — Danh sách công thức (yêu cầu đăng nhập)
- **Nguyên Liệu** — Bảng giá nguyên liệu kéo từ Supabase, có filter theo danh mục
- **Dụng Cụ** — Bảng giá 119 dụng cụ từ Supabase, có filter
- **Hình Ảnh → Trao Bằng** — Thư viện ảnh trao bằng lấy từ Lark Base API
- **Hình Ảnh → Lớp Học** — Thư viện ảnh lớp học lấy từ Lark Base API
- **Video** — Grid video pha chế lưu tại `public/videos/`, có thumbnail auto-gen
- **Đăng Ký Tư Vấn** — Form lưu vào Supabase `leads`

### Hệ thống nội bộ
- **Đăng nhập** — Supabase Auth (email/password)
- **Admin Panel** — 5 tabs: Leads, Học viên, Nội dung, Sản phẩm, Công cụ
- **Giỏ hàng** — CartContext + CartDrawer (cho trang nguyên liệu / dụng cụ)

### API Routes
- `GET /api/videos` — Quét `public/videos/`, trả danh sách video kèm thumbnail
- `GET /api/video-thumb` — Stream thumbnail qua ffmpeg
- `GET /api/video-proxy` — Proxy stream video file
- `POST /api/register-student` — Lưu đăng ký học viên
- `GET /api/lark-students` — Học viên từ Lark Base
- `GET /api/lark-classes` — Lịch lớp học từ Lark Base

### SEO & Meta
- `sitemap.ts` và `robots.ts` tự động generate
- Open Graph + Twitter Card đầy đủ trên mỗi trang
- Canonical URL

---

## Supabase Schema

| Table | Mục đích |
|-------|----------|
| `leads` | Form đăng ký tư vấn |
| `students` | Học viên đã học |
| `courses` | Khóa học & giá |
| `products` | Nguyên liệu (ảnh trong Storage bucket `products`) |
| `dung_cu` | Dụng cụ (ảnh static tại `/public/images/dung-cu/`) |

Admin account: `0834790555@hocviencaphehcm.vn` — `app_metadata.role === 'admin'`
