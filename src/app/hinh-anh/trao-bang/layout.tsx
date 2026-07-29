import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Trao Bằng Học Viên',
  description: 'Hình ảnh lễ trao bằng học viên Học Viện Cà Phê HCM — ghi lại những khoảnh khắc hoàn thành khóa học.',
};

export default function TraoBangLayout({ children }: { children: React.ReactNode }) {
  return children;
}
