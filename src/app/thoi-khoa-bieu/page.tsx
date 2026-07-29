import type { CSSProperties, ReactNode } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import s from './page.module.css';

// ── Helpers ──────────────────────────────────────────────────────────────────

function chipClass(course: string): string {
  const c = course.toLowerCase();
  // Drink type first — so "Hiện đại: Trà sữa" → green, not blue
  if (c.includes('đá xay') || c.includes('sinh tố'))                           return s.chipDaxay;
  if (c.includes('trà') || c.includes('matcha'))                               return s.chipTra;
  if (c.includes('truyền thống') || c.includes('phin') || c.includes('nitro')) return s.chipTruyen;
  if (c.includes('cà phê') || c.includes('espresso') || c.includes('barista') || c.includes('hiện đại')) return s.chipHiendai;
  return s.chipDefault;
}

function shortCourse(course: string): string {
  const colon = course.indexOf(':');
  return colon !== -1 ? course.slice(colon + 1).trim() : course;
}

// ── Calendar math ─────────────────────────────────────────────────────────────

function buildCalendar(year: number, month: number, todayStr: string) {
  const daysInMonth = new Date(year, month, 0).getDate();
  const firstDow    = new Date(year, month - 1, 1).getDay();
  const startCol    = firstDow === 0 ? 6 : firstDow - 1;

  const cells: Array<{ day: number | null; dateStr: string; isToday: boolean; isPast: boolean }> = [];
  for (let i = 0; i < startCol; i++) cells.push({ day: null, dateStr: '', isToday: false, isPast: false });
  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    cells.push({ day: d, dateStr, isToday: dateStr === todayStr, isPast: dateStr <= todayStr });
  }
  return cells;
}

// ── Page ─────────────────────────────────────────────────────────────────────

export const revalidate = 3600;

