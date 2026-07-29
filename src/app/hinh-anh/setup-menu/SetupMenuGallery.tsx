'use client';
import { useState, useEffect, useCallback } from 'react';
import s from './page.module.css';

const PERSON_PHOTOS = [
  '~12573.webp', '~12816.webp', '~12930.webp',
  '~12405.webp', '~12432.webp', '~12498.webp',
  '~12321.webp', '~12555.webp', '~12720.webp',
].map(f => ({ src: `/images/gallery/lifestyle-person-cropped/${f}`, alt: 'Học viên thực hành tại Học Viện Cà Phê' }));

const DRINK_PHOTOS = [
  '~11675.webp', '~11900.webp', '~12219.webp',
  '~11447.webp', '~11594_1.webp', '~11783.webp', '~12609.webp',
].map(f => ({ src: `/images/gallery/lifestyle-drinks-cropped/${f}`, alt: 'Đồ uống tại Học Viện Cà Phê' }));

const ALL_PHOTOS = [...PERSON_PHOTOS, ...DRINK_PHOTOS];

export default function SetupMenuGallery() {
  const [lbIdx, setLbIdx] = useState<number | null>(null);

  const close = useCallback(() => setLbIdx(null), []);
  const prev = useCallback(() => setLbIdx(i => i !== null ? (i - 1 + ALL_PHOTOS.length) % ALL_PHOTOS.length : null), []);
  const next = useCallback(() => setLbIdx(i => i !== null ? (i + 1) % ALL_PHOTOS.length : null), []);

  useEffect(() => {
    if (lbIdx === null) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
    }
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = ''; };
  }, [lbIdx, close, prev, next]);

  return (
    <>
      <section className={s.section}>
        <div className="container">
          <p className={s.sectionLabel}><i className="ti ti-user"></i> Giảng Viên &amp; Đội Ngũ</p>
          <div className={s.grid}>
            {PERSON_PHOTOS.map((photo, i) => (
              <button key={photo.src} className={s.photoBtn} onClick={() => setLbIdx(i)} aria-label="Xem ảnh đầy đủ">
                <img src={photo.src} alt={photo.alt} loading={i < 4 ? 'eager' : 'lazy'} />
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className={`${s.section} ${s.sectionAlt}`}>
        <div className="container">
          <p className={s.sectionLabel}><i className="ti ti-cup"></i> Đồ uống &amp; Menu</p>
          <div className={s.grid}>
            {DRINK_PHOTOS.map((photo, i) => (
              <button key={photo.src} className={s.photoBtn} onClick={() => setLbIdx(PERSON_PHOTOS.length + i)} aria-label="Xem ảnh đầy đủ">
                <img src={photo.src} alt={photo.alt} loading="lazy" />
              </button>
            ))}
          </div>
        </div>
      </section>

      {lbIdx !== null && (
        <div className={s.lbOverlay} onClick={close} role="dialog" aria-modal="true" aria-label="Xem ảnh">
          <button className={s.lbClose} onClick={close} aria-label="Đóng">
            <i className="ti ti-x"></i>
          </button>
          <button className={`${s.lbNav} ${s.lbPrev}`} onClick={e => { e.stopPropagation(); prev(); }} aria-label="Ảnh trước">
            <i className="ti ti-chevron-left"></i>
          </button>
          <div className={s.lbImgWrap} onClick={e => e.stopPropagation()}>
            <img key={lbIdx} src={ALL_PHOTOS[lbIdx].src} alt={ALL_PHOTOS[lbIdx].alt} className={s.lbImg} />
          </div>
          <button className={`${s.lbNav} ${s.lbNext}`} onClick={e => { e.stopPropagation(); next(); }} aria-label="Ảnh sau">
            <i className="ti ti-chevron-right"></i>
          </button>
          <div className={s.lbCounter}>{lbIdx + 1} / {ALL_PHOTOS.length}</div>
        </div>
      )}
    </>
  );
}
