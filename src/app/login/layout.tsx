import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Đăng Nhập',
  description: 'Đăng nhập để truy cập kho công thức pha chế độc quyền dành cho học viên Học Viện Cà Phê HCM.',
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return children;
}
