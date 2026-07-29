import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Bảng Giá Nguyên Liệu',
  description: 'Nguyên liệu pha chế cà phê, trà sữa chất lượng cao — cung cấp sỉ và lẻ cho quán và học viên. Hơn 100+ mặt hàng thương mại và thương hiệu.',
  openGraph: {
    title: 'Bảng Giá Nguyên Liệu | Học Viện Cà Phê HCM',
    description: 'Nguyên liệu pha chế chất lượng cao, giá cạnh tranh. Cung cấp sỉ và lẻ toàn quốc.',
    images: [{ url: '/images/about.webp', width: 1200, height: 630, alt: 'Nguyên Liệu Học Viện Cà Phê' }],
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
