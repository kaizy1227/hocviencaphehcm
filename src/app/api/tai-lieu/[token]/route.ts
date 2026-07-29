import { NextRequest, NextResponse } from 'next/server';
import { createClient as sbClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

const getSb = () => sbClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

export async function GET(_req: NextRequest, ctx: { params: Promise<{ token: string }> }) {
  try {
    const { token } = await ctx.params;
    if (!token) return NextResponse.json({ error: 'not-found' }, { status: 404 });

    const sb = getSb();

    const { data: link } = await sb
      .from('course_doc_links')
      .select('token, course, title, active')
      .eq('token', token)
      .maybeSingle();

    if (!link || !link.active) {
      return NextResponse.json({ error: 'not-found' }, { status: 404 });
    }

    // Công thức thuộc khóa này
    const { data: recipes } = await sb
      .from('cong_thuc')
      .select('id, name, category, photo_url, instructions, total_cost, recipe_text')
      .contains('courses', [link.course])
      .order('sort_order')
      .order('created_at');

    const recipeList = recipes ?? [];
    const ids = recipeList.map(r => r.id);

    // Định lượng + giá vốn từng món
    let itemsByRecipe: Record<string, any[]> = {};
    if (ids.length) {
      const { data: items } = await sb
        .from('recipe_ingredient_items')
        .select('id, recipe_id, source, name, quantity, unit, cost_per_unit')
        .in('recipe_id', ids)
        .order('created_at');
      for (const it of items ?? []) {
        (itemsByRecipe[it.recipe_id] ??= []).push(it);
      }
    }

    // Tăng lượt xem (không chặn response)
    void (async () => {
      const { data: cur } = await sb.from('course_doc_links').select('view_count').eq('token', token).maybeSingle();
      await sb.from('course_doc_links').update({ view_count: (cur?.view_count ?? 0) + 1 }).eq('token', token);
    })();

    return NextResponse.json({
      title: link.title || link.course,
      course: link.course,
      recipes: recipeList.map(r => ({ ...r, items: itemsByRecipe[r.id] ?? [] })),
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
