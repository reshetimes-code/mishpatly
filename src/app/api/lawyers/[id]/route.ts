import { NextRequest, NextResponse } from 'next/server';
import { getLawyerById, updateLawyer } from '@/lib/lawyer-store';
import { verifyToken } from '@/lib/auth';

// GET /api/lawyers/[id] - get lawyer by id
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const lawyer = await getLawyerById(parseInt(id, 10));
  if (!lawyer) {
    return NextResponse.json({ error: 'עורך הדין לא נמצא' }, { status: 404 });
  }
  return NextResponse.json({ lawyer });
}

// PUT /api/lawyers/[id] - update lawyer
// Auth: JWT token (admin or lawyer owner) OR licenseNumber fallback
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const lawyerId = parseInt(id, 10);

  try {
    const body = await request.json();

    const lawyer = await getLawyerById(lawyerId);
    if (!lawyer) {
      return NextResponse.json({ error: 'עורך הדין לא נמצא' }, { status: 404 });
    }

    // Check authorization
    let isAdmin = false;
    let isOwner = false;

    const authHeader = request.headers.get('authorization');
    if (authHeader?.startsWith('Bearer ')) {
      const token = authHeader.slice(7);
      const decoded = verifyToken(token);
      if (decoded) {
        if (decoded.role === 'ADMIN') {
          isAdmin = true;
        } else if (decoded.role === 'LAWYER' && decoded.lawyerId === lawyerId) {
          isOwner = true;
        }
      }
    }

    // Fallback: license number auth (for admin panel which sends licenseNumber)
    if (!isAdmin && !isOwner && body.licenseNumber) {
      if (lawyer.licenseNumber === body.licenseNumber) {
        isOwner = true;
      }
    }

    if (!isAdmin && !isOwner) {
      return NextResponse.json({ error: 'אין הרשאה לעדכן כרטיס זה' }, { status: 403 });
    }

    // Only admin can change isVerified and isActive
    const updateData: Record<string, unknown> = {
      fullName: body.fullName || undefined,
      phone: body.phone || undefined,
      email: body.email || undefined,
      profileImage: body.profileImage !== undefined ? (body.profileImage || null) : undefined,
      coverImage: body.coverImage !== undefined ? (body.coverImage || null) : undefined,
      galleryImages: body.galleryImages || undefined,
      specializations: body.specializations || undefined,
      courtDistrict: body.courtDistrict !== undefined ? (body.courtDistrict || null) : undefined,
      city: body.city || undefined,
      address: body.address !== undefined ? (body.address || null) : undefined,
      yearsExperience: body.yearsExperience !== undefined ? parseInt(body.yearsExperience, 10) || 0 : undefined,
      education: body.education !== undefined ? (body.education || null) : undefined,
      bio: body.bio !== undefined ? (body.bio || null) : undefined,
      website: body.website !== undefined ? (body.website || null) : undefined,
      whatsapp: body.whatsapp !== undefined ? (body.whatsapp || null) : undefined,
    };

    if (isAdmin) {
      if (body.isVerified !== undefined) updateData.isVerified = Boolean(body.isVerified);
      if (body.isActive !== undefined) updateData.isActive = Boolean(body.isActive);
    }

    const updated = await updateLawyer(lawyerId, updateData);

    return NextResponse.json({ success: true, lawyer: updated });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
