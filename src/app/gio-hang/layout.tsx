import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Giỏ Hàng & Đặt Hàng',
  description: 'Xem lại sản phẩm và hoàn tất đặt hàng nguyên liệu, dụng cụ pha chế.',
  robots: { index: false },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
