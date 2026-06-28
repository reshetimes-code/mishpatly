import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

/**
 * Serves lawyer profile image as a real image file
 * This is needed because images are stored as base64 data URIs in the DB,
 * but OG tags (WhatsApp, Facebook, etc.) need a real URL.
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    // id can be numeric id or slug
    const lawyer = await prisma.lawyer.findFirst({
      where: isNaN(Number(id)) ? { slug: id } : { id: Number(id) },
      select: { profileImage: true },
    });

    if (!lawyer?.profileImage) {
      return new NextResponse(null, { status: 404 });
    }

    // If it's already a URL, redirect to it
    if (lawyer.profileImage.startsWith('http')) {
      return NextResponse.redirect(lawyer.profileImage);
    }

    // Parse base64 data URI: data:image/jpeg;base64,/9j/4AAQ...
    const match = lawyer.profileImage.match(/^data:image\/(\w+);base64,(.+)$/);
    if (!match) {
      return new NextResponse(null, { status: 404 });
    }

    const format = match[1]; // jpeg, png, etc.
    const base64Data = match[2];
    const buffer = Buffer.from(base64Data, 'base64');

    return new NextResponse(buffer, {
      headers: {
        'Content-Type': `image/${format}`,
        'Cache-Control': 'public, max-age=86400, s-maxage=86400',
      },
    });
  } catch {
    return new NextResponse(null, { status: 500 });
  }
}
