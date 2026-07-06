'use client';
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

export type ReviewStat = { avg: number; count: number };

/**
 * Lấy điểm trung bình + số lượt đánh giá cho tất cả sản phẩm của 1 bảng.
 * Trả về Map<product_id, { avg, count }>. Query 1 lần, gom nhóm client-side.
 */
export function useReviewStats(productTable: 'products' | 'dung_cu') {
  const [stats, setStats] = useState<Map<string, ReviewStat>>(new Map());

  useEffect(() => {
    let alive = true;
    createClient()
      .from('reviews')
      .select('product_id, rating')
      .eq('product_table', productTable)
      .then(({ data }) => {
        if (!alive || !data) return;
        const agg = new Map<string, { sum: number; count: number }>();
        for (const r of data as { product_id: string; rating: number }[]) {
          const cur = agg.get(r.product_id) ?? { sum: 0, count: 0 };
          cur.sum += r.rating;
          cur.count += 1;
          agg.set(r.product_id, cur);
        }
        const out = new Map<string, ReviewStat>();
        agg.forEach((v, k) => out.set(k, { avg: v.sum / v.count, count: v.count }));
        setStats(out);
      }, () => {});
    return () => { alive = false; };
  }, [productTable]);

  return stats;
}
