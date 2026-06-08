/**
 * Lawyer directory store — backed by PostgreSQL via Prisma
 */

import { prisma } from './db';
import type { Lawyer, LawyerReview } from '@prisma/client';

export type LawyerProfile = Lawyer;
export type { LawyerReview };

export function createLawyerSlug(name: string): string {
  return name
    .replace(/[^\w\u0590-\u05FF\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .substring(0, 60) || `lawyer-${Date.now()}`;
}

async function ensureUniqueSlug(baseSlug: string): Promise<string> {
  let slug = baseSlug;
  let counter = 1;
  while (await prisma.lawyer.findUnique({ where: { slug } })) {
    slug = `${baseSlug}-${counter++}`;
  }
  return slug;
}

export async function addLawyer(
  data: {
    fullName: string;
    licenseNumber: string;
    phone: string;
    email: string;
    profileImage?: string;
    coverImage?: string;
    galleryImages?: string[];
    specializations: string[];
    courtDistrict?: string;
    city: string;
    address?: string;
    yearsExperience?: number;
    education?: string;
    bio?: string;
    website?: string;
    whatsapp?: string;
    isActive?: boolean;
  }
): Promise<Lawyer> {
  // Check duplicate by license number
  const existing = await prisma.lawyer.findUnique({
    where: { licenseNumber: data.licenseNumber },
  });

  if (existing) {
    return prisma.lawyer.update({
      where: { id: existing.id },
      data: {
        fullName: data.fullName,
        phone: data.phone,
        email: data.email,
        profileImage: data.profileImage || null,
        coverImage: data.coverImage || null,
        galleryImages: data.galleryImages || [],
        specializations: data.specializations,
        courtDistrict: data.courtDistrict || null,
        city: data.city,
        address: data.address || null,
        yearsExperience: data.yearsExperience || 0,
        education: data.education || null,
        bio: data.bio || null,
        website: data.website || null,
        whatsapp: data.whatsapp || null,
      },
    });
  }

  const slug = await ensureUniqueSlug(createLawyerSlug(data.fullName));

  return prisma.lawyer.create({
    data: {
      slug,
      fullName: data.fullName,
      licenseNumber: data.licenseNumber,
      phone: data.phone,
      email: data.email,
      profileImage: data.profileImage || null,
      coverImage: data.coverImage || null,
      galleryImages: data.galleryImages || [],
      specializations: data.specializations,
      courtDistrict: data.courtDistrict || null,
      city: data.city,
      address: data.address || null,
      yearsExperience: data.yearsExperience || 0,
      education: data.education || null,
      bio: data.bio || null,
      website: data.website || null,
      whatsapp: data.whatsapp || null,
    },
  });
}

export async function getAllLawyers(): Promise<Lawyer[]> {
  return prisma.lawyer.findMany({
    where: { isActive: true },
    orderBy: { rating: 'desc' },
  });
}

export async function getLawyerBySlug(slug: string): Promise<Lawyer | null> {
  return prisma.lawyer.findUnique({ where: { slug } });
}

export async function getLawyerById(id: number): Promise<Lawyer | null> {
  return prisma.lawyer.findUnique({ where: { id } });
}

export async function searchLawyers(opts: {
  query?: string;
  specialization?: string;
  city?: string;
  page?: number;
  limit?: number;
  sortBy?: 'rating' | 'name' | 'experience';
}): Promise<{ lawyers: Lawyer[]; total: number; page: number; totalPages: number }> {
  const { query = '', specialization = '', city = '', page = 1, limit = 12, sortBy = 'rating' } = opts;

  const where: Record<string, unknown> = { isActive: true };

  if (query) {
    where.OR = [
      { fullName: { contains: query, mode: 'insensitive' } },
      { city: { contains: query, mode: 'insensitive' } },
      { bio: { contains: query, mode: 'insensitive' } },
      { specializations: { has: query } },
    ];
  }

  if (specialization) {
    where.specializations = { has: specialization };
  }

  if (city) {
    where.city = city;
  }

  const orderBy =
    sortBy === 'name'
      ? { fullName: 'asc' as const }
      : sortBy === 'experience'
        ? { yearsExperience: 'desc' as const }
        : { rating: 'desc' as const };

  const [lawyers, total] = await Promise.all([
    prisma.lawyer.findMany({
      where,
      orderBy,
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.lawyer.count({ where }),
  ]);

  return {
    lawyers,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  };
}

// ============================================================
// Reviews with AI sentiment filtering
// ============================================================

function analyzeSentiment(text: string): number {
  const lower = text.toLowerCase();

  const negativeWords = [
    'גרוע', 'נורא', 'איום', 'מחפיר', 'רמאי', 'גנב', 'שקרן', 'לא מקצועי',
    'חרא', 'זבל', 'מאכזב', 'הונאה', 'רשלני', 'רשלנות', 'עלוב', 'מבאס',
    'לא ממליץ', 'הכי גרוע', 'בזבוז כסף', 'בזבוז זמן', 'חסר תועלת',
    'לא אכפת', 'מזלזל', 'לא מגיב', 'לא עונה', 'התעלם', 'רמאות',
    'עורך דין גרוע', 'לא מומלץ', 'אסון', 'כישלון', 'הפסדתי', 'נוכל',
    'fuck', 'shit', 'scam', 'terrible', 'awful', 'worst', 'horrible',
    'fraud', 'liar', 'thief', 'incompetent', 'useless',
  ];

  const positiveWords = [
    'מעולה', 'מצוין', 'מקצועי', 'ממליץ', 'אדיב', 'מומחה', 'הכי טוב',
    'מומלץ בחום', 'תודה', 'מרוצה', 'מושלם', 'יסודי', 'אכפתי', 'נאמן',
    'הצליח', 'ניצחון', 'הצלחה', 'זכינו', 'תוצאה טובה', 'שירות מצוין',
    'זמין', 'קשוב', 'מסור', 'אמין', 'יעיל', 'מנצח', 'חד', 'חכם',
    'excellent', 'amazing', 'great', 'best', 'recommend', 'professional',
    'wonderful', 'fantastic', 'outstanding', 'brilliant', 'helpful',
  ];

  const profanity = [
    'זונה', 'מניאק', 'חרא', 'זין', 'כוס', 'תמות', 'שרמוטה',
    'fuck', 'shit', 'ass', 'dick', 'bitch',
  ];

  for (const word of profanity) {
    if (lower.includes(word)) return 0;
  }

  let negativeCount = 0;
  let positiveCount = 0;

  for (const word of negativeWords) {
    if (lower.includes(word)) negativeCount++;
  }

  for (const word of positiveWords) {
    if (lower.includes(word)) positiveCount++;
  }

  const totalWords = negativeCount + positiveCount;
  if (totalWords === 0) return 0.6;

  const score = positiveCount / totalWords;
  return Math.round(score * 100) / 100;
}

export async function addReview(data: {
  lawyerId: number;
  reviewerName: string;
  rating: number;
  text: string;
}): Promise<{ review: LawyerReview; approved: boolean; reason?: string }> {
  const lawyer = await getLawyerById(data.lawyerId);
  if (!lawyer) {
    throw new Error('עורך הדין לא נמצא');
  }

  const aiScore = analyzeSentiment(data.text);
  const isApproved = aiScore >= 0.3 && data.rating >= 2;

  const review = await prisma.lawyerReview.create({
    data: {
      lawyerId: data.lawyerId,
      reviewerName: data.reviewerName,
      rating: Math.min(5, Math.max(1, data.rating)),
      text: data.text,
      isApproved,
      aiScore,
    },
  });

  if (isApproved) {
    const agg = await prisma.lawyerReview.aggregate({
      where: { lawyerId: data.lawyerId, isApproved: true },
      _avg: { rating: true },
      _count: true,
    });

    await prisma.lawyer.update({
      where: { id: data.lawyerId },
      data: {
        rating: Math.round((agg._avg.rating || 0) * 10) / 10,
        reviewCount: agg._count,
      },
    });
  }

  return {
    review,
    approved: isApproved,
    reason: isApproved
      ? undefined
      : 'ההמלצה לא פורסמה כי המערכת זיהתה תוכן שלילי או לא ראוי. רק המלצות חיוביות ועניינות מתפרסמות.',
  };
}

export async function getReviewsByLawyerId(lawyerId: number, onlyApproved = true): Promise<LawyerReview[]> {
  return prisma.lawyerReview.findMany({
    where: {
      lawyerId,
      ...(onlyApproved ? { isApproved: true } : {}),
    },
    orderBy: { createdAt: 'desc' },
  });
}

export async function getLawyerStats() {
  const [totalLawyers, activeLawyers, totalReviews, approvedReviews] = await Promise.all([
    prisma.lawyer.count(),
    prisma.lawyer.count({ where: { isActive: true } }),
    prisma.lawyerReview.count(),
    prisma.lawyerReview.count({ where: { isApproved: true } }),
  ]);

  return {
    totalLawyers,
    activeLawyers,
    totalReviews,
    approvedReviews,
    rejectedReviews: totalReviews - approvedReviews,
  };
}

export { SPECIALIZATIONS, CITIES } from './lawyer-constants';
