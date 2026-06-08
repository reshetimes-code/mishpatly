import { NextRequest, NextResponse } from 'next/server';
import { getLawyerById, getLawyerByLicense, updateLawyer } from '@/lib/lawyer-store';

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

// PUT /api/lawyers/[id] - update lawyer (requires licenseNumber for auth)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const lawyerId = parseInt(id, 10);

  try {
    const body = await request.json();

    // Verify ownership via license number
    if (!body.licenseNumber) {
      return NextResponse.json({ error: 'יש להזין מספר רישיון לאימות' }, { status: 401 });
    }

    const lawyer = await getLawyerById(lawyerId);
    if (!lawyer) {
      return NextResponse.json({ error: 'עורך הדין לא נמצא' }, { status: 404 });
    }

    if (lawyer.licenseNumber !== body.licenseNumber) {
      return NextResponse.json({ error: 'מספר רישיון שגוי' }, { status: 403 });
    }

    const updated = await updateLawyer(lawyerId, {
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
      isVerified: body.isVerified !== undefined ? Boolean(body.isVerified) : undefined,
      isActive: body.isActive !== undefined ? Boolean(body.isActive) : undefined,
    });

    return NextResponse.json({ success: true, lawyer: updated });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
