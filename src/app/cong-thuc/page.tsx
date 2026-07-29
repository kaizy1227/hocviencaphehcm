'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import s from './cost.module.css';

/* ─── Types ─── */
type Ing     = { id: string; name: string; unit: string; cost_per_unit: number | null; image_url?: string | null; source: 'hvcp' | 'external'; custom?: boolean; quantity_per_pack?: number | null; price_per_pack?: number | null };
type IngRow  = { key: string; name: string; unit: string; cost_per_unit: number | null; quantity: number; image_url?: string | null };
type Drink   = { id: string; name: string; rows: IngRow[]; totalCost: number; sellingPrice: number };
type RecipeItem = { source: string; name: string; quantity: number; unit: string; cost_per_unit: number };
type Recipe  = { id: string; name: string; category: string; photo_url: string; total_cost: number | null; courses: string[]; items: RecipeItem[] };

const fmt = (n: number) => Math.round(n).toLocaleString('vi-VN') + 'đ';
const UNITS = ['g', 'ml', 'viên', 'cái', 'gói', 'muỗng', 'lít', 'kg', 'lát', 'lá'];

/* 1g lá trà pha ra ~30ml trà → cost trà tính theo đ/ml trà pha, không phải đ/g lá thô. */
const TEA_BREW_RATIO = 30;
const isTea = (category?: string | null) => /trà/i.test(String(category || ''));

/* Tự tính đơn giá NL HVCP = giá bán ÷ quy cách (parse "Chai 750ml", "Túi 1kg"...).
   Nguyên liệu Trà: tự quy đổi sang đ/ml trà pha (÷30). Ưu tiên cost_per_unit nếu admin ghi đè. */
function internalCost(p: { unit?: string | null; price?: number | null; cost_per_unit?: number | null; category?: string | null }): { cost: number; unit: string; base: number } | null {
  const baseUnitOf = (u: string) => /ml|lít|lit|\bl\b/i.test(u) ? 'ml' : 'g';
  const tea = isTea(p.category);
  if (p.cost_per_unit != null) return { cost: Number(p.cost_per_unit), unit: tea ? 'ml' : (p.unit ? baseUnitOf(p.unit) : 'g'), base: 0 };
  const m = String(p.unit || '').match(/([\d.,]+)\s*(kg|ml|l|g)\b/i);
  const num = m ? parseFloat(m[1].replace(',', '.')) : 0;
  if (!m || !num || !p.price) return null;
  const u = m[2].toLowerCase();
  let base = (u === 'kg' || u === 'l') ? num * 1000 : num;
  let baseUnit = (u === 'kg' || u === 'g') ? 'g' : 'ml';
  let cost = Number(p.price) / base;
  if (tea && baseUnit === 'g') { cost = cost / TEA_BREW_RATIO; baseUnit = 'ml'; base = base * TEA_BREW_RATIO; }
  return { cost, unit: baseUnit, base };
}

