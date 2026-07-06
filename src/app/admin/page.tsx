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
  slug: string | null; detail: string | null;
};
type Product = {
  id: string; stt: number; name: string; unit: string;
  price: number; image_url: string; category: string; active: boolean;
  phan_loai: 'thuong-mai' | 'thuong-hieu'; description: string | null;
};
type Tool = {
  id: string; stt: number; name: string; unit: string;
  price: number; image_url: string; category: string; active: boolean;
};
type OrderItem = { id: string; name: string; price: number; unit: string; quantity: number; image_url: string; };
type Order = {
  id: string; customer_name: string; phone: string; address: string | null;
  notes: string | null; items: OrderItem[]; total: number;
  status: 'pending' | 'confirmed' | 'shipping' | 'done' | 'cancelled';
  created_at: string; user_id: string | null;
};

type CongThuc = {
  id: string; name: string; category: string; photo_url: string;
  instructions: string; total_cost: number | null; recipe_text: string;
  linked_product_ids: string[]; courses: string[]; sort_order: number;
};

const VIDEO_CATEGORIES = [
  { slug: 'series-100-ngay', label: 'Series 100 Ngày Pha Chế' },
  { slug: 'giang-vien', label: 'Giảng Viên Làm Món' },
  { slug: 'hoc-vien-workshop', label: 'Học Viên & Workshop' },
  { slug: 'phong-van', label: 'Phỏng Vấn Khách Hàng' },
] as const;

type VideoRow = {
  id: string; title: string; video_url: string;
  thumbnail_url: string | null; sort_order: number; active: boolean; created_at: string;
  service_slug: string | null; category: string;
};
type ServiceVideoRow = {
  id: string; title: string | null; video_url: string;
  thumbnail_url: string | null; service_slug: string;
  sort_order: number; active: boolean; created_at: string;
};
type ChiaSeIngredient = { name: string; shopLink: string; };
type ChiaSeRecipe = {
  id: string; name: string; short_name: string; category: string;
  source: string; image_url: string; steps: string;
  ingredients: ChiaSeIngredient[]; sort_order: number; active: boolean; locked: boolean;
};
const RECIPE_COURSES = ['Khóa hiện đại', 'Khóa truyền thống', 'Trà sữa hiện đại', 'Trà sữa truyền thống', 'Trà trái cây & Matcha', 'Đá xay & Sinh tố', 'Cà phê phin - Đá xay & Sữa chua', 'Cà phê máy cơ bản'];
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
  name: '', category: 'tong-hop', price: '', duration: '', description: '', image: '', active: true, slug: '', detail: '',
};
const BLANK_PRODUCT: Omit<Product, 'id'> = {
  stt: 0, name: '', unit: '', price: 0, image_url: '', category: 'Nguyên liệu', active: true, phan_loai: 'thuong-mai', description: '',
};
const BLANK_TOOL: Omit<Tool, 'id'> = {
  stt: 0, name: '', unit: '', price: 0, image_url: '', category: 'Dụng cụ pha chế', active: true,
};
const BLANK_RECIPE: Omit<CongThuc, 'id'> = {
  name: '', category: '', photo_url: '', instructions: '',
  total_cost: null, recipe_text: '', linked_product_ids: [], courses: [], sort_order: 0,
};
const BLANK_CHIA_SE: Omit<ChiaSeRecipe, 'id'> = {
  name: '', short_name: '', category: '', source: '', image_url: '',
  steps: '', ingredients: [], sort_order: 0, active: true, locked: false,
};
type CongThucHVCP = {
  id: string; name: string; category: string; photo_url: string;
  instructions: string; recipe_text: string;
  linked_product_ids: string[]; sort_order: number; active: boolean; locked: boolean;
};
const BLANK_HVCP: Omit<CongThucHVCP, 'id'> = {
  name: '', category: '', photo_url: '', instructions: '',
  recipe_text: '', linked_product_ids: [], sort_order: 0, active: true, locked: false,
};
const CT_COURSES = ['Khóa hiện đại', 'Khóa truyền thống', 'Trà sữa hiện đại', 'Trà sữa truyền thống', 'Trà trái cây & Matcha', 'Đá xay & Sinh tố', 'Cà phê phin - Đá xay & Sữa chua', 'Cà phê máy cơ bản'];

