import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Liên Hệ',
  description: 'Liên hệ Học Viện Cà Phê HCM — tư vấn khóa học, đặt hàng nguyên liệu, mở quán. Hotline: 0834.790.555',
  openGraph: {
    title: 'Liên Hệ | Học Viện Cà Phê HCM',
    description: 'Tư vấn khóa học pha chế, đặt hàng nguyên liệu, tư vấn mở quán cà phê trà sữa.',
    images: [{ url: '/images/about.webp', width: 1200, height: 630 }],
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
