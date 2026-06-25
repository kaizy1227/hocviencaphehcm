import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sản Phẩm Yêu Thích',
  description: 'Danh sách sản phẩm nguyên liệu và dụng cụ pha chế bạn đã lưu.',
  robots: { index: false },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
