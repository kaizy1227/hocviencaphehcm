import { createClient } from '@/lib/supabase/server';
import { buildSlugIndex } from '@/lib/slug';
import NvlMarquee from './NvlMarquee';
import s from './home.module.css';

export default async function NvlSection() {
  const supabase = await createClient();
  const { data } = await supabase
    .from('products')
    .select('id,name,image_url,phan_loai')
    .eq('active', true)
    .order('stt');

  const items = data
    ? (() => {
        const { byId } = buildSlugIndex(data, (p: { name: string }) => p.name);
        return data
          .filter((p: { image_url: string; phan_loai: string }) => p.image_url && p.phan_loai === 'thuong-hieu')
          .map((p: { id: string; name: string; image_url: string; phan_loai: string }) => ({
            id: p.id, name: p.name, image_url: p.image_url, slug: byId.get(p.id) ?? '',
          }));
      })()
    : [];

  return (
    <section className={s.nvlSection}>
      <div className="container" style={{ textAlign: 'center', paddingBottom: 24 }}>
        <span className={s.eyebrow}>Dòng thương hiệu riêng · Chỉ có tại Học Viện</span>
        <h2 className={s.sectionTitle}>Hương Vị Đối Thủ Không Mua Được</h2>
        <p className={s.sectionLead}>Dòng nguyên liệu thương hiệu riêng của Học Viện — không bày bán đại trà, chỉ dành cho học viên và đối tác. Menu quán bạn vì thế có chất riêng mà nơi khác khó sao chép.</p>
      </div>
      <NvlMarquee items={items} />
      <div style={{ textAlign: 'center', paddingTop: 28 }}>
        <a href="/nguyen-lieu" className="btn btn-primary"><i className="ti ti-package"></i> Xem bảng giá nguyên liệu</a>
      </div>
    </section>
  );
}
