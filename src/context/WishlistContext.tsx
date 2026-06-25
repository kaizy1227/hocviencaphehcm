'use client';
import { createContext, useContext, useState, useEffect } from 'react';

const WISHLIST_KEY = 'hvcph-wishlist';

export type WishlistItem = {
  id: string; name: string; unit: string; price: number;
  image_url: string; category: string;
  source: 'nguyen-lieu' | 'dung-cu';
};

type WishlistCtx = {
  items: WishlistItem[];
  toggle: (item: WishlistItem) => void;
  has: (id: string) => boolean;
  count: number;
};

const WishlistContext = createContext<WishlistCtx>({
  items: [], toggle: () => {}, has: () => false, count: 0,
});

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<WishlistItem[]>([]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(WISHLIST_KEY);
      if (saved) setItems(JSON.parse(saved));
    } catch {}
  }, []);

  function toggle(item: WishlistItem) {
    setItems(prev => {
      const next = prev.some(i => i.id === item.id)
        ? prev.filter(i => i.id !== item.id)
        : [...prev, item];
      try { localStorage.setItem(WISHLIST_KEY, JSON.stringify(next)); } catch {}
      return next;
    });
  }

  return (
    <WishlistContext.Provider value={{ items, toggle, has: (id) => items.some(i => i.id === id), count: items.length }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() { return useContext(WishlistContext); }
