import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Công Thức Pha Chế',
  description: '36 công thức pha chế độc quyền — Kombucha, Matcha, Cà phê đặc sản. Từ nguyên liệu đến cách pha chi tiết.',
  openGraph: {
    title: 'Công Thức Pha Chế | Học Viện Cà Phê HCM',
    description: '36 công thức pha chế độc quyền — Kombucha, Matcha, Cà phê đặc sản. Từ nguyên liệu đến cách pha chi tiết.',
    url: 'https://hocviencaphehcm-next.vercel.app/cong-thuc',
  },
  twitter: {
    title: 'Công Thức Pha Chế | Học Viện Cà Phê HCM',
    description: '36 công thức pha chế độc quyền — Kombucha, Matcha, Cà phê đặc sản. Từ nguyên liệu đến cách pha chi tiết.',
  },
  alternates: { canonical: '/cong-thuc' },
};

export default function CongThucLayout({ children }: { children: React.ReactNode }) {
  return children;
}
