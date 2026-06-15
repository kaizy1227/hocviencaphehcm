import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Giới Thiệu',
  description: 'Câu chuyện và sứ mệnh của Học Viện Cà Phê HCM — nơi đào tạo pha chế & đồng hành mở quán cà phê, trà sữa bài bản.',
  openGraph: {
    title: 'Giới Thiệu | Học Viện Cà Phê HCM',
    description: 'Câu chuyện và sứ mệnh của Học Viện Cà Phê HCM — nơi đào tạo pha chế & đồng hành mở quán cà phê, trà sữa bài bản.',
    url: 'https://hocviencaphehcm-next.vercel.app/gioi-thieu',
  },
  twitter: {
    title: 'Giới Thiệu | Học Viện Cà Phê HCM',
    description: 'Câu chuyện và sứ mệnh của Học Viện Cà Phê HCM — nơi đào tạo pha chế & đồng hành mở quán cà phê, trà sữa bài bản.',
  },
  alternates: { canonical: '/gioi-thieu' },
};

export default function GioiThieuLayout({ children }: { children: React.ReactNode }) {
  return children;
}
