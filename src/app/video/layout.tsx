import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Tư Liệu Video',
  description: 'Tư liệu video pha chế, đào tạo và vận hành từ Học Viện Cà Phê HCM.',
};

export default function VideoLayout({ children }: { children: React.ReactNode }) {
  return children;
}
