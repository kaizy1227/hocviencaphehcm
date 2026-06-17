import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Công Thức 2 | Học Viện Cà Phê HCM',
  description: 'Kho công thức pha chế thực tế — đầy đủ hướng dẫn, tổng cost và công thức chi tiết dành cho học viên.',
  openGraph: {
    title: 'Công Thức 2 | Học Viện Cà Phê HCM',
    description: 'Kho công thức pha chế thực tế — đầy đủ hướng dẫn, tổng cost và công thức chi tiết dành cho học viên.',
    url: 'https://hocviencaphehcm-next.vercel.app/cong-thuc-2',
  },
  alternates: { canonical: '/cong-thuc-2' },
};

export default function CongThuc2Layout({ children }: { children: React.ReactNode }) {
  return children;
}
