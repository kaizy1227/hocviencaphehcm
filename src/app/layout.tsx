import type { Metadata, Viewport } from 'next';
import { Be_Vietnam_Pro } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import FloatingButtons from '@/components/FloatingButtons';

const beVietnam = Be_Vietnam_Pro({
  variable: '--font-be-vietnam',
  subsets: ['latin', 'vietnamese'],
  weight: ['400', '500', '600', '700', '800', '900'],
  display: 'swap',
});

export const viewport: Viewport = {
  themeColor: '#B05A10',
};

export const metadata: Metadata = {
  title: 'Học Viện Cà Phê | Nơi Khởi Nguồn Kinh Doanh Của Bạn',
  description: 'Đào tạo pha chế cà phê, trà sữa và tư vấn mở quán bài bản — từ công thức, set up menu đến vận hành kinh doanh.',
  openGraph: {
    title: 'Học Viện Cà Phê | Nơi Khởi Nguồn Kinh Doanh Của Bạn',
    description: 'Đào tạo pha chế cà phê, trà sữa và tư vấn mở quán bài bản — từ công thức, set up menu đến vận hành kinh doanh.',
    images: ['/images/gallery/Life-styles-with-person/~12816.webp'],
    type: 'website',
  },
  twitter: { card: 'summary_large_image' },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi" className={beVietnam.variable}>
      <head>
        <link rel="icon" type="image/png" href="/images/logo.png" />
        <link rel="apple-touch-icon" href="/images/logo.png" />
      </head>
      <body>
        <Navbar />
        <FloatingButtons />
        {children}
        <Footer />
      </body>
    </html>
  );
}