export default async function ThoiKhoaBieuPage({
  searchParams,
}: {
  searchParams: Promise<{ y?: string; m?: string }>;
}) {
  const params = await searchParams;
  const now    = new Date();
  const year   = parseInt(params.y ?? '') || now.getFullYear();
  const month  = parseInt(params.m ?? '') || (now.getMonth() + 1);

  const todayStr  = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  const startDate = `${year}-${String(month).padStart(2, '0')}-01`;
  const endDate   = new Date(year, month, 0).toISOString().slice(0, 10);
  const yearStart = `${year}-01-01`;
  const yearEnd   = year === now.getFullYear() ? todayStr : `${year}-12-31`;

  const supabase = await createClient();

  const [{ data: monthData }, { data: yearData }] = await Promise.all([
    supabase.from('class_schedule').select('date, course, si_so')
      .gte('date', startDate).lte('date', endDate).order('date'),
    supabase.from('class_schedule').select('date, si_so')
      .gte('date', yearStart).lte('date', yearEnd),
  ]);

  const sessions = monthData ?? [];
  const yearRows = yearData ?? [];

  // Stats
  const yearSessions  = yearRows.length;
  const yearStudents  = yearRows.reduce((acc, r) => acc + (r.si_so ?? 0), 0);
  const yearDays      = new Set(yearRows.map(r => r.date)).size;
  const monthSessions = sessions.length;
  const monthStudents = sessions.reduce((acc, r) => acc + (r.si_so ?? 0), 0);
  const monthDays     = new Set(sessions.map(r => r.date)).size;

  // Group month sessions by date
  const sessionsByDate: Record<string, { course: string; siSo: number | null }[]> = {};
  for (const r of sessions) {
    if (!sessionsByDate[r.date]) sessionsByDate[r.date] = [];
    sessionsByDate[r.date].push({ course: r.course, siSo: r.si_so });
  }

  const cells = buildCalendar(year, month, todayStr);

  // Month nav
  const prevMonth = month === 1  ? { y: year - 1, m: 12 } : { y: year, m: month - 1 };
  const nextMonth = month === 12 ? { y: year + 1, m: 1  } : { y: year, m: month + 1 };
  const nowYM    = now.getFullYear() * 100 + (now.getMonth() + 1);
  const thisYM   = year * 100 + month;
  const isCurrentOrFuture = thisYM >= nowYM;

  const MONTH_VI = ['Tháng 1','Tháng 2','Tháng 3','Tháng 4','Tháng 5','Tháng 6',
                    'Tháng 7','Tháng 8','Tháng 9','Tháng 10','Tháng 11','Tháng 12'];
  const DOW_VI   = ['T2','T3','T4','T5','T6','T7','CN'];

  return (
    <div className={s.page} style={{ paddingTop: 'var(--nav-h, 64px)' }}>

      {/* Header */}
      <div className={s.pageHeader}>
        <div className="container">
          <nav className={s.breadcrumb} aria-label="Breadcrumb">
            <Link href="/">Trang Chủ</Link>
            <span>›</span>
            <Link href="/gioi-thieu">Giới Thiệu</Link>
            <span>›</span>
            <span aria-current="page">Thời Khóa Biểu</span>
          </nav>
          <span className={s.eyebrow}>Hoạt động đào tạo</span>
          <div className={s.branchBadge}>
            <i className="ti ti-map-pin" aria-hidden="true"></i>
            Lịch học tại cơ sở TP. Hồ Chí Minh
          </div>
          <h1 className={s.pageH1}>Lịch Lớp Học<br /><em>Thực Tế.</em></h1>
          <p className={s.pageLead}>
            Mỗi buổi học đều được ghi lại. Bạn có thể thấy Học Viện hoạt động đều đặn như thế nào — không phải quảng cáo, mà là thực tế.
          </p>

          {/* Cumulative stats */}
          <div className={s.liveBadgeRow}>
            <span className={s.liveBadge}>
              <span className={s.liveDot} aria-hidden="true" />
              LIVE
            </span>
            <span className={s.liveUpdated}>Dữ liệu cập nhật hôm nay, {todayStr.split('-').reverse().join('/')}</span>
          </div>
          <div className={s.statsBar}>
            <div className={`${s.statItem} ${s.statCardNavy}`}>
              <span className={s.statNum}>{yearSessions}</span>
              <span className={s.statLabel}>buổi học năm {year}</span>
              {monthSessions > 0 && <span className={s.statSub}>+{monthSessions} tháng này</span>}
            </div>
            <div className={`${s.statItem} ${s.statCardCaramel}`}>
              <span className={s.statNum}>{yearDays}</span>
              <span className={s.statLabel}>ngày có lớp</span>
              {monthDays > 0 && <span className={s.statSub}>+{monthDays} tháng này</span>}
            </div>
            <div className={`${s.statItem} ${s.statCardSoft}`}>
              <span className={s.statNum}>{yearStudents || '—'}</span>
              <span className={s.statLabel}>lượt học viên</span>
              {monthStudents > 0 && <span className={s.statSub}>+{monthStudents} tháng này</span>}
            </div>
          </div>
        </div>
      </div>

      {/* Calendar */}
      <section className={s.calSection}>
        <div className="container">

          {/* Month nav */}
          <div className={s.monthNav}>
            <h2 className={s.monthTitle}>{MONTH_VI[month - 1]} · {year}</h2>
            <div className={s.monthBtns}>
              <Link href={`/thoi-khoa-bieu?y=${prevMonth.y}&m=${prevMonth.m}`} className={s.monthBtn}>
                <i className="ti ti-chevron-left"></i> Tháng trước
              </Link>
              <Link
                href={`/thoi-khoa-bieu?y=${nextMonth.y}&m=${nextMonth.m}`}
                className={`${s.monthBtn} ${isCurrentOrFuture ? s.monthBtnDisabled : ''}`}
                aria-disabled={isCurrentOrFuture}
                tabIndex={isCurrentOrFuture ? -1 : 0}
              >
                Tháng sau <i className="ti ti-chevron-right"></i>
              </Link>
            </div>
          </div>

          {/* Mobile scroll hint */}
          <p className={s.scrollHint}>
            <i className="ti ti-arrows-horizontal" aria-hidden="true"></i>
            Vuốt ngang để xem đầy đủ
          </p>

          {/* Grid — wrapped for mobile scroll */}
          <div className={s.calGridWrap}>
            <div className={s.calGrid}>
              {DOW_VI.map(d => (
                <div key={d} className={s.calDow}>{d}</div>
              ))}
              {(() => {
                // Find start of trailing future-empty cells
                let fei = cells.length;
                for (let i = cells.length - 1; i >= 0; i--) {
                  const c = cells[i];
                  if (!c.day || c.isPast || c.isToday) break;
                  if ((sessionsByDate[c.dateStr] ?? []).length > 0) break;
                  fei = i;
                }

                const out: ReactNode[] = [];

                for (let i = 0; i < cells.length; i++) {
                  if (i === fei && fei < cells.length) {
                    // Merged future-empty region
                    const col = (i % 7) + 1;
                    const firstSpan = Math.min(8 - col, cells.length - i);
                    out.push(
                      <div key="fup-0" className={`${s.calCell} ${s.calCellFutureUpdate}`} style={{ gridColumn: `span ${firstSpan}` }}>
                        <span className={s.futureUpdateLabel}>
                          <i className="ti ti-calendar-clock" aria-hidden="true" />
                          Lịch đang cập nhật
                        </span>
                      </div>
                    );
                    let done = firstSpan;
                    let row = 1;
                    while (done < cells.length - i) {
                      const span = Math.min(7, cells.length - i - done);
                      out.push(<div key={`fup-${row}`} className={`${s.calCell} ${s.calCellFutureUpdate}`} style={{ gridColumn: `span ${span}` }} />);
                      done += span; row++;
                    }
                    break;
                  }

                  const cell = cells[i];
                  if (!cell.day) {
                    out.push(<div key={`empty-${i}`} className={`${s.calCell} ${s.calCellEmpty}`} />);
                    continue;
                  }
                  const daySessions = sessionsByDate[cell.dateStr] ?? [];
                  const cellMod = cell.isToday ? s.calCellToday : cell.isPast ? s.calCellPast : s.calCellFuture;
                  out.push(
                    <div key={cell.dateStr} className={`${s.calCell} ${cellMod}`}>
                      {cell.isToday
                        ? <span className={`${s.calDate} ${s.calDateToday}`}>{cell.day}</span>
                        : <span className={s.calDate}>{cell.day}</span>
                      }
                      {daySessions.map((ds, idx2) => (
                        <div key={idx2} className={`${s.chip} ${chipClass(ds.course)}`}>
                          <span className={s.chipName}>{shortCourse(ds.course)}</span>
                          {ds.siSo ? <span className={s.chipSiso}>Sỉ số: {ds.siSo} học viên</span> : null}
                        </div>
                      ))}
                    </div>
                  );
                }
                return out;
              })()}
            </div>
          </div>


          {sessions.length === 0 && !isCurrentOrFuture && (
            <div className={s.emptyState}>
              <i className="ti ti-calendar-off"></i>
              <p>Chưa có dữ liệu tháng này. Lịch được cập nhật hàng ngày lúc 7h sáng.</p>
            </div>
          )}
        </div>
      </section>

      {/* Photo link */}
      <div className={s.photoLink}>
        <div className="container">
          <Link href="/hinh-anh/lop-hoc" className={s.photoLinkInner}>
            <i className="ti ti-camera" aria-hidden="true"></i>
            <span>Xem ảnh thực tế từ các lớp học</span>
            <i className="ti ti-arrow-right" aria-hidden="true"></i>
          </Link>
        </div>
      </div>

      {/* CTA */}
      <section className={s.ctaSection}>
        <div className="container">
          <div className={s.ctaBox}>
            <div className={s.ctaLeft}>
              <i className={`ti ti-calendar-check ${s.ctaIcon}`} aria-hidden="true"></i>
              <div>
                <p className={s.ctaTitle}>Lịch này trống chỗ cho bạn đấy.</p>
                <p className={s.ctaDesc}>Lớp học đều đặn, học viên thật — bạn có muốn là người tiếp theo không?</p>
                <p className={s.ctaNote}>
                  <i className="ti ti-refresh" aria-hidden="true"></i>
                  <strong>Hỗ trợ học lại miễn phí trong vòng 1 năm</strong>
                  <em> — phụ thu phí nguyên liệu &amp; phòng học</em>
                </p>
              </div>
            </div>
            <div className={s.ctaBtnGroup}>
              <Link href="/dang-ky" className={s.ctaBtn}>
                Đăng ký ngay
                <i className="ti ti-arrow-right" aria-hidden="true"></i>
              </Link>
              <a
                href="https://zalo.me/0834790555"
                target="_blank"
                rel="noopener noreferrer"
                className={s.zaloBtn}
              >
                <span className={s.zaloZ} aria-hidden="true">Z</span>
                Nhắn Zalo
              </a>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
