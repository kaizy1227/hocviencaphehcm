'use client';
import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

export default function PageViewTracker() {
  const pathname = usePathname();
  const lastPath = useRef<string | null>(null);

  useEffect(() => {
    if (!pathname || pathname.startsWith('/admin') || lastPath.current === pathname) return;
    if (typeof window !== 'undefined' && localStorage.getItem('skipTracking') === '1') return;
    lastPath.current = pathname;
    fetch('/api/track-view', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ path: pathname, referrer: document.referrer || '' }),
      keepalive: true,
    }).catch(() => {});
  }, [pathname]);

  return null;
}
