import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Tạo Tài Khoản Học Viên',
  description: 'Đăng ký tài khoản để truy cập kho công thức pha chế độc quyền của Học Viện Cà Phê HCM.',
  alternates: { canonical: '/dang-ky-hoc-vien' },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
