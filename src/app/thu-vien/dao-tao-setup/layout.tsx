import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Đào Tạo - Setup',
  description: 'Tư liệu video thực tế từ các buổi đào tạo, setup menu và đồng hành vận hành tại Học Viện Cà Phê HCM.',
};

export default function DaoTaoSetupLayout({ children }: { children: React.ReactNode }) {
  return children;
}
