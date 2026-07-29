'use client';
import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import s from './page.module.css';

type Course = {
  id: string; cat: string; cats: string[];
  badge?: string; featured?: boolean;
  img: string;
  name: string; desc: string; price: string;
  dur: string; meta2: string;
};

const COURSES_DEFAULT: Course[] = [
  { id: 'tong-hop-hien-dai',    cats: ['tong-hop','ca-phe-may','tra-sua','tra-trai-cay','da-xay','nitro'], badge: 'Phổ biến',       featured: true, img: '/images/courses/Bang-gia-khoa-tong-hop/menu-hien-dai.webp',       name: 'Tổng Hợp Hiện Đại',          desc: 'Cà phê máy cơ bản, trà sữa hiện đại, oolong nitro tea, trà trái cây & matcha, đá xay & sinh tố — học trong 4 ngày.', price: '7.500.000đ', dur: '4 ngày',      meta2: 'Cà phê máy, nitro…',    cat: 'tong-hop' },
  { id: 'tong-hop-truyen-thong', cats: ['tong-hop','tra-sua','tra-trai-cay','ca-phe-phin','da-xay'], badge: 'Nền tảng vững',  featured: true, img: '/images/courses/Bang-gia-khoa-tong-hop/menu-truyen-thong.webp',    name: 'Tổng Hợp Truyền Thống',      desc: 'Trọn bộ trà sữa truyền thống, trà trái cây & matcha, cà phê phin, đá xay & sữa chua — học trong 3 ngày.',            price: '5.200.000đ', dur: '3 ngày',      meta2: 'Trà sữa, cà phê phin…', cat: 'tong-hop' },
  { id: 'ca-phe-may-nang-cao',   cats: ['ca-phe-may'],   badge: 'Chuyên sâu',     featured: true, img: '/images/courses/Bang-gia-khoa-le/ca-phe-may-nang-cao.webp',        name: 'Cà Phê Máy Nâng Cao',        desc: 'Kiểm soát chiết xuất espresso, đánh sữa, latte art và vận hành quầy chuyên nghiệp — dành cho người muốn đi sâu nghề.',  price: '8.300.000đ', dur: '3 ngày',      meta2: 'Espresso chuyên sâu',   cat: 'ca-phe'  },
  { id: 'ca-phe-may-co-ban',     cats: ['ca-phe-may'],              badge: 'Cho người mới',  img: '/images/courses/Bang-gia-khoa-le/ca-phe-may-co-ban.webp',          name: 'Cà Phê Máy Cơ Bản',         desc: 'Làm quen thiết bị, định lượng và thao tác nền tảng để tạo ly espresso ổn định. Không cần kinh nghiệm trước.',          price: '2.500.000đ', dur: '1 ngày',      meta2: 'Thực hành thiết bị',    cat: 'ca-phe'  },
  { id: 'tra-sua-hien-dai',      cats: ['tra-sua','nitro'],                 badge: 'Xu hướng',       img: '/images/courses/Bang-gia-khoa-le/tra-sua-hien-dai.webp',           name: 'Trà Sữa Hiện Đại',           desc: 'Shan tuyết, olong nitro, topping trân châu & phô mai — menu hiện đại ưa chuộng nhất hiện nay.',                        price: '2.500.000đ', dur: '1 ngày',      meta2: 'Nitro, topping…',       cat: 'tra'     },
  { id: 'tra-trai-cay-matcha',   cats: ['tra-trai-cay'],                 badge: 'Menu hiện đại',  img: '/images/courses/Bang-gia-khoa-le/tra-trai-cay-matcha.webp',        name: 'Trà Trái Cây & Matcha',      desc: 'Hơn 15 công thức trà trái cây soda, trà tươi và 4 loại matcha latte. Chi phí thấp, ứng dụng cao trong menu hiện đại.', price: '2.500.000đ', dur: '1 ngày',      meta2: 'Soda trái cây, matcha', cat: 'tra'     },
  { id: 'da-xay-sinh-to',        cats: ['da-xay'],                 badge: '',               img: '/images/courses/Bang-gia-khoa-le/da-xay-sinh-to.webp',             name: 'Đá Xay & Sinh Tố',           desc: 'Đá xay cocomilk, cookies chocolate, matcha freeze, sinh tố — thu hút khách mùa hè, áp dụng ngay vào menu quán.',       price: '2.500.000đ', dur: '1 ngày',      meta2: '6 loại sinh tố',        cat: 'tra'     },
  { id: 'tra-sua-truyen-thong',  cats: ['tra-sua'],                 badge: '',               img: '/images/courses/Bang-gia-khoa-le/tra-sua-truyen-thong.webp',       name: 'Trà Sữa Truyền Thống',       desc: 'Shan tuyết thăng hoa, olong, topping 3Q, đường đen, phô mai, kem bánh — nền tảng cho menu trà sữa hoàn chỉnh.',        price: '2.200.000đ', dur: '1 ngày',      meta2: 'Topping đa dạng',       cat: 'tra'     },
  { id: 'ca-phe-phin',           cats: ['ca-phe-phin','da-xay'],              badge: '',               img: '/images/courses/Bang-gia-khoa-le/ca-phe-phin.webp',                name: 'Cà Phê Phin – Đá Xay & Sữa Chua', desc: 'Cà phê phin, cacao & socola, sữa chua lắc kết hợp đá xay. Chi phí thấp, dễ triển khai cho quán nhỏ và xe đẩy.',  price: '2.200.000đ', dur: '1 ngày',      meta2: 'Quán nhỏ, xe đẩy',     cat: 'ca-phe'  },
  { id: 'nitro-soda',            cats: ['nitro'],        badge: 'Độc đáo',        img: '/images/courses/Bang-gia-khoa-le/nitro-soda.webp',                 name: 'Nâng Cấp Menu Nitro Soda',   desc: 'Trà, cà phê, kombucha & soda nitro bằng hệ thống Nitro 4 vòi hiện đại — điểm nhận diện khác biệt cho quán.',          price: '2.500.000đ', dur: '1 ngày',      meta2: 'Nitro 4 vòi',           cat: 'tra'     },
  { id: 'khoa-chon-mon',         cats: ['tong-hop'],            badge: 'Linh hoạt',      img: '/images/courses/Bang-gia-khoa-le/chon-mon-kem-1-1.webp',           name: 'Khóa Chọn Món Kèm 1–1',      desc: 'Tự chọn 15 món, học kèm 1–1 cùng giảng viên. Phù hợp nâng cấp menu mà không cần học cả khóa tổng hợp.',               price: '3.000.000đ', dur: 'Linh hoạt',   meta2: 'Kèm cặp cá nhân',      cat: 'tong-hop'},
];

