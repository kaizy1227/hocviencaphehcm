import type { Metadata, Viewport } from 'next';
import { Be_Vietnam_Pro } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import FloatingButtons from '@/components/FloatingButtons';
import CartDrawer from '@/components/CartDrawer';
import { CartProvider } from '@/context/CartContext';
import { WishlistProvider } from '@/context/WishlistContext';

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
  metadataBase: new URL('https://hocviencaphehcm-next.vercel.app'),
  title: {
    default: 'Học Viện Cà Phê | Nơi Khởi Nguồn Kinh Doanh Của Bạn',
    template: '%s | Học Viện Cà Phê HCM',
  },
  description: 'Đào tạo pha chế cà phê, trà sữa và tư vấn mở quán bài bản — từ công thức, set up menu đến vận hành kinh doanh.',
  openGraph: {
    siteName: 'Học Viện Cà Phê HCM',
    title: 'Học Viện Cà Phê | Nơi Khởi Nguồn Kinh Doanh Của Bạn',
    description: 'Đào tạo pha chế cà phê, trà sữa và tư vấn mở quán bài bản — từ công thức, set up menu đến vận hành kinh doanh.',
    images: [{ url: '/images/about.jpg', width: 1200, height: 630, alt: 'Học Viện Cà Phê HCM' }],
    url: 'https://hocviencaphehcm-next.vercel.app',
    type: 'website',
    locale: 'vi_VN',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Học Viện Cà Phê | Nơi Khởi Nguồn Kinh Doanh Của Bạn',
    description: 'Đào tạo pha chế cà phê, trà sữa và tư vấn mở quán bài bản — từ công thức, set up menu đến vận hành kinh doanh.',
    images: ['/images/about.jpg'],
  },
  alternates: { canonical: '/' },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi" className={beVietnam.variable} data-scroll-behavior="smooth">
      <head>
        <link rel="icon" type="image/png" href="/images/logo.png" />
        <link rel="apple-touch-icon" href="/images/logo.png" />
      </head>
      <body>
        <CartProvider>
          <WishlistProvider>
            <Navbar />
            <FloatingButtons />
            <CartDrawer />
            {children}
            <Footer />
          </WishlistProvider>
        </CartProvider>
      </body>
    </html>
  );
}
