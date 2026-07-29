'use client';

import { useState } from 'react';
import Image from 'next/image';
import s from './home.module.css';

type NvlItem = { id: string; name: string; image_url: string; slug: string };

export default function NvlMarquee({ items }: { items: NvlItem[] }) {
  const [lb, setLb] = useState<{ src: string; alt: string; href?: string } | null>(null);
  const closeLb = () => { setLb(null); document.body.style.overflow = ''; };
  const openLb  = (src: string, alt: string, href?: string) => { setLb({ src, alt, href }); document.body.style.overflow = 'hidden'; };

  if (items.length === 0) return null;

  const mid  = Math.ceil(items.length / 2);
  const row1 = items.slice(0, mid);
  const row2 = items.slice(mid);

  const renderChip = (p: NvlItem, key: string) => (
    <span key={key} className={`${s.nvlChip} ${s.nvlChipTH}`}>
      <span className={s.nvlThumb} style={{ cursor: 'zoom-in' }}
        onClick={() => openLb(p.image_url, p.name, p.slug ? `/nguyen-lieu/${p.slug}` : undefined)}>
        <Image src={p.image_url} alt={p.name} width={160} height={160}
          sizes="(min-width:768px) 176px, 130px" />
      </span>
      <span className={s.nvlChipName}>{p.name}</span>
    </span>
  );

  return (
    <>
      <div className={s.nvlOuter}>
        <div className={s.nvlTrack}>
          {[...row1, ...row1].map((p, i) => renderChip(p, `nvl1-${i}`))}
        </div>
        <div className={`${s.nvlTrack} ${s.nvlTrackRight}`}>
          {[...row2, ...row2].map((p, i) => renderChip(p, `nvl2-${i}`))}
        </div>
      </div>

      {lb && (
        <div className="lightbox active" onClick={e => { if (e.target === e.currentTarget) closeLb(); }}>
          <button className="lb-close" onClick={closeLb}>&#x2715;</button>
          <div onClick={e => { if (e.target === e.currentTarget) closeLb(); }} style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:12 }}>
            <img src={lb.src} alt={lb.alt} style={{ maxWidth:'90vw', maxHeight:'80vh', borderRadius:12, objectFit:'contain' }} />
            {lb.href && <a href={lb.href} className="btn btn-primary" style={{ marginTop:8 }}>Xem chi tiết <i className="ti ti-arrow-right"></i></a>}
          </div>
        </div>
      )}
    </>
  );
}
