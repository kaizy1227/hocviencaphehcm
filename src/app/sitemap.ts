import type { MetadataRoute } from 'next';

const BASE = 'https://hocviencaphehcm-next.vercel.app';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: `${BASE}/`,
      lastModified: new Date('2026-06-15'),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${BASE}/gioi-thieu`,
      lastModified: new Date('2026-06-15'),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${BASE}/cong-thuc`,
      lastModified: new Date('2026-06-15'),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
  ];
}
