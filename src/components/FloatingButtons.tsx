'use client';
import { useEffect, useState } from 'react';

export default function FloatingButtons() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 300);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="floats">
      <a href="https://zalo.me/0834790555" className="fl fl-zalo" title="Chat Zalo" target="_blank" rel="noopener">Zalo</a>
      <a href="https://www.facebook.com/hocviencaphe" className="fl fl-fb" title="Facebook" target="_blank" rel="noopener">
        <i className="ti ti-brand-facebook"></i>
      </a>
      <a href="tel:0834790555" className="fl fl-phone" title="Gọi ngay">
        <i className="ti ti-phone"></i>
      </a>
      <button
        className={`fl fl-top${show ? ' show' : ''}`}
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        aria-label="Lên đầu"
      >
        <i className="ti ti-arrow-up"></i>
      </button>
    </div>
  );
}
