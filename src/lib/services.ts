export const SERVICES = [
  {
    slug: 'khoi-nghiep',
    name: 'Khóa Khởi Nghiệp',
    img: 'khoi-nghiep-v2.png',
    price: '4.000.000đ',
    desc: 'Nền tảng mở quán, quản lý chi phí, vận hành hiệu quả — 1 ngày (2 buổi). Hỗ trợ online 1 tháng sau khai trương.',
    detail: 'Khóa học 1 ngày dành cho người muốn mở quán cà phê, trà sữa. Bạn sẽ được trang bị toàn bộ kiến thức nền tảng: từ lập kế hoạch kinh doanh, tính giá thành sản phẩm, quản lý chi phí đến vận hành quán hiệu quả ngay từ ngày đầu.',
  },
  {
    slug: 'setup-menu',
    name: 'Gói Set Up Menu',
    img: 'setup-menu-7tr.png',
    price: '7.000.000đ',
    desc: 'Menu nhỏ gọn dưới 10 món: xây dựng 2–3 signature, thiết kế menu, hướng dẫn cost, tư vấn thiết bị và test món 2 lần.',
    detail: 'Giải pháp menu tinh gọn, hiệu quả cho quán mới hoặc quán muốn làm lại menu. Chúng tôi xây dựng 2–3 món signature độc quyền, thiết kế menu chuyên nghiệp, tính cost từng món và hỗ trợ test món 2 buổi thực tế.',
  },
  {
    slug: 'setup-menu-15',
    name: 'Setup Menu 15–20 Món',
    img: 'setup-menu-15-20-mon.png',
    price: '15.000.000đ',
    desc: 'Menu độc quyền 15–20 món: 3–5 signature, tính cost toàn bộ, tư vấn nguyên liệu & thiết bị, test món 2 buổi tại Học Viện.',
    detail: 'Gói menu toàn diện cho quán muốn có thực đơn phong phú, bài bản. 15–20 món được xây dựng độc quyền, bao gồm 3–5 signature nổi bật, cost toàn bộ nguyên vật liệu, tư vấn thiết bị phù hợp và 2 buổi test món trực tiếp tại Học Viện.',
  },
  {
    slug: 'dao-tao-van-hanh',
    name: 'Đào Tạo Vận Hành',
    img: 'dao-tao-van-hanh-v2.png',
    price: '15.000.000đ',
    desc: 'Vận hành chuẩn, quản trị chặt: xây dựng chính sách, quản lý nhân sự, kiểm soát chi phí & doanh thu. Hỗ trợ online 1 tháng sau khai trương.',
    detail: 'Dành cho chủ quán muốn xây dựng hệ thống vận hành bài bản. Bao gồm: xây dựng quy trình & chính sách nội bộ, quản lý nhân sự, kiểm soát chi phí và doanh thu. Hỗ trợ online 1 tháng sau khi khai trương.',
  },
  {
    slug: 'dao-tao-tai-quan',
    name: 'Đào Tạo Tại Quán',
    img: 'dao-tao-tai-quan.png',
    price: 'Từ 2.300.000đ/ngày',
    desc: 'Giảng viên đến trực tiếp quán đào tạo nhân viên pha chế, thiết lập quy trình bar & hỗ trợ sắp xếp thiết bị phù hợp với thực tế quán.',
    detail: 'Giảng viên đến tận quán, làm việc trực tiếp trên không gian thực tế của bạn. Đào tạo nhân viên pha chế, thiết lập quy trình bar chuẩn, sắp xếp thiết bị hợp lý và hướng dẫn kiểm soát nguyên liệu tại chỗ.',
  },
] as const;

export type ServiceSlug = typeof SERVICES[number]['slug'];
export type Service = typeof SERVICES[number];

export function getService(slug: string) {
  return SERVICES.find(s => s.slug === slug) ?? null;
}
