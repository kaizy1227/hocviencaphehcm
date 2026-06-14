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

type Lead = {
  id: string;
  name: string;
  phone: string;
  course: string;
  location: string | null;
  status: 'new' | 'contacted' | 'enrolled';
  created_at: string;
};

type Course = {
  id: string;
  name: string;
  category: 'chuyen-de' | 'kinh-doanh';
  price: string;
  duration: string | null;
  description: string | null;
  image: string | null;
  active: boolean;
  sort_order: number;
};

const STUDENT_COURSES = [
  'Tổng Hợp Truyền Thống', 'Tổng Hợp Hiện Đại', 'Cà Phê Máy Nâng Cao',
  'Cà Phê Phin Truyền Thống', 'Trà Sữa Hiện Đại', 'Trà Trái Cây & Matcha',
  'Đá Xay & Sinh Tố', 'Nitro & Soda', 'Chọn Món Kem 1-1', 'Khởi Nghiệp A-Z', 'Khác',
];

const STATUS_CLASS: Record<Lead['status'], string> = {
  new: 'lead-badge-new',
  contacted: 'lead-badge-contacted',
  enrolled: 'lead-badge-enrolled',
};

const CAT_LABEL: Record<Course['category'], string> = {
  'chuyen-de': 'Chuyên Đề Lẻ',
  'kinh-doanh': 'Gói Kinh Doanh',
};

const BLANK_COURSE: Omit<Course, 'id' | 'sort_order'> = {
  name: '', category: 'chuyen-de', price: '', duration: '', description: '', image: '', active: true,
};

