import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Kho Công Thức | Học Viện Cà Phê HCM',
  description: 'Công thức nội bộ kèm nguyên liệu đặt mua và công thức chia sẻ từ cộng đồng pha chế.',
  openGraph: {
    title: 'Kho Công Thức | Học Viện Cà Phê HCM',
    description: 'Công thức nội bộ kèm nguyên liệu đặt mua và công thức chia sẻ từ cộng đồng pha chế.',
  },
  alternates: { canonical: '/kho-cong-thuc' },
};

export default function KhoCongThucLayout({ children }: { children: React.ReactNode }) {
  return children;
}
