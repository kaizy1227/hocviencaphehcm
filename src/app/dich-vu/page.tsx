'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { SERVICES } from '@/lib/services';
import s from './page.module.css';

type ServiceItem = {
  img: string; name: string; desc: string; price: string;
  slug?: string; index: string; tags: string[];
};

function resolveImg(img: string | null): string {
  if (!img) return '';
  if (img.startsWith('http')) return img;
  return `/images/services/${img}`;
}

const SERVICE_META: Record<string, { index: string; tags: string[] }> = {
  'khoi-nghiep':      { index: '01 · Nền tảng mở quán',  tags: ['1 ngày · 2 buổi', 'Quản lý chi phí', 'Hỗ trợ 1 tháng'] },
  'setup-menu':       { index: '02 · Menu nhỏ gọn',       tags: ['Dưới 10 món', '2–3 signature', 'Test món 2 lần'] },
  'setup-menu-15':    { index: '03 · Menu hoàn chỉnh',    tags: ['15–20 món', '3–5 signature', 'Tính cost toàn bộ'] },
  'dao-tao-van-hanh': { index: '04 · Quản trị quán',      tags: ['Quy trình vận hành', 'Quản lý nhân sự', 'Kiểm soát doanh thu'] },
  'dao-tao-tai-quan': { index: '05 · Triển khai tại chỗ', tags: ['Tại mặt bằng quán', 'Đào tạo nhân viên', 'Thiết lập quầy bar'] },
};

const SERVICES_DEFAULT: ServiceItem[] = SERVICES.map(sv => ({
  img: `/images/services/${sv.img}`,
  name: sv.name, desc: sv.desc, price: sv.price, slug: sv.slug,
  ...(SERVICE_META[sv.slug] ?? { index: '', tags: [] }),
}));

const PROCESS_STEPS = [
  { title: 'Hiểu bài toán',         desc: 'Trao đổi mô hình, mặt bằng, ngân sách và mục tiêu kinh doanh.' },
  { title: 'Chốt phạm vi',          desc: 'Xác định đầu việc, thời gian thực hiện và kết quả bàn giao.' },
  { title: 'Triển khai thực tế',    desc: 'Làm menu, đào tạo hoặc thiết lập quy trình theo gói đã chọn.' },
  { title: 'Đồng hành sau bàn giao',desc: 'Tiếp nhận vướng mắc khi áp dụng vào hoạt động thật của quán.' },
];

const PROOF_ROWS = [
  { title: 'Menu gắn với vận hành',    desc: 'Món được cân nhắc cùng nguyên liệu, thiết bị và năng lực của nhân sự.' },
  { title: 'Đào tạo tại bối cảnh thật',desc: 'Quy trình được điều chỉnh theo quầy bar và cách phục vụ của quán.' },
  { title: 'Hỗ trợ sau triển khai',    desc: 'Có kênh tiếp nhận vấn đề khi đội ngũ bắt đầu vận hành thực tế.' },
];

