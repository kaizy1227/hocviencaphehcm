'use client';
import { useState } from 'react';
import Link from 'next/link';
import s from './page.module.css';

const ALL_SERVICES = [
  {
    slug: 'setup-menu',
    index: '01 · Menu nhỏ gọn',
    name: 'Gói Set Up Menu',
    price: '7.000.000đ',
    desc: 'Menu tinh gọn dưới 10 món — xây dựng 2–3 signature độc quyền, thiết kế menu, tính cost từng món và test món 2 buổi thực tế.',
    tags: ['Dưới 10 món', '2–3 Signature', 'Test món 2 lần', 'Tư vấn thiết bị'],
    img: '/images/services/setup-menu-7tr.webp',
    imgAlt: 'Gói Setup Menu dưới 10 món',
  },
  {
    slug: 'setup-menu-15',
    index: '02 · Menu hoàn chỉnh',
    name: 'Setup Menu 15–20 Món',
    price: '15.000.000đ',
    desc: 'Menu độc quyền toàn diện — 3–5 signature nổi bật, cost toàn bộ nguyên vật liệu, tư vấn thiết bị và 2 buổi test tại Học Viện.',
    tags: ['15–20 món', '3–5 Signature', 'Cost toàn bộ', 'Tư vấn nguyên liệu'],
    img: '/images/services/setup-menu-15-20-mon.webp',
    imgAlt: 'Setup Menu 15-20 món',
  },
  {
    slug: 'dao-tao-van-hanh',
    index: '03 · Quản trị quán',
    name: 'Đào Tạo Vận Hành',
    price: '15.000.000đ',
    desc: 'Vận hành chuẩn, quản trị chặt — xây dựng chính sách, quản lý nhân sự, kiểm soát chi phí & doanh thu. Hỗ trợ online 1 tháng.',
    tags: ['Quy trình vận hành', 'Quản lý nhân sự', 'Kiểm soát doanh thu', 'Hỗ trợ 1 tháng'],
    img: '/images/services/dao-tao-van-hanh-v2.webp',
    imgAlt: 'Đào Tạo Vận Hành quán cà phê',
  },
  {
    slug: 'dao-tao-tai-quan',
    index: '04 · Triển khai tại chỗ',
    name: 'Đào Tạo Tại Quán',
    price: 'Từ 2.300.000đ/ngày',
    desc: 'Giảng viên đến trực tiếp quán — đào tạo nhân viên pha chế, thiết lập quy trình bar & hỗ trợ sắp xếp thiết bị phù hợp thực tế.',
    tags: ['Tại mặt bằng quán', 'Đào tạo nhân viên', 'Thiết lập quầy bar', 'Theo ca thực tế'],
    img: '/images/services/dao-tao-tai-quan.webp',
    imgAlt: 'Đào Tạo Tại Quán cà phê trà sữa',
  },
];

export default function ServiceCardsClient() {
  const [lbImg, setLbImg] = useState<{ src: string; alt: string } | null>(null);

  return (
    <>
      <div className={s.serviceGrid}>
        {ALL_SERVICES.map(sv => (
          <div key={sv.slug} className={s.serviceCard}>
            <button
              className={s.serviceImgBtn}
              onClick={() => setLbImg({ src: sv.img, alt: sv.imgAlt })}
              aria-label={`Xem ảnh ${sv.name}`}
            >
              <img src={sv.img} alt={sv.imgAlt} loading="lazy" className={s.serviceImg} />
              <span className={s.serviceImgHint}><i className="ti ti-zoom-in"></i></span>
            </button>
            <div className={s.serviceCardBody}>
              <span className={s.serviceIndex}>{sv.index}</span>
              <h3 className={s.serviceName}>{sv.name}</h3>
              <p className={s.serviceDesc}>{sv.desc}</p>
              <div className={s.serviceTags}>
                {sv.tags.map(t => <span key={t} className={s.serviceTag}>{t}</span>)}
              </div>
              <div className={s.serviceFooter}>
                <span className={s.servicePrice}>{sv.price}</span>
                <Link href={`/dich-vu/${sv.slug}`} className={s.serviceBtn}>
                  Xem Chi Tiết <i className="ti ti-arrow-right"></i>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {lbImg && (
        <div className={s.lbOverlay} onClick={() => setLbImg(null)} role="dialog" aria-modal="true" aria-label="Xem ảnh dịch vụ">
          <button className={s.lbClose} onClick={() => setLbImg(null)} aria-label="Đóng">
            <i className="ti ti-x"></i>
          </button>
          <div className={s.lbImgWrap} onClick={e => e.stopPropagation()}>
            <img src={lbImg.src} alt={lbImg.alt} className={s.lbImg} />
          </div>
        </div>
      )}
    </>
  );
}
