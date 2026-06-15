import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Đăng Ký Tư Vấn Miễn Phí',
  description: 'Để lại thông tin — tư vấn viên liên hệ trong 30 phút. Học pha chế cà phê, trà sữa và tư vấn mở quán bài bản.',
  openGraph: {
    title: 'Đăng Ký Tư Vấn Miễn Phí | Học Viện Cà Phê HCM',
    description: 'Để lại thông tin — tư vấn viên liên hệ trong 30 phút.',
    url: 'https://hocviencaphehcm-next.vercel.app/dang-ky',
  },
  alternates: { canonical: '/dang-ky' },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
