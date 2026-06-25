import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Tài Khoản của tôi',
  description: 'Quản lý thông tin cá nhân, địa chỉ giao hàng mặc định.',
  robots: { index: false },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
