import { NextResponse } from 'next/server';

// Cache the crawl result for 1 hour (ISR-style)
export const revalidate = 3600;

const SOURCE_URL = 'https://hocviencaphe.vn/kinh-nghiem/';

type Article = {
  title: string;
  url: string;
  image: string;
  date: string;
};

// Decode the common HTML entities WordPress emits in titles
function decodeEntities(s: string): string {
  return s
    .replace(/&#8211;/g, '–')
    .replace(/&#8212;/g, '—')
    .replace(/&#8220;/g, '“')
    .replace(/&#8221;/g, '”')
    .replace(/&#8216;/g, '‘')
    .replace(/&#8217;/g, '’')
    .replace(/&#8230;/g, '…')
    .replace(/&#038;|&amp;/g, '&')
    .replace(/&#039;|&apos;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&nbsp;/g, ' ')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/\s+/g, ' ')
    .trim();
}

function parseArticles(html: string, limit: number): Article[] {
  const articles: Article[] = [];
  // Each post starts with <article id="post-XXXX"
  const blocks = html.split(/<article id="post-\d+"/i).slice(1);

  for (const block of blocks) {
    if (articles.length >= limit) break;

    const titleMatch = block.match(
      /<h2 class="entry-title"><a href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/i
    );
    if (!titleMatch) continue;

    const url = titleMatch[1];
    const title = decodeEntities(titleMatch[2].replace(/<[^>]+>/g, ''));

    // Featured image: src appears before the wp-post-image class on the img tag
    const imgMatch = block.match(
      /<img[^>]*\bsrc="([^"]+)"[^>]*\bclass="[^"]*wp-post-image[^"]*"/i
    );
    const image = imgMatch ? imgMatch[1] : '';

    // Published date (visible text)
    const dateMatch = block.match(
      /<time class="entry-date published"[^>]*>([\s\S]*?)<\/time>/i
    );
    const date = dateMatch ? decodeEntities(dateMatch[1]) : '';

    articles.push({ title, url, image, date });
  }

  return articles;
}

export async function GET() {
  try {
    const res = await fetch(SOURCE_URL, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36',
      },
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      return NextResponse.json({ articles: [] }, { status: 200 });
    }

    const html = await res.text();
    const articles = parseArticles(html, 4);

    return NextResponse.json({ articles });
  } catch (err) {
    console.error('[kinh-nghiem] crawl failed:', err);
    return NextResponse.json({ articles: [] }, { status: 200 });
  }
}
