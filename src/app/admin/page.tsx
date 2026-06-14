'use client';
import { useEffect, useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';

type Student = {
  id: string;
  name: string;
  phone: string;
  course: string;
  enrolled_at: string;
  notes: string | null;
  created_at: string;
};

const COURSES = [
  'Tổng Hợp Truyền Thống',
  'Tổng Hợp Hiện Đại',
  'Cà Phê Máy Nâng Cao',
  'Cà Phê Phin Truyền Thống',
  'Trà Sữa Hiện Đại',
  'Trà Trái Cây & Matcha',
  'Đá Xay & Sinh Tố',
  'Nitro & Soda',
  'Chọn Món Kem 1-1',
  'Khởi Nghiệp A-Z',
  'Khác',
];

export default function AdminPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [students, setStudents] = useState<Student[]>([]);
  const [adding, setAdding] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [form, setForm] = useState({ name: '', phone: '', course: COURSES[0], enrolled_at: new Date().toISOString().slice(0, 10), notes: '' });
  const [formError, setFormError] = useState('');
  const [showAdd, setShowAdd] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session) { router.replace('/login?redirect=/admin'); return; }
      const admin = session.user.app_metadata?.role === 'admin';
      setIsAdmin(admin);
      if (!admin) { setLoading(false); return; }
      await loadStudents();
      setLoading(false);
    });
  }, []);

  async function loadStudents() {
    const supabase = createClient();
    const { data } = await supabase.from('students').select('*').order('enrolled_at', { ascending: false });
    setStudents(data ?? []);
  }

  async function addStudent(e: FormEvent) {
    e.preventDefault();
    if (!form.name.trim() || !form.phone.trim()) { setFormError('Vui lòng điền đầy đủ họ tên và số điện thoại.'); return; }
    setAdding(true); setFormError('');
    const supabase = createClient();
    const { error } = await supabase.from('students').insert({
      name: form.name.trim(),
      phone: form.phone.trim(),
      course: form.course,
      enrolled_at: form.enrolled_at,
      notes: form.notes.trim() || null,
    });
    setAdding(false);
    if (error) { setFormError('Lỗi: ' + error.message); return; }
    setForm({ name: '', phone: '', course: COURSES[0], enrolled_at: new Date().toISOString().slice(0, 10), notes: '' });
    setShowAdd(false);
    await loadStudents();
  }

  async function deleteStudent(id: string) {
    if (!confirm('Xóa học viên này?')) return;
    setDeleting(id);
    const supabase = createClient();
    await supabase.from('students').delete().eq('id', id);
    setDeleting(null);
    await loadStudents();
  }

  const filtered = students.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.phone.includes(search) ||
    s.course.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <main style={{ minHeight: '100dvh', display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: 'var(--nav-h)' }}><div className="admin-loading"><i className="ti ti-loader-2 spin"></i> Đang tải...</div></main>;

  if (!isAdmin) return (
    <main style={{ minHeight: '100dvh', display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: 'var(--nav-h)' }}>
      <div style={{ textAlign: 'center' }}>
        <i className="ti ti-lock" style={{ fontSize: '3rem', color: 'var(--accent)', display: 'block', marginBottom: '16px' }}></i>
        <h2>Không có quyền truy cập</h2>
        <p style={{ color: 'var(--text-3)', margin: '12px 0 24px' }}>Trang này chỉ dành cho quản trị viên.</p>
        <Link href="/" className="btn btn-primary">Về trang chủ</Link>
      </div>
    </main>
  );

  return (
    <main className="admin-page">
      <div className="container">
        <div className="admin-header">
          <div>
            <h1 className="admin-title"><i className="ti ti-users"></i> Quản Lý Học Viên</h1>
            <p className="admin-sub">Tổng cộng <strong>{students.length}</strong> học viên đã đăng ký</p>
          </div>
          <button className="btn btn-primary" onClick={() => setShowAdd(v => !v)}>
            <i className={`ti ti-${showAdd ? 'x' : 'user-plus'}`}></i> {showAdd ? 'Đóng' : 'Thêm Học Viên'}
          </button>
        </div>

        {/* ADD FORM */}
        {showAdd && (
          <div className="admin-add-card">
            <h3 className="admin-section-title">Thêm Học Viên Mới</h3>
            <form className="admin-form" onSubmit={addStudent}>
              <div className="admin-form-grid">
                <div className="af-group">
                  <label>Họ và tên *</label>
                  <input type="text" placeholder="Nguyễn Văn A" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required />
                </div>
                <div className="af-group">
                  <label>Số điện thoại *</label>
                  <input type="tel" placeholder="0912 345 678" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} required />
                </div>
                <div className="af-group">
                  <label>Khóa học</label>
                  <select value={form.course} onChange={e => setForm(f => ({ ...f, course: e.target.value }))}>
                    {COURSES.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div className="af-group">
                  <label>Ngày đăng ký</label>
                  <input type="date" value={form.enrolled_at} onChange={e => setForm(f => ({ ...f, enrolled_at: e.target.value }))} />
                </div>
                <div className="af-group af-full">
                  <label>Ghi chú</label>
                  <input type="text" placeholder="Ví dụ: Thanh toán 50%, học buổi tối..." value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} />
                </div>
              </div>
              {formError && <div className="lf-error" style={{ marginBottom: '12px' }}><i className="ti ti-alert-circle"></i> {formError}</div>}
              <div style={{ display: 'flex', gap: '10px' }}>
                <button type="submit" className="btn btn-primary" disabled={adding}>
                  {adding ? <><i className="ti ti-loader-2 spin"></i> Đang lưu...</> : <><i className="ti ti-check"></i> Lưu Học Viên</>}
                </button>
                <button type="button" className="btn btn-outline" onClick={() => setShowAdd(false)}>Hủy</button>
              </div>
            </form>
          </div>
        )}

        {/* SEARCH */}
        <div className="admin-search-wrap">
          <i className="ti ti-search"></i>
          <input className="admin-search" type="text" placeholder="Tìm theo tên, SĐT, khóa học..." value={search} onChange={e => setSearch(e.target.value)} />
          {search && <button onClick={() => setSearch('')} className="ct-search-clear"><i className="ti ti-x"></i></button>}
        </div>

        {/* TABLE */}
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Họ Tên</th>
                <th>Số Điện Thoại</th>
                <th>Khóa Học</th>
                <th>Ngày Đăng Ký</th>
                <th>Ghi Chú</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={7} className="admin-empty">Không tìm thấy học viên nào</td></tr>
              ) : filtered.map((s, i) => (
                <tr key={s.id}>
                  <td className="admin-num">{i + 1}</td>
                  <td className="admin-name">{s.name}</td>
                  <td><a href={`tel:${s.phone}`} className="admin-phone">{s.phone}</a></td>
                  <td><span className="admin-course-tag">{s.course}</span></td>
                  <td className="admin-date">{new Date(s.enrolled_at).toLocaleDateString('vi-VN')}</td>
                  <td className="admin-notes">{s.notes ?? '—'}</td>
                  <td>
                    <button className="admin-del-btn" onClick={() => deleteStudent(s.id)} disabled={deleting === s.id} title="Xóa">
                      {deleting === s.id ? <i className="ti ti-loader-2 spin"></i> : <i className="ti ti-trash"></i>}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