export default function DichVuPage() {
  const router = useRouter();
  const [services, setServices] = useState<ServiceItem[]>(SERVICES_DEFAULT);
  const [formName, setFormName] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formService, setFormService] = useState('');
  const [formNote, setFormNote] = useState('');
  const [formStatus, setFormStatus] = useState<{ msg: string; ok: boolean }>({ msg: 'Thứ 2 – Thứ 7 · 8h30 – 17h30', ok: false });

  useEffect(() => {
    createClient().from('courses').select('name,image,description,price,slug').eq('active', true).eq('category', 'kinh-doanh').order('sort_order').then(({ data }) => {
      if (!data || !data.length) return;
      setServices(data.map((c: { image: string | null; name: string; description: string | null; price: string; slug: string | null }) => {
        const slug = c.slug ?? '';
        const meta = SERVICE_META[slug] ?? { index: '', tags: [] };
        return { img: resolveImg(c.image), name: c.name, desc: c.description ?? '', price: c.price, slug: slug || undefined, ...meta };
      }));
    });
  }, []);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const phone = formPhone.replace(/\s/g, '');
    if (!formName.trim() || !/^(0|\+84)[0-9]{9,10}$/.test(phone) || !formService) {
      setFormStatus({ msg: 'Vui lòng nhập họ tên, số điện thoại hợp lệ và dịch vụ quan tâm.', ok: false });
      return;
    }
    setFormStatus({ msg: 'Đã ghi nhận. Đội ngũ sẽ liên hệ trong giờ làm việc.', ok: true });
    setFormName(''); setFormPhone(''); setFormService(''); setFormNote('');
  }

  return (
    <main className={s.page}>
      {/* HERO */}
      <section className={s.hero}>
        <div className="container">
          <div className={s.heroInner}>
            <div>
              <span className={s.eyebrow}>Dịch vụ kinh doanh · Đồng hành thực tế</span>
              <h1 className={s.heroH1}>Mở quán có lộ trình,<br />vận hành có nền tảng.</h1>
              <p className={s.heroLead}>Từ định hình mô hình, xây menu đến đào tạo đội ngũ, mỗi gói dịch vụ đều bắt đầu từ bài toán thật của quán bạn.</p>
              <div className={s.heroCta}>
                <a href="#goi-dich-vu" className="btn btn-primary"><i className="ti ti-briefcase"></i> Xem các gói dịch vụ</a>
                <a href="#tu-van" className="btn btn-outline">Trao đổi nhu cầu</a>
              </div>
              <div className={s.trustLine}>
                <span><i className="ti ti-circle-check"></i>Tư vấn theo mô hình quán</span>
                <span><i className="ti ti-circle-check"></i>Hỗ trợ sau triển khai</span>
              </div>
            </div>
            <figure className={s.heroVisual}>
              <img src="/images/gallery/Life-styles-with-person/~12930.webp" alt="Giảng viên trao đổi quy trình vận hành với học viên" />
              <figcaption className={s.heroCaption}>
                <strong>Không áp một công thức cho mọi quán</strong>
                <span>Giải pháp được điều chỉnh theo mô hình, ngân sách và năng lực vận hành thực tế.</span>
              </figcaption>
            </figure>
          </div>
        </div>
      </section>

      {/* QUICK CONTACT RAIL */}
      <div className={s.contactRail}>
        <div className="container">
          <div className={s.contactPanel}>
            <a className={s.contactItem} href="#tu-van">
              <span className={s.contactIcon}><i className="ti ti-file-text"></i></span>
              <span>
                <strong>Nhận gợi ý gói phù hợp</strong>
                <span>Điền nhu cầu, đội ngũ sẽ phản hồi trong giờ làm việc</span>
              </span>
            </a>
            <a className={s.contactItem} href="tel:0834790555">
              <span className={s.contactIcon}><i className="ti ti-phone"></i></span>
              <span>
                <strong>0834 790 555</strong>
                <span>Gọi trực tiếp</span>
              </span>
            </a>
            <a className={s.contactItem} href="https://zalo.me/0834790555" target="_blank" rel="noopener">
              <span className={s.contactIcon}><i className="ti ti-message-circle"></i></span>
              <span>
                <strong>Trao đổi qua Zalo</strong>
                <span>Gửi thông tin quán</span>
              </span>
            </a>
          </div>
        </div>
      </div>

      {/* SERVICE LIST */}
      <section className="section" id="goi-dich-vu">
        <div className="container">
          <div className={s.sectionHead}>
            <div>
              <span className={s.eyebrow}>Gói kinh doanh</span>
              <h2 className={s.sectionTitle}>Chọn theo việc bạn cần giải quyết</h2>
              <p className={s.sectionLead}>Phạm vi và chi phí được công khai để bạn dễ định hướng trước khi trao đổi chi tiết.</p>
            </div>
            <span className={s.sectionMeta}>{services.length} dịch vụ hiện có</span>
          </div>

          <div className={s.serviceList}>
            {services.map(sv => (
              <article className={s.serviceCard} key={sv.name}>
                <div className={s.serviceMedia}>
                  {sv.img && <img src={sv.img} alt={sv.name} loading="lazy" />}
                </div>
                <div className={s.serviceCopy}>
                  {sv.index && <span className={s.serviceIndex}>{sv.index}</span>}
                  <h3>{sv.name}</h3>
                  <p>{sv.desc}</p>
                  <div className={s.serviceIncludes}>
                    {sv.tags.map(t => <span className={s.serviceTag} key={t}>{t}</span>)}
                  </div>
                </div>
                <div className={s.serviceAction}>
                  <div>
                    <span className={s.priceLabel}>Chi phí</span>
                    <strong className={s.servicePrice}>{sv.price}</strong>
                  </div>
                  {sv.slug
                    ? <Link href={`/dich-vu/${sv.slug}`} className="btn btn-outline">Xem chi tiết →</Link>
                    : <button className="btn btn-outline" onClick={() => router.push('/dang-ky')}>Tìm hiểu →</button>
                  }
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* PROCESS */}
      <section className="section" style={{ borderTop: '1px solid var(--border,#dce6ed)' }}>
        <div className="container">
          <div style={{ maxWidth: 640, marginBottom: 48 }}>
            <span className={s.eyebrow}>Quy trình hợp tác</span>
            <h2 className={s.sectionTitle}>Rõ đầu việc trước khi bắt đầu</h2>
            <p className={s.sectionLead}>Mỗi bước đều có mục tiêu và phạm vi để hai bên cùng theo dõi tiến độ.</p>
          </div>
          <div className={s.processGrid}>
            {PROCESS_STEPS.map(step => (
              <article className={s.processStep} key={step.title}>
                <h3>{step.title}</h3>
                <p>{step.desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* PROOF */}
      <section className="section" style={{ borderTop: '1px solid var(--border,#dce6ed)' }}>
        <div className="container">
          <div className={s.proof}>
            <span className={s.eyebrow}>Năng lực thực chiến</span>
            <h2 className={s.proofTitle}>Kinh nghiệm đứng sau từng đề xuất</h2>
            <p className={s.proofLead}>Đội ngũ không chỉ dạy pha chế mà đã tham gia vận hành, đào tạo và xây menu cho mô hình thực tế.</p>
            <div className={s.proofGrid}>
              <div className={s.proofList}>
                {PROOF_ROWS.map((row, i) => (
                  <div className={s.proofRow} key={row.title}>
                    <span className={s.proofNum}>0{i + 1}</span>
                    <div>
                      <strong>{row.title}</strong>
                      <span>{row.desc}</span>
                    </div>
                  </div>
                ))}
              </div>
              <figure className={s.proofPhoto}>
                <img src="/images/gallery/Life-styles-with-person/~12816.webp" alt="Giảng viên theo sát học viên trong buổi thực hành" />
              </figure>
            </div>
          </div>
        </div>
      </section>

      {/* CONSULT FORM */}
      <section className="section" id="tu-van" style={{ borderTop: '1px solid var(--border,#dce6ed)' }}>
        <div className="container">
          <div className={s.consultGrid}>
            <div>
              <span className={s.eyebrow}>Bắt đầu trao đổi</span>
              <h2 className={s.consultTitle}>Cho chúng tôi biết quán bạn đang ở bước nào</h2>
              <p className={s.consultLead}>Đội ngũ sẽ phản hồi trong giờ làm việc và gợi ý phạm vi phù hợp, không ép chọn gói lớn hơn nhu cầu.</p>
              <div className={s.directLinks}>
                <a className={s.directLink} href="tel:0834790555">
                  <span><i className="ti ti-phone"></i>Gọi hotline</span>
                  <span>0834 790 555</span>
                </a>
                <a className={s.directLink} href="https://zalo.me/0834790555" target="_blank" rel="noopener">
                  <span><i className="ti ti-message-circle"></i>Nhắn qua Zalo</span>
                  <span>Phản hồi trực tiếp →</span>
                </a>
              </div>
            </div>
            <form className={s.formCard} onSubmit={handleSubmit} noValidate>
              <div className={s.formGrid}>
                <div className={s.field}>
                  <label htmlFor="dvFullName">Họ và tên</label>
                  <input className={s.input} id="dvFullName" type="text" autoComplete="name" required value={formName} onChange={e => setFormName(e.target.value)} />
                </div>
                <div className={s.field}>
                  <label htmlFor="dvPhone">Số điện thoại</label>
                  <input className={s.input} id="dvPhone" type="tel" inputMode="tel" autoComplete="tel" required value={formPhone} onChange={e => setFormPhone(e.target.value)} />
                </div>
                <div className={`${s.field} ${s.fieldFull}`}>
                  <label htmlFor="dvService">Dịch vụ quan tâm</label>
                  <select className={s.select} id="dvService" required value={formService} onChange={e => setFormService(e.target.value)}>
                    <option value="">Chọn dịch vụ</option>
                    <option value="khoi-nghiep">Khóa Khởi Nghiệp</option>
                    <option value="setup-duoi-10">Set Up Menu dưới 10 món</option>
                    <option value="setup-15-20">Setup Menu 15–20 món</option>
                    <option value="van-hanh">Đào Tạo Vận Hành</option>
                    <option value="tai-quan">Đào Tạo Tại Quán</option>
                    <option value="chua-ro">Chưa rõ, cần tư vấn</option>
                  </select>
                </div>
                <div className={`${s.field} ${s.fieldFull}`}>
                  <label htmlFor="dvNote">Tình trạng hiện tại của quán</label>
                  <textarea className={s.textarea} id="dvNote" placeholder="Ví dụ: đang tìm mặt bằng, đã có menu, cần đào tạo nhân viên..." value={formNote} onChange={e => setFormNote(e.target.value)} />
                </div>
                <div className={s.formSubmit}>
                  <p className={`${s.formStatus} ${formStatus.ok ? s.formStatusOk : ''}`}>{formStatus.msg}</p>
                  <button className="btn btn-primary" type="submit">Gửi yêu cầu tư vấn</button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}
