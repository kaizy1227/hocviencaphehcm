import type { MetadataRoute } from 'next';

const BASE = 'https://hocviencaphehcm-next.vercel.app';

const TODAY = new Date('2026-06-23');

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `${BASE}/`,             lastModified: TODAY, changeFrequency: 'weekly',  priority: 1.0 },
    { url: `${BASE}/gioi-thieu`,   lastModified: TODAY, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE}/khoa-hoc`,     lastModified: TODAY, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE}/dich-vu`,      lastModified: TODAY, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE}/nguyen-lieu`,  lastModified: TODAY, changeFrequency: 'weekly',  priority: 0.9 },
    { url: `${BASE}/dung-cu`,      lastModified: TODAY, changeFrequency: 'weekly',  priority: 0.9 },
    { url: `${BASE}/cong-thuc`,    lastModified: TODAY, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE}/kho-cong-thuc`,lastModified: TODAY, changeFrequency: 'weekly',  priority: 0.7 },
    { url: `${BASE}/lien-he`,             lastModified: TODAY, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE}/hinh-anh/trao-bang`, lastModified: TODAY, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE}/hinh-anh/lop-hoc`,   lastModified: TODAY, changeFrequency: 'monthly', priority: 0.5 },
  ];
}
