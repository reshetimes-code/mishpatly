import { NextRequest, NextResponse } from 'next/server';
import { addLawyer, searchLawyers, type LawyerProfile } from '@/lib/lawyer-store';
import { hashPassword, generateLawyerToken } from '@/lib/auth';

// GET /api/lawyers - search/list lawyers
export async function GET(request: NextRequest) {
  const sp = request.nextUrl.searchParams;
  const includeInactive = sp.get('all') === 'true';
  const result = await searchLawyers({
    query: sp.get('q') || '',
    specialization: sp.get('specialization') || '',
    city: sp.get('city') || '',
    page: parseInt(sp.get('page') || '1', 10),
    limit: parseInt(sp.get('limit') || '12', 10),
    sortBy: (sp.get('sort') as 'rating' | 'name' | 'experience') || 'rating',
    includeInactive,
  });

  return NextResponse.json(result);
}

// POST /api/lawyers - register new lawyer
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    const required = ['fullName', 'licenseNumber', 'phone', 'email', 'city', 'specializations', 'password'];
    for (const field of required) {
      if (!body[field]) {
        return NextResponse.json({ error: `שדה חובה חסר: ${field}` }, { status: 400 });
      }
    }

    if (typeof body.password !== 'string' || body.password.length < 6) {
      return NextResponse.json({ error: 'סיסמה חייבת להכיל לפחות 6 תווים' }, { status: 400 });
    }

    if (!Array.isArray(body.specializations) || body.specializations.length === 0) {
      return NextResponse.json({ error: 'יש לבחור לפחות תחום התמחות אחד' }, { status: 400 });
    }

    const passwordHash = await hashPassword(body.password);

    const lawyer = await addLawyer({
      fullName: body.fullName,
      licenseNumber: body.licenseNumber,
      phone: body.phone,
      email: body.email,
      profileImage: body.profileImage || '',
      coverImage: body.coverImage || '',
      galleryImages: Array.isArray(body.galleryImages) ? body.galleryImages.slice(0, 10) : [],
      specializations: body.specializations,
      courtDistrict: body.courtDistrict || '',
      city: body.city,
      address: body.address || '',
      yearsExperience: parseInt(body.yearsExperience, 10) || 0,
      education: body.education || '',
      bio: body.bio || '',
      website: body.website || '',
      whatsapp: body.whatsapp || '',
      passwordHash,
      isActive: false,
    });

    const token = generateLawyerToken(lawyer.id);

    return NextResponse.json({ success: true, lawyer, token }, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