/* ─── Export Excel (client-side, no server) ─── */
async function exportExcel(drinks: Drink[]) {
  const XLSX = await import('xlsx');
  const wb   = XLSX.utils.book_new();

  const sumData = [
    ['Tên Món', 'Giá Vốn/Ly', 'Giá Bán', 'Lợi Nhuận', 'Biên LN (%)'],
    ...drinks.map(d => [
      d.name, d.totalCost, d.sellingPrice, d.sellingPrice - d.totalCost,
      d.sellingPrice > 0 ? +((d.sellingPrice - d.totalCost) / d.sellingPrice * 100).toFixed(1) : '',
    ]),
  ];
  XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(sumData), 'Tổng Hợp');

  drinks.forEach(d => {
    const rows = [
      ['Nguyên liệu', 'Đơn vị', 'Đơn giá (đ/đv)', 'Số lượng', 'Thành tiền'],
      ...d.rows.filter(r => r.quantity > 0).map(r => [
        r.name, r.unit, r.cost_per_unit ?? '', r.quantity,
        r.cost_per_unit != null ? r.cost_per_unit * r.quantity : '',
      ]),
      [],
      ['Giá vốn/ly', '', '', '', d.totalCost],
      ['Giá bán',    '', '', '', d.sellingPrice],
      ['Lợi nhuận',  '', '', '', d.sellingPrice - d.totalCost],
    ];
    const sheetName = d.name.slice(0, 31).replace(/[\\/*?[\]]/g, '');
    XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(rows), sheetName || `Món ${drinks.indexOf(d)+1}`);
  });

  XLSX.writeFile(wb, `Cost_Menu_${new Date().toLocaleDateString('vi-VN').replace(/\//g, '-')}.xlsx`);
}

export default function CongThucPage() {
  const [tab, setTab] = useState<'calc' | 'ingredients' | 'recipes'>('calc');

  /* Data */
  const [hvcpList, setHvcpList]   = useState<Ing[]>([]);
  const [extList, setExtList]     = useState<Ing[]>([]);
  const [sessionExt, setSessionExt] = useState<Ing[]>([]); // NL khách tự thêm (cả phiên, mất khi reload)
  const [recipes, setRecipes]     = useState<Recipe[]>([]);
  const [recipesLoaded, setRecipesLoaded] = useState(false);

  /* Calculator state */
  const [source, setSource]       = useState<'hvcp' | 'external'>('hvcp');
  const [drinkName, setDrinkName] = useState('');
  const [rows, setRows]           = useState<IngRow[]>([]);
  const [sellingPrice, setSp]     = useState('');
  const [search, setSearch]       = useState('');
  const [selectedId, setSelectedId] = useState('');
  const [qty, setQty]             = useState('');
  const [customCpu, setCustomCpu] = useState('');
  const [savedDrinks, setSavedDrinks] = useState<Drink[]>([]);
  const [expandedDrink, setExpandedDrink] = useState<string | null>(null);
  const [saveError, setSaveError] = useState('');

  /* Ingredient-tab add form */
  const [newName, setNewName] = useState('');
  const [newUnit, setNewUnit] = useState('g');
  const [newPackSize, setNewPackSize] = useState('');
  const [newPackPrice, setNewPackPrice] = useState('');
  const [ingSearch, setIngSearch] = useState('');
  const [ingFilter, setIngFilter] = useState<'all' | 'hvcp' | 'external'>('all');

  /* Recipe-tab filters */
  const [recipeSearch, setRecipeSearch] = useState('');
  const [recipeCourse, setRecipeCourse] = useState('');
  const [expandedRecipe, setExpandedRecipe] = useState<string | null>(null);

  useEffect(() => {
    const sb = createClient();
    Promise.all([
      sb.from('products').select('id,name,unit,price,cost_per_unit,image_url,category').eq('active', true).order('stt'),
      sb.from('external_ingredients').select('id,name,unit,cost_per_unit,quantity_per_pack,price_per_pack').eq('active', true).order('name'),
    ]).then(([{ data: prod }, { data: ext }]) => {
      setHvcpList((prod ?? []).map(p => {
        const c = internalCost(p);
        return {
          id: p.id, name: p.name,
          unit: c ? c.unit : (p.unit ?? 'g'),
          cost_per_unit: c ? c.cost : null,
          image_url: p.image_url, source: 'hvcp' as const,
          quantity_per_pack: c && c.base ? c.base : null,
        };
      }));
      setExtList((ext ?? []).map(e => ({ id: e.id, name: e.name, unit: e.unit, cost_per_unit: e.cost_per_unit, source: 'external' as const, quantity_per_pack: e.quantity_per_pack, price_per_pack: e.price_per_pack })));
    });
  }, []);

  /* Lazy-load recipes when tab opened */
  useEffect(() => {
    if (tab !== 'recipes' || recipesLoaded) return;
    const sb = createClient();
    void (async () => {
      const [{ data: cts }, { data: items }] = await Promise.all([
        sb.from('cong_thuc').select('id,name,category,photo_url,total_cost,courses,sort_order').order('sort_order').order('created_at'),
        sb.from('recipe_ingredient_items').select('recipe_id,source,name,quantity,unit,cost_per_unit'),
      ]);
      const byRecipe = new Map<string, RecipeItem[]>();
      (items ?? []).forEach((it: any) => {
        if (!byRecipe.has(it.recipe_id)) byRecipe.set(it.recipe_id, []);
        byRecipe.get(it.recipe_id)!.push({ source: it.source, name: it.name, quantity: it.quantity, unit: it.unit, cost_per_unit: it.cost_per_unit });
      });
      setRecipes((cts ?? []).map((c: any) => ({
        id: c.id, name: c.name, category: c.category, photo_url: c.photo_url,
        total_cost: c.total_cost, courses: c.courses ?? [], items: byRecipe.get(c.id) ?? [],
      })));
      setRecipesLoaded(true);
    })();
  }, [tab, recipesLoaded]);

  /* ─── Calculator derived ─── */
  const externalAll = [...extList, ...sessionExt];
  const allList    = source === 'hvcp' ? hvcpList : externalAll;
  const filtered   = search ? allList.filter(i => i.name.toLowerCase().includes(search.toLowerCase())) : allList;
  const selectedIng = allList.find(i => i.id === selectedId);
  const totalCost  = rows.reduce((sum, r) => sum + (r.cost_per_unit ?? 0) * r.quantity, 0);
  const activeCpu  = customCpu ? Number(customCpu) : (selectedIng?.cost_per_unit ?? null);
  const linePreview = activeCpu != null && Number(qty) > 0 ? activeCpu * Number(qty) : null;
  const sp         = Number(sellingPrice);
  const profit     = sp - totalCost;
  const margin     = sp > 0 ? profit / sp * 100 : null;

  function handleSourceChange(src: 'hvcp' | 'external') {
    setSource(src); setSearch(''); setSelectedId(''); setQty(''); setCustomCpu('');
  }

  function addRow() {
    if (!selectedIng) return;
    const cpu = customCpu ? Number(customCpu) : (selectedIng.cost_per_unit ?? null);
    const existing = rows.find(r => r.key === selectedIng.id);
    if (existing) {
      setRows(p => p.map(r => r.key === selectedIng.id ? { ...r, quantity: r.quantity + (Number(qty) || 0), cost_per_unit: cpu } : r));
    } else {
      setRows(p => [...p, { key: selectedIng.id, name: selectedIng.name, unit: selectedIng.unit, cost_per_unit: cpu, quantity: Number(qty) || 0, image_url: selectedIng.image_url }]);
    }
    setSelectedId(''); setQty(''); setCustomCpu('');
  }

  function saveDrink() {
    if (!drinkName.trim()) { setSaveError('Vui lòng nhập tên món trước khi lưu.'); return; }
    if (rows.length === 0) { setSaveError('Chưa có nguyên liệu nào.'); return; }
    setSaveError('');
    setSavedDrinks(p => [...p, { id: `d-${Date.now()}`, name: drinkName.trim(), rows: [...rows], totalCost, sellingPrice: sp }]);
    setDrinkName(''); setRows([]); setSp(''); setSelectedId(''); setSearch(''); setQty(''); setCustomCpu('');
  }

  /* ─── Ingredient tab: add session external ─── */
  function addSessionIng() {
    if (!newName.trim() || !newPackSize || !newPackPrice) return;
    const cpu = Number(newPackPrice) / Number(newPackSize);
    setSessionExt(p => [...p, {
      id: `sx-${Date.now()}`, name: newName.trim(), unit: newUnit, cost_per_unit: cpu, source: 'external',
      custom: true, quantity_per_pack: Number(newPackSize), price_per_pack: Number(newPackPrice),
    }]);
    setNewName(''); setNewPackSize(''); setNewPackPrice('');
  }
  function removeSessionIng(id: string) { setSessionExt(p => p.filter(i => i.id !== id)); }

  function useInCalc(ing: Ing) {
    setTab('calc');
    setSource(ing.source);
    setSelectedId(ing.id);
    setSearch('');
  }

  /* Ingredient table rows */
  const ingTableRows: Ing[] = [
    ...(ingFilter === 'external' ? [] : hvcpList),
    ...(ingFilter === 'hvcp' ? [] : externalAll),
  ].filter(i => !ingSearch || i.name.toLowerCase().includes(ingSearch.toLowerCase()));

  /* Recipe courses list */
  const allCourses = Array.from(new Set(recipes.flatMap(r => r.courses))).sort();
  const filteredRecipes = recipes.filter(r =>
    (!recipeSearch || r.name.toLowerCase().includes(recipeSearch.toLowerCase())) &&
    (!recipeCourse || r.courses.includes(recipeCourse))
  );

  return (
    <div className={s.page} style={{ paddingTop: 'var(--nav-h, 64px)' }}>

      {/* ── Header ── */}
      <div className={s.header}>
        <div className="container">
          <span className={s.eyebrow}>Công cụ miễn phí · Không cần đăng nhập</span>
          <h1 className={s.h1}>Tính Cost Ly Nước</h1>
          <p className={s.lead}>Tự tính giá vốn cho món của bạn, tra bảng nguyên liệu và tham khảo công thức mẫu của Học Viện.</p>
        </div>
      </div>

      {/* ── Tab bar ── */}
      <div className={s.tabBarWrap}>
        <div className="container">
          <div className={s.tabBar}>
            <button className={`${s.tabBtn} ${tab === 'calc' ? s.tabBtnActive : ''}`} onClick={() => setTab('calc')}>
              <i className="ti ti-calculator"></i> Máy tính cost
            </button>
            <button className={`${s.tabBtn} ${tab === 'ingredients' ? s.tabBtnActive : ''}`} onClick={() => setTab('ingredients')}>
              <i className="ti ti-list-details"></i> Bảng nguyên liệu
            </button>
            <button className={`${s.tabBtn} ${tab === 'recipes' ? s.tabBtnActive : ''}`} onClick={() => setTab('recipes')}>
              <i className="ti ti-book"></i> Công thức mẫu HVCP
            </button>
          </div>
        </div>
      </div>

      <div className={s.body}>
        <div className="container">

          {/* ═══════════ TAB 1: CALCULATOR ═══════════ */}
          {tab === 'calc' && (
            <>
              <div className={s.grid}>
                {/* LEFT */}
                <div>
                  <div className={s.card}>
                    <label className={s.cardLabel}>Tên món đang tính</label>
                    <input className={s.input} value={drinkName} onChange={e => { setDrinkName(e.target.value); setSaveError(''); }} placeholder="VD: Trà đào cam sả, Bạc xỉu muối..." />
                  </div>

                  <div className={s.card}>
                    <div className={s.cardHead}>
                      <label className={s.cardLabel}>Thêm nguyên liệu</label>
                      {rows.length > 0 && <span className={s.rowCount}>{rows.length} nguyên liệu</span>}
                    </div>

                    {/* Row 1: source segmented + search */}
                    <div className={s.addTop}>
                      <div className={s.segmented}>
                        <button className={`${s.segBtn} ${source === 'hvcp' ? s.segBtnActive : ''}`} onClick={() => handleSourceChange('hvcp')}>HVCP ({hvcpList.length})</button>
                        <button className={`${s.segBtn} ${source === 'external' ? s.segBtnActive : ''}`} onClick={() => handleSourceChange('external')}>Ngoài ({externalAll.length})</button>
                      </div>
                      <div className={s.searchField}>
                        <i className="ti ti-search"></i>
                        <input value={search} onChange={e => { setSearch(e.target.value); setSelectedId(''); }} placeholder="Gõ tên nguyên liệu để lọc..." />
                      </div>
                    </div>

                    {/* Row 2: pick + qty + price + total + add */}
                    <div className={s.addRow}>
                      <div className={s.addField} style={{ flex: '3 1 200px' }}>
                        <label className={s.addFieldLabel}>Chọn ({filtered.length})</label>
                        <select className={s.inputSm} value={selectedId} onChange={e => { setSelectedId(e.target.value); setCustomCpu(''); }}>
                          <option value="">— Chọn nguyên liệu —</option>
                          {filtered.map(i => (
                            <option key={i.id} value={i.id}>{i.name}{i.custom ? ' (bạn thêm)' : ''} — {i.cost_per_unit != null ? `${(+i.cost_per_unit.toFixed(2)).toLocaleString('vi-VN')}đ/${i.unit}` : 'cần nhập giá'}</option>
                          ))}
                        </select>
                      </div>
                      <div className={s.addField} style={{ flex: '0 0 88px' }}>
                        <label className={s.addFieldLabel}>SL ({selectedIng?.unit ?? '?'})</label>
                        <input className={s.inputSm} type="number" min="0" step="0.5" value={qty} onChange={e => setQty(e.target.value)} placeholder="0" />
                      </div>
                      <div className={s.addField} style={{ flex: '0 0 104px' }}>
                        <label className={s.addFieldLabel}>Đơn giá</label>
                        <input className={s.inputSm} type="number" min="0" step="any"
                          value={customCpu || (selectedIng?.cost_per_unit != null ? (+selectedIng.cost_per_unit.toFixed(4)).toString() : '')}
                          onChange={e => setCustomCpu(e.target.value)} placeholder="tự tính" />
                      </div>
                      <div className={s.addField} style={{ flex: '0 0 auto' }}>
                        <label className={s.addFieldLabel}>Thành tiền</label>
                        <span className={`${s.linePreview} ${linePreview == null ? s.linePreviewEmpty : ''}`}>
                          {linePreview != null ? `${Math.round(linePreview).toLocaleString('vi-VN')}đ` : '—'}
                        </span>
                      </div>
                      <button className={s.btnAddIcon} onClick={addRow} disabled={!selectedId} title="Thêm vào món">
                        <i className="ti ti-plus"></i>
                      </button>
                    </div>

                    <p className={s.selectorHint}>
                      <i className="ti ti-info-circle"></i> Đơn giá HVCP tự tính = giá bán ÷ quy cách; sửa ô &ldquo;Đơn giá&rdquo; để ghi đè. Nguyên liệu <b>Trà</b> tự quy đổi sang đ/ml trà pha (1g lá ≈ 30ml).
                      Thiếu nguyên liệu ngoài? Sang tab <button className={s.linkBtn} onClick={() => setTab('ingredients')}>Bảng nguyên liệu</button> để tự thêm.
                    </p>

                    {rows.length === 0 ? (
                      <div className={s.emptyState}><span className={s.emptyIcon}>🧪</span>Chưa có nguyên liệu. Chọn từ danh sách ở trên để bắt đầu.</div>
                    ) : (
                      <div className={s.ingList}>
                        {rows.map(r => {
                          const line = r.cost_per_unit != null ? r.cost_per_unit * r.quantity : null;
                          return (
                          <div key={r.key} className={s.ingRow}>
                            <div className={s.ingInfo}>
                              {r.image_url
                                ? <img src={r.image_url} alt="" className={s.ingImg} />
                                : <span className={s.ingImgPh}><i className="ti ti-cup"></i></span>}
                              <div className={s.ingMeta}>
                                <div className={s.ingName}>{r.name}</div>
                                {r.cost_per_unit != null ? (
                                  <div className={s.ingCpu}>{(+r.cost_per_unit.toFixed(4)).toLocaleString('vi-VN')}đ/{r.unit}</div>
                                ) : (
                                  <input className={s.ingCpuInput} type="number" min="0" step="0.1" placeholder={`Nhập cost đ/${r.unit}`}
                                    onChange={e => setRows(p => p.map(x => x.key === r.key ? { ...x, cost_per_unit: e.target.value ? +e.target.value : null } : x))} />
                                )}
                              </div>
                            </div>
                            <div className={s.ingQtyBox}>
                              <input className={s.ingQtyInput} type="number" min="0" step="0.5"
                                value={r.quantity || ''} onChange={e => setRows(p => p.map(x => x.key === r.key ? { ...x, quantity: +e.target.value } : x))} placeholder="0" />
                              <span className={s.ingUnit}>{r.unit}</span>
                            </div>
                            <span className={s.ingLineTotal}>{line != null ? fmt(line) : '—'}</span>
                            <button className={s.ingRemove} onClick={() => setRows(p => p.filter(x => x.key !== r.key))}><i className="ti ti-x"></i></button>
                          </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>

                {/* RIGHT: Summary */}
                <div>
                  <div className={s.summary}>
                    <p className={s.sumEyebrow}>Kết quả tính cost</p>
                    {drinkName && <p className={s.sumDrinkName}>{drinkName}</p>}
                    {rows.some(r => r.quantity > 0) && (
                      <div className={s.sumBreakdown}>
                        {rows.filter(r => r.quantity > 0).map(r => (
                          <div key={r.key} className={s.sumLine}>
                            <span>{r.name} × {r.quantity}{r.unit}</span>
                            <span>{r.cost_per_unit != null ? fmt(r.cost_per_unit * r.quantity) : '?'}</span>
                          </div>
                        ))}
                      </div>
                    )}
                    <div className={s.sumTotal}>
                      <span className={s.sumTotalLabel}>Giá vốn / ly</span>
                      <span className={s.sumTotalNum}>{fmt(totalCost)}</span>
                    </div>
                    <p className={s.sumPriceLabel}>Giá bán dự kiến (đ)</p>
                    <input className={s.sumPriceInput} value={sellingPrice}
                      onChange={e => setSp(e.target.value.replace(/\D/g, ''))} placeholder="VD: 45000" inputMode="numeric" />
                    {sp > 0 && (
                      <div className={s.profitBox}>
                        <div className={s.profitRow}>
                          <span className={s.profitLabel}>Lợi nhuận / ly</span>
                          <span className={`${s.profitVal} ${profit >= 0 ? s.green : s.red}`}>{profit >= 0 ? '+' : ''}{fmt(profit)}</span>
                        </div>
                        {margin !== null && (
                          <div className={s.profitRow}>
                            <span className={s.profitLabel}>Biên lợi nhuận</span>
                            <span className={`${s.profitVal} ${margin >= 60 ? s.green : margin >= 40 ? s.yellow : s.red}`}>{Math.round(margin)}%</span>
                          </div>
                        )}
                        {margin !== null && (
                          <p className={s.profitHint}>
                            {margin < 40 && '⚠️ Biên thấp. Nên tăng giá bán hoặc giảm nguyên liệu.'}
                            {margin >= 40 && margin < 60 && '✓ Biên hợp lý cho quán có lượng khách ổn định.'}
                            {margin >= 60 && '🌟 Biên tốt! Có thể cạnh tranh giá hoặc giữ lợi nhuận cao.'}
                          </p>
                        )}
                      </div>
                    )}
                    {totalCost > 0 && (
                      <div className={s.suggestSection}>
                        <p className={s.suggestTitle}>Gợi ý giá bán</p>
                        {([['×2.5 — tối thiểu hoà vốn', 2.5], ['×3 — phổ biến quán nhỏ', 3], ['×4 — lợi nhuận cao', 4]] as [string, number][]).map(([label, mult]) => (
                          <div key={mult} className={s.suggestRow}>
                            <span>{label}</span>
                            <button className={s.suggestBtn} onClick={() => setSp(String(Math.round(totalCost * mult)))}>{fmt(totalCost * mult)}</button>
                          </div>
                        ))}
                      </div>
                    )}
                    {saveError && <p className={s.saveError}>{saveError}</p>}
                    <button className={s.btnSaveDrink} onClick={saveDrink}>
                      <i className="ti ti-device-floppy"></i> Lưu món này
                    </button>
                  </div>
                </div>
              </div>

              {/* Saved drinks */}
              {savedDrinks.length > 0 && (
                <div className={s.savedSection}>
                  <div className={s.savedHeader}>
                    <div>
                      <h2 className={s.savedTitle}>Danh sách đã lưu ({savedDrinks.length} món)</h2>
                      <p className={s.savedNote}>Dữ liệu sẽ mất khi tải lại trang. Xuất Excel để lưu trữ.</p>
                    </div>
                    <button className={s.btnExport} onClick={() => exportExcel(savedDrinks)}>
                      <i className="ti ti-table-export"></i> Xuất Excel
                    </button>
                  </div>
                  <div className={s.savedTable}>
                    <div className={s.savedTableHead}>
                      <span>Tên món</span><span>Giá vốn/ly</span><span>Giá bán</span><span>Lợi nhuận</span><span>Biên LN</span><span></span>
                    </div>
                    {savedDrinks.map(d => {
                      const prof = d.sellingPrice - d.totalCost;
                      const mgn  = d.sellingPrice > 0 ? prof / d.sellingPrice * 100 : null;
                      return (
                        <div key={d.id}>
                          <div className={s.savedRow} onClick={() => setExpandedDrink(expandedDrink === d.id ? null : d.id)}>
                            <span className={s.savedDrinkName}>
                              <i className={`ti ti-chevron-${expandedDrink === d.id ? 'up' : 'down'}`} style={{ marginRight: 5, opacity: .5 }}></i>{d.name}
                            </span>
                            <span style={{ color: '#f59e0b', fontWeight: 700 }}>{fmt(d.totalCost)}</span>
                            <span>{d.sellingPrice > 0 ? fmt(d.sellingPrice) : '—'}</span>
                            <span className={prof >= 0 ? s.posProfit : s.negProfit}>{d.sellingPrice > 0 ? (prof >= 0 ? '+' : '') + fmt(prof) : '—'}</span>
                            <span className={mgn != null ? (mgn >= 60 ? s.posProfit : mgn >= 40 ? s.midProfit : s.negProfit) : ''}>{mgn != null ? Math.round(mgn) + '%' : '—'}</span>
                            <button className={s.ingRemove} onClick={e => { e.stopPropagation(); setSavedDrinks(p => p.filter(x => x.id !== d.id)); }}>✕</button>
                          </div>
                          {expandedDrink === d.id && (
                            <div className={s.savedDetail}>
                              {d.rows.filter(r => r.quantity > 0).map(r => (
                                <div key={r.key} className={s.savedDetailRow}>
                                  <span>{r.name}</span>
                                  <span className={s.savedDetailQty}>{r.quantity} {r.unit}</span>
                                  <span className={s.savedDetailCost}>{r.cost_per_unit != null ? fmt(r.cost_per_unit * r.quantity) : '—'}</span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </>
          )}

          {/* ═══════════ TAB 2: INGREDIENTS TABLE ═══════════ */}
          {tab === 'ingredients' && (
            <>
              {/* Add form */}
              <div className={s.card}>
                <label className={s.cardLabel}>Thêm nguyên liệu ngoài (chỉ dùng trong phiên này)</label>
                <p className={s.selectorHint} style={{ marginTop: 0 }}>
                  <i className="ti ti-info-circle"></i> Đơn giá tự tính = giá gói ÷ quy cách. NL bạn thêm dùng được cho cả phiên (kể cả máy tính cost), nhưng sẽ mất khi tải lại trang.
                </p>
                <div className={s.addIngGrid}>
                  <input className={s.inputSm} value={newName} onChange={e => setNewName(e.target.value)} placeholder="Tên NL (VD: Đường trắng)" />
                  <select className={s.inputSm} value={newUnit} onChange={e => setNewUnit(e.target.value)}>
                    {UNITS.map(u => <option key={u}>{u}</option>)}
                  </select>
                  <input className={s.inputSm} type="number" min="0" value={newPackSize} onChange={e => setNewPackSize(e.target.value)} placeholder={`Quy cách gói (${newUnit})`} />
                  <input className={s.inputSm} type="number" min="0" value={newPackPrice} onChange={e => setNewPackPrice(e.target.value)} placeholder="Giá cả gói (đ)" />
                  <div className={s.addIngCost}>
                    {newPackSize && newPackPrice && Number(newPackSize) > 0
                      ? `${Math.round(Number(newPackPrice) / Number(newPackSize)).toLocaleString('vi-VN')}đ/${newUnit}`
                      : '—'}
                  </div>
                  <button className={s.btnAdd} onClick={addSessionIng} disabled={!newName.trim() || !newPackSize || !newPackPrice}>+ Thêm</button>
                </div>
              </div>

              {/* Filter bar */}
              <div className={s.ingFilterBar}>
                <input className={s.input} style={{ flex: 1, minWidth: 180 }} value={ingSearch} onChange={e => setIngSearch(e.target.value)} placeholder="🔍 Tìm nguyên liệu..." />
                <div className={s.segmented}>
                  {(['all', 'hvcp', 'external'] as const).map(f => (
                    <button key={f} className={`${s.segBtn} ${ingFilter === f ? s.segBtnActive : ''}`} onClick={() => setIngFilter(f)}>
                      {f === 'all' ? 'Tất cả' : f === 'hvcp' ? `HVCP (${hvcpList.length})` : `Ngoài (${externalAll.length})`}
                    </button>
                  ))}
                </div>
              </div>

              {/* Table */}
              <div className={s.ingTableWrap}>
                <div className={s.ingTableHead}>
                  <span>Tên nguyên liệu</span><span>Nguồn</span><span>Quy cách</span><span>Đơn giá/ĐV</span><span></span>
                </div>
                {ingTableRows.length === 0 ? (
                  <div className={s.emptyState} style={{ padding: 30 }}>Không tìm thấy nguyên liệu.</div>
                ) : ingTableRows.map(i => (
                  <div key={i.id} className={s.ingTableRow}>
                    <span className={s.ingTableName}>
                      {i.image_url && <img src={i.image_url} alt="" className={s.ingTableImg} />}
                      {i.name}
                      {i.custom && <span className={s.customTag}>Bạn thêm</span>}
                    </span>
                    <span>
                      <span className={i.source === 'hvcp' ? s.srcBadgeHvcp : s.srcBadgeExt}>{i.source === 'hvcp' ? 'HVCP' : 'Ngoài'}</span>
                    </span>
                    <span className={s.ingTableMuted}>{i.quantity_per_pack != null ? `${i.quantity_per_pack.toLocaleString('vi-VN')} ${i.unit}` : '—'}</span>
                    <span className={s.ingTableCost}>{i.cost_per_unit != null ? `${(+i.cost_per_unit.toFixed(2)).toLocaleString('vi-VN')}đ/${i.unit}` : '—'}</span>
                    <span className={s.ingTableActions}>
                      <button className={s.useBtn} onClick={() => useInCalc(i)} title="Dùng trong máy tính"><i className="ti ti-calculator"></i></button>
                      {i.custom && <button className={s.ingRemove} onClick={() => removeSessionIng(i.id)}>✕</button>}
                    </span>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* ═══════════ TAB 3: HVCP RECIPES ═══════════ */}
          {tab === 'recipes' && (
            <>
              <div className={s.ingFilterBar}>
                <input className={s.input} style={{ flex: 1, minWidth: 180 }} value={recipeSearch} onChange={e => setRecipeSearch(e.target.value)} placeholder="🔍 Tìm công thức..." />
                <select className={s.input} style={{ flex: '0 0 220px' }} value={recipeCourse} onChange={e => setRecipeCourse(e.target.value)}>
                  <option value="">Tất cả khóa học</option>
                  {allCourses.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              {!recipesLoaded ? (
                <div className={s.emptyState} style={{ padding: 40 }}><i className="ti ti-loader-2 spin" style={{ fontSize: '1.6rem' }}></i><br />Đang tải công thức...</div>
              ) : filteredRecipes.length === 0 ? (
                <div className={s.emptyState} style={{ padding: 40 }}>Không có công thức phù hợp.</div>
              ) : (
                <div className={s.recipeGrid}>
                  {filteredRecipes.map(r => {
                    const open = expandedRecipe === r.id;
                    const cost = r.total_cost ?? r.items.reduce((s2, it) => s2 + it.quantity * it.cost_per_unit, 0);
                    return (
                      <div key={r.id} className={`${s.recipeCard} ${open ? s.recipeCardOpen : ''}`}>
                        <div className={s.recipeCardTop} onClick={() => setExpandedRecipe(open ? null : r.id)}>
                          {r.photo_url
                            ? <img src={r.photo_url} alt={r.name} className={s.recipeImg} />
                            : <div className={s.recipeImgPlaceholder}><i className="ti ti-cup"></i></div>}
                          <div className={s.recipeInfo}>
                            <div className={s.recipeName}>{r.name}</div>
                            {r.courses.length > 0 && <div className={s.recipeCourses}>{r.courses.slice(0, 2).join(' · ')}{r.courses.length > 2 ? '…' : ''}</div>}
                            <div className={s.recipeCost}>{cost > 0 ? fmt(cost) : 'Chưa có cost'}<span className={s.recipeCostUnit}> / ly</span></div>
                          </div>
                          <i className={`ti ti-chevron-${open ? 'up' : 'down'} ${s.recipeChevron}`}></i>
                        </div>
                        {open && (
                          <div className={s.recipeDetail}>
                            {r.items.length === 0 ? (
                              <p className={s.recipeNoItems}>Chưa có định lượng chi tiết cho món này.</p>
                            ) : (
                              <>
                                <div className={s.recipeItemHead}><span>Nguyên liệu</span><span>Định lượng</span><span>Thành tiền</span></div>
                                {r.items.map((it, idx) => (
                                  <div key={idx} className={s.recipeItemRow}>
                                    <span>{it.name} <span className={it.source === 'internal' ? s.srcDotHvcp : s.srcDotExt}>{it.source === 'internal' ? 'HVCP' : 'Ngoài'}</span></span>
                                    <span className={s.recipeItemQty}>{it.quantity} {it.unit}</span>
                                    <span className={s.recipeItemCost}>{fmt(it.quantity * it.cost_per_unit)}</span>
                                  </div>
                                ))}
                                <div className={s.recipeItemTotal}><span>Tổng giá vốn</span><span>{fmt(cost)}</span></div>
                              </>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
              <p className={s.recipeFootNote}><i className="ti ti-info-circle"></i> Công thức &amp; giá vốn tham khảo từ Học Viện Cà Phê HCM. Giá nguyên liệu có thể thay đổi theo thời điểm và nhà cung cấp.</p>
            </>
          )}

        </div>
      </div>
    </div>
  );
}
