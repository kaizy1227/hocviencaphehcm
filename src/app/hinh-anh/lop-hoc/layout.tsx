import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Hình Ảnh Lớp Học',
  description: 'Hình ảnh thực tế từ các buổi học tại Học Viện Cà Phê HCM — lớp nhỏ, kèm 1–1, thiết bị thật.',
};

export default function LopHocLayout({ children }: { children: React.ReactNode }) {
  return children;
}
