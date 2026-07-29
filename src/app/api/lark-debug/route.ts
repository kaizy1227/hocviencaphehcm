import { NextResponse } from 'next/server';
import { getLarkToken } from '@/lib/lark';

const LARK_API = 'https://open.larksuite.com/open-apis';
const VIEW_ID = 'vewMHUtKed';

async function safeJson(res: Response) {
  const text = await res.text();
  try { return JSON.parse(text); } catch { return { _raw: text.slice(0, 300) }; }
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const appToken = process.env.LARK_BASE_APP_TOKEN;
  const tableId  = searchParams.get('table') ?? process.env.LARK_TABLE_ID;
  const viewId   = searchParams.get('view') ?? VIEW_ID;
  const appId    = process.env.LARK_APP_ID;

  // Step 0: check env vars
  if (!appId || !appToken || !tableId) {
    return NextResponse.json({ step: 0, error: 'missing env vars', appId: !!appId, appToken: !!appToken, tableId: !!tableId });
  }

  // Step 0a: compare env value against expected (không lộ giá trị thật)
  const EXPECTED_BASE = 'Rg8DbDE0SaZsEls6vkylfx2ngrf';
  const baseCheck = {
    matchesExpected: appToken === EXPECTED_BASE,
    lenEnv: appToken.length,
    lenExpected: EXPECTED_BASE.length,
    first4: appToken.slice(0, 4),
    last4: appToken.slice(-4),
    hasWhitespace: /\s/.test(appToken),
    tableIdUsed: tableId,
    viewIdUsed: viewId,
  };
  if (searchParams.get('probe') === '1') {
    return NextResponse.json({ step: '0a', baseCheck });
  }

  // Step 0g: dump raw value của vài field cụ thể (xác nhận shape để parse đúng)
  if (searchParams.get('vals') === '1') {
    const tk = await getLarkToken();
    const rRes = await fetch(
      `${LARK_API}/bitable/v1/apps/${appToken}/tables/${tableId}/records?page_size=3&view_id=${viewId}`,
      { headers: { Authorization: `Bearer ${tk}` }, cache: 'no-store' },
    );
    const rJson = await safeJson(rRes);
    const keys = ['Khóa học', 'Sỉ số', 'Danh sách học viên', 'Ngày học', 'Ảnh lớp học (lọc ảnh đẹp)'];
    const samples = (rJson?.data?.items ?? []).map((it: any) => {
      const out: Record<string, any> = {};
      for (const k of keys) {
        const v = it.fields[k];
        out[k] = Array.isArray(v) ? { _isArray: true, len: v.length, first: v[0] } : v;
      }
      return out;
    });
    return NextResponse.json({ step: '0g', samples });
  }

  // Step 0f: liệt kê field names + 1 record mẫu của bảng (xác nhận tên cột chính xác)
  if (searchParams.get('fields') === '1') {
    const tk = await getLarkToken();
    const hh = { Authorization: `Bearer ${tk}` };
    const fRes = await fetch(
      `${LARK_API}/bitable/v1/apps/${appToken}/tables/${tableId}/fields?page_size=100`,
      { headers: hh, cache: 'no-store' },
    );
    const fJson = await safeJson(fRes);
    const rRes = await fetch(
      `${LARK_API}/bitable/v1/apps/${appToken}/tables/${tableId}/records?page_size=1&view_id=${viewId}`,
      { headers: hh, cache: 'no-store' },
    );
    const rJson = await safeJson(rRes);
    const sampleFields = rJson?.data?.items?.[0]?.fields ?? {};
    return NextResponse.json({
      step: '0f',
      fieldNames: (fJson?.data?.items ?? []).map((f: any) => ({ name: f.field_name, type: f.ui_type ?? f.type })),
      sampleRecordKeys: Object.keys(sampleFields),
    });
  }

  // Step 0d: chẩn đoán Wiki-base — thử liệt kê tables + resolve wiki node
  if (searchParams.get('diag') === '1') {
    const tk = await getLarkToken();
    const hh = { Authorization: `Bearer ${tk}` };

    // 1) List tables bằng appToken hiện tại
    const listRes = await fetch(
      `${LARK_API}/bitable/v1/apps/${appToken}/tables?page_size=50`,
      { headers: hh, cache: 'no-store' },
    );
    const listJson = await safeJson(listRes);

    // 2) Resolve wiki node → obj_token thật
    const nodeToken = searchParams.get('node') ?? 'HHFpwTjphiUo49kN3HJl9fc5gm1';
    const nodeRes = await fetch(
      `${LARK_API}/wiki/v2/spaces/get_node?token=${nodeToken}&obj_type=wiki`,
      { headers: hh, cache: 'no-store' },
    );
    const nodeJson = await safeJson(nodeRes);

    return NextResponse.json({
      step: '0d',
      listTables: {
        code: listJson?.code,
        msg: listJson?.msg,
        tables: (listJson?.data?.items ?? []).map((t: any) => ({ id: t.table_id, name: t.name })),
      },
      wikiNode: {
        code: nodeJson?.code,
        msg: nodeJson?.msg,
        obj_token: nodeJson?.data?.node?.obj_token,
        obj_type: nodeJson?.data?.node?.obj_type,
        title: nodeJson?.data?.node?.title,
      },
    });
  }

  const token = await getLarkToken();
  const h = { Authorization: `Bearer ${token}` };

  // Step 0b: fetch fields to check course options
  const fieldsRes = await fetch(
    `${LARK_API}/bitable/v1/apps/${appToken}/tables/${tableId}/fields`,
    { headers: h, cache: 'no-store' },
  );
  const fieldsJson = await safeJson(fieldsRes);
  const allFields: any[] = fieldsJson?.data?.items ?? [];
  const courseField = allFields.find((f: any) => f.field_name === 'Khóa học');

  // Step 1: fetch records
  const recRes = await fetch(
    `${LARK_API}/bitable/v1/apps/${appToken}/tables/${tableId}/records?page_size=5&view_id=${viewId}`,
    { headers: h, cache: 'no-store' },
  );
  const recJson = await safeJson(recRes);
  const items: any[] = recJson?.data?.items ?? [];

  if (items.length === 0) {
    return NextResponse.json({ step: 1, error: 'no items', recJson });
  }

  // Step 2: extract file tokens
  const fileTokens: string[] = [];
  const recordTokenMap: Record<string, string> = {};
  let extraParam = '';

  for (const item of items) {
    const attachments: any[] = item.fields['Hình ảnh trao bằng'] ?? [];
    const img =
      attachments.find((a: any) => a.type === 'image/jpeg' || /\.(jpg|jpeg)$/i.test(a.name ?? '')) ??
      attachments.find((a: any) => /\.(png|webp|heic)$/i.test(a.name ?? '')) ??
      attachments[0];
    if (img?.file_token) {
      fileTokens.push(img.file_token);
      recordTokenMap[item.record_id] = img.file_token;
      if (!extraParam && img.tmp_url) {
        try { extraParam = new URL(img.tmp_url).searchParams.get('extra') ?? ''; } catch {}
      }
    }
  }

  if (fileTokens.length === 0) {
    const sampleFields = Object.keys(items[0]?.fields ?? {});
    const f0 = items[0]?.fields ?? {};
    return NextResponse.json({
      step: 2, error: 'no file tokens found', sampleFields,
      lop_hoc_anh: f0['Ảnh lớp học'],
      lop_hoc_anh_copy: f0['Ảnh lớp học Copy'],
      sampleAttachments: f0['Hình ảnh trao bằng'],
      sampleNgayHoc: f0['Ngày học'],
      allItems: items.map(i => ({
        id: i.record_id,
        anh: i.fields['Ảnh lớp học'],
        anhCopy: i.fields['Ảnh lớp học Copy'],
        ngayHoc: i.fields['Ngày học'],
      })),
    });
  }

  // Step 3: batch get tmp download URLs
  const batchRes = await fetch(
    `${LARK_API}/drive/v1/medias/batch_get_tmp_download_url?file_tokens=${fileTokens.join(',')}&extra=${encodeURIComponent(extraParam)}`,
    { headers: h, cache: 'no-store' },
  );
  const batchJson = await safeJson(batchRes);
  const tokenUrlMap: Record<string, string> = {};
  for (const entry of batchJson?.data?.tmp_download_urls ?? []) {
    tokenUrlMap[entry.file_token] = entry.tmp_download_url;
  }

  // Step 4: map records
  const mapped = items.map(item => {
    const f = item.fields;
    const nameArr: any[] = f['Tên HV'] ?? f['Tên học viên'] ?? [];
    const name = nameArr[0]?.text ?? '';
    const rawDate = f['Ngày'];
    const date = typeof rawDate === 'number'
      ? new Date(rawDate).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })
      : '';
    const fileToken = recordTokenMap[item.record_id];
    const photoUrl = fileToken ? (tokenUrlMap[fileToken] ?? null) : null;
    return { id: item.record_id, name, date, photoUrl, hasName: !!name, hasPhoto: !!photoUrl };
  });

  return NextResponse.json({
    step: 4,
    batchCode: batchJson?.code,
    tokenUrlMapSize: Object.keys(tokenUrlMap).length,
    mapped,
    extraParam,
    allFieldKeys: Object.keys(items[0]?.fields ?? {}),
    courseField,
    fieldsApiCode: fieldsJson?.code,
    fieldsApiMsg: fieldsJson?.msg,
    scheduleMapDebug: await (async () => {
      // Check schedule records fetch (all records, no view)
      const r = await fetch(`${LARK_API}/bitable/v1/apps/${appToken}/tables/tblZo3DU3xfBX8Wy/records?page_size=5`, { headers: h, cache: 'no-store' });
      const j = await r.json();
      const items = j?.data?.items ?? [];
      return {
        code: j?.code, total: j?.data?.total,
        sample: items.slice(0,2).map((i: any) => ({ id: i.record_id, khoaHoc: i.fields['Khóa học'], ngayHoc: i.fields['Ngày học'] })),
        // Check trao-bang Thoi khoa bieu field
        traoBangScheduleIds: items[0]?.fields?.['Thời khóa biểu'],
      };
    })(),
    courseTableFields: await (async () => {
      const courseTableId = 'tblOU5Sge2qEHGHF';
      const r = await fetch(`${LARK_API}/bitable/v1/apps/${appToken}/tables/${courseTableId}/fields`, { headers: h, cache: 'no-store' });
      const j = await r.json();
      return {
        code: j?.code, msg: j?.msg,
        fields: (j?.data?.items ?? []).map((f: any) => ({
          id: f.field_id, name: f.field_name, type: f.type, ui_type: f.ui_type,
          options: f.property?.options,
        })),
      };
    })(),
  });
}
