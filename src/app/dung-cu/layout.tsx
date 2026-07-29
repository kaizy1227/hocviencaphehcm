import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Bảng Giá Dụng Cụ Pha Chế',
  description: 'Dụng cụ pha chế cà phê, trà sữa chuyên nghiệp — máy xay, bình pha, dụng cụ bar cho quán và học viên.',
  openGraph: {
    title: 'Bảng Giá Dụng Cụ Pha Chế | Học Viện Cà Phê HCM',
    description: 'Dụng cụ pha chế chuyên nghiệp, đầy đủ chủng loại. Giao hàng toàn quốc.',
    images: [{ url: '/images/about.webp', width: 1200, height: 630, alt: 'Dụng Cụ Pha Chế Học Viện Cà Phê' }],
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
