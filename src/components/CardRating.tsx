import type { ReviewStat } from '@/lib/useReviewStats';

/** Hiển thị ⭐ điểm + số lượt trên card sản phẩm. Ẩn nếu chưa có đánh giá. */
export default function CardRating({ stat }: { stat?: ReviewStat }) {
  if (!stat || stat.count === 0) return null;
  const rounded = Math.round(stat.avg * 10) / 10;
  return (
    <span className="card-rating" aria-label={`${rounded} trên 5 sao, ${stat.count} đánh giá`}>
      <i className="ti ti-star-filled"></i>
      <strong>{rounded.toFixed(1)}</strong>
      <span className="card-rating-count">({stat.count})</span>
    </span>
  );
}
