import { NextResponse } from 'next/server';
import { fetchLarkRecipes } from '@/lib/lark';

export const dynamic = 'force-dynamic';

export async function GET() {
  if (!process.env.LARK_APP_ID) {
    return NextResponse.json({ recipes: [] });
  }
  try {
    const recipes = await fetchLarkRecipes();
    return NextResponse.json({ recipes });
  } catch (err: any) {
    console.error('[lark-recipes]', err);
    return NextResponse.json({ error: err.message, recipes: [] }, { status: 500 });
  }
}
