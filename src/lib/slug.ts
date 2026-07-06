export function slugify(str: string): string {
  return str
    .replace(/đ/g, 'd').replace(/Đ/g, 'D')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

/** Build a slug <-> item index from a list, deduping collisions with -2, -3, ... */
export function buildSlugIndex<T extends { id: string }>(items: T[], getName: (item: T) => string) {
  const bySlug = new Map<string, T>();
  const byId = new Map<string, string>();
  const counts = new Map<string, number>();
  for (const item of items) {
    const base = slugify(getName(item)) || 'cong-thuc';
    const n = (counts.get(base) ?? 0) + 1;
    counts.set(base, n);
    const slug = n === 1 ? base : `${base}-${n}`;
    bySlug.set(slug, item);
    byId.set(item.id, slug);
  }
  return { bySlug, byId };
}
