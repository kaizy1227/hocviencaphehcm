'use client';
import { useEffect, useState, FormEvent, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';

type Student = {
  id: string; name: string; phone: string; course: string;
  enrolled_at: string; notes: string | null; created_at: string;
  auth_user_id: string | null; course_access: string[] | null;
};
type Lead = {
  id: string; name: string; phone: string; course: string;
  location: string | null; status: 'new' | 'contacted' | 'enrolled'; created_at: string;
};
type Course = {
  id: string; name: string; category: 'tong-hop' | 'chuyen-de' | 'kinh-doanh';
  price: string; duration: string | null; description: string | null;
  image: string | null; active: boolean; sort_order: number;
};
type Product = {
  id: string; stt: number; name: string; unit: string;
  price: number; image_url: string; category: string; active: boolean;
  phan_loai: 'thuong-mai' | 'thuong-hieu';
};
type Tool = {
  id: string; stt: number; name: string; unit: string;
  price: number; image_url: string; category: string; active: boolean;
};

const RECIPE_COURSES = ['Tổng hợp hiện đại', 'Tổng hợp truyền thống'];
const STUDENT_COURSES = [
  'Tổng Hợp Truyền Thống', 'Tổng Hợp Hiện Đại', 'Cà Phê Máy Nâng Cao',
  'Cà Phê Phin Truyền Thống', 'Trà Sữa Hiện Đại', 'Trà Trái Cây & Matcha',
  'Đá Xay & Sinh Tố', 'Nitro & Soda', 'Chọn Món Kem 1-1', 'Khởi Nghiệp A-Z', 'Khác',
];
const STATUS_CLASS: Record<Lead['status'], string> = {
  new: 'lead-badge-new', contacted: 'lead-badge-contacted', enrolled: 'lead-badge-enrolled',
};
const CAT_LABEL: Record<Course['category'], string> = {
  'tong-hop': 'Khóa Tổng Hợp', 'chuyen-de': 'Chuyên Đề Lẻ', 'kinh-doanh': 'Gói Kinh Doanh',
};
const BLANK_COURSE: Omit<Course, 'id' | 'sort_order'> = {
  name: '', category: 'tong-hop', price: '', duration: '', description: '', image: '', active: true,
};
const BLANK_PRODUCT: Omit<Product, 'id'> = {
  stt: 0, name: '', unit: '', price: 0, image_url: '', category: 'Nguyên liệu', active: true, phan_loai: 'thuong-mai',
};
const BLANK_TOOL: Omit<Tool, 'id'> = {
  stt: 0, name: '', unit: '', price: 0, image_url: '', category: 'Dụng cụ pha chế', active: true,
};

export default function AdminPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [activeTab, setActiveTab] = useState<'leads' | 'students' | 'content' | 'products' | 'tools'>('leads');

  // Students
  const [students, setStudents] = useState<Student[]>([]);
  const [addingStudent, setAddingStudent] = useState(false);
  const [deletingStudent, setDeletingStudent] = useState<string | null>(null);
  const [studentSearch, setStudentSearch] = useState('');
  const [studentForm, setStudentForm] = useState({ name: '', phone: '', course: STUDENT_COURSES[0], enrolled_at: new Date().toISOString().slice(0, 10), notes: '' });
  const [studentFormError, setStudentFormError] = useState('');
  const [showAddStudent, setShowAddStudent] = useState(false);
  const [grantModal, setGrantModal] = useState<Student | null>(null);
  const [grantAccess, setGrantAccess] = useState<string[]>([]);
  const [savingGrant, setSavingGrant] = useState(false);

  // Leads
  const [leads, setLeads] = useState<Lead[]>([]);
  const [leadSearch, setLeadSearch] = useState('');
  const [updatingLead, setUpdatingLead] = useState<string | null>(null);
  const [deletingLead, setDeletingLead] = useState<string | null>(null);

  // Courses
  const [courses, setCourses] = useState<Course[]>([]);
  const [courseForm, setCourseForm] = useState<Omit<Course, 'id' | 'sort_order'>>(BLANK_COURSE);
  const [courseFormError, setCourseFormError] = useState('');
  const [savingCourse, setSavingCourse] = useState(false);
  const [deletingCourse, setDeletingCourse] = useState<string | null>(null);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [showAddCourse, setShowAddCourse] = useState(false);

  // Products
  const [products, setProducts] = useState<Product[]>([]);
  const [productForm, setProductForm] = useState<Omit<Product, 'id'>>(BLANK_PRODUCT);
  const [productFormError, setProductFormError] = useState('');
  const [savingProduct, setSavingProduct] = useState(false);
  const [deletingProduct, setDeletingProduct] = useState<string | null>(null);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [uploadingImg, setUploadingImg] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  // Tools (Dụng Cụ)
  const [tools, setTools] = useState<Tool[]>([]);
  const [toolForm, setToolForm] = useState<Omit<Tool, 'id'>>(BLANK_TOOL);
  const [toolFormError, setToolFormError] = useState('');
  const [savingTool, setSavingTool] = useState(false);
  const [deletingTool, setDeletingTool] = useState<string | null>(null);
  const [editingTool, setEditingTool] = useState<Tool | null>(null);
  const [showAddTool, setShowAddTool] = useState(false);
  const [uploadingToolImg, setUploadingToolImg] = useState(false);
  const toolFileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session) { router.replace('/login?redirect=/admin'); return; }
      const admin = session.user.app_metadata?.role === 'admin';
      setIsAdmin(admin);
      if (!admin) { setLoading(false); return; }
      await Promise.all([loadStudents(), loadLeads(), loadCourses(), loadProducts(), loadTools()]);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') { cancelProductEdit(); cancelToolEdit(); cancelCourseEdit(); }
    }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  async function loadStudents() {
    const { data } = await createClient().from('students').select('*').order('enrolled_at', { ascending: false });
    setStudents(data ?? []);
  }
  async function loadLeads() {
    const { data } = await createClient().from('leads').select('*').order('created_at', { ascending: false });
    setLeads(data ?? []);
  }
  async function loadCourses() {
    const { data } = await createClient().from('courses').select('*').order('sort_order');
    setCourses(data ?? []);
  }
  async function loadProducts() {
    const { data } = await createClient().from('products').select('*').order('stt');
    setProducts(data ?? []);
  }
  async function loadTools() {
    const { data } = await createClient().from('dung_cu').select('*').order('stt');
    setTools(data ?? []);
  }

  // --- STUDENTS ---
  async function addStudent(e: FormEvent) {
    e.preventDefault();
    if (!studentForm.name.trim() || !studentForm.phone.trim()) { setStudentFormError('Vui lòng điền đầy đủ họ tên và số điện thoại.'); return; }
    setAddingStudent(true); setStudentFormError('');
    const { error } = await createClient().from('students').insert({
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
  function openGrantModal(s: Student) { setGrantModal(s); setGrantAccess(s.course_access ?? []); }
  async function saveGrant() {
    if (!grantModal) return;
    setSavingGrant(true);
    await createClient().from('students').update({ course_access: grantAccess }).eq('id', grantModal.id);
    setSavingGrant(false); setGrantModal(null); await loadStudents();
  }
  async function deleteStudent(id: string) {
    if (!confirm('Xóa học viên này?')) return;
    setDeletingStudent(id);
    await createClient().from('students').delete().eq('id', id);
    setDeletingStudent(null); await loadStudents();
  }

  // --- LEADS ---
  async function updateLeadStatus(id: string, status: Lead['status']) {
    setUpdatingLead(id);
    await createClient().from('leads').update({ status }).eq('id', id);
    setUpdatingLead(null); await loadLeads();
  }
  async function deleteLead(id: string) {
    if (!confirm('Xóa yêu cầu tư vấn này?')) return;
    setDeletingLead(id);
    await createClient().from('leads').delete().eq('id', id);
    setDeletingLead(null); await loadLeads();
  }

  // --- COURSES ---
  function startEditCourse(c: Course) {
    setEditingCourse(c);
    setCourseForm({ name: c.name, category: c.category, price: c.price, duration: c.duration ?? '', description: c.description ?? '', image: c.image ?? '', active: c.active });
    setShowAddCourse(false); setCourseFormError('');
  }
  function cancelCourseEdit() { setEditingCourse(null); setShowAddCourse(false); setCourseForm(BLANK_COURSE); setCourseFormError(''); }
  async function saveCourse(e: FormEvent) {
    e.preventDefault();
    if (!courseForm.name.trim() || !courseForm.price.trim()) { setCourseFormError('Vui lòng điền tên và giá.'); return; }
    setSavingCourse(true); setCourseFormError('');
    const payload = { name: courseForm.name.trim(), category: courseForm.category, price: courseForm.price.trim(), duration: courseForm.duration?.trim() || null, description: courseForm.description?.trim() || null, image: courseForm.image?.trim() || null, active: courseForm.active };
    const { error } = editingCourse
      ? await createClient().from('courses').update(payload).eq('id', editingCourse.id)
      : await createClient().from('courses').insert({ ...payload, sort_order: courses.length });
    setSavingCourse(false);
    if (error) { setCourseFormError('Lỗi: ' + error.message); return; }
    cancelCourseEdit(); await loadCourses();
  }
  async function toggleCourseActive(c: Course) {
    await createClient().from('courses').update({ active: !c.active }).eq('id', c.id);
    await loadCourses();
  }
  async function deleteCourse(id: string) {
    if (!confirm('Xóa khóa học này?')) return;
    setDeletingCourse(id);
    await createClient().from('courses').delete().eq('id', id);
    setDeletingCourse(null); await loadCourses();
  }

  // --- PRODUCTS ---
  function startEditProduct(p: Product) {
    setEditingProduct(p);
    setProductForm({ stt: p.stt, name: p.name, unit: p.unit, price: p.price, image_url: p.image_url, category: p.category, active: p.active, phan_loai: p.phan_loai ?? 'thuong-mai' });
    setShowAddProduct(false); setProductFormError('');
  }
  function cancelProductEdit() { setEditingProduct(null); setShowAddProduct(false); setProductForm(BLANK_PRODUCT); setProductFormError(''); }

  async function handleProductImageUpload(file: File) {
    setUploadingImg(true);
    const supabase = createClient();
    const ext = file.name.split('.').pop() ?? 'jpg';
    const path = `${Date.now()}.${ext}`;
    const { data, error } = await supabase.storage.from('products').upload(path, file, { upsert: true });
    setUploadingImg(false);
    if (error) { setProductFormError('Upload ảnh thất bại: ' + error.message); return; }
    const { data: { publicUrl } } = supabase.storage.from('products').getPublicUrl(data.path);
    setProductForm(f => ({ ...f, image_url: publicUrl }));
  }

  async function saveProduct(e: FormEvent) {
    e.preventDefault();
    if (!productForm.name.trim()) { setProductFormError('Vui lòng điền tên sản phẩm.'); return; }
    setSavingProduct(true); setProductFormError('');
    const payload = { stt: productForm.stt, name: productForm.name.trim(), unit: productForm.unit.trim(), price: productForm.price, image_url: productForm.image_url.trim(), category: productForm.category.trim(), active: productForm.active, phan_loai: productForm.phan_loai };
    const { error } = editingProduct
      ? await createClient().from('products').update(payload).eq('id', editingProduct.id)
      : await createClient().from('products').insert(payload);
    setSavingProduct(false);
    if (error) { setProductFormError('Lỗi: ' + error.message); return; }
    cancelProductEdit(); await loadProducts();
  }

  async function deleteProduct(id: string) {
    if (!confirm('Xóa sản phẩm này?')) return;
    setDeletingProduct(id);
    await createClient().from('products').delete().eq('id', id);
    setDeletingProduct(null); await loadProducts();
  }
  async function toggleProductActive(p: Product) {
    await createClient().from('products').update({ active: !p.active }).eq('id', p.id);
    await loadProducts();
  }

  // --- TOOLS (DỤNG CỤ) ---
  function startEditTool(t: Tool) {
    setEditingTool(t);
    setToolForm({ stt: t.stt, name: t.name, unit: t.unit, price: t.price, image_url: t.image_url, category: t.category, active: t.active });
    setShowAddTool(false); setToolFormError('');
  }
  function cancelToolEdit() { setEditingTool(null); setShowAddTool(false); setToolForm(BLANK_TOOL); setToolFormError(''); }

  async function handleToolImageUpload(file: File) {
    setUploadingToolImg(true);
    const supabase = createClient();
    const ext = file.name.split('.').pop() ?? 'jpg';
    const path = `${Date.now()}.${ext}`;
    const { data, error } = await supabase.storage.from('products').upload(path, file, { upsert: true });
    setUploadingToolImg(false);
    if (error) { setToolFormError('Upload ảnh thất bại: ' + error.message); return; }
    const { data: { publicUrl } } = supabase.storage.from('products').getPublicUrl(data.path);
    setToolForm(f => ({ ...f, image_url: publicUrl }));
  }

  async function saveTool(e: FormEvent) {
    e.preventDefault();
    if (!toolForm.name.trim()) { setToolFormError('Vui lòng điền tên sản phẩm.'); return; }
    setSavingTool(true); setToolFormError('');
    const payload = { stt: toolForm.stt, name: toolForm.name.trim(), unit: toolForm.unit.trim(), price: toolForm.price, image_url: toolForm.image_url.trim(), category: toolForm.category.trim(), active: toolForm.active };
    const { error } = editingTool
      ? await createClient().from('dung_cu').update(payload).eq('id', editingTool.id)
      : await createClient().from('dung_cu').insert(payload);
    setSavingTool(false);
    if (error) { setToolFormError('Lỗi: ' + error.message); return; }
    cancelToolEdit(); await loadTools();
  }

  async function deleteTool(id: string) {
    if (!confirm('Xóa sản phẩm này?')) return;
    setDeletingTool(id);
    await createClient().from('dung_cu').delete().eq('id', id);
    setDeletingTool(null); await loadTools();
  }
  async function toggleToolActive(t: Tool) {
    await createClient().from('dung_cu').update({ active: !t.active }).eq('id', t.id);
    await loadTools();
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
              <strong>{courses.length}</strong> khóa học ·{' '}
              <strong>{products.length}</strong> nguyên liệu ·{' '}
              <strong>{tools.length}</strong> dụng cụ
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
          <button className={`admin-tab${activeTab === 'products' ? ' active' : ''}`} onClick={() => setActiveTab('products')}>
            <i className="ti ti-package"></i> Nguyên Liệu
          </button>
          <button className={`admin-tab${activeTab === 'tools' ? ' active' : ''}`} onClick={() => setActiveTab('tools')}>
            <i className="ti ti-tool"></i> Dụng Cụ
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
                <thead><tr><th>#</th><th>Họ Tên</th><th>Số Điện Thoại</th><th>Khu Vực</th><th>Khóa Quan Tâm</th><th>Ngày Gửi</th><th>Trạng Thái</th><th></th></tr></thead>
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

        {/* GRANT ACCESS MODAL */}
        {grantModal && (
          <div className="ct-modal-bg" onClick={() => setGrantModal(null)}>
            <div className="ct-modal" style={{ maxWidth: '420px' }} onClick={e => e.stopPropagation()}>
              <button className="ct-modal-close" onClick={() => setGrantModal(null)}><i className="ti ti-x"></i></button>
              <div className="ct-modal-body" style={{ padding: '28px 24px' }}>
                <h3 style={{ marginBottom: '4px' }}>Cấp quyền xem công thức</h3>
                <p style={{ color: 'var(--text-3)', fontSize: '0.875rem', marginBottom: '20px' }}><strong>{grantModal.name}</strong> — {grantModal.phone}</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
                  {RECIPE_COURSES.map(c => (
                    <label key={c} style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', padding: '12px', border: '1px solid var(--border)', borderRadius: 'var(--r)', background: grantAccess.includes(c) ? 'rgba(176,90,16,0.06)' : 'transparent' }}>
                      <input type="checkbox" checked={grantAccess.includes(c)} onChange={e => setGrantAccess(prev => e.target.checked ? [...prev, c] : prev.filter(x => x !== c))} style={{ accentColor: 'var(--accent)', width: '16px', height: '16px' }} />
                      <span style={{ fontWeight: 500 }}>{c}</span>
                    </label>
                  ))}
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button className="btn btn-primary" onClick={saveGrant} disabled={savingGrant}>
                    {savingGrant ? <><i className="ti ti-loader-2 spin"></i> Đang lưu...</> : <><i className="ti ti-check"></i> Lưu Quyền</>}
                  </button>
                  <button className="btn btn-outline" onClick={() => setGrantModal(null)}>Hủy</button>
                </div>
              </div>
            </div>
          </div>
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
                    <div className="af-group"><label>Họ và tên *</label><input type="text" placeholder="Nguyễn Văn A" value={studentForm.name} onChange={e => setStudentForm(f => ({ ...f, name: e.target.value }))} required /></div>
                    <div className="af-group"><label>Số điện thoại *</label><input type="tel" placeholder="0912 345 678" value={studentForm.phone} onChange={e => setStudentForm(f => ({ ...f, phone: e.target.value }))} required /></div>
                    <div className="af-group"><label>Khóa học</label><select value={studentForm.course} onChange={e => setStudentForm(f => ({ ...f, course: e.target.value }))}>{STUDENT_COURSES.map(c => <option key={c}>{c}</option>)}</select></div>
                    <div className="af-group"><label>Ngày đăng ký</label><input type="date" value={studentForm.enrolled_at} onChange={e => setStudentForm(f => ({ ...f, enrolled_at: e.target.value }))} /></div>
                    <div className="af-group af-full"><label>Ghi chú</label><input type="text" placeholder="Ví dụ: Thanh toán 50%, học buổi tối..." value={studentForm.notes} onChange={e => setStudentForm(f => ({ ...f, notes: e.target.value }))} /></div>
                  </div>
                  {studentFormError && <div className="lf-error" style={{ marginBottom: '12px' }}><i className="ti ti-alert-circle"></i> {studentFormError}</div>}
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button type="submit" className="btn btn-primary" disabled={addingStudent}>{addingStudent ? <><i className="ti ti-loader-2 spin"></i> Đang lưu...</> : <><i className="ti ti-check"></i> Lưu Học Viên</>}</button>
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
                <thead><tr><th>#</th><th>Họ Tên</th><th>Số Điện Thoại</th><th>Khóa Học</th><th>Quyền Xem CT</th><th>Ngày ĐK</th><th></th></tr></thead>
                <tbody>
                  {filteredStudents.length === 0 ? (
                    <tr><td colSpan={7} className="admin-empty">Không tìm thấy học viên nào</td></tr>
                  ) : filteredStudents.map((s, i) => (
                    <tr key={s.id}>
                      <td className="admin-num">{i + 1}</td>
                      <td className="admin-name">{s.name}{s.auth_user_id && <span title="Đã có tài khoản" style={{ marginLeft: '6px', color: 'var(--accent)', fontSize: '0.75rem' }}><i className="ti ti-circle-check"></i></span>}</td>
                      <td><a href={`tel:${s.phone}`} className="admin-phone">{s.phone}</a></td>
                      <td><span className="admin-course-tag">{s.course}</span></td>
                      <td>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', alignItems: 'center' }}>
                          {(s.course_access ?? []).length === 0
                            ? <span style={{ color: 'var(--muted)', fontSize: '0.8rem' }}>Chưa cấp</span>
                            : (s.course_access ?? []).map(c => <span key={c} className="admin-course-tag" style={{ fontSize: '0.75rem' }}>{c}</span>)
                          }
                          <button className="admin-edit-btn" onClick={() => openGrantModal(s)} title="Cấp quyền"><i className="ti ti-key"></i></button>
                        </div>
                      </td>
                      <td className="admin-date">{new Date(s.enrolled_at).toLocaleDateString('vi-VN')}</td>
                      <td><button className="admin-del-btn" onClick={() => deleteStudent(s.id)} disabled={deletingStudent === s.id} title="Xóa">{deletingStudent === s.id ? <i className="ti ti-loader-2 spin"></i> : <i className="ti ti-trash"></i>}</button></td>
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
            {showAddCourse && (
              <div className="admin-add-card">
                <h3 className="admin-section-title">Thêm Khóa Học Mới</h3>
                <form className="admin-form" onSubmit={saveCourse}>
                  <div className="admin-form-grid">
                    <div className="af-group af-full"><label>Tên khóa học *</label><input type="text" placeholder="Ví dụ: Trà Sữa Hiện Đại" value={courseForm.name} onChange={e => setCourseForm(f => ({ ...f, name: e.target.value }))} required /></div>
                    <div className="af-group"><label>Loại *</label><select value={courseForm.category} onChange={e => setCourseForm(f => ({ ...f, category: e.target.value as Course['category'] }))}><option value="tong-hop">Khóa Tổng Hợp</option><option value="chuyen-de">Chuyên Đề Lẻ</option><option value="kinh-doanh">Gói Kinh Doanh</option></select></div>
                    <div className="af-group"><label>Giá *</label><input type="text" placeholder="2.500.000đ" value={courseForm.price} onChange={e => setCourseForm(f => ({ ...f, price: e.target.value }))} required /></div>
                    <div className="af-group"><label>Thời lượng</label><input type="text" placeholder="1 ngày · 2 buổi" value={courseForm.duration ?? ''} onChange={e => setCourseForm(f => ({ ...f, duration: e.target.value }))} /></div>
                    <div className="af-group"><label>Tên file ảnh</label><input type="text" placeholder="tra-sua-hien-dai.png" value={courseForm.image ?? ''} onChange={e => setCourseForm(f => ({ ...f, image: e.target.value }))} /></div>
                    <div className="af-group af-full"><label>Mô tả</label><textarea rows={3} placeholder="Mô tả ngắn về khóa học..." value={courseForm.description ?? ''} onChange={e => setCourseForm(f => ({ ...f, description: e.target.value }))} /></div>
                    <div className="af-group"><label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}><input type="checkbox" checked={courseForm.active} onChange={e => setCourseForm(f => ({ ...f, active: e.target.checked }))} />Hiển thị trên trang chủ</label></div>
                  </div>
                  {courseFormError && <div className="lf-error" style={{ marginBottom: '12px' }}><i className="ti ti-alert-circle"></i> {courseFormError}</div>}
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button type="submit" className="btn btn-primary" disabled={savingCourse}>{savingCourse ? <><i className="ti ti-loader-2 spin"></i> Đang lưu...</> : <><i className="ti ti-check"></i> Thêm Khóa Học</>}</button>
                    <button type="button" className="btn btn-outline" onClick={cancelCourseEdit}>Hủy</button>
                  </div>
                </form>
              </div>
            )}

            {editingCourse && (
              <div className="admin-modal-backdrop" onClick={e => { if (e.target === e.currentTarget) cancelCourseEdit(); }}>
                <div className="admin-modal-card">
                  <div className="admin-modal-head">
                    <h3>Sửa: {editingCourse.name}</h3>
                    <button type="button" className="admin-modal-close" onClick={cancelCourseEdit}><i className="ti ti-x"></i></button>
                  </div>
                  <form className="admin-form" onSubmit={saveCourse}>
                    <div className="admin-form-grid">
                      <div className="af-group af-full"><label>Tên khóa học *</label><input type="text" placeholder="Ví dụ: Trà Sữa Hiện Đại" value={courseForm.name} onChange={e => setCourseForm(f => ({ ...f, name: e.target.value }))} required /></div>
                      <div className="af-group"><label>Loại *</label><select value={courseForm.category} onChange={e => setCourseForm(f => ({ ...f, category: e.target.value as Course['category'] }))}><option value="tong-hop">Khóa Tổng Hợp</option><option value="chuyen-de">Chuyên Đề Lẻ</option><option value="kinh-doanh">Gói Kinh Doanh</option></select></div>
                      <div className="af-group"><label>Giá *</label><input type="text" placeholder="2.500.000đ" value={courseForm.price} onChange={e => setCourseForm(f => ({ ...f, price: e.target.value }))} required /></div>
                      <div className="af-group"><label>Thời lượng</label><input type="text" placeholder="1 ngày · 2 buổi" value={courseForm.duration ?? ''} onChange={e => setCourseForm(f => ({ ...f, duration: e.target.value }))} /></div>
                      <div className="af-group"><label>Tên file ảnh</label><input type="text" placeholder="tra-sua-hien-dai.png" value={courseForm.image ?? ''} onChange={e => setCourseForm(f => ({ ...f, image: e.target.value }))} /></div>
                      <div className="af-group af-full"><label>Mô tả</label><textarea rows={3} placeholder="Mô tả ngắn về khóa học..." value={courseForm.description ?? ''} onChange={e => setCourseForm(f => ({ ...f, description: e.target.value }))} /></div>
                      <div className="af-group"><label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}><input type="checkbox" checked={courseForm.active} onChange={e => setCourseForm(f => ({ ...f, active: e.target.checked }))} />Hiển thị trên trang chủ</label></div>
                    </div>
                    {courseFormError && <div className="lf-error" style={{ marginBottom: '12px' }}><i className="ti ti-alert-circle"></i> {courseFormError}</div>}
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <button type="submit" className="btn btn-primary" disabled={savingCourse}>{savingCourse ? <><i className="ti ti-loader-2 spin"></i> Đang lưu...</> : <><i className="ti ti-check"></i> Cập Nhật</>}</button>
                      <button type="button" className="btn btn-outline" onClick={cancelCourseEdit}>Hủy</button>
                    </div>
                  </form>
                </div>
              </div>
            )}
            {(['tong-hop', 'chuyen-de', 'kinh-doanh'] as Course['category'][]).map(cat => {
              const list = courses.filter(c => c.category === cat);
              return (
                <div key={cat} style={{ marginBottom: '32px' }}>
                  <h3 className="admin-section-title" style={{ marginBottom: '12px' }}>
                    <i className={`ti ti-${cat === 'tong-hop' ? 'school' : cat === 'chuyen-de' ? 'cup' : 'briefcase'}`}></i> {CAT_LABEL[cat]}
                    <span style={{ fontWeight: 400, color: 'var(--text-3)', marginLeft: '8px' }}>({list.length} khóa)</span>
                  </h3>
                  <div className="admin-table-wrap">
                    <table className="admin-table">
                      <thead><tr><th>Tên Khóa Học</th><th>Giá</th><th>Thời Lượng</th><th>Hiển Thị</th><th></th></tr></thead>
                      <tbody>
                        {list.length === 0 ? (
                          <tr><td colSpan={5} className="admin-empty">Chưa có khóa học nào</td></tr>
                        ) : list.map(c => (
                          <tr key={c.id} style={{ opacity: c.active ? 1 : 0.45 }}>
                            <td className="admin-name">{c.name}</td>
                            <td style={{ fontWeight: 600, color: 'var(--accent)', whiteSpace: 'nowrap' }}>{c.price}</td>
                            <td className="admin-date">{c.duration ?? '—'}</td>
                            <td><button className={`course-toggle${c.active ? ' on' : ''}`} onClick={() => toggleCourseActive(c)}><i className={`ti ti-${c.active ? 'eye' : 'eye-off'}`}></i></button></td>
                            <td style={{ display: 'flex', gap: '4px' }}>
                              <button className="admin-edit-btn" onClick={() => startEditCourse(c)}><i className="ti ti-pencil"></i></button>
                              <button className="admin-del-btn" onClick={() => deleteCourse(c.id)} disabled={deletingCourse === c.id}>{deletingCourse === c.id ? <i className="ti ti-loader-2 spin"></i> : <i className="ti ti-trash"></i>}</button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              );
            })}
          </>
        )}

        {/* ======= TOOLS TAB (DỤNG CỤ) ======= */}
        {activeTab === 'tools' && (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
              <p style={{ color: 'var(--text-3)', fontSize: '0.85rem', margin: 0 }}>
                Bảng giá dụng cụ hiển thị tại{' '}
                <Link href="/dung-cu" target="_blank" style={{ color: 'var(--accent)' }}>/dung-cu <i className="ti ti-external-link" style={{ fontSize: '0.75rem' }}></i></Link>
              </p>
              <button className="btn btn-primary" onClick={() => { setShowAddTool(v => !v); setEditingTool(null); setToolForm(BLANK_TOOL); }}>
                <i className={`ti ti-${showAddTool ? 'x' : 'plus'}`}></i> {showAddTool ? 'Đóng' : 'Thêm Dụng Cụ'}
              </button>
            </div>

            {showAddTool && (
              <div className="admin-add-card">
                <h3 className="admin-section-title">Thêm Dụng Cụ Mới</h3>
                <form className="admin-form" onSubmit={saveTool}>
                  <div className="admin-form-grid">
                    <div className="af-group">
                      <label>STT</label>
                      <input type="number" min={0} value={toolForm.stt} onChange={e => setToolForm(f => ({ ...f, stt: +e.target.value }))} />
                    </div>
                    <div className="af-group af-full">
                      <label>Tên sản phẩm *</label>
                      <input type="text" placeholder="Ca đánh sữa inox 350ml" value={toolForm.name} onChange={e => setToolForm(f => ({ ...f, name: e.target.value }))} required />
                    </div>
                    <div className="af-group">
                      <label>Quy cách</label>
                      <input type="text" placeholder="cái / bộ / cây..." value={toolForm.unit} onChange={e => setToolForm(f => ({ ...f, unit: e.target.value }))} />
                    </div>
                    <div className="af-group">
                      <label>Giá bán (VNĐ)</label>
                      <input type="number" min={0} step={1000} placeholder="70000" value={toolForm.price || ''} onChange={e => setToolForm(f => ({ ...f, price: +e.target.value }))} />
                    </div>
                    <div className="af-group">
                      <label>Danh mục</label>
                      <select value={toolForm.category} onChange={e => setToolForm(f => ({ ...f, category: e.target.value }))}>
                        <option>Dụng cụ pha chế</option>
                        <option>Dụng cụ phục vụ</option>
                        <option>Linh phụ kiện máy cà phê - sinh tố</option>
                        <option>Máy móc pha chế</option>
                        <option>Thiết bị thu ngân</option>
                      </select>
                    </div>
                    <div className="af-group af-full">
                      <label>Hình ảnh</label>
                      <div className="prod-img-row">
                        {toolForm.image_url && (
                          <img src={toolForm.image_url} alt="preview" className="prod-img-preview" />
                        )}
                        <div style={{ flex: 1 }}>
                          <input
                            type="text"
                            placeholder="URL ảnh hoặc /images/dung-cu/..."
                            value={toolForm.image_url}
                            onChange={e => setToolForm(f => ({ ...f, image_url: e.target.value }))}
                            style={{ marginBottom: '8px' }}
                          />
                          <input ref={toolFileRef} type="file" accept="image/*" style={{ display: 'none' }}
                            onChange={e => { const f = e.target.files?.[0]; if (f) handleToolImageUpload(f); }} />
                          <button type="button" className="btn btn-outline" style={{ fontSize: '0.8rem', padding: '6px 14px' }}
                            onClick={() => toolFileRef.current?.click()} disabled={uploadingToolImg}>
                            {uploadingToolImg ? <><i className="ti ti-loader-2 spin"></i> Đang upload...</> : <><i className="ti ti-upload"></i> Chọn ảnh từ máy</>}
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="af-group">
                      <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                        <input type="checkbox" checked={toolForm.active} onChange={e => setToolForm(f => ({ ...f, active: e.target.checked }))} />
                        Hiển thị bảng giá
                      </label>
                    </div>
                  </div>
                  {toolFormError && <div className="lf-error" style={{ marginBottom: '12px' }}><i className="ti ti-alert-circle"></i> {toolFormError}</div>}
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button type="submit" className="btn btn-primary" disabled={savingTool || uploadingToolImg}>
                      {savingTool ? <><i className="ti ti-loader-2 spin"></i> Đang lưu...</> : <><i className="ti ti-check"></i> Thêm Dụng Cụ</>}
                    </button>
                    <button type="button" className="btn btn-outline" onClick={cancelToolEdit}>Hủy</button>
                  </div>
                </form>
              </div>
            )}

            {editingTool && (
              <div className="admin-modal-backdrop" onClick={e => { if (e.target === e.currentTarget) cancelToolEdit(); }}>
                <div className="admin-modal-card">
                  <div className="admin-modal-head">
                    <h3>Sửa: {editingTool.name}</h3>
                    <button type="button" className="admin-modal-close" onClick={cancelToolEdit}><i className="ti ti-x"></i></button>
                  </div>
                  <form className="admin-form" onSubmit={saveTool}>
                    <div className="admin-form-grid">
                      <div className="af-group">
                        <label>STT</label>
                        <input type="number" min={0} value={toolForm.stt} onChange={e => setToolForm(f => ({ ...f, stt: +e.target.value }))} />
                      </div>
                      <div className="af-group af-full">
                        <label>Tên sản phẩm *</label>
                        <input type="text" placeholder="Ca đánh sữa inox 350ml" value={toolForm.name} onChange={e => setToolForm(f => ({ ...f, name: e.target.value }))} required />
                      </div>
                      <div className="af-group">
                        <label>Quy cách</label>
                        <input type="text" placeholder="cái / bộ / cây..." value={toolForm.unit} onChange={e => setToolForm(f => ({ ...f, unit: e.target.value }))} />
                      </div>
                      <div className="af-group">
                        <label>Giá bán (VNĐ)</label>
                        <input type="number" min={0} step={1000} placeholder="70000" value={toolForm.price || ''} onChange={e => setToolForm(f => ({ ...f, price: +e.target.value }))} />
                      </div>
                      <div className="af-group">
                        <label>Danh mục</label>
                        <select value={toolForm.category} onChange={e => setToolForm(f => ({ ...f, category: e.target.value }))}>
                          <option>Dụng cụ pha chế</option>
                          <option>Dụng cụ phục vụ</option>
                          <option>Linh phụ kiện máy cà phê - sinh tố</option>
                          <option>Máy móc pha chế</option>
                          <option>Thiết bị thu ngân</option>
                        </select>
                      </div>
                      <div className="af-group af-full">
                        <label>Hình ảnh</label>
                        <div className="prod-img-row">
                          {toolForm.image_url && (
                            <img src={toolForm.image_url} alt="preview" className="prod-img-preview" />
                          )}
                          <div style={{ flex: 1 }}>
                            <input
                              type="text"
                              placeholder="URL ảnh hoặc /images/dung-cu/..."
                              value={toolForm.image_url}
                              onChange={e => setToolForm(f => ({ ...f, image_url: e.target.value }))}
                              style={{ marginBottom: '8px' }}
                            />
                            <input ref={toolFileRef} type="file" accept="image/*" style={{ display: 'none' }}
                              onChange={e => { const f = e.target.files?.[0]; if (f) handleToolImageUpload(f); }} />
                            <button type="button" className="btn btn-outline" style={{ fontSize: '0.8rem', padding: '6px 14px' }}
                              onClick={() => toolFileRef.current?.click()} disabled={uploadingToolImg}>
                              {uploadingToolImg ? <><i className="ti ti-loader-2 spin"></i> Đang upload...</> : <><i className="ti ti-upload"></i> Chọn ảnh từ máy</>}
                            </button>
                          </div>
                        </div>
                      </div>
                      <div className="af-group">
                        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                          <input type="checkbox" checked={toolForm.active} onChange={e => setToolForm(f => ({ ...f, active: e.target.checked }))} />
                          Hiển thị bảng giá
                        </label>
                      </div>
                    </div>
                    {toolFormError && <div className="lf-error" style={{ marginBottom: '12px' }}><i className="ti ti-alert-circle"></i> {toolFormError}</div>}
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <button type="submit" className="btn btn-primary" disabled={savingTool || uploadingToolImg}>
                        {savingTool ? <><i className="ti ti-loader-2 spin"></i> Đang lưu...</> : <><i className="ti ti-check"></i> Cập Nhật</>}
                      </button>
                      <button type="button" className="btn btn-outline" onClick={cancelToolEdit}>Hủy</button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr><th>STT</th><th>Ảnh</th><th>Tên Sản Phẩm</th><th>Quy Cách</th><th>Giá Bán</th><th>Danh Mục</th><th>Hiện</th><th></th></tr>
                </thead>
                <tbody>
                  {tools.length === 0 ? (
                    <tr><td colSpan={8} className="admin-empty">Chưa có dụng cụ nào — nhấn "Thêm Dụng Cụ" để bắt đầu</td></tr>
                  ) : tools.map(t => (
                    <tr key={t.id} style={{ opacity: t.active ? 1 : 0.45 }}>
                      <td className="admin-num">{t.stt || '—'}</td>
                      <td>
                        {t.image_url
                          ? <img src={t.image_url} alt={t.name} style={{ width: '48px', height: '48px', objectFit: 'cover', borderRadius: '6px' }} />
                          : <div style={{ width: '48px', height: '48px', background: 'var(--border)', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><i className="ti ti-tool" style={{ color: 'var(--muted)' }}></i></div>
                        }
                      </td>
                      <td className="admin-name">{t.name}</td>
                      <td className="admin-date">{t.unit || '—'}</td>
                      <td style={{ fontWeight: 700, color: 'var(--accent)', whiteSpace: 'nowrap' }}>
                        {t.price ? t.price.toLocaleString('vi-VN') + 'đ' : '—'}
                      </td>
                      <td><span className="admin-course-tag" style={{ fontSize: '0.75rem' }}>{t.category}</span></td>
                      <td>
                        <button className={`course-toggle${t.active ? ' on' : ''}`} onClick={() => toggleToolActive(t)} title={t.active ? 'Đang hiện' : 'Đang ẩn'}>
                          <i className={`ti ti-${t.active ? 'eye' : 'eye-off'}`}></i>
                        </button>
                      </td>
                      <td style={{ display: 'flex', gap: '4px' }}>
                        <button className="admin-edit-btn" onClick={() => startEditTool(t)} title="Sửa"><i className="ti ti-pencil"></i></button>
                        <button className="admin-del-btn" onClick={() => deleteTool(t.id)} disabled={deletingTool === t.id} title="Xóa">
                          {deletingTool === t.id ? <i className="ti ti-loader-2 spin"></i> : <i className="ti ti-trash"></i>}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* ======= PRODUCTS TAB ======= */}
        {activeTab === 'products' && (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
              <p style={{ color: 'var(--text-3)', fontSize: '0.85rem', margin: 0 }}>
                Bảng giá nguyên liệu hiển thị tại{' '}
                <Link href="/nguyen-lieu" target="_blank" style={{ color: 'var(--accent)' }}>/nguyen-lieu <i className="ti ti-external-link" style={{ fontSize: '0.75rem' }}></i></Link>
              </p>
              <button className="btn btn-primary" onClick={() => { setShowAddProduct(v => !v); setEditingProduct(null); setProductForm(BLANK_PRODUCT); }}>
                <i className={`ti ti-${showAddProduct ? 'x' : 'plus'}`}></i> {showAddProduct ? 'Đóng' : 'Thêm Sản Phẩm'}
              </button>
            </div>

            {/* PRODUCT ADD FORM — inline */}
            {showAddProduct && (
              <div className="admin-add-card">
                <h3 className="admin-section-title">Thêm Sản Phẩm Mới</h3>
                <form className="admin-form" onSubmit={saveProduct}>
                  <div className="admin-form-grid">
                    <div className="af-group">
                      <label>STT</label>
                      <input type="number" min={0} value={productForm.stt} onChange={e => setProductForm(f => ({ ...f, stt: +e.target.value }))} />
                    </div>
                    <div className="af-group af-full">
                      <label>Tên sản phẩm *</label>
                      <input type="text" placeholder="Bột cacao nguyên chất Bạch Dương 500g" value={productForm.name} onChange={e => setProductForm(f => ({ ...f, name: e.target.value }))} required />
                    </div>
                    <div className="af-group">
                      <label>Quy cách</label>
                      <input type="text" placeholder="Túi 500g" value={productForm.unit} onChange={e => setProductForm(f => ({ ...f, unit: e.target.value }))} />
                    </div>
                    <div className="af-group">
                      <label>Giá bán (VNĐ)</label>
                      <input type="number" min={0} step={1000} placeholder="165000" value={productForm.price || ''} onChange={e => setProductForm(f => ({ ...f, price: +e.target.value }))} />
                    </div>
                    <div className="af-group">
                      <label>Danh mục</label>
                      <input type="text" placeholder="Nguyên liệu, Bột, Siro..." value={productForm.category} onChange={e => setProductForm(f => ({ ...f, category: e.target.value }))} />
                    </div>
                    <div className="af-group">
                      <label>Phân loại</label>
                      <select value={productForm.phan_loai} onChange={e => setProductForm(f => ({ ...f, phan_loai: e.target.value as Product['phan_loai'] }))}>
                        <option value="thuong-mai">Thương Mại — bán thoải mái</option>
                        <option value="thuong-hieu">Thương Hiệu — chỉ học viên</option>
                      </select>
                    </div>
                    <div className="af-group af-full">
                      <label>Hình ảnh</label>
                      <div className="prod-img-row">
                        {productForm.image_url && (
                          <img src={productForm.image_url} alt="preview" className="prod-img-preview" />
                        )}
                        <div style={{ flex: 1 }}>
                          <input
                            type="text"
                            placeholder="URL ảnh (tự điền sau khi upload)"
                            value={productForm.image_url}
                            onChange={e => setProductForm(f => ({ ...f, image_url: e.target.value }))}
                            style={{ marginBottom: '8px' }}
                          />
                          <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }}
                            onChange={e => { const f = e.target.files?.[0]; if (f) handleProductImageUpload(f); }} />
                          <button type="button" className="btn btn-outline" style={{ fontSize: '0.8rem', padding: '6px 14px' }}
                            onClick={() => fileRef.current?.click()} disabled={uploadingImg}>
                            {uploadingImg ? <><i className="ti ti-loader-2 spin"></i> Đang upload...</> : <><i className="ti ti-upload"></i> Chọn ảnh từ máy</>}
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="af-group">
                      <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                        <input type="checkbox" checked={productForm.active} onChange={e => setProductForm(f => ({ ...f, active: e.target.checked }))} />
                        Hiển thị bảng giá
                      </label>
                    </div>
                  </div>
                  {productFormError && <div className="lf-error" style={{ marginBottom: '12px' }}><i className="ti ti-alert-circle"></i> {productFormError}</div>}
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button type="submit" className="btn btn-primary" disabled={savingProduct || uploadingImg}>
                      {savingProduct ? <><i className="ti ti-loader-2 spin"></i> Đang lưu...</> : <><i className="ti ti-check"></i> Thêm Sản Phẩm</>}
                    </button>
                    <button type="button" className="btn btn-outline" onClick={cancelProductEdit}>Hủy</button>
                  </div>
                </form>
              </div>
            )}

            {/* PRODUCT EDIT MODAL */}
            {editingProduct && (
              <div className="admin-modal-backdrop" onClick={e => { if (e.target === e.currentTarget) cancelProductEdit(); }}>
                <div className="admin-modal-card">
                  <div className="admin-modal-head">
                    <h3>Sửa: {editingProduct.name}</h3>
                    <button type="button" className="admin-modal-close" onClick={cancelProductEdit}><i className="ti ti-x"></i></button>
                  </div>
                  <form className="admin-form" onSubmit={saveProduct}>
                    <div className="admin-form-grid">
                      <div className="af-group">
                        <label>STT</label>
                        <input type="number" min={0} value={productForm.stt} onChange={e => setProductForm(f => ({ ...f, stt: +e.target.value }))} />
                      </div>
                      <div className="af-group af-full">
                        <label>Tên sản phẩm *</label>
                        <input type="text" placeholder="Bột cacao nguyên chất Bạch Dương 500g" value={productForm.name} onChange={e => setProductForm(f => ({ ...f, name: e.target.value }))} required />
                      </div>
                      <div className="af-group">
                        <label>Quy cách</label>
                        <input type="text" placeholder="Túi 500g" value={productForm.unit} onChange={e => setProductForm(f => ({ ...f, unit: e.target.value }))} />
                      </div>
                      <div className="af-group">
                        <label>Giá bán (VNĐ)</label>
                        <input type="number" min={0} step={1000} placeholder="165000" value={productForm.price || ''} onChange={e => setProductForm(f => ({ ...f, price: +e.target.value }))} />
                      </div>
                      <div className="af-group">
                        <label>Danh mục</label>
                        <input type="text" placeholder="Nguyên liệu, Bột, Siro..." value={productForm.category} onChange={e => setProductForm(f => ({ ...f, category: e.target.value }))} />
                      </div>
                      <div className="af-group">
                        <label>Phân loại</label>
                        <select value={productForm.phan_loai} onChange={e => setProductForm(f => ({ ...f, phan_loai: e.target.value as Product['phan_loai'] }))}>
                          <option value="thuong-mai">Thương Mại — bán thoải mái</option>
                          <option value="thuong-hieu">Thương Hiệu — chỉ học viên</option>
                        </select>
                      </div>
                      <div className="af-group af-full">
                        <label>Hình ảnh</label>
                        <div className="prod-img-row">
                          {productForm.image_url && (
                            <img src={productForm.image_url} alt="preview" className="prod-img-preview" />
                          )}
                          <div style={{ flex: 1 }}>
                            <input
                              type="text"
                              placeholder="URL ảnh (tự điền sau khi upload)"
                              value={productForm.image_url}
                              onChange={e => setProductForm(f => ({ ...f, image_url: e.target.value }))}
                              style={{ marginBottom: '8px' }}
                            />
                            <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }}
                              onChange={e => { const f = e.target.files?.[0]; if (f) handleProductImageUpload(f); }} />
                            <button type="button" className="btn btn-outline" style={{ fontSize: '0.8rem', padding: '6px 14px' }}
                              onClick={() => fileRef.current?.click()} disabled={uploadingImg}>
                              {uploadingImg ? <><i className="ti ti-loader-2 spin"></i> Đang upload...</> : <><i className="ti ti-upload"></i> Chọn ảnh từ máy</>}
                            </button>
                          </div>
                        </div>
                      </div>
                      <div className="af-group">
                        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                          <input type="checkbox" checked={productForm.active} onChange={e => setProductForm(f => ({ ...f, active: e.target.checked }))} />
                          Hiển thị bảng giá
                        </label>
                      </div>
                    </div>
                    {productFormError && <div className="lf-error" style={{ marginBottom: '12px' }}><i className="ti ti-alert-circle"></i> {productFormError}</div>}
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <button type="submit" className="btn btn-primary" disabled={savingProduct || uploadingImg}>
                        {savingProduct ? <><i className="ti ti-loader-2 spin"></i> Đang lưu...</> : <><i className="ti ti-check"></i> Cập Nhật</>}
                      </button>
                      <button type="button" className="btn btn-outline" onClick={cancelProductEdit}>Hủy</button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* PRODUCTS TABLE */}
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr><th>STT</th><th>Ảnh</th><th>Tên Sản Phẩm</th><th>Quy Cách</th><th>Giá Bán</th><th>Danh Mục</th><th>Phân Loại</th><th>Hiện</th><th></th></tr>
                </thead>
                <tbody>
                  {products.length === 0 ? (
                    <tr><td colSpan={9} className="admin-empty">Chưa có sản phẩm nào — nhấn "Thêm Sản Phẩm" để bắt đầu</td></tr>
                  ) : products.map(p => (
                    <tr key={p.id} style={{ opacity: p.active ? 1 : 0.45 }}>
                      <td className="admin-num">{p.stt || '—'}</td>
                      <td>
                        {p.image_url
                          ? <img src={p.image_url} alt={p.name} style={{ width: '48px', height: '48px', objectFit: 'cover', borderRadius: '6px' }} />
                          : <div style={{ width: '48px', height: '48px', background: 'var(--border)', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><i className="ti ti-photo" style={{ color: 'var(--muted)' }}></i></div>
                        }
                      </td>
                      <td className="admin-name">{p.name}</td>
                      <td className="admin-date">{p.unit || '—'}</td>
                      <td style={{ fontWeight: 700, color: 'var(--accent)', whiteSpace: 'nowrap' }}>
                        {p.price ? p.price.toLocaleString('vi-VN') + 'đ' : '—'}
                      </td>
                      <td><span className="admin-course-tag" style={{ fontSize: '0.75rem' }}>{p.category}</span></td>
                      <td>
                        <span className={`pl-badge pl-badge--${p.phan_loai ?? 'thuong-mai'}`}>
                          {p.phan_loai === 'thuong-hieu' ? <><i className="ti ti-shield-star"></i> Thương Hiệu</> : <><i className="ti ti-shopping-bag"></i> Thương Mại</>}
                        </span>
                      </td>
                      <td>
                        <button className={`course-toggle${p.active ? ' on' : ''}`} onClick={() => toggleProductActive(p)} title={p.active ? 'Đang hiện' : 'Đang ẩn'}>
                          <i className={`ti ti-${p.active ? 'eye' : 'eye-off'}`}></i>
                        </button>
                      </td>
                      <td style={{ display: 'flex', gap: '4px' }}>
                        <button className="admin-edit-btn" onClick={() => startEditProduct(p)} title="Sửa"><i className="ti ti-pencil"></i></button>
                        <button className="admin-del-btn" onClick={() => deleteProduct(p.id)} disabled={deletingProduct === p.id} title="Xóa">
                          {deletingProduct === p.id ? <i className="ti ti-loader-2 spin"></i> : <i className="ti ti-trash"></i>}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