export default function AdminPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'traffic' | 'leads' | 'students' | 'content' | 'products' | 'tools' | 'recipes' | 'ct-hvcp' | 'kho-cong-thuc' | 'hinh-anh' | 'videos' | 'service-videos' | 'orders'>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

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

  // Traffic (page views dashboard)
  const [trafficLoading, setTrafficLoading] = useState(true);
  const [trafficRows, setTrafficRows] = useState<{ path: string; source: string; created_at: string }[]>([]);
  const [trafficTotals, setTrafficTotals] = useState({ today: 0, week: 0, month: 0, allTime: 0 });
  const [trafficRangeDays, setTrafficRangeDays] = useState<7 | 14 | 30>(14);

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
  const courseImgRef = useRef<HTMLInputElement>(null);
  const [uploadingCourseImg, setUploadingCourseImg] = useState(false);
  const [productSearch, setProductSearch] = useState('');
  const [productCatFilter, setProductCatFilter] = useState('');
  const [productPhanLoaiFilter, setProductPhanLoaiFilter] = useState('');

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
  const [toolSearch, setToolSearch] = useState('');
  const [toolCatFilter, setToolCatFilter] = useState('');

  // Recipes (Công Thức 2)
  const [recipes, setRecipes] = useState<CongThuc[]>([]);
  const [recipeForm, setRecipeForm] = useState<Omit<CongThuc, 'id'>>(BLANK_RECIPE);
  const [recipeFormError, setRecipeFormError] = useState('');
  const [savingRecipe, setSavingRecipe] = useState(false);
  const [deletingRecipe, setDeletingRecipe] = useState<string | null>(null);
  const [editingRecipe, setEditingRecipe] = useState<CongThuc | null>(null);
  const [showAddRecipe, setShowAddRecipe] = useState(false);
  const [recipeSearch, setRecipeSearch] = useState('');
  const [recipeKhoaFilter, setRecipeKhoaFilter] = useState('');
  const [prodFilterQ, setProdFilterQ] = useState('');
  const [uploadingRecipeImg, setUploadingRecipeImg] = useState(false);
  const recipeImgRef = useRef<HTMLInputElement>(null);

  // Kho CT Chia Sẻ
  const [chiaSeList, setChiaSeList] = useState<ChiaSeRecipe[]>([]);
  const [chiaSeForm, setChiaSeForm] = useState<Omit<ChiaSeRecipe, 'id'>>(BLANK_CHIA_SE);
  const [chiaSeFormError, setChiaSeFormError] = useState('');
  const [savingChiaSe, setSavingChiaSe] = useState(false);
  const [deletingChiaSe, setDeletingChiaSe] = useState<string | null>(null);
  const [editingChiaSe, setEditingChiaSe] = useState<ChiaSeRecipe | null>(null);
  const [showAddChiaSe, setShowAddChiaSe] = useState(false);
  const [chiaSeSearch, setChiaSeSearch] = useState('');
  const [uploadingChiaSeImg, setUploadingChiaSeImg] = useState(false);
  const chiaSeImgRef = useRef<HTMLInputElement>(null);

  // CT HVCP
  const [hvcp, setHvcp] = useState<CongThucHVCP[]>([]);
  const [hvcpForm, setHvcpForm] = useState<Omit<CongThucHVCP, 'id'>>(BLANK_HVCP);
  const [hvcpFormError, setHvcpFormError] = useState('');
  const [savingHvcp, setSavingHvcp] = useState(false);
  const [deletingHvcp, setDeletingHvcp] = useState<string | null>(null);
  const [editingHvcp, setEditingHvcp] = useState<CongThucHVCP | null>(null);
  const [showAddHvcp, setShowAddHvcp] = useState(false);
  const [hvcpSearch, setHvcpSearch] = useState('');
  const [hvcpProdQ, setHvcpProdQ] = useState('');
  const [uploadingHvcpImg, setUploadingHvcpImg] = useState(false);
  const hvcpImgRef = useRef<HTMLInputElement>(null);

  // Orders
  const [orders, setOrders] = useState<Order[]>([]);
  const [orderSearch, setOrderSearch] = useState('');
  const [updatingOrder, setUpdatingOrder] = useState<string | null>(null);
  const [deletingOrder, setDeletingOrder] = useState<string | null>(null);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  // Hình ảnh sync
  const [syncingTraoBang, setSyncingTraoBang] = useState(false);
  const [syncingLopHoc, setSyncingLopHoc] = useState(false);
  const [syncMsg, setSyncMsg] = useState('');

  // Videos (Tư Liệu Truyền Thông)
  const [videos, setVideos] = useState<VideoRow[]>([]);
  const [videoForm, setVideoForm] = useState({ title: '', youtubeUrl: '', category: 'series-100-ngay' });
  const [videoError, setVideoError] = useState('');
  const [addingVideo, setAddingVideo] = useState(false);
  const [deletingVideo, setDeletingVideo] = useState<string | null>(null);
  const [editingVideoId, setEditingVideoId] = useState<string | null>(null);
  const [editVideoForm, setEditVideoForm] = useState({ title: '', youtubeUrl: '', category: 'series-100-ngay' });
  const [savingVideo, setSavingVideo] = useState(false);
  // Service Videos (Video Dịch Vụ)
  const [dichVuServices, setDichVuServices] = useState<{ slug: string; name: string }[]>([]);
  const [serviceVideos, setServiceVideos] = useState<ServiceVideoRow[]>([]);
  const [svForm, setSvForm] = useState({ title: '', youtubeUrl: '', serviceSlug: '' });
  const [svError, setSvError] = useState('');
  const [addingSv, setAddingSv] = useState(false);
  const [deletingSv, setDeletingSv] = useState<string | null>(null);
  const [editingSvId, setEditingSvId] = useState<string | null>(null);
  const [editSvForm, setEditSvForm] = useState({ title: '', youtubeUrl: '', serviceSlug: '' });
  const [savingSv, setSavingSv] = useState(false);

  useEffect(() => {
    let mounted = true;
    const supabase = createClient();

    void (async () => {
      try {
        const { data: { session } } = await Promise.race([
          supabase.auth.getSession(),
          new Promise<never>((_, reject) => setTimeout(() => reject(new Error('auth-timeout')), 5000)),
        ]);
        if (!mounted) return;
        if (!session) { router.replace('/login?redirect=/admin'); return; }
        const admin = session.user.app_metadata?.role === 'admin';
        setIsAdmin(admin);
        setLoading(false);
        if (!admin) return;
        void loadStudents();
        void loadLeads();
        void loadTraffic();
        void loadCourses();
        void loadProducts();
        void loadTools();
        void loadRecipes();
        void loadChiaSeRecipes();
        void loadHVCPRecipes();
        void loadOrders();
        void loadVideos();
        void loadDichVuServices();
        void loadServiceVideos();
      } catch {
        if (!mounted) return;
        router.replace('/login?redirect=/admin');
      }
    })();

    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') { cancelProductEdit(); cancelToolEdit(); cancelCourseEdit(); cancelRecipeEdit(); cancelChiaSeEdit(); cancelHvcpEdit(); }
    }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  async function loadStudents() {
    const { data, error } = await createClient().from('students').select('*').order('enrolled_at', { ascending: false });
    if (error) throw error;
    setStudents(data ?? []);
  }
  async function loadLeads() {
    const { data, error } = await createClient().from('leads').select('*').order('created_at', { ascending: false });
    if (error) throw error;
    setLeads(data ?? []);
  }
  async function loadTraffic() {
    setTrafficLoading(true);
    const supabase = createClient();
    const now = new Date();
    const startToday = new Date(now); startToday.setHours(0, 0, 0, 0);
    const start7 = new Date(now.getTime() - 7 * 86400000);
    const start30 = new Date(now.getTime() - 30 * 86400000);

    const [{ data: rows }, today, week, month, allTime] = await Promise.all([
      supabase.from('page_views').select('path, source, created_at').gte('created_at', start30.toISOString()).order('created_at', { ascending: false }).limit(5000),
      supabase.from('page_views').select('*', { count: 'exact', head: true }).gte('created_at', startToday.toISOString()),
      supabase.from('page_views').select('*', { count: 'exact', head: true }).gte('created_at', start7.toISOString()),
      supabase.from('page_views').select('*', { count: 'exact', head: true }).gte('created_at', start30.toISOString()),
      supabase.from('page_views').select('*', { count: 'exact', head: true }),
    ]);

    setTrafficRows(rows ?? []);
    setTrafficTotals({ today: today.count ?? 0, week: week.count ?? 0, month: month.count ?? 0, allTime: allTime.count ?? 0 });
    setTrafficLoading(false);
  }
  async function loadCourses() {
    const { data, error } = await createClient().from('courses').select('*').order('sort_order');
    if (error) throw error;
    setCourses(data ?? []);
  }
  async function loadProducts() {
    const { data, error } = await createClient().from('products').select('*').order('stt');
    if (error) throw error;
    setProducts(data ?? []);
  }
  async function loadTools() {
    const { data, error } = await createClient().from('dung_cu').select('*').order('stt');
    if (error) throw error;
    setTools(data ?? []);
  }
  async function loadRecipes() {
    const { data, error } = await createClient().from('cong_thuc').select('*').order('sort_order').order('created_at');
    if (error) throw error;
    setRecipes(data ?? []);
  }
  async function loadChiaSeRecipes() {
    const { data, error } = await createClient().from('cong_thuc_chia_se').select('*').order('sort_order').order('created_at');
    if (error) throw error;
    setChiaSeList(data ?? []);
  }
  async function loadHVCPRecipes() {
    const { data, error } = await createClient().from('cong_thuc_hvcp').select('*').order('sort_order').order('created_at');
    if (error) throw error;
    setHvcp(data ?? []);
  }
  async function loadOrders() {
    const { data, error } = await createClient().from('orders').select('*').order('created_at', { ascending: false });
    if (error) throw error;
    setOrders(data ?? []);
  }
  async function loadVideos() {
    const { data, error } = await createClient().from('videos').select('*').order('sort_order').order('created_at', { ascending: false });
    if (error) throw error;
    setVideos(data ?? []);
  }
  function extractYouTubeId(url: string): string | null {
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/shorts\/)([A-Za-z0-9_-]{11})/,
    ];
    for (const p of patterns) {
      const m = url.match(p);
      if (m) return m[1];
    }
    return null;
  }

  async function addVideo(e: FormEvent) {
    e.preventDefault();
    setVideoError('');
    const ytId = extractYouTubeId(videoForm.youtubeUrl.trim());
    if (!ytId) { setVideoError('URL YouTube không hợp lệ. VD: https://youtu.be/ABC123 hoặc https://www.youtube.com/watch?v=ABC123'); return; }
    setAddingVideo(true);
    const supabase = createClient();
    const embedUrl = `https://www.youtube.com/embed/${ytId}`;
    const thumbnailUrl = `https://img.youtube.com/vi/${ytId}/maxresdefault.jpg`;
    const { error: dbErr } = await supabase.from('videos').insert({
      title: videoForm.title.trim() || null,
      video_url: embedUrl,
      thumbnail_url: thumbnailUrl,
      sort_order: videos.length,
      active: true,
      category: videoForm.category,
    });
    setAddingVideo(false);
    if (dbErr) { setVideoError('Lỗi lưu DB: ' + dbErr.message); return; }
    setVideoForm({ title: '', youtubeUrl: '', category: 'series-100-ngay' });
    void loadVideos();
  }
  async function deleteVideo(v: VideoRow) {
    if (!confirm('Xóa video "' + (v.title || 'này') + '"?')) return;
    setDeletingVideo(v.id);
    const supabase = createClient();
    // Chỉ xóa file storage nếu là URL Supabase cũ (không phải YouTube embed)
    if (!v.video_url.includes('youtube.com/embed/')) {
      const videoPath = v.video_url.split('/videos/')[1];
      if (videoPath) await supabase.storage.from('videos').remove([videoPath]);
      if (v.thumbnail_url && !v.thumbnail_url.includes('img.youtube.com')) {
        const thumbPath = v.thumbnail_url.split('/videos/')[1];
        if (thumbPath) await supabase.storage.from('videos').remove([thumbPath]);
      }
    }
    await supabase.from('videos').delete().eq('id', v.id);
    setVideos(prev => prev.filter(x => x.id !== v.id));
    setDeletingVideo(null);
  }
  async function toggleVideoActive(v: VideoRow) {
    await createClient().from('videos').update({ active: !v.active }).eq('id', v.id);
    setVideos(prev => prev.map(x => x.id === v.id ? { ...x, active: !x.active } : x));
  }

  // --- SERVICE VIDEOS ---
  async function loadDichVuServices() {
    const { data } = await createClient().from('courses').select('slug,name').eq('category', 'kinh-doanh').not('slug', 'is', null).order('sort_order');
    setDichVuServices((data ?? []).filter((d: { slug: string | null; name: string }) => d.slug) as { slug: string; name: string }[]);
  }
  async function loadServiceVideos() {
    const { data } = await createClient().from('service_videos').select('*').order('service_slug').order('sort_order').order('created_at', { ascending: false });
    setServiceVideos(data ?? []);
  }
  async function addServiceVideo(e: FormEvent) {
    e.preventDefault();
    setSvError('');
    if (!svForm.serviceSlug) { setSvError('Vui lòng chọn dịch vụ.'); return; }
    const ytId = extractYouTubeId(svForm.youtubeUrl.trim());
    if (!ytId) { setSvError('URL YouTube không hợp lệ.'); return; }
    setAddingSv(true);
    const embedUrl = `https://www.youtube.com/embed/${ytId}`;
    const thumbnailUrl = `https://img.youtube.com/vi/${ytId}/maxresdefault.jpg`;
    const { error } = await createClient().from('service_videos').insert({
      title: svForm.title.trim() || null,
      video_url: embedUrl,
      thumbnail_url: thumbnailUrl,
      service_slug: svForm.serviceSlug,
      sort_order: serviceVideos.filter(v => v.service_slug === svForm.serviceSlug).length,
      active: true,
    });
    setAddingSv(false);
    if (error) { setSvError('Lỗi lưu DB: ' + error.message); return; }
    setSvForm({ title: '', youtubeUrl: '', serviceSlug: svForm.serviceSlug });
    void loadServiceVideos();
  }
  async function deleteServiceVideo(v: ServiceVideoRow) {
    if (!confirm('Xóa video "' + (v.title || 'này') + '"?')) return;
    setDeletingSv(v.id);
    await createClient().from('service_videos').delete().eq('id', v.id);
    setServiceVideos(prev => prev.filter(x => x.id !== v.id));
    setDeletingSv(null);
  }
  async function toggleSvActive(v: ServiceVideoRow) {
    await createClient().from('service_videos').update({ active: !v.active }).eq('id', v.id);
    setServiceVideos(prev => prev.map(x => x.id === v.id ? { ...x, active: !x.active } : x));
  }

  function startEditVideo(v: VideoRow) {
    setEditingVideoId(v.id);
    setEditVideoForm({ title: v.title ?? '', youtubeUrl: '', category: v.category ?? 'series-100-ngay' });
  }
  async function saveVideoEdit(v: VideoRow) {
    setSavingVideo(true);
    const update: Partial<VideoRow> = {
      title: editVideoForm.title.trim() || null as unknown as string,
      category: editVideoForm.category,
    };
    if (editVideoForm.youtubeUrl.trim()) {
      const ytId = extractYouTubeId(editVideoForm.youtubeUrl.trim());
      if (ytId) {
        update.video_url = `https://www.youtube.com/embed/${ytId}`;
        update.thumbnail_url = `https://img.youtube.com/vi/${ytId}/maxresdefault.jpg`;
      }
    }
    await createClient().from('videos').update(update).eq('id', v.id);
    setVideos(prev => prev.map(x => x.id === v.id ? { ...x, ...update } : x));
    setEditingVideoId(null);
    setSavingVideo(false);
  }

  function startEditSv(v: ServiceVideoRow) {
    setEditingSvId(v.id);
    setEditSvForm({ title: v.title ?? '', youtubeUrl: '', serviceSlug: v.service_slug });
  }
  async function saveSvEdit(v: ServiceVideoRow) {
    setSavingSv(true);
    const update: Partial<ServiceVideoRow> = {
      title: editSvForm.title.trim() || null as unknown as string,
      service_slug: editSvForm.serviceSlug || v.service_slug,
    };
    if (editSvForm.youtubeUrl.trim()) {
      const ytId = extractYouTubeId(editSvForm.youtubeUrl.trim());
      if (ytId) {
        update.video_url = `https://www.youtube.com/embed/${ytId}`;
        update.thumbnail_url = `https://img.youtube.com/vi/${ytId}/maxresdefault.jpg`;
      }
    }
    await createClient().from('service_videos').update(update).eq('id', v.id);
    setServiceVideos(prev => prev.map(x => x.id === v.id ? { ...x, ...update } : x));
    setEditingSvId(null);
    setSavingSv(false);
  }

  async function updateOrderStatus(id: string, status: Order['status']) {
    setUpdatingOrder(id);
    await createClient().from('orders').update({ status }).eq('id', id);
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
    setUpdatingOrder(null);

    const order = orders.find(o => o.id === id);
    if (order?.user_id) {
      const MSG: Partial<Record<Order['status'], string>> = {
        confirmed: 'Đơn hàng của bạn đã được xác nhận ✅',
        shipping:  'Đơn hàng của bạn đang được giao 🚚',
        done:      'Đơn hàng đã giao thành công! Cảm ơn bạn ☕',
        cancelled: 'Đơn hàng của bạn đã bị hủy',
      };
      const body = MSG[status];
      if (body) fetch('/api/notify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: order.user_id, title: 'Học Viện Cà Phê', body }),
      }).catch(() => {});
    }
  }
  async function deleteOrder(id: string) {
    if (!confirm('Xóa đơn hàng này?')) return;
    setDeletingOrder(id);
    await createClient().from('orders').delete().eq('id', id);
    setOrders(prev => prev.filter(o => o.id !== id));
    setDeletingOrder(null);
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
  function openGrantModal(s: Student) {
    setGrantModal(s);
    // Chỉ pre-select những giá trị nằm trong RECIPE_COURSES
    setGrantAccess((s.course_access ?? []).filter(c => RECIPE_COURSES.includes(c)));
  }
  async function saveGrant() {
    if (!grantModal) return;
    setSavingGrant(true);
    // Giữ nguyên các giá trị không thuộc RECIPE_COURSES (ví dụ: khóa cũ), ghép với lựa chọn mới
    const otherAccess = (grantModal.course_access ?? []).filter(c => !RECIPE_COURSES.includes(c));
    await createClient().from('students').update({ course_access: [...otherAccess, ...grantAccess] }).eq('id', grantModal.id);
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
    setCourseForm({ name: c.name, category: c.category, price: c.price, duration: c.duration ?? '', description: c.description ?? '', image: c.image ?? '', active: c.active, slug: c.slug ?? '', detail: c.detail ?? '' });
    setShowAddCourse(false); setCourseFormError('');
  }
  function cancelCourseEdit() { setEditingCourse(null); setShowAddCourse(false); setCourseForm(BLANK_COURSE); setCourseFormError(''); }
  async function handleCourseImageUpload(file: File) {
    setUploadingCourseImg(true);
    const supabase = createClient();
    const compressed = await compressImage(file);
    const path = `courses/${Date.now()}.webp`;
    const { data, error } = await supabase.storage.from('products').upload(path, compressed, { upsert: true, contentType: 'image/webp', cacheControl: '31536000' });
    setUploadingCourseImg(false);
    if (error) { setCourseFormError('Upload ảnh thất bại: ' + error.message); return; }
    const { data: { publicUrl } } = supabase.storage.from('products').getPublicUrl(data.path);
    setCourseForm(f => ({ ...f, image: publicUrl }));
  }
  async function saveCourse(e: FormEvent) {
    e.preventDefault();
    if (!courseForm.name.trim() || !courseForm.price.trim()) { setCourseFormError('Vui lòng điền tên và giá.'); return; }
    setSavingCourse(true); setCourseFormError('');
    const payload = { name: courseForm.name.trim(), category: courseForm.category, price: courseForm.price.trim(), duration: courseForm.duration?.trim() || null, description: courseForm.description?.trim() || null, image: courseForm.image?.trim() || null, active: courseForm.active, slug: courseForm.slug?.trim() || null, detail: courseForm.detail?.trim() || null };
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
    setProductForm({ stt: p.stt, name: p.name, unit: p.unit, price: p.price, image_url: p.image_url, category: p.category, active: p.active, phan_loai: p.phan_loai ?? 'thuong-mai', description: p.description ?? '' });
    setShowAddProduct(false); setProductFormError('');
  }
  function cancelProductEdit() { setEditingProduct(null); setShowAddProduct(false); setProductForm(BLANK_PRODUCT); setProductFormError(''); }

  async function handleProductImageUpload(file: File) {
    setUploadingImg(true);
    const supabase = createClient();
    const compressed = await compressImage(file);
    const path = editingProduct ? `product-${editingProduct.id}.webp` : `${Date.now()}.webp`;
    const { data, error } = await supabase.storage.from('products').upload(path, compressed, { upsert: true, contentType: 'image/webp', cacheControl: '31536000' });
    setUploadingImg(false);
    if (error) { setProductFormError('Upload ảnh thất bại: ' + error.message); return; }
    const { data: { publicUrl } } = supabase.storage.from('products').getPublicUrl(data.path);
    setProductForm(f => ({ ...f, image_url: publicUrl }));
  }

  async function saveProduct(e: FormEvent) {
    e.preventDefault();
    if (!productForm.name.trim()) { setProductFormError('Vui lòng điền tên sản phẩm.'); return; }
    setSavingProduct(true); setProductFormError('');
    const payload = { stt: productForm.stt, name: productForm.name.trim(), unit: productForm.unit.trim(), price: productForm.price, image_url: productForm.image_url.trim(), category: productForm.category.trim(), active: productForm.active, phan_loai: productForm.phan_loai, description: productForm.description?.trim() || null };
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
    const compressed = await compressImage(file);
    const path = editingTool ? `tool-${editingTool.id}.webp` : `${Date.now()}.webp`;
    const { data, error } = await supabase.storage.from('products').upload(path, compressed, { upsert: true, contentType: 'image/webp', cacheControl: '31536000' });
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

  // --- CÔNG THỨC 2 ---
  function startEditRecipe(r: CongThuc) {
    setEditingRecipe(r);
    setRecipeForm({ name: r.name, category: r.category, photo_url: r.photo_url, instructions: r.instructions, total_cost: r.total_cost, recipe_text: r.recipe_text, linked_product_ids: r.linked_product_ids ?? [], courses: r.courses ?? [], sort_order: r.sort_order });
    setShowAddRecipe(false); setRecipeFormError(''); setProdFilterQ('');
  }
  function cancelRecipeEdit() { setEditingRecipe(null); setShowAddRecipe(false); setRecipeForm(BLANK_RECIPE); setRecipeFormError(''); setProdFilterQ(''); }

  async function compressImage(file: File, maxPx = 900, quality = 0.82): Promise<File> {
    return new Promise(resolve => {
      const img = new Image();
      const url = URL.createObjectURL(file);
      img.onload = () => {
        URL.revokeObjectURL(url);
        const scale = Math.min(1, maxPx / Math.max(img.naturalWidth, img.naturalHeight));
        const canvas = document.createElement('canvas');
        canvas.width = Math.round(img.naturalWidth * scale);
        canvas.height = Math.round(img.naturalHeight * scale);
        canvas.getContext('2d')!.drawImage(img, 0, 0, canvas.width, canvas.height);
        canvas.toBlob(blob => {
          resolve(blob ? new File([blob], file.name.replace(/\.[^.]+$/, '.webp'), { type: 'image/webp' }) : file);
        }, 'image/webp', quality);
      };
      img.onerror = () => { URL.revokeObjectURL(url); resolve(file); };
      img.src = url;
    });
  }

  async function handleRecipeImageUpload(file: File) {
    setUploadingRecipeImg(true);
    try {
      const uploadFile = file.size > 2 * 1024 * 1024 ? await compressImage(file) : file;
      const form = new FormData();
      form.append('file', uploadFile);
      const res = await fetch('/api/admin/cong-thuc/upload', { method: 'POST', body: form });
      const text = await res.text();
      let json: any;
      try { json = JSON.parse(text); } catch { throw new Error(text.slice(0, 200)); }
      if (!res.ok || json.error) throw new Error(json.error ?? 'Upload thất bại');
      setRecipeForm(f => ({ ...f, photo_url: json.url }));
    } catch (err: any) {
      setRecipeFormError('Upload ảnh thất bại: ' + (err as Error).message);
    } finally {
      setUploadingRecipeImg(false);
    }
  }

  async function saveRecipe(e: FormEvent) {
    e.preventDefault();
    if (!recipeForm.name.trim()) { setRecipeFormError('Vui lòng điền tên món.'); return; }
    setSavingRecipe(true); setRecipeFormError('');
    const payload = {
      name: recipeForm.name.trim(), category: recipeForm.category.trim(),
      photo_url: recipeForm.photo_url.trim(), instructions: recipeForm.instructions.trim(),
      total_cost: recipeForm.total_cost ? Number(recipeForm.total_cost) : null,
      recipe_text: recipeForm.recipe_text.trim(),
      linked_product_ids: recipeForm.linked_product_ids,
      courses: recipeForm.courses,
      sort_order: recipeForm.sort_order,
    };
    const { error } = editingRecipe
      ? await createClient().from('cong_thuc').update({ ...payload, updated_at: new Date().toISOString() }).eq('id', editingRecipe.id)
      : await createClient().from('cong_thuc').insert(payload);
    setSavingRecipe(false);
    if (error) { setRecipeFormError('Lỗi: ' + error.message); return; }
    cancelRecipeEdit(); await loadRecipes();
  }

  async function deleteRecipe(id: string) {
    if (!confirm('Xóa công thức này?')) return;
    setDeletingRecipe(id);
    await createClient().from('cong_thuc').delete().eq('id', id);
    setDeletingRecipe(null); await loadRecipes();
  }

  function toggleLinkedProduct(productId: string) {
    setRecipeForm(f => ({
      ...f,
      linked_product_ids: f.linked_product_ids.includes(productId)
        ? f.linked_product_ids.filter(id => id !== productId)
        : [...f.linked_product_ids, productId],
    }));
  }

  // --- CT HVCP ---
  function startEditHvcp(r: CongThucHVCP) {
    setEditingHvcp(r);
    setHvcpForm({ name: r.name, category: r.category, photo_url: r.photo_url, instructions: r.instructions, recipe_text: r.recipe_text, linked_product_ids: r.linked_product_ids ?? [], sort_order: r.sort_order, active: r.active, locked: r.locked ?? false });
    setShowAddHvcp(false); setHvcpFormError(''); setHvcpProdQ('');
  }
  function cancelHvcpEdit() { setEditingHvcp(null); setShowAddHvcp(false); setHvcpForm(BLANK_HVCP); setHvcpFormError(''); setHvcpProdQ(''); }

  async function handleHvcpImageUpload(file: File) {
    setUploadingHvcpImg(true);
    try {
      const uploadFile = file.size > 2 * 1024 * 1024 ? await compressImage(file) : file;
      const form = new FormData();
      form.append('file', uploadFile);
      const res = await fetch('/api/admin/cong-thuc/upload', { method: 'POST', body: form });
      const json = await res.json();
      if (!res.ok || json.error) throw new Error(json.error ?? 'Upload thất bại');
      setHvcpForm(f => ({ ...f, photo_url: json.url }));
    } catch (err: any) {
      setHvcpFormError('Upload ảnh thất bại: ' + (err as Error).message);
    } finally {
      setUploadingHvcpImg(false);
    }
  }

  async function saveHvcp(e: FormEvent) {
    e.preventDefault();
    if (!hvcpForm.name.trim()) { setHvcpFormError('Vui lòng điền tên món.'); return; }
    setSavingHvcp(true); setHvcpFormError('');
    const payload = {
      name: hvcpForm.name.trim(), category: hvcpForm.category.trim(),
      photo_url: hvcpForm.photo_url.trim(), instructions: hvcpForm.instructions.trim(),
      recipe_text: hvcpForm.recipe_text.trim(),
      linked_product_ids: hvcpForm.linked_product_ids,
      sort_order: hvcpForm.sort_order, active: hvcpForm.active, locked: hvcpForm.locked,
    };
    const { error } = editingHvcp
      ? await createClient().from('cong_thuc_hvcp').update(payload).eq('id', editingHvcp.id)
      : await createClient().from('cong_thuc_hvcp').insert(payload);
    setSavingHvcp(false);
    if (error) { setHvcpFormError('Lỗi: ' + error.message); return; }
    cancelHvcpEdit(); await loadHVCPRecipes();
  }

  async function deleteHvcp(id: string) {
    if (!confirm('Xóa công thức HVCP này?')) return;
    setDeletingHvcp(id);
    await createClient().from('cong_thuc_hvcp').delete().eq('id', id);
    setDeletingHvcp(null); await loadHVCPRecipes();
  }

  async function toggleHvcpActive(r: CongThucHVCP) {
    await createClient().from('cong_thuc_hvcp').update({ active: !r.active }).eq('id', r.id);
    await loadHVCPRecipes();
  }

  async function toggleHvcpLocked(r: CongThucHVCP) {
    await createClient().from('cong_thuc_hvcp').update({ locked: !r.locked }).eq('id', r.id);
    await loadHVCPRecipes();
  }

  function toggleHvcpProduct(productId: string) {
    setHvcpForm(f => ({
      ...f,
      linked_product_ids: f.linked_product_ids.includes(productId)
        ? f.linked_product_ids.filter(id => id !== productId)
        : [...f.linked_product_ids, productId],
    }));
  }

  // --- KHO CT CHIA SẺ ---
  function startEditChiaSe(r: ChiaSeRecipe) {
    setEditingChiaSe(r);
    setChiaSeForm({ name: r.name, short_name: r.short_name ?? r.name, category: r.category ?? '', source: r.source ?? '', image_url: r.image_url ?? '', steps: r.steps ?? '', ingredients: r.ingredients ?? [], sort_order: r.sort_order ?? 0, active: r.active, locked: r.locked ?? false });
    setShowAddChiaSe(false); setChiaSeFormError('');
  }
  function cancelChiaSeEdit() { setEditingChiaSe(null); setShowAddChiaSe(false); setChiaSeForm(BLANK_CHIA_SE); setChiaSeFormError(''); }

  async function handleChiaSeImageUpload(file: File) {
    setUploadingChiaSeImg(true);
    try {
      const uploadFile = file.size > 2 * 1024 * 1024 ? await compressImage(file) : file;
      const form = new FormData();
      form.append('file', uploadFile);
      const res = await fetch('/api/admin/cong-thuc/upload', { method: 'POST', body: form });
      const json = await res.json();
      if (!res.ok || json.error) throw new Error(json.error ?? 'Upload thất bại');
      setChiaSeForm(f => ({ ...f, image_url: json.url }));
    } catch (err: any) {
      setChiaSeFormError('Upload ảnh thất bại: ' + (err as Error).message);
    } finally {
      setUploadingChiaSeImg(false);
    }
  }

  async function saveChiaSe(e: FormEvent) {
    e.preventDefault();
    if (!chiaSeForm.name.trim()) { setChiaSeFormError('Vui lòng điền tên món.'); return; }
    setSavingChiaSe(true); setChiaSeFormError('');
    try {
      const payload = {
        name: chiaSeForm.name.trim(),
        short_name: (chiaSeForm.short_name ?? '').trim() || chiaSeForm.name.trim(),
        category: (chiaSeForm.category ?? '').trim(),
        source: (chiaSeForm.source ?? '').trim(),
        image_url: (chiaSeForm.image_url ?? '').trim(),
        steps: (chiaSeForm.steps ?? '').trim(),
        ingredients: chiaSeForm.ingredients ?? [],
        sort_order: chiaSeForm.sort_order ?? 0,
        active: chiaSeForm.active,
        locked: chiaSeForm.locked,
      };
      const { error } = editingChiaSe
        ? await createClient().from('cong_thuc_chia_se').update(payload).eq('id', editingChiaSe.id)
        : await createClient().from('cong_thuc_chia_se').insert(payload);
      if (error) { setChiaSeFormError('Lỗi: ' + error.message); return; }
      cancelChiaSeEdit(); await loadChiaSeRecipes();
    } catch (err: unknown) {
      setChiaSeFormError('Lỗi: ' + (err instanceof Error ? err.message : String(err)));
    } finally {
      setSavingChiaSe(false);
    }
  }

  async function deleteChiaSe(id: string) {
    if (!confirm('Xóa công thức chia sẻ này?')) return;
    setDeletingChiaSe(id);
    await createClient().from('cong_thuc_chia_se').delete().eq('id', id);
    setDeletingChiaSe(null); await loadChiaSeRecipes();
  }

  async function toggleChiaSeActive(r: ChiaSeRecipe) {
    await createClient().from('cong_thuc_chia_se').update({ active: !r.active }).eq('id', r.id);
    await loadChiaSeRecipes();
  }

  async function toggleChiaSeLocked(r: ChiaSeRecipe) {
    await createClient().from('cong_thuc_chia_se').update({ locked: !r.locked }).eq('id', r.id);
    await loadChiaSeRecipes();
  }

  // --- SYNC HÌNH ẢNH ---
  async function syncTraoBang() {
    setSyncingTraoBang(true); setSyncMsg('');
    try {
      const res = await fetch('/api/admin/sync-trao-bang', { method: 'POST' });
      const json = await res.json();
      setSyncMsg(json.error ? '❌ ' + json.error : `✅ Trao Bằng: đã sync ${json.count} học viên`);
    } catch (e: any) { setSyncMsg('❌ ' + e.message); }
    setSyncingTraoBang(false);
  }
  async function syncLopHoc() {
    setSyncingLopHoc(true); setSyncMsg('');
    try {
      const res = await fetch('/api/admin/sync-lop-hoc', { method: 'POST' });
      const json = await res.json();
      setSyncMsg(json.error ? '❌ ' + json.error : `✅ Lớp Học: đã sync ${json.count} buổi`);
    } catch (e: any) { setSyncMsg('❌ ' + e.message); }
    setSyncingLopHoc(false);
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
  const filteredRecipes = recipes.filter(r => {
    const q = recipeSearch.toLowerCase();
    const matchSearch = !q || r.name.toLowerCase().includes(q) || r.category.toLowerCase().includes(q);
    const matchKhoa = !recipeKhoaFilter || (r.courses ?? []).includes(recipeKhoaFilter);
    return matchSearch && matchKhoa;
  });
  const filteredChiaSe = chiaSeList.filter(r =>
    r.name.toLowerCase().includes(chiaSeSearch.toLowerCase()) ||
    r.category.toLowerCase().includes(chiaSeSearch.toLowerCase())
  );
  const filteredHvcp = hvcp.filter(r =>
    r.name.toLowerCase().includes(hvcpSearch.toLowerCase()) ||
    r.category.toLowerCase().includes(hvcpSearch.toLowerCase())
  );
  const filteredProductsForHvcp = products.filter(p =>
    p.name.toLowerCase().includes(hvcpProdQ.toLowerCase())
  );
  const filteredProductsForRecipe = products.filter(p =>
    p.name.toLowerCase().includes(prodFilterQ.toLowerCase())
  );

  const productCategories = Array.from(new Set(products.map(p => p.category).filter(Boolean))).sort();
  const filteredAdminProducts = products.filter(p => {
    const q = productSearch.toLowerCase();
    const matchName = !q || p.name.toLowerCase().includes(q);
    const matchCat = !productCatFilter || p.category === productCatFilter;
    const matchPl = !productPhanLoaiFilter || p.phan_loai === productPhanLoaiFilter;
    return matchName && matchCat && matchPl;
  });

  const toolCategories = Array.from(new Set(tools.map(t => t.category).filter(Boolean))).sort();
  const filteredAdminTools = tools.filter(t => {
    const q = toolSearch.toLowerCase();
    const matchName = !q || t.name.toLowerCase().includes(q);
    const matchCat = !toolCatFilter || t.category === toolCatFilter;
    return matchName && matchCat;
  });

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

  const pendingOrders = orders.filter(o => o.status === 'pending').length;

  // ── Traffic aggregation (derived from trafficRows) ──
  const SOURCE_LABELS: Record<string, string> = {
    direct: 'Trực tiếp', google: 'Google', facebook: 'Facebook', zalo: 'Zalo',
    tiktok: 'TikTok', instagram: 'Instagram', bing: 'Bing', yahoo: 'Yahoo', khac: 'Khác',
  };
  const SOURCE_ICONS: Record<string, string> = {
    direct: 'ti-link', google: 'ti-brand-google', facebook: 'ti-brand-facebook', zalo: 'ti-brand-zalo',
    tiktok: 'ti-brand-tiktok', instagram: 'ti-brand-instagram', bing: 'ti-search', yahoo: 'ti-search', khac: 'ti-world',
  };
  const viewsByDay: { date: string; label: string; count: number }[] = (() => {
    const days: { date: string; label: string; count: number }[] = [];
    for (let i = trafficRangeDays - 1; i >= 0; i--) {
      const d = new Date(); d.setHours(0, 0, 0, 0); d.setDate(d.getDate() - i);
      const dateKey = d.toISOString().slice(0, 10);
      days.push({ date: dateKey, label: `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}`, count: 0 });
    }
    const byDate = new Map(days.map(d => [d.date, d]));
    for (const r of trafficRows) {
      const key = r.created_at.slice(0, 10);
      const bucket = byDate.get(key);
      if (bucket) bucket.count++;
    }
    return days;
  })();
  const maxDayCount = Math.max(1, ...viewsByDay.map(d => d.count));
  const viewsBySource: { source: string; count: number }[] = (() => {
    const counts = new Map<string, number>();
    for (const r of trafficRows) counts.set(r.source, (counts.get(r.source) ?? 0) + 1);
    return [...counts.entries()].map(([source, count]) => ({ source, count })).sort((a, b) => b.count - a.count);
  })();
  const totalSourceViews = viewsBySource.reduce((s, x) => s + x.count, 0) || 1;
  const topPages: { path: string; count: number }[] = (() => {
    const counts = new Map<string, number>();
    for (const r of trafficRows) counts.set(r.path, (counts.get(r.path) ?? 0) + 1);
    return [...counts.entries()].map(([path, count]) => ({ path, count })).sort((a, b) => b.count - a.count).slice(0, 8);
  })();

  function navTo(tab: typeof activeTab) { setActiveTab(tab); setSidebarOpen(false); }
  const TAB_LABELS: Record<string, string> = {
    dashboard: 'Dashboard', traffic: 'Thống Kê Traffic', leads: 'Yêu Cầu Tư Vấn', students: 'Học Viên',
    content: 'Khóa Học', products: 'Nguyên Liệu', tools: 'Dụng Cụ',
    recipes: 'Công Thức', 'ct-hvcp': 'CT HVCP', 'kho-cong-thuc': 'CT Miễn Phí',
    'hinh-anh': 'Hình Ảnh', videos: 'Tư Liệu Truyền Thông', 'service-videos': 'Video Dịch Vụ', orders: 'Đơn Hàng',
  };

  return (
    <main className="admin-page">
      {/* ── SIDEBAR OVERLAY (mobile) ── */}
      {sidebarOpen && <div className="admin-sb-overlay" onClick={() => setSidebarOpen(false)} />}

      {/* ── SIDEBAR ── */}
      <aside className={`admin-sidebar${sidebarOpen ? ' open' : ''}`}>
        <div className="admin-sb-brand">
          <i className="ti ti-coffee"></i>
          <span>Học Viện Cà Phê</span>
          <button className="admin-sb-close" onClick={() => setSidebarOpen(false)} aria-label="Đóng menu">
            <i className="ti ti-x"></i>
          </button>
        </div>
        <nav className="admin-sb-nav">
          <div className="admin-sb-group">Tổng quan</div>
          <button className={`admin-sb-item${activeTab === 'dashboard' ? ' active' : ''}`} onClick={() => navTo('dashboard')}>
            <i className="ti ti-layout-dashboard"></i> Dashboard
          </button>
          <button className={`admin-sb-item${activeTab === 'traffic' ? ' active' : ''}`} onClick={() => navTo('traffic')}>
            <i className="ti ti-chart-line"></i> Thống Kê Traffic
          </button>
          <div className="admin-sb-sep"></div>
          <div className="admin-sb-group">Quản lý</div>
          <button className={`admin-sb-item${activeTab === 'leads' ? ' active' : ''}`} onClick={() => navTo('leads')}>
            <i className="ti ti-speakerphone"></i> Yêu Cầu Tư Vấn
            {newLeadsCount > 0 && <span className="admin-sb-badge">{newLeadsCount}</span>}
          </button>
          <button className={`admin-sb-item${activeTab === 'students' ? ' active' : ''}`} onClick={() => navTo('students')}>
            <i className="ti ti-users"></i> Học Viên
          </button>
          <button className={`admin-sb-item${activeTab === 'orders' ? ' active' : ''}`} onClick={() => navTo('orders')}>
            <i className="ti ti-shopping-bag"></i> Đơn Hàng
            {pendingOrders > 0 && <span className="admin-sb-badge">{pendingOrders}</span>}
          </button>
          <div className="admin-sb-sep"></div>
          <div className="admin-sb-group">Nội dung</div>
          <button className={`admin-sb-item${activeTab === 'content' ? ' active' : ''}`} onClick={() => navTo('content')}>
            <i className="ti ti-book-2"></i> Khóa Học
          </button>
          <button className={`admin-sb-item${activeTab === 'recipes' ? ' active' : ''}`} onClick={() => navTo('recipes')}>
            <i className="ti ti-coffee"></i> Công Thức
          </button>
          <button className={`admin-sb-item${activeTab === 'ct-hvcp' ? ' active' : ''}`} onClick={() => navTo('ct-hvcp')}>
            <i className="ti ti-building-store"></i> CT HVCP
            {hvcp.length > 0 && <span className="admin-sb-badge">{hvcp.length}</span>}
          </button>
          <button className={`admin-sb-item${activeTab === 'kho-cong-thuc' ? ' active' : ''}`} onClick={() => navTo('kho-cong-thuc')}>
            <i className="ti ti-gift"></i> CT Miễn Phí
            {chiaSeList.length > 0 && <span className="admin-sb-badge">{chiaSeList.length}</span>}
          </button>
          <div className="admin-sb-sep"></div>
          <div className="admin-sb-group">Kho hàng</div>
          <button className={`admin-sb-item${activeTab === 'products' ? ' active' : ''}`} onClick={() => navTo('products')}>
            <i className="ti ti-package"></i> Nguyên Liệu
          </button>
          <button className={`admin-sb-item${activeTab === 'tools' ? ' active' : ''}`} onClick={() => navTo('tools')}>
            <i className="ti ti-tool"></i> Dụng Cụ
          </button>
          <div className="admin-sb-sep"></div>
          <div className="admin-sb-group">Media</div>
          <button className={`admin-sb-item${activeTab === 'hinh-anh' ? ' active' : ''}`} onClick={() => navTo('hinh-anh')}>
            <i className="ti ti-photo"></i> Hình Ảnh
          </button>
          <button className={`admin-sb-item${activeTab === 'videos' ? ' active' : ''}`} onClick={() => navTo('videos')}>
            <i className="ti ti-video"></i> Tư Liệu
            {videos.length > 0 && <span className="admin-sb-badge">{videos.length}</span>}
          </button>
          <button className={`admin-sb-item${activeTab === 'service-videos' ? ' active' : ''}`} onClick={() => navTo('service-videos')}>
            <i className="ti ti-brand-youtube"></i> Video Dịch Vụ
            {serviceVideos.length > 0 && <span className="admin-sb-badge">{serviceVideos.length}</span>}
          </button>
        </nav>
      </aside>

      {/* ── MAIN ── */}
      <div className="admin-main">
        {/* TOPBAR */}
        <div className="admin-topbar">
          <button className="admin-topbar-hamburger" onClick={() => setSidebarOpen(true)} aria-label="Mở menu">
            <i className="ti ti-menu-2"></i>
          </button>
          <span className="admin-topbar-title">{TAB_LABELS[activeTab] ?? ''}</span>
          <div className="admin-topbar-right">
            <Link href="/" className="admin-topbar-link" target="_blank">
              <i className="ti ti-external-link"></i> Xem trang
            </Link>
          </div>
        </div>

        {/* CONTENT */}
        <div className="admin-content">
          <div className="container">

            {/* ======= DASHBOARD ======= */}
            {activeTab === 'dashboard' && (
              <>
                <div className="admin-stats-grid">
                  <div className="admin-stat-card">
                    <i className="ti ti-speakerphone"></i>
                    <div className="admin-stat-num">{newLeadsCount}</div>
                    <div className="admin-stat-label">Leads mới chưa liên hệ</div>
                  </div>
                  <div className="admin-stat-card">
                    <i className="ti ti-users"></i>
                    <div className="admin-stat-num">{students.length}</div>
                    <div className="admin-stat-label">Tổng học viên</div>
                  </div>
                  <div className="admin-stat-card">
                    <i className="ti ti-coffee"></i>
                    <div className="admin-stat-num">{recipes.length}</div>
                    <div className="admin-stat-label">Công thức</div>
                  </div>
                  <div className="admin-stat-card">
                    <i className="ti ti-shopping-bag"></i>
                    <div className="admin-stat-num">{pendingOrders}</div>
                    <div className="admin-stat-label">Đơn hàng chờ xử lý</div>
                  </div>
                </div>

                {newLeadsCount > 0 && (
                  <div className="admin-notice">
                    <i className="ti ti-info-circle"></i>
                    Có <strong>{newLeadsCount}</strong> yêu cầu tư vấn mới chưa liên hệ.{' '}
                    <button className="admin-notice-btn" onClick={() => setActiveTab('leads')}>Xem ngay →</button>
                  </div>
                )}

                <div className="admin-dash-section">
                  <div className="admin-dash-sec-hd">
                    <h3>Leads gần đây</h3>
                    <button className="admin-dash-more" onClick={() => setActiveTab('leads')}>Xem tất cả →</button>
                  </div>
                  <div className="admin-table-wrap">
                    <table className="admin-table">
                      <thead>
                        <tr><th>Họ Tên</th><th>SĐT</th><th>Khu Vực</th><th>Khóa Quan Tâm</th><th>Ngày</th><th>Trạng Thái</th></tr>
                      </thead>
                      <tbody>
                        {leads.slice(0, 8).map(l => (
                          <tr key={l.id} className={l.status === 'new' ? 'lead-row-new' : ''}>
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
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            )}

        {/* ======= TRAFFIC TAB ======= */}
        {activeTab === 'traffic' && (
          <>
            {trafficLoading ? (
              <div className="admin-loading"><i className="ti ti-loader-2 spin"></i> Đang tải số liệu...</div>
            ) : trafficTotals.allTime === 0 ? (
              <div className="admin-empty-state">
                <i className="ti ti-chart-line"></i>
                <p>Chưa có dữ liệu traffic.</p>
                <p style={{ fontSize: '.85rem', color: 'var(--text-3)' }}>Số liệu sẽ xuất hiện sau khi có người truy cập website (theo dõi tự động từ giờ trở đi).</p>
              </div>
            ) : (
              <>
                <div className="admin-stats-grid">
                  <div className="admin-stat-card">
                    <i className="ti ti-calendar-event"></i>
                    <div className="admin-stat-num">{trafficTotals.today}</div>
                    <div className="admin-stat-label">Lượt xem hôm nay</div>
                  </div>
                  <div className="admin-stat-card">
                    <i className="ti ti-calendar-week"></i>
                    <div className="admin-stat-num">{trafficTotals.week}</div>
                    <div className="admin-stat-label">Lượt xem 7 ngày qua</div>
                  </div>
                  <div className="admin-stat-card">
                    <i className="ti ti-calendar-month"></i>
                    <div className="admin-stat-num">{trafficTotals.month}</div>
                    <div className="admin-stat-label">Lượt xem 30 ngày qua</div>
                  </div>
                  <div className="admin-stat-card">
                    <i className="ti ti-chart-bar"></i>
                    <div className="admin-stat-num">{trafficTotals.allTime}</div>
                    <div className="admin-stat-label">Tổng lượt xem</div>
                  </div>
                </div>

                {/* Daily views chart */}
                <div className="admin-dash-section">
                  <div className="admin-dash-sec-hd">
                    <h3>Lượt xem theo ngày</h3>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      {([7, 14, 30] as const).map(n => (
                        <button key={n} className={`traffic-range-btn${trafficRangeDays === n ? ' active' : ''}`} onClick={() => setTrafficRangeDays(n)}>
                          {n} ngày
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="traffic-bar-chart">
                    {viewsByDay.map(d => (
                      <div key={d.date} className="traffic-bar-col" title={`${d.label}: ${d.count} lượt`}>
                        <div className="traffic-bar" style={{ height: `${Math.max(3, (d.count / maxDayCount) * 100)}%` }}>
                          {d.count > 0 && <span className="traffic-bar-val">{d.count}</span>}
                        </div>
                        <span className="traffic-bar-label">{d.label}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="admin-dash-2col">
                  {/* Traffic sources */}
                  <div className="admin-dash-section">
                    <div className="admin-dash-sec-hd"><h3>Nguồn traffic (30 ngày)</h3></div>
                    <div className="traffic-source-list">
                      {viewsBySource.map(s => (
                        <div key={s.source} className="traffic-source-row">
                          <div className="traffic-source-label">
                            <i className={`ti ${SOURCE_ICONS[s.source] ?? 'ti-world'}`}></i>
                            {SOURCE_LABELS[s.source] ?? s.source}
                          </div>
                          <div className="traffic-source-bar-wrap">
                            <div className="traffic-source-bar" style={{ width: `${(s.count / totalSourceViews) * 100}%` }}></div>
                          </div>
                          <div className="traffic-source-count">{s.count} <span>({Math.round((s.count / totalSourceViews) * 100)}%)</span></div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Top pages */}
                  <div className="admin-dash-section">
                    <div className="admin-dash-sec-hd"><h3>Trang được xem nhiều nhất</h3></div>
                    <div className="admin-table-wrap">
                      <table className="admin-table">
                        <thead><tr><th>Đường dẫn</th><th>Lượt xem</th></tr></thead>
                        <tbody>
                          {topPages.map(p => (
                            <tr key={p.path}>
                              <td className="admin-name" style={{ fontFamily: 'monospace', fontSize: '.82rem' }}>{p.path}</td>
                              <td>{p.count}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </>
            )}
          </>
        )}

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
                    <div className="af-group af-full">
                      <label>Hình ảnh</label>
                      <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                        <input type="text" placeholder="URL ảnh..." value={courseForm.image ?? ''} onChange={e => setCourseForm(f => ({ ...f, image: e.target.value }))} style={{ flex: 1, minWidth: '160px' }} />
                        <input ref={courseImgRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={e => { const f = e.target.files?.[0]; if (f) handleCourseImageUpload(f); e.target.value = ''; }} />
                        <button type="button" className="btn btn-outline" style={{ whiteSpace: 'nowrap' }} disabled={uploadingCourseImg} onClick={() => courseImgRef.current?.click()}>
                          {uploadingCourseImg ? <><i className="ti ti-loader-2 spin"></i> Upload...</> : <><i className="ti ti-upload"></i> Upload</>}
                        </button>
                      </div>
                      {courseForm.image && (
                        <div style={{ position: 'relative', display: 'inline-block', marginTop: '8px' }}>
                          <img src={courseForm.image.startsWith('http') ? courseForm.image : `/images/courses/Bang-gia-khoa-le/${courseForm.image}`} alt="" style={{ height: '80px', borderRadius: '6px', objectFit: 'cover' }} />
                          <button type="button" onClick={() => setCourseForm(f => ({ ...f, image: '' }))} style={{ position: 'absolute', top: '-6px', right: '-6px', background: '#c0392b', color: '#fff', border: 'none', borderRadius: '50%', width: '20px', height: '20px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px' }} title="Xóa ảnh"><i className="ti ti-x"></i></button>
                        </div>
                      )}
                    </div>
                    <div className="af-group af-full"><label>Mô tả ngắn</label><textarea rows={2} placeholder="Mô tả ngắn về khóa học..." value={courseForm.description ?? ''} onChange={e => setCourseForm(f => ({ ...f, description: e.target.value }))} /></div>
                    {courseForm.category === 'kinh-doanh' && (<>
                      <div className="af-group"><label>Slug (URL) *<span style={{ fontWeight: 400, color: 'var(--text-3)', marginLeft: 6 }}>vd: nitro-soda</span></label><input type="text" placeholder="nitro-soda" value={courseForm.slug ?? ''} onChange={e => setCourseForm(f => ({ ...f, slug: e.target.value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') }))} /></div>
                      <div className="af-group af-full"><label>Mô tả chi tiết (trang riêng)</label><textarea rows={3} placeholder="Nội dung chi tiết hiển thị trên trang /dich-vu/slug..." value={courseForm.detail ?? ''} onChange={e => setCourseForm(f => ({ ...f, detail: e.target.value }))} /></div>
                    </>)}
                    <div className="af-group"><label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}><input type="checkbox" checked={courseForm.active} onChange={e => setCourseForm(f => ({ ...f, active: e.target.checked }))} />Hiển thị trên trang</label></div>
                  </div>
                  {courseFormError && <div className="lf-error" style={{ marginBottom: '12px' }}><i className="ti ti-alert-circle"></i> {courseFormError}</div>}
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button type="submit" className="btn btn-primary" disabled={savingCourse || uploadingCourseImg}>{savingCourse ? <><i className="ti ti-loader-2 spin"></i> Đang lưu...</> : <><i className="ti ti-check"></i> Thêm Khóa Học</>}</button>
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
                      <div className="af-group af-full">
                        <label>Hình ảnh</label>
                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                          <input type="text" placeholder="URL ảnh..." value={courseForm.image ?? ''} onChange={e => setCourseForm(f => ({ ...f, image: e.target.value }))} style={{ flex: 1, minWidth: '160px' }} />
                          <input ref={courseImgRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={e => { const f = e.target.files?.[0]; if (f) handleCourseImageUpload(f); e.target.value = ''; }} />
                          <button type="button" className="btn btn-outline" style={{ whiteSpace: 'nowrap' }} disabled={uploadingCourseImg} onClick={() => courseImgRef.current?.click()}>
                            {uploadingCourseImg ? <><i className="ti ti-loader-2 spin"></i> Upload...</> : <><i className="ti ti-upload"></i> Upload</>}
                          </button>
                        </div>
                        {courseForm.image && (
                          <div style={{ position: 'relative', display: 'inline-block', marginTop: '8px' }}>
                            <img src={courseForm.image.startsWith('http') ? courseForm.image : `/images/courses/Bang-gia-khoa-le/${courseForm.image}`} alt="" style={{ height: '80px', borderRadius: '6px', objectFit: 'cover' }} />
                            <button type="button" onClick={() => setCourseForm(f => ({ ...f, image: '' }))} style={{ position: 'absolute', top: '-6px', right: '-6px', background: '#c0392b', color: '#fff', border: 'none', borderRadius: '50%', width: '20px', height: '20px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px' }} title="Xóa ảnh"><i className="ti ti-x"></i></button>
                          </div>
                        )}
                      </div>
                      <div className="af-group af-full"><label>Mô tả ngắn</label><textarea rows={2} placeholder="Mô tả ngắn về khóa học..." value={courseForm.description ?? ''} onChange={e => setCourseForm(f => ({ ...f, description: e.target.value }))} /></div>
                      {courseForm.category === 'kinh-doanh' && (<>
                        <div className="af-group"><label>Slug (URL) *<span style={{ fontWeight: 400, color: 'var(--text-3)', marginLeft: 6 }}>vd: nitro-soda</span></label><input type="text" placeholder="nitro-soda" value={courseForm.slug ?? ''} onChange={e => setCourseForm(f => ({ ...f, slug: e.target.value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') }))} /></div>
                        <div className="af-group af-full"><label>Mô tả chi tiết (trang riêng)</label><textarea rows={3} placeholder="Nội dung chi tiết hiển thị trên trang /dich-vu/slug..." value={courseForm.detail ?? ''} onChange={e => setCourseForm(f => ({ ...f, detail: e.target.value }))} /></div>
                      </>)}
                      <div className="af-group"><label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}><input type="checkbox" checked={courseForm.active} onChange={e => setCourseForm(f => ({ ...f, active: e.target.checked }))} />Hiển thị trên trang</label></div>
                    </div>
                    {courseFormError && <div className="lf-error" style={{ marginBottom: '12px' }}><i className="ti ti-alert-circle"></i> {courseFormError}</div>}
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <button type="submit" className="btn btn-primary" disabled={savingCourse || uploadingCourseImg}>{savingCourse ? <><i className="ti ti-loader-2 spin"></i> Đang lưu...</> : <><i className="ti ti-check"></i> Cập Nhật</>}</button>
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
                      <thead><tr><th>Tên Khóa Học</th><th>Giá</th><th>{cat === 'kinh-doanh' ? 'Slug / URL' : 'Thời Lượng'}</th><th>Hiển Thị</th><th></th></tr></thead>
                      <tbody>
                        {list.length === 0 ? (
                          <tr><td colSpan={5} className="admin-empty">Chưa có khóa học nào</td></tr>
                        ) : list.map(c => (
                          <tr key={c.id} style={{ opacity: c.active ? 1 : 0.45 }}>
                            <td className="admin-name">{c.name}</td>
                            <td style={{ fontWeight: 600, color: 'var(--accent)', whiteSpace: 'nowrap' }}>{c.price}</td>
                            <td className="admin-date">
                              {cat === 'kinh-doanh'
                                ? (c.slug ? <a href={`/dich-vu/${c.slug}`} target="_blank" style={{ color: 'var(--accent)', fontSize: '0.8rem' }}>/dich-vu/{c.slug}</a> : <span style={{ color: 'var(--text-3)', fontSize: '0.8rem' }}>Chưa có slug</span>)
                                : (c.duration ?? '—')}
                            </td>
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
                          <div style={{ position: 'relative', display: 'inline-block' }}>
                            <img src={toolForm.image_url} alt="preview" className="prod-img-preview" />
                            <button type="button" onClick={() => setToolForm(f => ({ ...f, image_url: '' }))} style={{ position: 'absolute', top: '-6px', right: '-6px', background: '#c0392b', color: '#fff', border: 'none', borderRadius: '50%', width: '20px', height: '20px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px' }} title="Xóa ảnh"><i className="ti ti-x"></i></button>
                          </div>
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
                            <div style={{ position: 'relative', display: 'inline-block' }}>
                              <img src={toolForm.image_url} alt="preview" className="prod-img-preview" />
                              <button type="button" onClick={() => setToolForm(f => ({ ...f, image_url: '' }))} style={{ position: 'absolute', top: '-6px', right: '-6px', background: '#c0392b', color: '#fff', border: 'none', borderRadius: '50%', width: '20px', height: '20px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px' }} title="Xóa ảnh"><i className="ti ti-x"></i></button>
                            </div>
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

            {/* TOOLS SEARCH + FILTER */}
            <div className="admin-filter-bar">
              <div className="admin-search-wrap" style={{ flex: 1, minWidth: '180px' }}>
                <i className="ti ti-search"></i>
                <input className="admin-search" type="text" placeholder="Tìm theo tên sản phẩm..." value={toolSearch} onChange={e => setToolSearch(e.target.value)} />
                {toolSearch && <button onClick={() => setToolSearch('')} className="ct-search-clear"><i className="ti ti-x"></i></button>}
              </div>
              <select className="admin-filter-select" value={toolCatFilter} onChange={e => setToolCatFilter(e.target.value)}>
                <option value="">Tất cả danh mục</option>
                {toolCategories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              {(toolSearch || toolCatFilter) && (
                <button className="btn btn-outline" style={{ fontSize: '0.8rem', padding: '6px 12px', whiteSpace: 'nowrap' }}
                  onClick={() => { setToolSearch(''); setToolCatFilter(''); }}>
                  <i className="ti ti-x"></i> Xóa lọc
                </button>
              )}
              <span className="admin-filter-count">{filteredAdminTools.length}/{tools.length}</span>
            </div>

            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr><th>STT</th><th>Ảnh</th><th>Tên Sản Phẩm</th><th>Quy Cách</th><th>Giá Bán</th><th>Danh Mục</th><th>Hiện</th><th></th></tr>
                </thead>
                <tbody>
                  {filteredAdminTools.length === 0 ? (
                    <tr><td colSpan={8} className="admin-empty">{tools.length === 0 ? 'Chưa có dụng cụ nào — nhấn "Thêm Dụng Cụ" để bắt đầu' : 'Không tìm thấy dụng cụ nào phù hợp'}</td></tr>
                  ) : filteredAdminTools.map(t => (
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
                          <div style={{ position: 'relative', display: 'inline-block' }}>
                            <img src={productForm.image_url} alt="preview" className="prod-img-preview" />
                            <button type="button" onClick={() => setProductForm(f => ({ ...f, image_url: '' }))} style={{ position: 'absolute', top: '-6px', right: '-6px', background: '#c0392b', color: '#fff', border: 'none', borderRadius: '50%', width: '20px', height: '20px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px' }} title="Xóa ảnh"><i className="ti ti-x"></i></button>
                          </div>
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
                    <div className="af-group af-full">
                      <label>Mô tả / Hướng dẫn sử dụng</label>
                      <textarea rows={4} placeholder="Mô tả thêm về sản phẩm, thành phần, hướng dẫn bảo quản hoặc sử dụng..."
                        value={productForm.description ?? ''} onChange={e => setProductForm(f => ({ ...f, description: e.target.value }))} />
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
                            <div style={{ position: 'relative', display: 'inline-block' }}>
                              <img src={productForm.image_url} alt="preview" className="prod-img-preview" />
                              <button type="button" onClick={() => setProductForm(f => ({ ...f, image_url: '' }))} style={{ position: 'absolute', top: '-6px', right: '-6px', background: '#c0392b', color: '#fff', border: 'none', borderRadius: '50%', width: '20px', height: '20px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px' }} title="Xóa ảnh"><i className="ti ti-x"></i></button>
                            </div>
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
                      <div className="af-group af-full">
                        <label>Mô tả / Hướng dẫn sử dụng</label>
                        <textarea rows={4} placeholder="Mô tả thêm về sản phẩm, thành phần, hướng dẫn bảo quản hoặc sử dụng..."
                          value={productForm.description ?? ''} onChange={e => setProductForm(f => ({ ...f, description: e.target.value }))} />
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

            {/* PRODUCTS SEARCH + FILTER */}
            <div className="admin-filter-bar">
              <div className="admin-search-wrap" style={{ flex: 1, minWidth: '180px' }}>
                <i className="ti ti-search"></i>
                <input className="admin-search" type="text" placeholder="Tìm theo tên sản phẩm..." value={productSearch} onChange={e => setProductSearch(e.target.value)} />
                {productSearch && <button onClick={() => setProductSearch('')} className="ct-search-clear"><i className="ti ti-x"></i></button>}
              </div>
              <select className="admin-filter-select" value={productCatFilter} onChange={e => setProductCatFilter(e.target.value)}>
                <option value="">Tất cả danh mục</option>
                {productCategories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <select className="admin-filter-select" value={productPhanLoaiFilter} onChange={e => setProductPhanLoaiFilter(e.target.value)}>
                <option value="">Tất cả phân loại</option>
                <option value="thuong-mai">Thương Mại</option>
                <option value="thuong-hieu">Thương Hiệu</option>
              </select>
              {(productSearch || productCatFilter || productPhanLoaiFilter) && (
                <button className="btn btn-outline" style={{ fontSize: '0.8rem', padding: '6px 12px', whiteSpace: 'nowrap' }}
                  onClick={() => { setProductSearch(''); setProductCatFilter(''); setProductPhanLoaiFilter(''); }}>
                  <i className="ti ti-x"></i> Xóa lọc
                </button>
              )}
              <span className="admin-filter-count">{filteredAdminProducts.length}/{products.length}</span>
            </div>

            {/* PRODUCTS TABLE */}
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr><th>STT</th><th>Ảnh</th><th>Tên Sản Phẩm</th><th>Quy Cách</th><th>Giá Bán</th><th>Danh Mục</th><th>Phân Loại</th><th>Hiện</th><th></th></tr>
                </thead>
                <tbody>
                  {filteredAdminProducts.length === 0 ? (
                    <tr><td colSpan={9} className="admin-empty">{products.length === 0 ? 'Chưa có sản phẩm nào — nhấn "Thêm Sản Phẩm" để bắt đầu' : 'Không tìm thấy sản phẩm nào phù hợp'}</td></tr>
                  ) : filteredAdminProducts.map(p => (
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
        {/* ======= RECIPES TAB ======= */}
        {activeTab === 'recipes' && (
          <>
            <div style={{ display: 'flex', gap: '12px', marginBottom: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
              <div className="admin-search-wrap" style={{ flex: 1, minWidth: '200px' }}>
                <i className="ti ti-search"></i>
                <input className="admin-search" type="text" placeholder="Tìm công thức..." value={recipeSearch} onChange={e => setRecipeSearch(e.target.value)} />
                {recipeSearch && <button onClick={() => setRecipeSearch('')} className="ct-search-clear"><i className="ti ti-x"></i></button>}
              </div>
              <select value={recipeKhoaFilter} onChange={e => setRecipeKhoaFilter(e.target.value)} style={{ padding: '8px 12px', border: '1.5px solid var(--border)', borderRadius: '8px', fontSize: '0.85rem', background: 'var(--white)', color: 'var(--text)', cursor: 'pointer', minWidth: '160px' }}>
                <option value="">Tất cả khóa học</option>
                {CT_COURSES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              {recipeKhoaFilter && <button onClick={() => setRecipeKhoaFilter('')} style={{ fontSize: '0.8rem', color: 'var(--accent)', background: 'none', border: 'none', cursor: 'pointer' }}><i className="ti ti-x"></i> Xóa lọc</button>}
              <button className="btn btn-primary" onClick={() => { setShowAddRecipe(v => !v); setEditingRecipe(null); setRecipeForm(BLANK_RECIPE); }}>
                <i className={`ti ti-${showAddRecipe ? 'x' : 'plus'}`}></i> {showAddRecipe ? 'Đóng' : 'Thêm Công Thức'}
              </button>
            </div>

            {/* Add form */}
            {showAddRecipe && (
              <div className="admin-add-card" style={{ marginBottom: '24px' }}>
                <h3 className="admin-section-title">Thêm Công Thức Mới</h3>
                <RecipeForm
                  form={recipeForm} setForm={setRecipeForm} error={recipeFormError}
                  saving={savingRecipe} uploadingImg={uploadingRecipeImg}
                  fileRef={recipeImgRef} onSubmit={saveRecipe} onCancel={cancelRecipeEdit}
                  submitLabel="Thêm Công Thức"
                  products={products} prodFilterQ={prodFilterQ} setProdFilterQ={setProdFilterQ}
                  filteredProducts={filteredProductsForRecipe} toggleLinkedProduct={toggleLinkedProduct}
                  onImageFile={handleRecipeImageUpload}
                  courses={CT_COURSES}
                />
              </div>
            )}

            {/* Edit modal */}
            {editingRecipe && (
              <div className="admin-modal-backdrop" onClick={e => { if (e.target === e.currentTarget) cancelRecipeEdit(); }}>
                <div className="admin-modal-card" style={{ maxWidth: '700px' }}>
                  <div className="admin-modal-head">
                    <h3>Sửa: {editingRecipe.name}</h3>
                    <button type="button" className="admin-modal-close" onClick={cancelRecipeEdit}><i className="ti ti-x"></i></button>
                  </div>
                  <RecipeForm
                    form={recipeForm} setForm={setRecipeForm} error={recipeFormError}
                    saving={savingRecipe} uploadingImg={uploadingRecipeImg}
                    fileRef={recipeImgRef} onSubmit={saveRecipe} onCancel={cancelRecipeEdit}
                    submitLabel="Cập Nhật"
                    products={products} prodFilterQ={prodFilterQ} setProdFilterQ={setProdFilterQ}
                    filteredProducts={filteredProductsForRecipe} toggleLinkedProduct={toggleLinkedProduct}
                    onImageFile={handleRecipeImageUpload}
                    courses={CT_COURSES}
                  />
                </div>
              </div>
            )}

            {/* Table */}
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead><tr><th>#</th><th>Ảnh</th><th>Tên Món</th><th>Phân Loại</th><th>Khóa Học</th><th>Tổng Cost</th><th>NL</th><th></th></tr></thead>
                <tbody>
                  {filteredRecipes.length === 0 ? (
                    <tr><td colSpan={7} className="admin-empty">Chưa có công thức nào</td></tr>
                  ) : filteredRecipes.map((r, i) => (
                    <tr key={r.id}>
                      <td className="admin-num">{i + 1}</td>
                      <td>
                        {r.photo_url
                          ? <img src={r.photo_url} alt={r.name} style={{ width: '48px', height: '48px', objectFit: 'cover', borderRadius: '6px' }} />
                          : <div style={{ width: '48px', height: '48px', background: 'var(--border)', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><i className="ti ti-coffee" style={{ color: 'var(--muted)' }}></i></div>
                        }
                      </td>
                      <td className="admin-name">{r.name}</td>
                      <td><span className="admin-course-tag" style={{ fontSize: '0.75rem' }}>{r.category || '—'}</span></td>
                      <td style={{ maxWidth: '180px' }}>
                        {(r.courses ?? []).length > 0
                          ? <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                              {(r.courses ?? []).map(c => <span key={c} style={{ fontSize: '0.7rem', background: 'var(--bg-alt)', border: '1px solid var(--border)', borderRadius: '4px', padding: '2px 6px', whiteSpace: 'nowrap' }}>{c}</span>)}
                            </div>
                          : <span style={{ color: 'var(--muted)', fontSize: '0.8rem' }}>—</span>}
                      </td>
                      <td style={{ whiteSpace: 'nowrap' }}>{r.total_cost ? r.total_cost.toLocaleString('vi-VN') + ' đ' : '—'}</td>
                      <td style={{ fontSize: '0.8rem', color: 'var(--text-3)' }}>{r.linked_product_ids?.length ?? 0} SP</td>
                      <td style={{ display: 'flex', gap: '4px' }}>
                        <button className="admin-edit-btn" onClick={() => startEditRecipe(r)} title="Sửa"><i className="ti ti-pencil"></i></button>
                        <button className="admin-del-btn" onClick={() => deleteRecipe(r.id)} disabled={deletingRecipe === r.id} title="Xóa">
                          {deletingRecipe === r.id ? <i className="ti ti-loader-2 spin"></i> : <i className="ti ti-trash"></i>}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* ======= CT HVCP TAB ======= */}
        {activeTab === 'ct-hvcp' && (
          <>
            <div style={{ display: 'flex', gap: '12px', marginBottom: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
              <div className="admin-search-wrap" style={{ flex: 1, minWidth: '200px' }}>
                <i className="ti ti-search"></i>
                <input className="admin-search" type="text" placeholder="Tìm CT HVCP..." value={hvcpSearch} onChange={e => setHvcpSearch(e.target.value)} />
                {hvcpSearch && <button onClick={() => setHvcpSearch('')} className="ct-search-clear"><i className="ti ti-x"></i></button>}
              </div>
              <button className="btn btn-primary" onClick={() => { setShowAddHvcp(v => !v); setEditingHvcp(null); setHvcpForm(BLANK_HVCP); }}>
                <i className={`ti ti-${showAddHvcp ? 'x' : 'plus'}`}></i> {showAddHvcp ? 'Đóng' : 'Thêm CT HVCP'}
              </button>
            </div>

            {showAddHvcp && (
              <div className="admin-add-card" style={{ marginBottom: '24px' }}>
                <h3 className="admin-section-title">Thêm Công Thức HVCP Mới</h3>
                <HVCPForm
                  form={hvcpForm} setForm={setHvcpForm} error={hvcpFormError}
                  saving={savingHvcp} uploadingImg={uploadingHvcpImg}
                  fileRef={hvcpImgRef} onSubmit={saveHvcp} onCancel={cancelHvcpEdit}
                  submitLabel="Thêm CT HVCP" onImageFile={handleHvcpImageUpload}
                  products={products} prodFilterQ={hvcpProdQ} setProdFilterQ={setHvcpProdQ}
                  filteredProducts={filteredProductsForHvcp} toggleLinkedProduct={toggleHvcpProduct}
                />
              </div>
            )}

            {editingHvcp && (
              <div className="admin-modal-backdrop" onClick={e => { if (e.target === e.currentTarget) cancelHvcpEdit(); }}>
                <div className="admin-modal-card" style={{ maxWidth: '700px' }}>
                  <div className="admin-modal-head">
                    <h3>Sửa: {editingHvcp.name}</h3>
                    <button type="button" className="admin-modal-close" onClick={cancelHvcpEdit}><i className="ti ti-x"></i></button>
                  </div>
                  <HVCPForm
                    form={hvcpForm} setForm={setHvcpForm} error={hvcpFormError}
                    saving={savingHvcp} uploadingImg={uploadingHvcpImg}
                    fileRef={hvcpImgRef} onSubmit={saveHvcp} onCancel={cancelHvcpEdit}
                    submitLabel="Cập Nhật" onImageFile={handleHvcpImageUpload}
                    products={products} prodFilterQ={hvcpProdQ} setProdFilterQ={setHvcpProdQ}
                    filteredProducts={filteredProductsForHvcp} toggleLinkedProduct={toggleHvcpProduct}
                  />
                </div>
              </div>
            )}

            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead><tr><th>#</th><th>Ảnh</th><th>Tên Món</th><th>Phân Loại</th><th>Nguyên Liệu</th><th>Hiện</th><th>Khóa</th><th></th></tr></thead>
                <tbody>
                  {filteredHvcp.length === 0 ? (
                    <tr><td colSpan={8} className="admin-empty">Chưa có CT HVCP nào — nhấn "Thêm" để bắt đầu</td></tr>
                  ) : filteredHvcp.map((r, i) => (
                    <tr key={r.id} style={{ opacity: r.active ? 1 : 0.45 }}>
                      <td className="admin-num">{i + 1}</td>
                      <td>
                        {r.photo_url
                          ? <img src={r.photo_url} alt={r.name} style={{ width: '48px', height: '48px', objectFit: 'cover', borderRadius: '6px' }} />
                          : <div style={{ width: '48px', height: '48px', background: 'var(--border)', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><i className="ti ti-coffee" style={{ color: 'var(--muted)' }}></i></div>
                        }
                      </td>
                      <td className="admin-name">{r.name}</td>
                      <td><span className="admin-course-tag" style={{ fontSize: '0.75rem' }}>{r.category || '—'}</span></td>
                      <td style={{ fontSize: '0.8rem', color: 'var(--text-3)' }}>{r.linked_product_ids?.length ?? 0} SP</td>
                      <td>
                        <button className={`course-toggle${r.active ? ' on' : ''}`} onClick={() => toggleHvcpActive(r)} title={r.active ? 'Đang hiện' : 'Đang ẩn'}>
                          <i className={`ti ti-${r.active ? 'eye' : 'eye-off'}`}></i>
                        </button>
                      </td>
                      <td>
                        <button
                          className={`course-toggle${r.locked ? ' on' : ''}`}
                          style={r.locked ? { background: '#c0392b', borderColor: '#c0392b' } : {}}
                          onClick={() => toggleHvcpLocked(r)}
                          title={r.locked ? 'Đang khóa — nhấn để mở khóa' : 'Đang mở — nhấn để khóa'}
                        >
                          <i className={`ti ti-${r.locked ? 'lock' : 'lock-open'}`}></i>
                        </button>
                      </td>
                      <td style={{ display: 'flex', gap: '4px' }}>
                        <button className="admin-edit-btn" onClick={() => startEditHvcp(r)}><i className="ti ti-pencil"></i></button>
                        <button className="admin-del-btn" onClick={() => deleteHvcp(r.id)} disabled={deletingHvcp === r.id}>
                          {deletingHvcp === r.id ? <i className="ti ti-loader-2 spin"></i> : <i className="ti ti-trash"></i>}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* ======= KHO CT CHIA SẺ TAB ======= */}
        {activeTab === 'kho-cong-thuc' && (
          <>
            <div style={{ display: 'flex', gap: '12px', marginBottom: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
              <div className="admin-search-wrap" style={{ flex: 1, minWidth: '200px' }}>
                <i className="ti ti-search"></i>
                <input className="admin-search" type="text" placeholder="Tìm công thức chia sẻ..." value={chiaSeSearch} onChange={e => setChiaSeSearch(e.target.value)} />
                {chiaSeSearch && <button onClick={() => setChiaSeSearch('')} className="ct-search-clear"><i className="ti ti-x"></i></button>}
              </div>
              <button className="btn btn-primary" onClick={() => { setShowAddChiaSe(v => !v); setEditingChiaSe(null); setChiaSeForm(BLANK_CHIA_SE); }}>
                <i className={`ti ti-${showAddChiaSe ? 'x' : 'plus'}`}></i> {showAddChiaSe ? 'Đóng' : 'Thêm Công Thức Chia Sẻ'}
              </button>
            </div>

            {showAddChiaSe && (
              <div className="admin-add-card" style={{ marginBottom: '24px' }}>
                <h3 className="admin-section-title">Thêm Công Thức Chia Sẻ Mới</h3>
                <ChiaSeForm
                  form={chiaSeForm} setForm={setChiaSeForm} error={chiaSeFormError}
                  saving={savingChiaSe} uploadingImg={uploadingChiaSeImg}
                  fileRef={chiaSeImgRef} onSubmit={saveChiaSe} onCancel={cancelChiaSeEdit}
                  submitLabel="Thêm Công Thức" onImageFile={handleChiaSeImageUpload}
                />
              </div>
            )}

            {editingChiaSe && (
              <div className="admin-modal-backdrop" onClick={e => { if (e.target === e.currentTarget) cancelChiaSeEdit(); }}>
                <div className="admin-modal-card" style={{ maxWidth: '740px' }}>
                  <div className="admin-modal-head">
                    <h3>Sửa: {editingChiaSe.name}</h3>
                    <button type="button" className="admin-modal-close" onClick={cancelChiaSeEdit}><i className="ti ti-x"></i></button>
                  </div>
                  <ChiaSeForm
                    form={chiaSeForm} setForm={setChiaSeForm} error={chiaSeFormError}
                    saving={savingChiaSe} uploadingImg={uploadingChiaSeImg}
                    fileRef={chiaSeImgRef} onSubmit={saveChiaSe} onCancel={cancelChiaSeEdit}
                    submitLabel="Cập Nhật" onImageFile={handleChiaSeImageUpload}
                  />
                </div>
              </div>
            )}

            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead><tr><th>#</th><th>Ảnh</th><th>Tên Món</th><th>Phân Loại</th><th>Nguồn</th><th>Nguyên Liệu</th><th>Hiện</th><th>Khóa</th><th></th></tr></thead>
                <tbody>
                  {filteredChiaSe.length === 0 ? (
                    <tr><td colSpan={9} className="admin-empty">Chưa có công thức chia sẻ nào — nhấn "Thêm" để bắt đầu</td></tr>
                  ) : filteredChiaSe.map((r, i) => (
                    <tr key={r.id} style={{ opacity: r.active ? 1 : 0.45 }}>
                      <td className="admin-num">{i + 1}</td>
                      <td>
                        {r.image_url
                          ? <img src={r.image_url} alt={r.name} style={{ width: '48px', height: '48px', objectFit: 'cover', borderRadius: '6px' }} />
                          : <div style={{ width: '48px', height: '48px', background: 'var(--border)', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><i className="ti ti-world" style={{ color: 'var(--muted)' }}></i></div>
                        }
                      </td>
                      <td className="admin-name">{r.name}</td>
                      <td><span className="admin-course-tag" style={{ fontSize: '0.75rem' }}>{r.category || '—'}</span></td>
                      <td style={{ fontSize: '0.8rem', color: 'var(--text-3)', maxWidth: '140px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.source || '—'}</td>
                      <td style={{ fontSize: '0.8rem', color: 'var(--text-3)' }}>{r.ingredients?.length ?? 0} nguyên liệu</td>
                      <td>
                        <button className={`course-toggle${r.active ? ' on' : ''}`} onClick={() => toggleChiaSeActive(r)} title={r.active ? 'Đang hiện' : 'Đang ẩn'}>
                          <i className={`ti ti-${r.active ? 'eye' : 'eye-off'}`}></i>
                        </button>
                      </td>
                      <td>
                        <button
                          className={`course-toggle${r.locked ? ' on' : ''}`}
                          style={r.locked ? { background: '#c0392b', borderColor: '#c0392b' } : {}}
                          onClick={() => toggleChiaSeLocked(r)}
                          title={r.locked ? 'Đang khóa — nhấn để mở khóa' : 'Đang mở — nhấn để khóa'}
                        >
                          <i className={`ti ti-${r.locked ? 'lock' : 'lock-open'}`}></i>
                        </button>
                      </td>
                      <td style={{ display: 'flex', gap: '4px' }}>
                        <button className="admin-edit-btn" onClick={() => startEditChiaSe(r)} title="Sửa"><i className="ti ti-pencil"></i></button>
                        <button className="admin-del-btn" onClick={() => deleteChiaSe(r.id)} disabled={deletingChiaSe === r.id} title="Xóa">
                          {deletingChiaSe === r.id ? <i className="ti ti-loader-2 spin"></i> : <i className="ti ti-trash"></i>}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* ======= HÌNH ẢNH TAB ======= */}
        {activeTab === 'hinh-anh' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '600px' }}>
            <div className="admin-add-card">
              <h3 className="admin-section-title"><i className="ti ti-certificate"></i> Trao Bằng</h3>
              <p style={{ color: 'var(--text-3)', fontSize: '0.875rem', marginBottom: '16px' }}>
                Fetch dữ liệu từ Lark Base, download ảnh và lưu vào Supabase Storage bucket <code>trao-bang</code>.
              </p>
              <button className="btn btn-primary" onClick={syncTraoBang} disabled={syncingTraoBang || syncingLopHoc}>
                {syncingTraoBang ? <><i className="ti ti-loader-2 spin"></i> Đang sync...</> : <><i className="ti ti-refresh"></i> Sync từ Lark</>}
              </button>
            </div>

            <div className="admin-add-card">
              <h3 className="admin-section-title"><i className="ti ti-school"></i> Lớp Học</h3>
              <p style={{ color: 'var(--text-3)', fontSize: '0.875rem', marginBottom: '16px' }}>
                Fetch dữ liệu từ Lark Base, download tất cả ảnh lớp học và lưu vào Supabase Storage bucket <code>lop-hoc</code>.
              </p>
              <button className="btn btn-primary" onClick={syncLopHoc} disabled={syncingTraoBang || syncingLopHoc}>
                {syncingLopHoc ? <><i className="ti ti-loader-2 spin"></i> Đang sync...</> : <><i className="ti ti-refresh"></i> Sync từ Lark</>}
              </button>
            </div>

            {syncMsg && (
              <div style={{ padding: '14px 18px', background: syncMsg.startsWith('✅') ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)', border: `1px solid ${syncMsg.startsWith('✅') ? 'rgba(34,197,94,0.3)' : 'rgba(239,68,68,0.3)'}`, borderRadius: 'var(--r)', fontSize: '0.9rem', fontWeight: 500 }}>
                {syncMsg}
              </div>
            )}

            <div style={{ padding: '14px 18px', background: 'rgba(176,90,16,0.06)', border: '1px solid rgba(176,90,16,0.2)', borderRadius: 'var(--r)', fontSize: '0.85rem', color: 'var(--text-2)' }}>
              <strong>⚠️ Lưu ý quota Lark API:</strong> Mỗi lần sync Trao Bằng tốn ~21 lượt, Lớp Học tốn nhiều hơn tùy số ảnh. Giới hạn 10.000 lượt/tháng. Chỉ sync khi cần thiết.
            </div>
          </div>
        )}

        {/* ======= VIDEOS TAB ======= */}
        {activeTab === 'videos' && (
          <>
            <div className="admin-add-card">
              <h3 className="admin-section-title"><i className="ti ti-brand-youtube"></i> Thêm Video YouTube</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-3)', margin: '0 0 16px', lineHeight: 1.6 }}>
                Dán link YouTube (youtube.com hoặc youtu.be). Video sẽ hiện trên trang{' '}
                <a href="/video" target="_blank" style={{ color: 'var(--accent)' }}>/video</a>.
              </p>
              <form className="admin-form" onSubmit={addVideo}>
                <div className="admin-form-grid">
                  <div className="af-group af-full">
                    <label>Nhóm video *</label>
                    <select value={videoForm.category} onChange={e => setVideoForm(f => ({ ...f, category: e.target.value }))} required>
                      {VIDEO_CATEGORIES.map(c => <option key={c.slug} value={c.slug}>{c.label}</option>)}
                    </select>
                  </div>
                  <div className="af-group af-full">
                    <label>Tiêu đề video</label>
                    <input type="text" placeholder="VD: Americano Bưởi - Thầy Liêm hướng dẫn" value={videoForm.title} onChange={e => setVideoForm(f => ({ ...f, title: e.target.value }))} />
                  </div>
                  <div className="af-group af-full">
                    <label>Link YouTube *</label>
                    <input type="url" placeholder="https://youtu.be/ABC123 hoặc https://www.youtube.com/watch?v=ABC123"
                      value={videoForm.youtubeUrl} onChange={e => setVideoForm(f => ({ ...f, youtubeUrl: e.target.value }))} required />
                  </div>
                </div>
                {videoError && <div className="f-error"><i className="ti ti-alert-circle"></i> {videoError}</div>}
                <button className="btn btn-primary" type="submit" disabled={addingVideo}>
                  {addingVideo ? <><i className="ti ti-loader-2 spin"></i> Đang lưu...</> : <><i className="ti ti-plus"></i> Thêm Video</>}
                </button>
              </form>
            </div>

            {videos.length === 0 ? (
              <div className="admin-empty" style={{ padding: 40, textAlign: 'center', color: 'var(--text-3)' }}>Chưa có video nào. Upload video ở trên để bắt đầu.</div>
            ) : (
              <>
                {VIDEO_CATEGORIES.map(cat => {
                  const catVideos = videos.filter(v => v.category === cat.slug);
                  if (!catVideos.length) return null;
                  return (
                    <div key={cat.slug} style={{ marginBottom: 32 }}>
                      <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 12, paddingBottom: 8, borderBottom: '1px solid var(--border)' }}>
                        {cat.label} <span style={{ fontWeight: 400 }}>({catVideos.length} video)</span>
                      </h4>
                      <div className="vd-admin-grid">
                        {catVideos.map(v => (
                          <div key={v.id} className={`vd-admin-card${v.active ? '' : ' inactive'}${editingVideoId === v.id ? ' editing' : ''}`}>
                            <div className="vd-admin-thumb">
                              {v.thumbnail_url
                                ? <img src={v.thumbnail_url} alt={v.title || 'Video'} loading="lazy" />
                                : <div style={{ width: '100%', height: '100%', background: 'var(--bg-dark)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><i className="ti ti-brand-youtube" style={{ fontSize: 28, color: '#ff0000' }}></i></div>
                              }
                              <span className="vd-admin-play-ico"><i className="ti ti-player-play-filled"></i></span>
                            </div>
                            <div className="vd-admin-body">
                              {editingVideoId === v.id ? (
                                <div className="vd-edit-form">
                                  <select value={editVideoForm.category} onChange={e => setEditVideoForm(f => ({ ...f, category: e.target.value }))} className="vd-edit-input">
                                    {VIDEO_CATEGORIES.map(c => <option key={c.slug} value={c.slug}>{c.label}</option>)}
                                  </select>
                                  <input type="text" placeholder="Tiêu đề" value={editVideoForm.title} onChange={e => setEditVideoForm(f => ({ ...f, title: e.target.value }))} className="vd-edit-input" />
                                  <input type="url" placeholder="Link YouTube mới (để trống nếu không đổi)" value={editVideoForm.youtubeUrl} onChange={e => setEditVideoForm(f => ({ ...f, youtubeUrl: e.target.value }))} className="vd-edit-input" />
                                  <div className="vd-edit-actions">
                                    <button className="btn btn-primary" style={{ fontSize: '0.8rem', padding: '6px 14px' }} onClick={() => saveVideoEdit(v)} disabled={savingVideo}>
                                      {savingVideo ? <i className="ti ti-loader-2 spin"></i> : <><i className="ti ti-check"></i> Lưu</>}
                                    </button>
                                    <button className="btn btn-outline" style={{ fontSize: '0.8rem', padding: '6px 14px' }} onClick={() => setEditingVideoId(null)}>Hủy</button>
                                  </div>
                                </div>
                              ) : (
                                <>
                                  <div className="vd-admin-title">{v.title || 'Video không tiêu đề'}</div>
                                  <div className="vd-admin-date"><i className="ti ti-calendar"></i> {new Date(v.created_at).toLocaleDateString('vi-VN')}</div>
                                  <div className="tt-admin-actions">
                                    <button className={`course-toggle${v.active ? ' on' : ''}`} onClick={() => toggleVideoActive(v)}>
                                      {v.active ? 'Đang hiện' : 'Đang ẩn'}
                                    </button>
                                    <button className="admin-edit-btn" onClick={() => startEditVideo(v)} title="Chỉnh sửa">
                                      <i className="ti ti-pencil"></i>
                                    </button>
                                    <button className="admin-del-btn" onClick={() => deleteVideo(v)} disabled={deletingVideo === v.id} title="Xóa">
                                      {deletingVideo === v.id ? <i className="ti ti-loader-2 spin"></i> : <i className="ti ti-trash"></i>}
                                    </button>
                                  </div>
                                </>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
                {/* Video chưa phân loại */}
                {(() => {
                  const known = VIDEO_CATEGORIES.map(c => c.slug);
                  const uncat = videos.filter(v => !known.includes(v.category as typeof VIDEO_CATEGORIES[number]['slug']));
                  if (!uncat.length) return null;
                  return (
                    <div style={{ marginBottom: 32 }}>
                      <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 12, paddingBottom: 8, borderBottom: '1px solid var(--border)' }}>
                        Chưa phân loại <span style={{ fontWeight: 400 }}>({uncat.length} video)</span>
                      </h4>
                      <div className="vd-admin-grid">
                        {uncat.map(v => (
                          <div key={v.id} className={`vd-admin-card${v.active ? '' : ' inactive'}`}>
                            <div className="vd-admin-thumb">
                              {v.thumbnail_url
                                ? <img src={v.thumbnail_url} alt={v.title || 'Video'} loading="lazy" />
                                : <div style={{ width: '100%', height: '100%', background: 'var(--bg-dark)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><i className="ti ti-brand-youtube" style={{ fontSize: 28, color: '#ff0000' }}></i></div>
                              }
                              <span className="vd-admin-play-ico"><i className="ti ti-player-play-filled"></i></span>
                            </div>
                            <div className="vd-admin-body">
                              <div className="vd-admin-title">{v.title || 'Video không tiêu đề'}</div>
                              <div className="vd-admin-date"><i className="ti ti-calendar"></i> {new Date(v.created_at).toLocaleDateString('vi-VN')}</div>
                              <div className="tt-admin-actions">
                                <button className={`course-toggle${v.active ? ' on' : ''}`} onClick={() => toggleVideoActive(v)}>
                                  {v.active ? 'Đang hiện' : 'Đang ẩn'}
                                </button>
                                <button className="admin-edit-btn" onClick={() => startEditVideo(v)} title="Chỉnh sửa">
                                  <i className="ti ti-pencil"></i>
                                </button>
                                <button className="admin-del-btn" onClick={() => deleteVideo(v)} disabled={deletingVideo === v.id} title="Xóa">
                                  {deletingVideo === v.id ? <i className="ti ti-loader-2 spin"></i> : <i className="ti ti-trash"></i>}
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })()}
              </>
            )}
          </>
        )}

        {/* ======= SERVICE VIDEOS TAB ======= */}
        {activeTab === 'service-videos' && (
          <>
            <div className="admin-add-card">
              <h3 className="admin-section-title"><i className="ti ti-brand-youtube"></i> Thêm Video Dịch Vụ</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-3)', margin: '0 0 16px', lineHeight: 1.6 }}>
                Video sẽ hiển thị trên trang chi tiết của dịch vụ tương ứng (ví dụ: <a href="/dich-vu/khoi-nghiep" target="_blank" style={{ color: 'var(--accent)' }}>/dich-vu/khoi-nghiep</a>).
              </p>
              <form className="admin-form" onSubmit={addServiceVideo}>
                <div className="admin-form-grid">
                  <div className="af-group af-full">
                    <label>Dịch Vụ *</label>
                    <select value={svForm.serviceSlug} onChange={e => setSvForm(f => ({ ...f, serviceSlug: e.target.value }))} required>
                      <option value="">— Chọn dịch vụ —</option>
                      {dichVuServices.map(s => <option key={s.slug} value={s.slug}>{s.name}</option>)}
                    </select>
                  </div>
                  <div className="af-group af-full">
                    <label>Tiêu đề video</label>
                    <input type="text" placeholder="VD: Buổi setup menu thực tế tại quán anh Tuấn" value={svForm.title} onChange={e => setSvForm(f => ({ ...f, title: e.target.value }))} />
                  </div>
                  <div className="af-group af-full">
                    <label>Link YouTube *</label>
                    <input type="url" placeholder="https://youtu.be/ABC123 hoặc https://www.youtube.com/watch?v=ABC123"
                      value={svForm.youtubeUrl} onChange={e => setSvForm(f => ({ ...f, youtubeUrl: e.target.value }))} required />
                  </div>
                </div>
                {svError && <div className="f-error"><i className="ti ti-alert-circle"></i> {svError}</div>}
                <button className="btn btn-primary" type="submit" disabled={addingSv}>
                  {addingSv ? <><i className="ti ti-loader-2 spin"></i> Đang lưu...</> : <><i className="ti ti-plus"></i> Thêm Video</>}
                </button>
              </form>
            </div>

            {serviceVideos.length === 0 ? (
              <div className="admin-empty" style={{ padding: 40, textAlign: 'center', color: 'var(--text-3)' }}>Chưa có video dịch vụ nào. Thêm video ở trên để bắt đầu.</div>
            ) : (
              <>
                {dichVuServices.map(s => {
                  const svs = serviceVideos.filter(v => v.service_slug === s.slug);
                  if (!svs.length) return null;
                  return (
                    <div key={s.slug} style={{ marginBottom: 32 }}>
                      <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 12, paddingBottom: 8, borderBottom: '1px solid var(--border)' }}>
                        {s.name} <span style={{ fontWeight: 400 }}>({svs.length} video)</span>
                      </h4>
                      <div className="vd-admin-grid">
                        {svs.map(v => (
                          <div key={v.id} className={`vd-admin-card${v.active ? '' : ' inactive'}${editingSvId === v.id ? ' editing' : ''}`}>
                            <div className="vd-admin-thumb">
                              {v.thumbnail_url
                                ? <img src={v.thumbnail_url} alt={v.title || 'Video'} loading="lazy" />
                                : <div style={{ width: '100%', height: '100%', background: 'var(--bg-dark)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><i className="ti ti-brand-youtube" style={{ fontSize: 28, color: '#ff0000' }}></i></div>
                              }
                              <span className="vd-admin-play-ico"><i className="ti ti-player-play-filled"></i></span>
                            </div>
                            <div className="vd-admin-body">
                              {editingSvId === v.id ? (
                                <div className="vd-edit-form">
                                  <select value={editSvForm.serviceSlug} onChange={e => setEditSvForm(f => ({ ...f, serviceSlug: e.target.value }))} className="vd-edit-input">
                                    {dichVuServices.map(s => <option key={s.slug} value={s.slug}>{s.name}</option>)}
                                  </select>
                                  <input type="text" placeholder="Tiêu đề" value={editSvForm.title} onChange={e => setEditSvForm(f => ({ ...f, title: e.target.value }))} className="vd-edit-input" />
                                  <input type="url" placeholder="Link YouTube mới (để trống nếu không đổi)" value={editSvForm.youtubeUrl} onChange={e => setEditSvForm(f => ({ ...f, youtubeUrl: e.target.value }))} className="vd-edit-input" />
                                  <div className="vd-edit-actions">
                                    <button className="btn btn-primary" style={{ fontSize: '0.8rem', padding: '6px 14px' }} onClick={() => saveSvEdit(v)} disabled={savingSv}>
                                      {savingSv ? <i className="ti ti-loader-2 spin"></i> : <><i className="ti ti-check"></i> Lưu</>}
                                    </button>
                                    <button className="btn btn-outline" style={{ fontSize: '0.8rem', padding: '6px 14px' }} onClick={() => setEditingSvId(null)}>Hủy</button>
                                  </div>
                                </div>
                              ) : (
                                <>
                                  <div className="vd-admin-title">{v.title || 'Video không tiêu đề'}</div>
                                  <div className="vd-admin-date"><i className="ti ti-calendar"></i> {new Date(v.created_at).toLocaleDateString('vi-VN')}</div>
                                  <div className="tt-admin-actions">
                                    <button className={`course-toggle${v.active ? ' on' : ''}`} onClick={() => toggleSvActive(v)}>
                                      {v.active ? 'Đang hiện' : 'Đang ẩn'}
                                    </button>
                                    <button className="admin-edit-btn" onClick={() => startEditSv(v)} title="Chỉnh sửa">
                                      <i className="ti ti-pencil"></i>
                                    </button>
                                    <button className="admin-del-btn" onClick={() => deleteServiceVideo(v)} disabled={deletingSv === v.id} title="Xóa">
                                      {deletingSv === v.id ? <i className="ti ti-loader-2 spin"></i> : <i className="ti ti-trash"></i>}
                                    </button>
                                  </div>
                                </>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </>
            )}
          </>
        )}

        {/* ======= ORDERS TAB ======= */}
        {activeTab === 'orders' && (() => {
          const ORDER_STATUS: Record<Order['status'], { label: string; cls: string }> = {
            pending:   { label: 'Mới',         cls: 'order-status-pending' },
            confirmed: { label: 'Đã xác nhận', cls: 'order-status-confirmed' },
            shipping:  { label: 'Đang giao',   cls: 'order-status-shipping' },
            done:      { label: 'Hoàn thành',  cls: 'order-status-done' },
            cancelled: { label: 'Đã hủy',      cls: 'order-status-cancelled' },
          };
          const filteredOrders = orders.filter(o =>
            !orderSearch ||
            o.customer_name.toLowerCase().includes(orderSearch.toLowerCase()) ||
            o.phone.includes(orderSearch)
          );
          return (
            <>
              <div className="admin-search-wrap">
                <i className="ti ti-search"></i>
                <input className="admin-search" type="text" placeholder="Tìm theo tên, SĐT..." value={orderSearch} onChange={e => setOrderSearch(e.target.value)} />
                {orderSearch && <button onClick={() => setOrderSearch('')} className="ct-search-clear"><i className="ti ti-x"></i></button>}
              </div>
              <div className="admin-table-wrap">
                <table className="admin-table">
                  <thead>
                    <tr><th>#</th><th>Khách hàng</th><th>SĐT</th><th>Sản phẩm</th><th>Tổng tiền</th><th>Ngày đặt</th><th>Trạng thái</th><th></th></tr>
                  </thead>
                  <tbody>
                    {filteredOrders.length === 0 ? (
                      <tr><td colSpan={8} className="admin-empty">Chưa có đơn hàng nào</td></tr>
                    ) : filteredOrders.map((o, i) => (
                      <>
                        <tr key={o.id} className={o.status === 'pending' ? 'lead-row-new' : ''}>
                          <td className="admin-num">{i + 1}</td>
                          <td className="admin-name">
                            <div>{o.customer_name}</div>
                            {o.address && <div style={{ fontSize: '0.75rem', color: 'var(--text-3)' }}>{o.address}</div>}
                          </td>
                          <td><a href={`tel:${o.phone}`} className="admin-phone">{o.phone}</a></td>
                          <td>
                            <button className="order-expand-btn" onClick={() => setExpandedOrder(expandedOrder === o.id ? null : o.id)}>
                              {o.items.length} sản phẩm <i className={`ti ti-chevron-${expandedOrder === o.id ? 'up' : 'down'}`}></i>
                            </button>
                          </td>
                          <td style={{ fontWeight: 700, color: 'var(--accent)', whiteSpace: 'nowrap' }}>{o.total.toLocaleString('vi-VN')}đ</td>
                          <td className="admin-date">{new Date(o.created_at).toLocaleDateString('vi-VN')}</td>
                          <td>
                            <select className={`lead-status-select ${ORDER_STATUS[o.status].cls}`} value={o.status} disabled={updatingOrder === o.id} onChange={e => updateOrderStatus(o.id, e.target.value as Order['status'])}>
                              <option value="pending">Mới</option>
                              <option value="confirmed">Đã xác nhận</option>
                              <option value="shipping">Đang giao</option>
                              <option value="done">Hoàn thành</option>
                              <option value="cancelled">Đã hủy</option>
                            </select>
                          </td>
                          <td>
                            <button className="admin-del-btn" onClick={() => deleteOrder(o.id)} disabled={deletingOrder === o.id} title="Xóa">
                              {deletingOrder === o.id ? <i className="ti ti-loader-2 spin"></i> : <i className="ti ti-trash"></i>}
                            </button>
                          </td>
                        </tr>
                        {expandedOrder === o.id && (
                          <tr key={`${o.id}-detail`}>
                            <td colSpan={8} style={{ padding: '0 16px 16px', background: 'rgba(176,90,16,0.03)' }}>
                              <div className="order-detail-wrap">
                                {o.items.map((item, idx) => (
                                  <div key={idx} className="order-detail-item">
                                    {item.image_url && <img src={item.image_url} alt={item.name} className="order-detail-img" />}
                                    <div className="order-detail-info">
                                      <span className="order-detail-name">{item.name}</span>
                                      <span className="order-detail-unit">{item.unit}</span>
                                    </div>
                                    <span className="order-detail-qty">x{item.quantity}</span>
                                    <span className="order-detail-price">{(item.price * item.quantity).toLocaleString('vi-VN')}đ</span>
                                  </div>
                                ))}
                                {o.notes && (
                                  <div style={{ marginTop: '10px', padding: '10px 12px', background: 'rgba(0,0,0,0.04)', borderRadius: '8px', fontSize: '0.85rem', color: 'var(--text-2)' }}>
                                    <strong>Ghi chú:</strong> {o.notes}
                                  </div>
                                )}
                              </div>
                            </td>
                          </tr>
                        )}
                      </>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          );
        })()}
          </div>
        </div>
      </div>
    </main>
  );
}

// ─── HVCP Form Component ─────────────────────────────────────────────────────
type HVCPFormData = Omit<CongThucHVCP, 'id'>;
function HVCPForm({
  form, setForm, error, saving, uploadingImg, fileRef, onSubmit, onCancel, submitLabel, onImageFile,
  products, prodFilterQ, setProdFilterQ, filteredProducts, toggleLinkedProduct,
}: {
  form: HVCPFormData; setForm: React.Dispatch<React.SetStateAction<HVCPFormData>>;
  error: string; saving: boolean; uploadingImg: boolean;
  fileRef: React.RefObject<HTMLInputElement | null>;
  onSubmit: (e: React.FormEvent) => void; onCancel: () => void; submitLabel: string;
  onImageFile: (f: File) => void;
  products: any[]; prodFilterQ: string; setProdFilterQ: (v: string) => void;
  filteredProducts: any[]; toggleLinkedProduct: (id: string) => void;
}) {
  return (
    <form className="admin-form" onSubmit={onSubmit}>
      <div className="admin-form-grid">
        <div className="af-group af-full"><label>Tên món *</label><input type="text" placeholder="VD: KOMBUCHA LỰU HỒNG NGỌC" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required /></div>
        <div className="af-group"><label>Phân loại</label><input type="text" placeholder="VD: Trà Trái Cây" value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} /></div>
        <div className="af-group"><label>Thứ tự hiển thị</label><input type="number" value={form.sort_order} onChange={e => setForm(f => ({ ...f, sort_order: Number(e.target.value) }))} /></div>

        <div className="af-group af-full">
          <label>Hình ảnh</label>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <input type="text" placeholder="URL ảnh..." value={form.photo_url} onChange={e => setForm(f => ({ ...f, photo_url: e.target.value }))} style={{ flex: 1 }} />
            <button type="button" className="btn btn-outline" style={{ whiteSpace: 'nowrap' }} disabled={uploadingImg} onClick={() => fileRef.current?.click()}>
              {uploadingImg ? <><i className="ti ti-loader-2 spin"></i> Upload...</> : <><i className="ti ti-upload"></i> Upload</>}
            </button>
            <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={e => { const f = e.target.files?.[0]; if (f) onImageFile(f); e.target.value = ''; }} />
          </div>
          {form.photo_url && (
            <div style={{ position: 'relative', display: 'inline-block', marginTop: '8px' }}>
              <img src={form.photo_url} alt="" style={{ height: '80px', borderRadius: '6px', objectFit: 'cover' }} />
              <button type="button" onClick={() => setForm(f => ({ ...f, photo_url: '' }))} style={{ position: 'absolute', top: '-6px', right: '-6px', background: '#c0392b', color: '#fff', border: 'none', borderRadius: '50%', width: '20px', height: '20px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px' }} title="Xóa ảnh"><i className="ti ti-x"></i></button>
            </div>
          )}
        </div>

        <div className="af-group af-full"><label>Hướng dẫn pha chế</label><textarea rows={5} placeholder="B1: ...&#10;B2: ..." value={form.instructions} onChange={e => setForm(f => ({ ...f, instructions: e.target.value }))} /></div>
        <div className="af-group af-full"><label>Công thức (nguyên liệu + định lượng)</label><textarea rows={5} placeholder="1. Siro lựu COLOMIX: 35ml&#10;2. Lục trà: 40ml" value={form.recipe_text} onChange={e => setForm(f => ({ ...f, recipe_text: e.target.value }))} /></div>

        <div className="af-group af-full">
          <label>Nguyên liệu bán kèm ({form.linked_product_ids.length} đã chọn)</label>
          <input type="text" placeholder="Tìm nguyên liệu..." value={prodFilterQ} onChange={e => setProdFilterQ(e.target.value)} style={{ marginBottom: '8px' }} />
          <div style={{ border: '1px solid var(--border)', borderRadius: 'var(--r)', maxHeight: '200px', overflowY: 'auto', padding: '4px 0' }}>
            {filteredProducts.length === 0 ? (
              <p style={{ padding: '12px 16px', color: 'var(--text-3)', fontSize: '0.875rem' }}>Không tìm thấy</p>
            ) : filteredProducts.map((p: any) => (
              <label key={p.id} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 12px', cursor: 'pointer', background: form.linked_product_ids.includes(p.id) ? 'rgba(176,90,16,0.06)' : 'transparent', borderBottom: '1px solid var(--border)' }}>
                <input type="checkbox" checked={form.linked_product_ids.includes(p.id)} onChange={() => toggleLinkedProduct(p.id)} style={{ accentColor: 'var(--accent)', flexShrink: 0 }} />
                {p.image_url && <img src={p.image_url} alt="" style={{ width: '32px', height: '32px', objectFit: 'cover', borderRadius: '4px', flexShrink: 0 }} />}
                <span style={{ fontSize: '0.875rem' }}>{p.name}</span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-3)', marginLeft: 'auto' }}>{p.unit}</span>
              </label>
            ))}
          </div>
          {form.linked_product_ids.length > 0 && (
            <div style={{ marginTop: '8px', display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {form.linked_product_ids.map((id: string) => {
                const p = products.find((x: any) => x.id === id);
                return p ? (
                  <span key={id} style={{ background: 'var(--accent)', color: '#fff', padding: '2px 8px', borderRadius: '999px', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    {p.name}
                    <button type="button" onClick={() => toggleLinkedProduct(id)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', padding: '0', lineHeight: 1, fontSize: '0.9em' }}>✕</button>
                  </span>
                ) : null;
              })}
            </div>
          )}
        </div>

        <div className="af-group">
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
            <input type="checkbox" checked={form.active} onChange={e => setForm(f => ({ ...f, active: e.target.checked }))} />
            Hiển thị công khai
          </label>
        </div>
        <div className="af-group">
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
            <input type="checkbox" checked={form.locked} onChange={e => setForm(f => ({ ...f, locked: e.target.checked }))} style={{ accentColor: '#c0392b' }} />
            <span style={{ color: form.locked ? '#c0392b' : 'inherit' }}>
              <i className="ti ti-lock" style={{ marginRight: '4px' }}></i>
              Khóa công thức (ẩn chi tiết & ảnh với người dùng)
            </span>
          </label>
        </div>
      </div>
      {error && <div className="lf-error" style={{ marginBottom: '12px' }}><i className="ti ti-alert-circle"></i> {error}</div>}
      <div style={{ display: 'flex', gap: '10px' }}>
        <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? <><i className="ti ti-loader-2 spin"></i> Đang lưu...</> : <><i className="ti ti-check"></i> {submitLabel}</>}</button>
        <button type="button" className="btn btn-outline" onClick={onCancel}>Hủy</button>
      </div>
    </form>
  );
}

// ─── ChiaSe Form Component ───────────────────────────────────────────────────
type ChiaSeFormData = Omit<ChiaSeRecipe, 'id'>;
const BLANK_ING: ChiaSeIngredient = { name: '', shopLink: '' };

function ChiaSeForm({
  form, setForm, error, saving, uploadingImg, fileRef, onSubmit, onCancel, submitLabel, onImageFile,
}: {
  form: ChiaSeFormData; setForm: React.Dispatch<React.SetStateAction<ChiaSeFormData>>;
  error: string; saving: boolean; uploadingImg: boolean;
  fileRef: React.RefObject<HTMLInputElement | null>;
  onSubmit: (e: React.FormEvent) => void; onCancel: () => void; submitLabel: string;
  onImageFile: (f: File) => void;
}) {
  const addIng = () => setForm(f => ({ ...f, ingredients: [...f.ingredients, { ...BLANK_ING }] }));
  const removeIng = (i: number) => setForm(f => ({ ...f, ingredients: f.ingredients.filter((_, idx) => idx !== i) }));
  const updateIng = (i: number, field: keyof ChiaSeIngredient, val: string) =>
    setForm(f => ({ ...f, ingredients: f.ingredients.map((ing, idx) => idx === i ? { ...ing, [field]: val } : ing) }));

  return (
    <form className="admin-form" onSubmit={onSubmit}>
      <div className="admin-form-grid">
        <div className="af-group af-full"><label>Tên món đầy đủ *</label><input type="text" placeholder="VD: BROWN SUGAR BOBA MILK TEA" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required /></div>
        <div className="af-group"><label>Tên ngắn (hiển thị card)</label><input type="text" placeholder="VD: BROWN SUGAR BOBA" value={form.short_name} onChange={e => setForm(f => ({ ...f, short_name: e.target.value }))} /></div>
        <div className="af-group"><label>Phân loại</label><input type="text" placeholder="VD: Trà sữa / Latte / Cafe" value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} /></div>
        <div className="af-group"><label>Nguồn / tác giả</label><input type="text" placeholder="VD: @boba.trend.vn" value={form.source} onChange={e => setForm(f => ({ ...f, source: e.target.value }))} /></div>
        <div className="af-group"><label>Thứ tự hiển thị</label><input type="number" value={form.sort_order} onChange={e => setForm(f => ({ ...f, sort_order: Number(e.target.value) }))} /></div>

        <div className="af-group af-full">
          <label>Hình ảnh</label>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <input type="text" placeholder="URL ảnh..." value={form.image_url} onChange={e => setForm(f => ({ ...f, image_url: e.target.value }))} style={{ flex: 1 }} />
            <button type="button" className="btn btn-outline" style={{ whiteSpace: 'nowrap' }} disabled={uploadingImg} onClick={() => fileRef.current?.click()}>
              {uploadingImg ? <><i className="ti ti-loader-2 spin"></i> Upload...</> : <><i className="ti ti-upload"></i> Upload</>}
            </button>
            <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={e => { const f = e.target.files?.[0]; if (f) onImageFile(f); e.target.value = ''; }} />
          </div>
          {form.image_url && (
            <div style={{ position: 'relative', display: 'inline-block', marginTop: '8px' }}>
              <img src={form.image_url} alt="" style={{ height: '80px', borderRadius: '6px', objectFit: 'cover' }} />
              <button type="button" onClick={() => setForm(f => ({ ...f, image_url: '' }))} style={{ position: 'absolute', top: '-6px', right: '-6px', background: '#c0392b', color: '#fff', border: 'none', borderRadius: '50%', width: '20px', height: '20px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px' }} title="Xóa ảnh"><i className="ti ti-x"></i></button>
            </div>
          )}
        </div>

        <div className="af-group af-full"><label>Hướng dẫn pha chế</label><textarea rows={6} placeholder="B1: ...&#10;B2: ..." value={form.steps} onChange={e => setForm(f => ({ ...f, steps: e.target.value }))} /></div>

        <div className="af-group af-full">
          <label>Nguyên liệu ({form.ingredients.length})</label>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '8px' }}>
            {form.ingredients.map((ing, i) => (
              <div key={i} style={{ display: 'grid', gridTemplateColumns: '2fr 2fr 36px', gap: '6px', alignItems: 'center', padding: '8px', background: 'var(--bg-alt)', borderRadius: 'var(--r)', border: '1px solid var(--border)' }}>
                <input type="text" placeholder="Tên nguyên liệu" value={ing.name} onChange={e => updateIng(i, 'name', e.target.value)} style={{ fontSize: '0.82rem' }} />
                <input type="text" placeholder="Link Shopee" value={ing.shopLink} onChange={e => updateIng(i, 'shopLink', e.target.value)} style={{ fontSize: '0.82rem' }} />
                <button type="button" className="admin-del-btn" onClick={() => removeIng(i)} style={{ width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <i className="ti ti-trash"></i>
                </button>
              </div>
            ))}
            {form.ingredients.length === 0 && (
              <p style={{ color: 'var(--muted)', fontSize: '0.82rem', padding: '8px 0' }}>Chưa có nguyên liệu — nhấn "+ Thêm nguyên liệu" để bắt đầu</p>
            )}
          </div>
          <button type="button" className="btn btn-outline" style={{ fontSize: '0.8rem', padding: '6px 14px' }} onClick={addIng}>
            <i className="ti ti-plus"></i> Thêm nguyên liệu
          </button>
        </div>

        <div className="af-group">
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
            <input type="checkbox" checked={form.active} onChange={e => setForm(f => ({ ...f, active: e.target.checked }))} />
            Hiển thị công khai
          </label>
        </div>
        <div className="af-group">
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
            <input type="checkbox" checked={form.locked} onChange={e => setForm(f => ({ ...f, locked: e.target.checked }))} style={{ accentColor: '#c0392b' }} />
            <span style={{ color: form.locked ? '#c0392b' : 'inherit' }}>
              <i className="ti ti-lock" style={{ marginRight: '4px' }}></i>
              Khóa công thức (ẩn chi tiết & ảnh với người dùng)
            </span>
          </label>
        </div>
      </div>

      {error && <div className="lf-error" style={{ marginBottom: '12px' }}><i className="ti ti-alert-circle"></i> {error}</div>}
      <div style={{ display: 'flex', gap: '10px' }}>
        <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? <><i className="ti ti-loader-2 spin"></i> Đang lưu...</> : <><i className="ti ti-check"></i> {submitLabel}</>}</button>
        <button type="button" className="btn btn-outline" onClick={onCancel}>Hủy</button>
      </div>
    </form>
  );
}

// ─── Recipe Form Component ────────────────────────────────────────────────────
type RecipeFormData = { name: string; category: string; photo_url: string; instructions: string; total_cost: number | null; recipe_text: string; linked_product_ids: string[]; courses: string[]; sort_order: number; };
function RecipeForm({
  form, setForm, error, saving, uploadingImg, fileRef, onSubmit, onCancel, submitLabel,
  products, prodFilterQ, setProdFilterQ, filteredProducts, toggleLinkedProduct, onImageFile, courses,
}: {
  form: RecipeFormData; setForm: React.Dispatch<React.SetStateAction<RecipeFormData>>;
  error: string; saving: boolean; uploadingImg: boolean;
  fileRef: React.RefObject<HTMLInputElement | null>;
  onSubmit: (e: React.FormEvent) => void; onCancel: () => void; submitLabel: string;
  products: any[]; prodFilterQ: string; setProdFilterQ: (v: string) => void;
  filteredProducts: any[]; toggleLinkedProduct: (id: string) => void;
  onImageFile: (f: File) => void; courses: string[];
}) {
  return (
    <form className="admin-form" onSubmit={onSubmit}>
      <div className="admin-form-grid">
        {/* Tên + Phân loại */}
        <div className="af-group af-full"><label>Tên món *</label><input type="text" placeholder="VD: MATCHA ĐẬU ĐỎ" value={form.name} onChange={e => setForm((f: RecipeFormData) => ({ ...f, name: e.target.value }))} required /></div>
        <div className="af-group"><label>Phân loại</label><input type="text" placeholder="VD: Kombucha Soda" value={form.category} onChange={e => setForm((f: RecipeFormData) => ({ ...f, category: e.target.value }))} /></div>
        <div className="af-group"><label>Tổng cost (VNĐ)</label><input type="number" placeholder="8500" value={form.total_cost ?? ''} onChange={e => setForm((f: RecipeFormData) => ({ ...f, total_cost: e.target.value ? Number(e.target.value) : null }))} /></div>
        <div className="af-group"><label>Thứ tự hiển thị</label><input type="number" value={form.sort_order} onChange={e => setForm((f: RecipeFormData) => ({ ...f, sort_order: Number(e.target.value) }))} /></div>

        {/* Ảnh */}
        <div className="af-group af-full">
          <label>Hình ảnh</label>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <input type="text" placeholder="URL ảnh..." value={form.photo_url} onChange={e => setForm((f: RecipeFormData) => ({ ...f, photo_url: e.target.value }))} style={{ flex: 1 }} />
            <button type="button" className="btn btn-outline" style={{ whiteSpace: 'nowrap' }} disabled={uploadingImg} onClick={() => fileRef.current?.click()}>
              {uploadingImg ? <><i className="ti ti-loader-2 spin"></i> Upload...</> : <><i className="ti ti-upload"></i> Upload</>}
            </button>
            <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={e => { const f = e.target.files?.[0]; if (f) onImageFile(f); e.target.value = ''; }} />
          </div>
          {form.photo_url && (
            <div style={{ position: 'relative', display: 'inline-block', marginTop: '8px' }}>
              <img src={form.photo_url} alt="" style={{ height: '80px', borderRadius: '6px', objectFit: 'cover' }} />
              <button type="button" onClick={() => setForm((f: RecipeFormData) => ({ ...f, photo_url: '' }))} style={{ position: 'absolute', top: '-6px', right: '-6px', background: '#c0392b', color: '#fff', border: 'none', borderRadius: '50%', width: '20px', height: '20px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px' }} title="Xóa ảnh"><i className="ti ti-x"></i></button>
            </div>
          )}
        </div>

        {/* Hướng dẫn */}
        <div className="af-group af-full"><label>Hướng dẫn pha chế</label><textarea rows={5} placeholder="B1: ...&#10;B2: ..." value={form.instructions} onChange={e => setForm((f: RecipeFormData) => ({ ...f, instructions: e.target.value }))} /></div>

        {/* Công thức */}
        <div className="af-group af-full"><label>Công thức (nguyên liệu + định lượng)</label><textarea rows={6} placeholder="1. Sữa tươi HAPPY BARN: 120 ml&#10;2. Bột matcha Bạch Dương: 3 gram" value={form.recipe_text} onChange={e => setForm((f: RecipeFormData) => ({ ...f, recipe_text: e.target.value }))} /></div>

        {/* Khóa học */}
        <div className="af-group af-full">
          <label>Khóa học áp dụng</label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '4px' }}>
            {courses.map(c => (
              <label key={c} style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontSize: '0.875rem' }}>
                <input type="checkbox" checked={form.courses.includes(c)} onChange={e => setForm((f: RecipeFormData) => ({ ...f, courses: e.target.checked ? [...f.courses, c] : f.courses.filter((x: string) => x !== c) }))} style={{ accentColor: 'var(--accent)' }} />
                {c}
              </label>
            ))}
          </div>
        </div>

        {/* Nguyên liệu (multi-select) */}
        <div className="af-group af-full">
          <label>Nguyên liệu sử dụng ({form.linked_product_ids.length} đã chọn)</label>
          <input type="text" placeholder="Tìm nguyên liệu..." value={prodFilterQ} onChange={e => setProdFilterQ(e.target.value)} style={{ marginBottom: '8px' }} />
          <div style={{ border: '1px solid var(--border)', borderRadius: 'var(--r)', maxHeight: '220px', overflowY: 'auto', padding: '4px 0' }}>
            {filteredProducts.length === 0 ? (
              <p style={{ padding: '12px 16px', color: 'var(--text-3)', fontSize: '0.875rem' }}>Không tìm thấy</p>
            ) : filteredProducts.map(p => (
              <label key={p.id} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 12px', cursor: 'pointer', background: form.linked_product_ids.includes(p.id) ? 'rgba(176,90,16,0.06)' : 'transparent', borderBottom: '1px solid var(--border)' }}>
                <input type="checkbox" checked={form.linked_product_ids.includes(p.id)} onChange={() => toggleLinkedProduct(p.id)} style={{ accentColor: 'var(--accent)', flexShrink: 0 }} />
                {p.image_url && <img src={p.image_url} alt="" style={{ width: '32px', height: '32px', objectFit: 'cover', borderRadius: '4px', flexShrink: 0 }} />}
                <span style={{ fontSize: '0.875rem' }}>{p.name}</span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-3)', marginLeft: 'auto' }}>{p.unit}</span>
              </label>
            ))}
          </div>
          {form.linked_product_ids.length > 0 && (
            <div style={{ marginTop: '8px', display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {form.linked_product_ids.map(id => {
                const p = products.find((x: any) => x.id === id);
                return p ? (
                  <span key={id} style={{ background: 'var(--accent)', color: '#fff', padding: '2px 8px', borderRadius: '999px', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    {p.name}
                    <button type="button" onClick={() => toggleLinkedProduct(id)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', padding: '0', lineHeight: 1, fontSize: '0.9em' }}>✕</button>
                  </span>
                ) : null;
              })}
            </div>
          )}
        </div>
      </div>

      {error && <div className="lf-error" style={{ marginBottom: '12px' }}><i className="ti ti-alert-circle"></i> {error}</div>}
      <div style={{ display: 'flex', gap: '10px' }}>
        <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? <><i className="ti ti-loader-2 spin"></i> Đang lưu...</> : <><i className="ti ti-check"></i> {submitLabel}</>}</button>
        <button type="button" className="btn btn-outline" onClick={onCancel}>Hủy</button>
      </div>
    </form>
  );
}
