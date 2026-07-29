import Link from 'next/link';
import s from './page.module.css';

const INSTRUCTORS = [
  {
    key: 'liem',
    fullName: 'Đoàn Hồng Liêm',
    larkName: 'Liêm',
    role: '☕ Trưởng Phòng Đào Tạo · Chuyên Gia Cà Phê',
    photo: '/images/giangvienLiem.webp',
    badges: ['Trưởng PĐT Học Viện', '10 năm kinh nghiệm', 'Cựu QL chuỗi Coffee'],
    descs: [
      'Gắn bó với ngành F&B như một lẽ tự nhiên — và kể từ đó, chưa một lần rời bước. Hành trình bắt đầu từ vị trí barista rồi dần vươn lên quản lý tại nhiều chuỗi quán cà phê lớn, tích lũy qua từng ca làm, từng tách cà phê, từng đội nhóm được dẫn dắt.',
      <p key="liem-2">Hiện là <strong>Trưởng Phòng Đào Tạo</strong> tại Học Viện Cà Phê Chi Nhánh Miền Nam, anh đã trực tiếp xây dựng menu và hướng dẫn nhân sự cho hàng chục quán mới mở trải dài khắp cả nước.</p>,
    ],
    quote: '"Một ly cà phê ngon không bao giờ là ngẫu nhiên — đó là tích lũy của kỹ thuật và tâm huyết. Tôi muốn truyền trọn điều đó cho các bạn."',
    skills: ['☕ Cà phê máy & espresso', '🔧 Vận hành quán', '🍽️ Setup menu', '👥 Đào tạo nhân sự'],
    reverse: false,
  },
  {
    key: 'an',
    fullName: 'Bùi Trần Thiên Ân',
    larkName: 'Ân',
    role: '🍵 Chuyên Gia Sáng Tạo Đồ Uống',
    photo: '/images/giangvienAn.webp',
    badges: ['Nền tảng Nghệ Thuật', '6 năm kinh nghiệm', 'Cựu Trainer chuỗi AiCha'],
    descs: [
      <p key="an-1">Xuất thân ngành <strong>Nghệ Thuật</strong>, anh Thiên Ân mang gu thẩm mỹ riêng vào từng công thức — từ màu sắc, lớp lang đến cách trình bày ly đồ uống.</p>,
      <p key="an-2">Trải qua 6 năm gắn bó, từng đảm nhận vai trò trainer cho chuỗi trà sữa AiCha ở thời điểm thương hiệu vươn tới gần 20 cửa hàng, anh tích lũy cho mình kho công thức phong phú về <strong>trà trái cây, trà sữa</strong> hòa quyện cùng nghệ thuật trang trí bắt mắt.</p>,
    ],
    quote: '"Người học nhanh nhất không phải người thông minh nhất — mà là người dám thử, dám sai và không bỏ cuộc."',
    skills: ['🍵 Trà trái cây & trà sữa', '✨ Sáng tạo hot trend', '🎨 Decor & trình bày', '🍽️ Setup menu'],
    reverse: true,
  },
];

export default function GiangVienPage() {
  return (
    <div style={{ paddingTop: 'var(--nav-h, 64px)' }}>
      <div className={s.pageHeader}>
        <div className="container">
          <nav className={s.breadcrumb} aria-label="Breadcrumb">
            <Link href="/">Trang Chủ</Link>
            <span aria-hidden="true">›</span>
            <Link href="/gioi-thieu">Giới Thiệu</Link>
            <span aria-hidden="true">›</span>
            <span aria-current="page">Giảng Viên</span>
          </nav>
          <span className={s.eyebrow}>Đội ngũ giảng dạy</span>
          <h1 className={s.pageH1}>Người Thầy,<br /><em>Người Đồng Hành.</em></h1>
          <p className={s.pageLead}>
            Giảng viên tại Học Viện Cà Phê HCM đều có kinh nghiệm vận hành quán thực tế — họ dạy từ những gì đã làm, không từ giáo trình.
          </p>
        </div>
      </div>

      <section className={s.section}>
        <div className="container">
          <div className="gv-list">
            {INSTRUCTORS.map(ins => {
              const cardClass = `gv-card2${ins.reverse ? ' gv-card2-reverse' : ''}`;
              const textSide = (
                <div className="gv-text-side">
                  <div className="gv-hero-badges">
                    {ins.badges.map(b => <span key={b} className="gv-badge">{b}</span>)}
                  </div>
                  <div className="gv-hero-name">{ins.fullName}</div>
                  <div className="gv-hero-role">{ins.role}</div>
                  {ins.descs.map((d, i) => typeof d === 'string'
                    ? <p key={i} className="gv-hero-desc">{d}</p>
                    : <div key={i} className="gv-hero-desc">{d}</div>
                  )}
                  <blockquote className="gv-hero-quote">{ins.quote}</blockquote>
                  <div className="gv-skills">
                    {ins.skills.map(sk => <span key={sk} className="gv-skill-pill">{sk}</span>)}
                  </div>
                </div>
              );
              const photoSide = (
                <div className="gv-photo-side">
                  <img src={ins.photo} alt={`Giảng viên ${ins.fullName}`} />
                </div>
              );
              return (
                <div key={ins.key} className={s.instructorWrap}>
                  <div className={cardClass}>
                    {ins.reverse ? <>{textSide}{photoSide}</> : <>{photoSide}{textSide}</>}
                  </div>

                  <div className={s.setupPortfolioLink}>
                    <i className="ti ti-award"></i>
                    <span>Đã setup menu cho nhiều quán trên cả nước</span>
                    <Link href="/hinh-anh/setup-menu#doi-tac" className={s.seeClassBtn}>
                      Xem danh sách quán <i className="ti ti-arrow-right"></i>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
