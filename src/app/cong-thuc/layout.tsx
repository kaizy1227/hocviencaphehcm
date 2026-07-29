import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Tính Cost Ly Nước | Công Cụ Miễn Phí',
  description: 'Tính giá vốn, lợi nhuận và giá bán tối ưu cho từng ly thức uống. Chọn nguyên liệu từ kho Học Viện hoặc tự nhập — không cần đăng nhập.',
  openGraph: {
    title: 'Tính Cost Ly Nước | Học Viện Cà Phê HCM',
    description: 'Tính giá vốn, lợi nhuận và giá bán tối ưu cho từng ly thức uống.',
    url: 'https://hocviencaphehcm-next.vercel.app/cong-thuc',
  },
  twitter: {
    title: 'Tính Cost Ly Nước | Học Viện Cà Phê HCM',
    description: 'Tính giá vốn, lợi nhuận và giá bán tối ưu cho từng ly thức uống.',
  },
  alternates: { canonical: '/cong-thuc' },
};

export default function CongThucLayout({ children }: { children: React.ReactNode }) {
  return children;
}
