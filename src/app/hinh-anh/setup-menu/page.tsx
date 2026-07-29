import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import s from './page.module.css';
import SetupMenuGallery from './SetupMenuGallery';
import ServiceCardsClient from './ServiceCardsClient';

export const revalidate = 60;

export default async function SetupMenuPage() {
  const supabase = await createClient();
  const { data: shops } = await supabase
    .from('instructor_shops')
    .select('id, name, map_url, logo_url, location')
    .eq('active', true)
    .order('display_order');

  const allShops = shops ?? [];

  return (
    <div className={s.page} style={{ paddingTop: 'var(--nav-h, 64px)' }}>
      {/* Header */}
      <div className={s.pageHeader}>
        <div className="container">
          <nav className={s.breadcrumb} aria-label="Breadcrumb">
            <Link href="/">Trang Chủ</Link>
            <span>›</span>
            <Link href="/dich-vu">Dịch Vụ</Link>
            <span>›</span>
            <span aria-current="page">Setup Menu</span>
          </nav>
          <span className={s.eyebrow}>Dịch vụ chuyên nghiệp</span>
          <h1 className={s.pageH1}>Setup Menu<br /><em>Chuẩn gu khách</em></h1>
          <p className={s.pageLead}>
            Đội ngũ Học Viện Cà Phê HCM đã trực tiếp setup menu cho hàng chục quán trên khắp cả nước — từ ý tưởng đến tách cà phê hoàn chỉnh.
          </p>
        </div>
      </div>

      {/* Service Cards */}
      <section className={s.serviceSection}>
        <div className="container">
          <p className={s.sectionLabel}><i className="ti ti-tools"></i> Các Gói Dịch Vụ</p>
          <ServiceCardsClient />
          <div className={s.serviceCtaRow}>
            <span className={s.serviceCtaText}>Chưa biết nên chọn gói nào?</span>
            <Link href="/dang-ky" className={s.serviceCtaBtn}>
              <i className="ti ti-message-dots"></i> Nhận Tư Vấn Miễn Phí
            </Link>
          </div>
        </div>
      </section>

      {/* Shops social proof */}
      {allShops.length > 0 && (
        <section id="doi-tac" className={s.shopsSection}>
          <div className="container">
            <div className={s.shopsSectionHeader}>
              <div>
                <p className={s.sectionLabel}><i className="ti ti-award"></i> Đối Tác Đã Tin Tưởng</p>
                <p className={s.shopsSectionSub}>
                  Tin tưởng từ hàng chục quán cà phê &amp; trà sữa trên khắp cả nước
                  <span className={s.shopsMore}> — và nhiều quán khác...</span>
                </p>
              </div>
            </div>
          </div>
          <div className={s.shopsTrackWrap}>
            <div className={s.shopsTrack}>
              {[...allShops, ...allShops].map((shop, idx) => (
                <a
                  key={`${shop.id}-${idx}`}
                  href={shop.map_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={s.shopCard}
                >
                  {shop.logo_url ? (
                    <img src={shop.logo_url} alt={shop.name} className={s.shopLogo} />
                  ) : (
                    <div className={s.shopLogoPlaceholder}>☕</div>
                  )}
                  <span className={s.shopName}>{shop.name}</span>
                  {shop.location && <span className={s.shopLocation}>{shop.location}</span>}
                  <span className={s.shopMapHint}><i className="ti ti-map-pin"></i> Xem bản đồ</span>
                </a>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Photo gallery (client — lightbox) */}
      <SetupMenuGallery />
    </div>
  );
}
