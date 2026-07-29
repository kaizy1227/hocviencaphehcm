'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import s from './doc.module.css';

type Item = { id: string; source: 'internal' | 'external'; name: string; quantity: number; unit: string; cost_per_unit: number };
type Recipe = {
  id: string; name: string; category: string; photo_url: string;
  instructions: string; total_cost: number | null; recipe_text: string; items: Item[];
};
type DocData = { title: string; course: string; recipes: Recipe[] };

const fmt = (n: number) => new Intl.NumberFormat('vi-VN').format(Math.round(n)) + 'đ';
const lines = (t: string) => (t ?? '').split(/\n/).map(l => l.trim()).filter(Boolean);

export default function TaiLieuPage() {
  const { token } = useParams<{ token: string }>();
  const [data, setData] = useState<DocData | null>(null);
  const [status, setStatus] = useState<'loading' | 'ok' | 'notfound'>('loading');

  useEffect(() => {
    fetch(`/api/tai-lieu/${token}`)
      .then(r => r.ok ? r.json() : Promise.reject(r.status))
      .then((d: DocData) => { setData(d); setStatus('ok'); })
      .catch(() => setStatus('notfound'));
  }, [token]);

  if (status === 'loading') {
    return <main className={s.state}><i className="ti ti-loader-2 spin"></i> Đang tải tài liệu…</main>;
  }
  if (status === 'notfound' || !data) {
    return (
      <main className={s.state}>
        <i className="ti ti-file-off"></i>
        <h1>Không tìm thấy tài liệu</h1>
        <p>Đường dẫn không đúng hoặc đã bị vô hiệu hóa. Vui lòng liên hệ Học Viện qua Zalo 0834 790 555.</p>
      </main>
    );
  }

  return (
    <main className={s.page}>
      <header className={s.head}>
        <div className={s.headInner}>
          <img src="/images/logo.png" alt="Học Viện Cà Phê" className={s.logo}
            onError={e => { e.currentTarget.style.display = 'none'; }} />
          <div>
            <span className={s.eyebrow}>Tài liệu công thức · Học viên</span>
            <h1 className={s.title}>{data.title}</h1>
            <p className={s.sub}>{data.recipes.length} công thức · Khóa {data.course}</p>
          </div>
          <button className={s.printBtn} onClick={() => window.print()}>
            <i className="ti ti-printer"></i> In / Lưu PDF
          </button>
        </div>
      </header>

      <div className={s.body}>
        {data.recipes.length === 0 && (
          <p className={s.empty}>Chưa có công thức nào cho khóa này.</p>
        )}

        {data.recipes.map((r, idx) => (
          <article key={r.id} className={s.recipe}>
            <div className={s.rHead}>
              <span className={s.rNum}>{String(idx + 1).padStart(2, '0')}</span>
              <div>
                {r.category && <span className={s.rCat}>{r.category}</span>}
                <h2 className={s.rName}>{r.name}</h2>
              </div>
            </div>

            {r.photo_url && (
              <div className={s.rPhoto}>
                <Image src={r.photo_url} alt={r.name} fill sizes="(max-width:720px) 100vw, 680px" style={{ objectFit: 'cover' }} />
              </div>
            )}

            {r.items.length > 0 ? (
              <div className={s.tableWrap}>
                <table className={s.table}>
                  <thead>
                    <tr><th>Nguyên liệu</th><th className={s.num}>Định lượng</th><th className={s.num}>Giá vốn</th></tr>
                  </thead>
                  <tbody>
                    {r.items.map(it => (
                      <tr key={it.id}>
                        <td>
                          <span className={`${s.tag} ${it.source === 'internal' ? s.tagIn : s.tagEx}`}>{it.source === 'internal' ? 'HVCP' : 'Ngoài'}</span>
                          {it.name}
                        </td>
                        <td className={s.num}>{it.quantity} {it.unit}</td>
                        <td className={s.num}>{fmt(it.quantity * it.cost_per_unit)}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr><td colSpan={2}>Tổng giá vốn</td><td className={`${s.num} ${s.total}`}>{fmt(r.items.reduce((a, i) => a + i.quantity * i.cost_per_unit, 0))}</td></tr>
                  </tfoot>
                </table>
              </div>
            ) : r.recipe_text ? (
              <ul className={s.ingList}>
                {lines(r.recipe_text).map((l, i) => <li key={i}>{l}</li>)}
              </ul>
            ) : null}

            {r.instructions && (
              <div className={s.steps}>
                <h3><i className="ti ti-steps"></i> Cách làm</h3>
                <ol>
                  {lines(r.instructions).map((l, i) => <li key={i}>{l.replace(/^B\d+:?\s*/i, '')}</li>)}
                </ol>
              </div>
            )}
          </article>
        ))}
      </div>

      <footer className={s.foot}>
        <p>© Học Viện Cà Phê HCM · Tài liệu dành cho học viên · Vui lòng không chia sẻ ra ngoài</p>
      </footer>
    </main>
  );
}