export default function AdminPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [activeTab, setActiveTab] = useState<'leads' | 'students' | 'content'>('leads');

  // Students
  const [students, setStudents] = useState<Student[]>([]);
  const [addingStudent, setAddingStudent] = useState(false);
  const [deletingStudent, setDeletingStudent] = useState<string | null>(null);
  const [studentSearch, setStudentSearch] = useState('');
  const [studentForm, setStudentForm] = useState({ name: '', phone: '', course: STUDENT_COURSES[0], enrolled_at: new Date().toISOString().slice(0, 10), notes: '' });
  const [studentFormError, setStudentFormError] = useState('');
  const [showAddStudent, setShowAddStudent] = useState(false);

  // Leads
  const [leads, setLeads] = useState<Lead[]>([]);
  const [leadSearch, setLeadSearch] = useState('');
  const [updatingLead, setUpdatingLead] = useState<string | null>(null);
  const [deletingLead, setDeletingLead] = useState<string | null>(null);

  // Courses (content)
  const [courses, setCourses] = useState<Course[]>([]);
  const [courseForm, setCourseForm] = useState<Omit<Course, 'id' | 'sort_order'>>(BLANK_COURSE);
  const [courseFormError, setCourseFormError] = useState('');
  const [savingCourse, setSavingCourse] = useState(false);
  const [deletingCourse, setDeletingCourse] = useState<string | null>(null);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [showAddCourse, setShowAddCourse] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session) { router.replace('/login?redirect=/admin'); return; }
      const admin = session.user.app_metadata?.role === 'admin';
      setIsAdmin(admin);
      if (!admin) { setLoading(false); return; }
      await Promise.all([loadStudents(), loadLeads(), loadCourses()]);
      setLoading(false);
    });
  }, []);

  async function loadStudents() {
    const supabase = createClient();
    const { data } = await supabase.from('students').select('*').order('enrolled_at', { ascending: false });
    setStudents(data ?? []);
  }

  async function loadLeads() {
    const supabase = createClient();
    const { data } = await supabase.from('leads').select('*').order('created_at', { ascending: false });
    setLeads(data ?? []);
  }

  async function loadCourses() {
    const supabase = createClient();
    const { data } = await supabase.from('courses').select('*').order('sort_order');
    setCourses(data ?? []);
  }

  // --- STUDENTS ---
  async function addStudent(e: FormEvent) {
    e.preventDefault();
    if (!studentForm.name.trim() || !studentForm.phone.trim()) { setStudentFormError('Vui lòng điền đầy đủ họ tên và số điện thoại.'); return; }
    setAddingStudent(true); setStudentFormError('');
    const supabase = createClient();
    const { error } = await supabase.from('students').insert({
      name: studentForm.name.trim(), phone: studentForm.phone.trim(),
      course: studentForm.course, enrolled_at: studentForm.enrolled_at,
      notes: studentForm.notes.trim() || null,
    });
    setAddingStudent(false);
    if (error) { setStudentFormError('Lỗi: ' + error.message); return; }
    setStudentForm({ name: '', phone: '', course: STUDENT_COURSES[0], enrolled_at: new Date().toISOString().slice(0, 10), notes: '' });
    setShowAddStudent(false);
    await loadStudents();
  }

  async function deleteStudent(id: string) {
    if (!confirm('Xóa học viên này?')) return;
    setDeletingStudent(id);
    await createClient().from('students').delete().eq('id', id);
    setDeletingStudent(null);
    await loadStudents();
  }

  // --- LEADS ---
  async function updateLeadStatus(id: string, status: Lead['status']) {
    setUpdatingLead(id);
    await createClient().from('leads').update({ status }).eq('id', id);
    setUpdatingLead(null);
    await loadLeads();
  }

  async function deleteLead(id: string) {
    if (!confirm('Xóa yêu cầu tư vấn này?')) return;
    setDeletingLead(id);
    await createClient().from('leads').delete().eq('id', id);
    setDeletingLead(null);
    await loadLeads();
  }

  // --- COURSES ---
  function startEditCourse(c: Course) {
    setEditingCourse(c);
    setCourseForm({ name: c.name, category: c.category, price: c.price, duration: c.duration ?? '', description: c.description ?? '', image: c.image ?? '', active: c.active });
    setShowAddCourse(false);
    setCourseFormError('');
  }

  function cancelCourseEdit() {
    setEditingCourse(null);
    setShowAddCourse(false);
    setCourseForm(BLANK_COURSE);
    setCourseFormError('');
  }

  async function saveCourse(e: FormEvent) {
    e.preventDefault();
    if (!courseForm.name.trim() || !courseForm.price.trim()) { setCourseFormError('Vui lòng điền tên và giá.'); return; }
    setSavingCourse(true); setCourseFormError('');
    const supabase = createClient();
    const payload = {
      name: courseForm.name.trim(),
      category: courseForm.category,
      price: courseForm.price.trim(),
      duration: courseForm.duration?.trim() || null,
      description: courseForm.description?.trim() || null,
      image: courseForm.image?.trim() || null,
      active: courseForm.active,
    };
    const { error } = editingCourse
      ? await supabase.from('courses').update(payload).eq('id', editingCourse.id)
      : await supabase.from('courses').insert({ ...payload, sort_order: courses.length });
    setSavingCourse(false);
    if (error) { setCourseFormError('Lỗi: ' + error.message); return; }
    cancelCourseEdit();
    await loadCourses();
  }

  async function toggleCourseActive(c: Course) {
    await createClient().from('courses').update({ active: !c.active }).eq('id', c.id);
    await loadCourses();
  }

  async function deleteCourse(id: string) {
    if (!confirm('Xóa khóa học này?')) return;
    setDeletingCourse(id);
    await createClient().from('courses').delete().eq('id', id);
    setDeletingCourse(null);
    await loadCourses();
  }

  // --- FILTER ---
  const filteredStudents = students.filter(s =>
    s.name.toLowerCase().includes(studentSearch.toLowerCase()) ||
    s.phone.includes(studentSearch) ||
    s.course.toLowerCase().includes(studentSearch.toLowerCase())
  );
  const filteredLeads = leads.filter(l =>
    l.name.toLowerCase().includes(leadSearch.toLowerCase()) ||
    l.phone.includes(leadSearch) ||
    l.course.toLowerCase().includes(leadSearch.toLowerCase())
  );
  const newLeadsCount = leads.filter(l => l.status === 'new').length;

  // --- RENDER ---
  if (loading) return (
    <main style={{ minHeight: '100dvh', display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: 'var(--nav-h)' }}>
      <div className="admin-loading"><i className="ti ti-loader-2 spin"></i> Đang tải...</div>
    </main>
  );

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
            <h1 className="admin-title"><i className="ti ti-layout-dashboard"></i> Quản Lý</h1>
            <p className="admin-sub">
              <strong>{newLeadsCount}</strong> yêu cầu mới ·{' '}
              <strong>{students.length}</strong> học viên ·{' '}
              <strong>{courses.length}</strong> khóa học
            </p>
          </div>
        </div>

        {/* TABS */}
        <div className="admin-tabs">
          <button className={`admin-tab${activeTab === 'leads' ? ' active' : ''}`} onClick={() => setActiveTab('leads')}>
            <i className="ti ti-mail"></i> Yêu Cầu Tư Vấn
            {newLeadsCount > 0 && <span className="admin-tab-badge">{newLeadsCount}</span>}
          </button>
          <button className={`admin-tab${activeTab === 'students' ? ' active' : ''}`} onClick={() => setActiveTab('students')}>
            <i className="ti ti-users"></i> Học Viên
          </button>
          <button className={`admin-tab${activeTab === 'content' ? ' active' : ''}`} onClick={() => setActiveTab('content')}>
            <i className="ti ti-book-2"></i> Nội Dung
          </button>
        </div>

        {/* ======= LEADS TAB ======= */}
        {activeTab === 'leads' && (
          <>
            <div className="admin-search-wrap">
              <i className="ti ti-search"></i>
              <input className="admin-search" type="text" placeholder="Tìm theo tên, SĐT, khóa học..." value={leadSearch} onChange={e => setLeadSearch(e.target.value)} />
              {leadSearch && <button onClick={() => setLeadSearch('')} className="ct-search-clear"><i className="ti ti-x"></i></button>}
            </div>
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr><th>#</th><th>Họ Tên</th><th>Số Điện Thoại</th><th>Khu Vực</th><th>Khóa Quan Tâm</th><th>Ngày Gửi</th><th>Trạng Thái</th><th></th></tr>
                </thead>
                <tbody>
                  {filteredLeads.length === 0 ? (
                    <tr><td colSpan={8} className="admin-empty">Chưa có yêu cầu tư vấn nào</td></tr>
                  ) : filteredLeads.map((l, i) => (
                    <tr key={l.id} className={l.status === 'new' ? 'lead-row-new' : ''}>
                      <td className="admin-num">{i + 1}</td>
                      <td className="admin-name">{l.name}</td>
                      <td><a href={`tel:${l.phone}`} className="admin-phone">{l.phone}</a></td>
                      <td className="admin-date">{l.location ?? '—'}</td>
                      <td><span className="admin-course-tag">{l.course}</span></td>
                      <td className="admin-date">{new Date(l.created_at).toLocaleDateString('vi-VN')}</td>
                      <td>
                        <select className={`lead-status-select ${STATUS_CLASS[l.status]}`} value={l.status} disabled={updatingLead === l.id} onChange={e => updateLeadStatus(l.id, e.target.value as Lead['status'])}>
                          <option value="new">Mới</option>
                          <option value="contacted">Đã liên hệ</option>
                          <option value="enrolled">Đã đăng ký</option>
                        </select>
                      </td>
                      <td>
                        <button className="admin-del-btn" onClick={() => deleteLead(l.id)} disabled={deletingLead === l.id} title="Xóa">
                          {deletingLead === l.id ? <i className="ti ti-loader-2 spin"></i> : <i className="ti ti-trash"></i>}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* ======= STUDENTS TAB ======= */}
        {activeTab === 'students' && (
          <>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '16px' }}>
              <button className="btn btn-primary" onClick={() => setShowAddStudent(v => !v)}>
                <i className={`ti ti-${showAddStudent ? 'x' : 'user-plus'}`}></i> {showAddStudent ? 'Đóng' : 'Thêm Học Viên'}
              </button>
            </div>
            {showAddStudent && (
              <div className="admin-add-card">
                <h3 className="admin-section-title">Thêm Học Viên Mới</h3>
                <form className="admin-form" onSubmit={addStudent}>
                  <div className="admin-form-grid">
                    <div className="af-group">
                      <label>Họ và tên *</label>
                      <input type="text" placeholder="Nguyễn Văn A" value={studentForm.name} onChange={e => setStudentForm(f => ({ ...f, name: e.target.value }))} required />
                    </div>
                    <div className="af-group">
                      <label>Số điện thoại *</label>
                      <input type="tel" placeholder="0912 345 678" value={studentForm.phone} onChange={e => setStudentForm(f => ({ ...f, phone: e.target.value }))} required />
                    </div>
                    <div className="af-group">
                      <label>Khóa học</label>
                      <select value={studentForm.course} onChange={e => setStudentForm(f => ({ ...f, course: e.target.value }))}>
                        {STUDENT_COURSES.map(c => <option key={c}>{c}</option>)}
                      </select>
                    </div>
                    <div className="af-group">
                      <label>Ngày đăng ký</label>
                      <input type="date" value={studentForm.enrolled_at} onChange={e => setStudentForm(f => ({ ...f, enrolled_at: e.target.value }))} />
                    </div>
                    <div className="af-group af-full">
                      <label>Ghi chú</label>
                      <input type="text" placeholder="Ví dụ: Thanh toán 50%, học buổi tối..." value={studentForm.notes} onChange={e => setStudentForm(f => ({ ...f, notes: e.target.value }))} />
                    </div>
                  </div>
                  {studentFormError && <div className="lf-error" style={{ marginBottom: '12px' }}><i className="ti ti-alert-circle"></i> {studentFormError}</div>}
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button type="submit" className="btn btn-primary" disabled={addingStudent}>
                      {addingStudent ? <><i className="ti ti-loader-2 spin"></i> Đang lưu...</> : <><i className="ti ti-check"></i> Lưu Học Viên</>}
                    </button>
                    <button type="button" className="btn btn-outline" onClick={() => setShowAddStudent(false)}>Hủy</button>
                  </div>
                </form>
              </div>
            )}
            <div className="admin-search-wrap">
              <i className="ti ti-search"></i>
              <input className="admin-search" type="text" placeholder="Tìm theo tên, SĐT, khóa học..." value={studentSearch} onChange={e => setStudentSearch(e.target.value)} />
              {studentSearch && <button onClick={() => setStudentSearch('')} className="ct-search-clear"><i className="ti ti-x"></i></button>}
            </div>
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr><th>#</th><th>Họ Tên</th><th>Số Điện Thoại</th><th>Khóa Học</th><th>Ngày Đăng Ký</th><th>Ghi Chú</th><th></th></tr>
                </thead>
                <tbody>
                  {filteredStudents.length === 0 ? (
                    <tr><td colSpan={7} className="admin-empty">Không tìm thấy học viên nào</td></tr>
                  ) : filteredStudents.map((s, i) => (
                    <tr key={s.id}>
                      <td className="admin-num">{i + 1}</td>
                      <td className="admin-name">{s.name}</td>
                      <td><a href={`tel:${s.phone}`} className="admin-phone">{s.phone}</a></td>
                      <td><span className="admin-course-tag">{s.course}</span></td>
                      <td className="admin-date">{new Date(s.enrolled_at).toLocaleDateString('vi-VN')}</td>
                      <td className="admin-notes">{s.notes ?? '—'}</td>
                      <td>
                        <button className="admin-del-btn" onClick={() => deleteStudent(s.id)} disabled={deletingStudent === s.id} title="Xóa">
                          {deletingStudent === s.id ? <i className="ti ti-loader-2 spin"></i> : <i className="ti ti-trash"></i>}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* ======= CONTENT TAB ======= */}
        {activeTab === 'content' && (
          <>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '16px' }}>
              <button className="btn btn-primary" onClick={() => { setShowAddCourse(v => !v); setEditingCourse(null); setCourseForm(BLANK_COURSE); }}>
                <i className={`ti ti-${showAddCourse ? 'x' : 'plus'}`}></i> {showAddCourse ? 'Đóng' : 'Thêm Khóa Học'}
              </button>
            </div>

            {/* COURSE FORM (add or edit) */}
            {(showAddCourse || editingCourse) && (
              <div className="admin-add-card">
                <h3 className="admin-section-title">{editingCourse ? `Sửa: ${editingCourse.name}` : 'Thêm Khóa Học Mới'}</h3>
                <form className="admin-form" onSubmit={saveCourse}>
                  <div className="admin-form-grid">
                    <div className="af-group af-full">
                      <label>Tên khóa học *</label>
                      <input type="text" placeholder="Ví dụ: Trà Sữa Hiện Đại" value={courseForm.name} onChange={e => setCourseForm(f => ({ ...f, name: e.target.value }))} required />
                    </div>
                    <div className="af-group">
                      <label>Loại *</label>
                      <select value={courseForm.category} onChange={e => setCourseForm(f => ({ ...f, category: e.target.value as Course['category'] }))}>
                        <option value="chuyen-de">Chuyên Đề Lẻ</option>
                        <option value="kinh-doanh">Gói Kinh Doanh</option>
                      </select>
                    </div>
                    <div className="af-group">
                      <label>Giá *</label>
                      <input type="text" placeholder="2.500.000đ" value={courseForm.price} onChange={e => setCourseForm(f => ({ ...f, price: e.target.value }))} required />
                    </div>
                    <div className="af-group">
                      <label>Thời lượng</label>
                      <input type="text" placeholder="1 ngày · 2 buổi" value={courseForm.duration ?? ''} onChange={e => setCourseForm(f => ({ ...f, duration: e.target.value }))} />
                    </div>
                    <div className="af-group">
                      <label>Tên file ảnh</label>
                      <input type="text" placeholder="tra-sua-hien-dai.png" value={courseForm.image ?? ''} onChange={e => setCourseForm(f => ({ ...f, image: e.target.value }))} />
                    </div>
                    <div className="af-group af-full">
                      <label>Mô tả</label>
                      <textarea rows={3} placeholder="Mô tả ngắn về khóa học..." value={courseForm.description ?? ''} onChange={e => setCourseForm(f => ({ ...f, description: e.target.value }))} />
                    </div>
                    <div className="af-group">
                      <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                        <input type="checkbox" checked={courseForm.active} onChange={e => setCourseForm(f => ({ ...f, active: e.target.checked }))} />
                        Hiển thị trên trang chủ
                      </label>
                    </div>
                  </div>
                  {courseFormError && <div className="lf-error" style={{ marginBottom: '12px' }}><i className="ti ti-alert-circle"></i> {courseFormError}</div>}
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button type="submit" className="btn btn-primary" disabled={savingCourse}>
                      {savingCourse ? <><i className="ti ti-loader-2 spin"></i> Đang lưu...</> : <><i className="ti ti-check"></i> {editingCourse ? 'Cập Nhật' : 'Thêm Khóa Học'}</>}
                    </button>
                    <button type="button" className="btn btn-outline" onClick={cancelCourseEdit}>Hủy</button>
                  </div>
                </form>
              </div>
            )}

            {/* COURSES TABLE */}
            {(['chuyen-de', 'kinh-doanh'] as Course['category'][]).map(cat => {
              const list = courses.filter(c => c.category === cat);
              return (
                <div key={cat} style={{ marginBottom: '32px' }}>
                  <h3 className="admin-section-title" style={{ marginBottom: '12px' }}>
                    <i className={`ti ti-${cat === 'chuyen-de' ? 'cup' : 'briefcase'}`}></i> {CAT_LABEL[cat]}
                    <span style={{ fontWeight: 400, color: 'var(--text-3)', marginLeft: '8px' }}>({list.length} khóa)</span>
                  </h3>
                  <div className="admin-table-wrap">
                    <table className="admin-table">
                      <thead>
                        <tr><th>Tên Khóa Học</th><th>Giá</th><th>Thời Lượng</th><th>Hiển Thị</th><th></th></tr>
                      </thead>
                      <tbody>
                        {list.length === 0 ? (
                          <tr><td colSpan={5} className="admin-empty">Chưa có khóa học nào — thêm từ nút trên</td></tr>
                        ) : list.map(c => (
                          <tr key={c.id} style={{ opacity: c.active ? 1 : 0.45 }}>
                            <td className="admin-name">{c.name}</td>
                            <td style={{ fontWeight: 600, color: 'var(--accent)', whiteSpace: 'nowrap' }}>{c.price}</td>
                            <td className="admin-date">{c.duration ?? '—'}</td>
                            <td>
                              <button className={`course-toggle${c.active ? ' on' : ''}`} onClick={() => toggleCourseActive(c)} title={c.active ? 'Đang hiện — click để ẩn' : 'Đang ẩn — click để hiện'}>
                                <i className={`ti ti-${c.active ? 'eye' : 'eye-off'}`}></i>
                              </button>
                            </td>
                            <td style={{ display: 'flex', gap: '4px' }}>
                              <button className="admin-edit-btn" onClick={() => startEditCourse(c)} title="Sửa"><i className="ti ti-pencil"></i></button>
                              <button className="admin-del-btn" onClick={() => deleteCourse(c.id)} disabled={deletingCourse === c.id} title="Xóa">
                                {deletingCourse === c.id ? <i className="ti ti-loader-2 spin"></i> : <i className="ti ti-trash"></i>}
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              );
            })}

            {courses.length === 0 && !showAddCourse && (
              <div className="admin-empty" style={{ border: '2px dashed var(--border)', borderRadius: '12px', padding: '48px' }}>
                <i className="ti ti-book-2" style={{ fontSize: '2rem', color: 'var(--muted)', display: 'block', marginBottom: '12px' }}></i>
                Chưa có khóa học nào trong database.<br />
                <small>Nhấn "Thêm Khóa Học" hoặc chạy SQL seed data bên dưới.</small>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}
