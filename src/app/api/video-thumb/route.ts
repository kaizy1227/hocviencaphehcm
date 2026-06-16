import { NextRequest, NextResponse } from 'next/server';
import Ffmpeg from 'fluent-ffmpeg';
import ffmpegPath from 'ffmpeg-static';
import { writeFile, readFile, unlink } from 'fs/promises';
import path from 'path';

export const dynamic = 'force-dynamic';
export const maxDuration = 30;

const ALLOWED_HOSTS = ['.larksuite.com', '.feishu.cn'];

export async function GET(req: NextRequest) {
  const rawUrl = req.nextUrl.searchParams.get('url');
  if (!rawUrl) return new NextResponse('missing url', { status: 400 });

  try {
    const parsed = new URL(rawUrl);
    if (!ALLOWED_HOSTS.some(h => parsed.hostname.endsWith(h))) {
      return new NextResponse('forbidden host', { status: 403 });
    }
  } catch {
    return new NextResponse('invalid url', { status: 400 });
  }

  const id = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  const inputPath  = path.join('/tmp', `${id}.mp4`);
  const outputPath = path.join('/tmp', `${id}.jpg`);

  try {
    // Download video server-side (no CORS restriction)
    // First 5MB đủ cho faststart MP4 và MOV (moov atom ở đầu)
    const res = await fetch(rawUrl, {
      headers: { Range: 'bytes=0-5242879' },
    });
    if (!res.ok && res.status !== 206) throw new Error(`fetch ${res.status}`);

    await writeFile(inputPath, Buffer.from(await res.arrayBuffer()));

    if (ffmpegPath) Ffmpeg.setFfmpegPath(ffmpegPath);

    await new Promise<void>((resolve, reject) => {
      Ffmpeg(inputPath)
        .seekInput(1)          // seek đến giây 1 trước khi đọc input (nhanh)
        .frames(1)
        .videoFilter('scale=640:-1')
        .outputOptions(['-q:v', '5'])
        .output(outputPath)
        .on('end', () => resolve())
        .on('error', () => {
          // Thử lại từ giây 0 nếu seek 1s thất bại (video ngắn)
          Ffmpeg(inputPath)
            .frames(1)
            .videoFilter('scale=640:-1')
            .outputOptions(['-q:v', '5'])
            .output(outputPath)
            .on('end', () => resolve())
            .on('error', (e) => reject(e))
            .run();
        })
        .run();
    });

    const jpeg = await readFile(outputPath);
    return new NextResponse(jpeg, {
      headers: {
        'Content-Type': 'image/jpeg',
        'Cache-Control': 'public, max-age=3600',
      },
    });
  } catch {
    return new NextResponse(null, { status: 404 });
  } finally {
    await Promise.all([unlink(inputPath).catch(() => {}), unlink(outputPath).catch(() => {})]);
  }
}