const FILTERS = [
  { id: 'all',          label: 'Tất cả'             },
  { id: 'tong-hop',     label: 'Trọn bộ tổng hợp'   },
  { id: 'ca-phe-may',   label: 'Cà phê máy'         },
  { id: 'ca-phe-phin',  label: 'Cà phê phin'        },
  { id: 'tra-sua',      label: 'Trà sữa'            },
  { id: 'tra-trai-cay', label: 'Trà trái cây & Matcha' },
  { id: 'da-xay',       label: 'Đá xay & Sinh tố'   },
  { id: 'nitro',        label: 'Nitro & Soda'       },
];

export default function KhoaHocPage() {
  const router = useRouter();
  const [courses, setCourses] = useState<Course[]>(COURSES_DEFAULT);
  const [filter, setFilter]   = useState('all');
  const [search, setSearch]   = useState('');
  const [lb, setLb]           = useState<{ src: string; alt: string } | null>(null);

  const openLb = (src: string, alt: string) => { setLb({ src, alt }); document.body.style.overflow = 'hidden'; };
  const closeLb = () => { setLb(null); document.body.style.overflow = ''; };
  const dangKy = (name: string) => router.push(`/dang-ky?course=${encodeURIComponent(name)}`);

  useEffect(() => {
    const sb = createClient();
    sb.from('courses').select('*').eq('active', true).order('sort_order').then(({ data }) => {
      if (!data?.length) return;
      setCourses(prev => prev.map(c => {
        const db = data.find((d: { name: string }) => d.name === c.name);
        return db ? { ...c, price: db.price, desc: db.description ?? c.desc, dur: db.duration ?? c.dur } : c;
      }));
    });
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') closeLb(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  const visible = useMemo(() => {
    const q = search.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'');
    return courses.filter(c => {
      const catOk = filter === 'all' || c.cats.includes(filter);
      const textOk = !q || (c.name + c.desc).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'').includes(q);
      return catOk && textOk;
    });
  }, [courses, filter, search]);

  return (
    <main className={s.page}>
      {lb && (
        <div className="lightbox active" onClick={e => { if (e.target === e.currentTarget) closeLb(); }}>
          <button className="lb-close" onClick={closeLb}>&#x2715;</button>
          <img src={lb.src} alt={lb.alt} onClick={closeLb} />
        </div>
      )}

      {/* HERO */}
      <section className={s.hero}>
        <div className={`container ${s.heroInner}`}>
          <div>
            <span className={s.eyebrow}>Pha chế thực chiến · TP.HCM</span>
            <h1 className={s.heroH1}>Học Để Làm Được.<br /><em>Tự Tin Kinh Doanh.</em></h1>
            <p className={s.heroLead}>Chọn lộ trình phù hợp với mục tiêu của bạn — từ vững tay nghề đến xây menu đưa vào vận hành ngay.</p>
            <div className={s.heroCta}>
              <Link href="#danh-sach" className="btn btn-primary"><i className="ti ti-list"></i> Xem các khóa học</Link>
              <Link href="/dang-ky" className="btn btn-outline"><i className="ti ti-phone"></i> Nhận tư vấn lộ trình</Link>
            </div>
            <p className={s.heroNote}><i className="ti ti-circle-check"></i> Lớp nhỏ, thực hành tại quầy, hỗ trợ sau khóa học</p>
          </div>
          <figure className={s.heroVisual} onClick={() => openLb('/images/gallery/Life-styles-with-person/~12573.webp','Học viên thực hành pha chế')} style={{cursor:'pointer'}}>
            <img src="/images/gallery/Life-styles-with-person/~12573.webp" alt="Học viên thực hành pha chế trực tiếp tại quầy" />
            <figcaption className={s.heroCaption}>
              <strong>Hiểu nguyên liệu, vững kỹ thuật</strong>
              <span>Mỗi buổi học, bạn đứng trực tiếp tại quầy và thực hành với nguyên liệu thật.</span>
            </figcaption>
          </figure>
        </div>
      </section>

      {/* FILTER + COURSE LIST */}
      <section className="section" id="danh-sach">
        <div className="container">
          {/* Filter panel */}
          <div className={s.filterWrap}>
            <div className={s.filterRow}>
              <label className={s.searchWrap} htmlFor="kh-search">
                <i className="ti ti-search"></i>
                <input
                  className={s.searchInput}
                  id="kh-search" type="search"
                  placeholder="Tìm theo tên khóa học..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
              </label>
              <div className={s.filterTabs}>
                {FILTERS.map(f => (
                  <button
                    key={f.id}
                    className={`${s.filterBtn}${filter === f.id ? ' '+s.filterBtnActive : ''}`}
                    onClick={() => setFilter(f.id)}
                  >{f.label}</button>
                ))}
              </div>
            </div>
          </div>

          {/* Section head */}
          <div className={s.sectionHead}>
            <div>
              <span className={s.eyebrow}>Lộ trình đào tạo</span>
              <h2 className={s.sectionTitle}>Chọn khóa học theo đích đến của bạn</h2>
            </div>
            <span className={s.resultCount}>{visible.length} khóa học phù hợp</span>
          </div>

          {/* Course grid */}
          {visible.length > 0 ? (
            <div className={s.courseGrid}>
              {visible.map(c => (
                <article key={c.id} className={`${s.courseCard}${c.featured ? ' ' + s.courseCardFeatured : ''}`}>
                  <div className={s.courseMedia} onClick={() => openLb(c.img, c.name)} style={{cursor:'pointer'}}>
                    <img src={c.img} alt={c.name} loading="lazy"
                      onError={e => { (e.currentTarget.closest(`.${s.courseMedia}`) as HTMLElement)?.style && ((e.currentTarget.closest(`.${s.courseMedia}`) as HTMLElement).style.background='var(--bg)'); e.currentTarget.style.display='none'; }} />
                    {c.badge && <span className={s.courseBadge}>{c.badge}</span>}
                  </div>
                  <div className={s.courseBody}>
                    {c.featured && (
                      <span className={s.featuredTag}><i className="ti ti-star-filled"></i> Học viên ưa chuộng</span>
                    )}
                    <h3>{c.name}</h3>
                    <p>{c.desc}</p>
                    <div className={s.courseMeta}>
                      <span><i className="ti ti-clock"></i>{c.dur}</span>
                      <span><i className="ti ti-cup"></i>{c.meta2}</span>
                    </div>
                    <div className={s.courseFoot}>
                      <span className={s.coursePrice}>{c.price}</span>
                      <button className={s.courseLink} onClick={() => dangKy(c.name)}>Đăng ký →</button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className={s.emptyState}>
              <i className="ti ti-search-off" style={{fontSize:'2rem', color:'var(--muted)'}}></i>
              <p style={{margin:0}}>Chưa tìm thấy khóa học phù hợp — thử từ khóa khác hoặc chọn lại "Tất cả".</p>
              <button className="btn btn-outline" onClick={() => { setSearch(''); setFilter('all'); }}>Xóa bộ lọc</button>
            </div>
          )}
        </div>
      </section>

      {/* LEARNING PATHS */}
      <section className="section" style={{background:'var(--bg-alt)', paddingTop:'64px', paddingBottom:'64px'}}>
        <div className="container">
          <div style={{maxWidth:'600px', marginBottom:'40px'}}>
            <span className={s.eyebrow}>Chưa biết bắt đầu từ đâu?</span>
            <h2 className={s.sectionTitle}>Ba hướng đi, chọn theo mục tiêu</h2>
            <p className="sub" style={{marginTop:'10px'}}>Không cần ghép nhiều khóa rời rạc — chọn đúng lộ trình là đủ.</p>
          </div>
          <div className={s.pathGrid}>
            <article className={s.pathCard}>
              <div>
                <p className={s.pathNum}>01 · NGƯỜI MỚI</p>
                <h3>Vững tay nghề</h3>
                <p>Học kỹ thuật nền tảng, làm quen thiết bị và biết cách pha đúng ngay từ đầu.</p>
              </div>
              <Link href="#danh-sach" className="btn btn-outline" style={{marginTop:'20px', alignSelf:'flex-start'}} onClick={() => setFilter('ca-phe')}>Xem khóa nền tảng →</Link>
            </article>
            <article className={`${s.pathCard} ${s.pathCardFeatured}`}>
              <div>
                <p className={s.pathNum}>02 · CHỦ QUÁN</p>
                <h3>Xây menu có thể bán</h3>
                <p>Kết hợp kỹ thuật pha chế với định lượng, giá vốn và tổ chức quầy thực tế.</p>
              </div>
              <Link href="/dang-ky" className="btn" style={{marginTop:'20px', alignSelf:'flex-start', background:'#fff', color:'var(--navy)', border:'none'}}>Nhận gợi ý lộ trình →</Link>
            </article>
            <article className={s.pathCard}>
              <div>
                <p className={s.pathNum}>03 · NÂNG CAO</p>
                <h3>Đi sâu một chuyên môn</h3>
                <p>Tập trung vào espresso, trà, menu hiện đại hoặc kỹ năng cần nâng cấp.</p>
              </div>
              <Link href="#danh-sach" className="btn btn-outline" style={{marginTop:'20px', alignSelf:'flex-start'}} onClick={() => setFilter('tong-hop')}>Xem khóa chuyên đề →</Link>
            </article>
          </div>
        </div>
      </section>

      {/* CONSULT CTA */}
      <section className="section" style={{paddingTop:'0'}}>
        <div className="container">
          <div className={s.consult}>
            <span className={s.eyebrow} style={{color:'rgba(251,243,230,0.7)'}}>Tư vấn miễn phí</span>
            <h2>Chọn đúng khóa ngay từ đầu</h2>
            <p>Để lại thông tin, đội ngũ tư vấn sẽ liên hệ và gợi ý khóa học phù hợp với bạn.</p>
            <div className={s.consultBtns}>
              <Link href="/dang-ky" className="btn btn-primary" style={{background:'var(--caramel-dark)', border:'none'}}>
                <i className="ti ti-phone"></i> Yêu cầu tư vấn
              </Link>
              <a href="https://zalo.me/0834790555" target="_blank" rel="noopener noreferrer" className="btn btn-outline" style={{borderColor:'rgba(255,255,255,0.3)', color:'#fff'}}>
                <i className="ti ti-brand-line"></i> Chat Zalo
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
