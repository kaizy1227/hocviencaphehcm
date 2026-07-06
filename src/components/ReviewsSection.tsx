'use client';
import { useEffect, useState, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';

type Review = {
  id: string;
  rating: number;
  comment: string | null;
  reviewer_name: string | null;
  created_at: string;
  user_id: string | null;
};

function Stars({ value, interactive, onChange }: { value: number; interactive?: boolean; onChange?: (v: number) => void }) {
  const [hover, setHover] = useState(0);
  return (
    <span className="rv-stars">
      {[1, 2, 3, 4, 5].map(n => (
        <i
          key={n}
          className={`ti ${(interactive ? (hover || value) : value) >= n ? 'ti-star-filled' : 'ti-star'} rv-star${interactive ? ' rv-star-btn' : ''}`}
          onMouseEnter={() => interactive && setHover(n)}
          onMouseLeave={() => interactive && setHover(0)}
          onClick={() => interactive && onChange?.(n)}
        />
      ))}
    </span>
  );
}

export default function ReviewsSection({ productId, productTable = 'products' }: { productId: string; productTable?: string }) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [myUserId, setMyUserId] = useState<string | null>(null);
  const [myReview, setMyReview] = useState<Review | null>(null);
  const [editing, setEditing] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const load = useCallback(async () => {
    const sb = createClient();
    const { data } = await sb.from('reviews')
      .select('*')
      .eq('product_id', productId)
      .eq('product_table', productTable)
      .order('created_at', { ascending: false });
    setReviews((data as Review[]) ?? []);
    const { data: { user } } = await sb.auth.getUser();
    setMyUserId(user?.id ?? null);
    if (user?.id) {
      const mine = ((data as Review[]) ?? []).find(r => r.user_id === user.id) ?? null;
      setMyReview(mine);
      if (mine) { setRating(mine.rating); setComment(mine.comment ?? ''); }
    }
    setLoading(false);
  }, [productId, productTable]);

  useEffect(() => { load(); }, [load]);

  async function submit() {
    if (!myUserId) return;
    setSubmitting(true);
    const sb = createClient();
    const payload = {
      product_id: productId,
      product_table: productTable,
      user_id: myUserId,
      rating,
      comment: comment.trim() || null,
      reviewer_name: null,
    };
    if (myReview) {
      await sb.from('reviews').update({ rating, comment: comment.trim() || null }).eq('id', myReview.id);
    } else {
      await sb.from('reviews').insert(payload);
    }
    setEditing(false);
    await load();
    setSubmitting(false);
  }

  const avg = reviews.length ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length : 0;

  if (loading) return null;

  return (
    <div className="rv-section">
      <div className="rv-header">
        <h2><i className="ti ti-star-filled" style={{ color: '#F59E0B' }}></i> Đánh giá sản phẩm</h2>
        {reviews.length > 0 && (
          <div className="rv-avg">
            <span className="rv-avg-num">{avg.toFixed(1)}</span>
            <Stars value={Math.round(avg)} />
            <span className="rv-avg-count">({reviews.length} đánh giá)</span>
          </div>
        )}
      </div>

      {/* Write / Edit form */}
      {myUserId && (
        <div className="rv-form-wrap">
          {!editing && !myReview && (
            <button className="btn btn-outline rv-write-btn" onClick={() => setEditing(true)}>
              <i className="ti ti-pencil"></i> Viết đánh giá
            </button>
          )}
          {!editing && myReview && (
            <div className="rv-my-review">
              <span className="rv-my-label">Đánh giá của bạn:</span>
              <Stars value={myReview.rating} />
              {myReview.comment && <p className="rv-my-comment">"{myReview.comment}"</p>}
              <button className="rv-edit-btn" onClick={() => setEditing(true)}>
                <i className="ti ti-edit"></i> Chỉnh sửa
              </button>
            </div>
          )}
          {editing && (
            <div className="rv-form">
              <div className="rv-form-row">
                <span className="rv-form-label">Đánh giá:</span>
                <Stars value={rating} interactive onChange={setRating} />
              </div>
              <textarea
                className="rv-textarea"
                placeholder="Nhận xét của bạn (không bắt buộc)..."
                value={comment}
                onChange={e => setComment(e.target.value)}
                rows={3}
              />
              <div className="rv-form-actions">
                <button className="btn btn-primary" onClick={submit} disabled={submitting}>
                  {submitting ? 'Đang gửi...' : myReview ? 'Cập nhật' : 'Gửi đánh giá'}
                </button>
                <button className="btn btn-outline" onClick={() => { setEditing(false); if (myReview) { setRating(myReview.rating); setComment(myReview.comment ?? ''); } }}>
                  Hủy
                </button>
              </div>
            </div>
          )}
        </div>
      )}
      {!myUserId && (
        <p className="rv-login-hint">
          <a href="/login">Đăng nhập</a> để viết đánh giá.
        </p>
      )}

      {/* Review list */}
      {reviews.length === 0 ? (
        <p className="rv-empty">Chưa có đánh giá nào. Hãy là người đầu tiên!</p>
      ) : (
        <div className="rv-list">
          {reviews.map(r => (
            <div key={r.id} className={`rv-item${r.user_id === myUserId ? ' rv-item-mine' : ''}`}>
              <div className="rv-item-head">
                <span className="rv-name">{r.reviewer_name || 'Học viên'}</span>
                <Stars value={r.rating} />
                <span className="rv-date">{new Date(r.created_at).toLocaleDateString('vi-VN')}</span>
              </div>
              {r.comment && <p className="rv-comment">{r.comment}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
