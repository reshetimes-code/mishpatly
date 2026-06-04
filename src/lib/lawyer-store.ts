/**
 * In-memory lawyer directory store
 * Manages lawyer profiles, reviews, and ratings
 */

export interface LawyerProfile {
  id: number;
  slug: string;
  fullName: string;
  licenseNumber: string;
  phone: string;
  email: string;
  profileImage: string;
  coverImage: string;
  galleryImages: string[];
  specializations: string[];
  courtDistrict: string;
  city: string;
  address: string;
  yearsExperience: number;
  education: string;
  bio: string;
  website: string;
  whatsapp: string;
  rating: number;
  reviewCount: number;
  isVerified: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface LawyerReview {
  id: number;
  lawyerId: number;
  reviewerName: string;
  rating: number;
  text: string;
  isApproved: boolean;
  aiScore: number; // 0-1, higher = more positive
  createdAt: string;
}

// Global in-memory store
const globalStore = globalThis as unknown as {
  __lawyers: LawyerProfile[] | undefined;
  __lawyerReviews: LawyerReview[] | undefined;
  __lawyerNextId: number | undefined;
  __reviewNextId: number | undefined;
};

if (!globalStore.__lawyers) {
  globalStore.__lawyers = [];
  globalStore.__lawyerReviews = [];
  globalStore.__lawyerNextId = 1;
  globalStore.__reviewNextId = 1;
}

function getLawyers(): LawyerProfile[] {
  return globalStore.__lawyers!;
}

function getReviews(): LawyerReview[] {
  return globalStore.__lawyerReviews!;
}

function nextLawyerId(): number {
  return globalStore.__lawyerNextId!++;
}

function nextReviewId(): number {
  return globalStore.__reviewNextId!++;
}

export function createLawyerSlug(name: string): string {
  const base = name
    .replace(/[^\w\u0590-\u05FF\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .substring(0, 60) || `lawyer-${Date.now()}`;

  const store = getLawyers();
  let slug = base;
  let counter = 1;
  while (store.find((l) => l.slug === slug)) {
    slug = `${base}-${counter++}`;
  }
  return slug;
}

export function addLawyer(
  data: Omit<LawyerProfile, 'id' | 'slug' | 'rating' | 'reviewCount' | 'isVerified' | 'createdAt' | 'updatedAt'>
): LawyerProfile {
  const store = getLawyers();

  // Check duplicate by license number
  const existing = store.find((l) => l.licenseNumber === data.licenseNumber);
  if (existing) {
    Object.assign(existing, { ...data, updatedAt: new Date().toISOString() });
    return existing;
  }

  const lawyer: LawyerProfile = {
    ...data,
    id: nextLawyerId(),
    slug: createLawyerSlug(data.fullName),
    rating: 0,
    reviewCount: 0,
    isVerified: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  store.push(lawyer);
  return lawyer;
}

export function getAllLawyers(): LawyerProfile[] {
  return getLawyers().filter((l) => l.isActive);
}

export function getLawyerBySlug(slug: string): LawyerProfile | undefined {
  return getLawyers().find((l) => l.slug === slug);
}

export function getLawyerById(id: number): LawyerProfile | undefined {
  return getLawyers().find((l) => l.id === id);
}

export function searchLawyers(opts: {
  query?: string;
  specialization?: string;
  city?: string;
  page?: number;
  limit?: number;
  sortBy?: 'rating' | 'name' | 'experience';
}): { lawyers: LawyerProfile[]; total: number; page: number; totalPages: number } {
  const { query = '', specialization = '', city = '', page = 1, limit = 12, sortBy = 'rating' } = opts;
  let filtered = getLawyers().filter((l) => l.isActive);

  if (query) {
    const q = query.toLowerCase();
    filtered = filtered.filter(
      (l) =>
        l.fullName.toLowerCase().includes(q) ||
        l.specializations.some((s) => s.includes(q)) ||
        l.city.toLowerCase().includes(q) ||
        l.bio.toLowerCase().includes(q)
    );
  }

  if (specialization) {
    filtered = filtered.filter((l) => l.specializations.includes(specialization));
  }

  if (city) {
    filtered = filtered.filter((l) => l.city === city);
  }

  // Sort
  if (sortBy === 'rating') {
    filtered.sort((a, b) => b.rating - a.rating || b.reviewCount - a.reviewCount);
  } else if (sortBy === 'name') {
    filtered.sort((a, b) => a.fullName.localeCompare(b.fullName, 'he'));
  } else if (sortBy === 'experience') {
    filtered.sort((a, b) => b.yearsExperience - a.yearsExperience);
  }

  const total = filtered.length;
  const skip = (page - 1) * limit;
  const paginated = filtered.slice(skip, skip + limit);

  return {
    lawyers: paginated,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  };
}

// ============================================================
// Reviews with AI sentiment filtering
// ============================================================

/**
 * Simple AI-like sentiment analysis for Hebrew reviews
 * Returns score 0-1 (0 = very negative, 1 = very positive)
 */
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

  // Check for profanity - instant reject
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
  if (totalWords === 0) return 0.6; // Neutral defaults to slightly positive

  const score = positiveCount / totalWords;
  return Math.round(score * 100) / 100;
}

export function addReview(data: {
  lawyerId: number;
  reviewerName: string;
  rating: number;
  text: string;
}): { review: LawyerReview; approved: boolean; reason?: string } {
  const reviews = getReviews();
  const lawyer = getLawyerById(data.lawyerId);
  if (!lawyer) {
    throw new Error('עורך הדין לא נמצא');
  }

  // AI sentiment analysis
  const aiScore = analyzeSentiment(data.text);
  const isApproved = aiScore >= 0.3 && data.rating >= 2;

  const review: LawyerReview = {
    id: nextReviewId(),
    lawyerId: data.lawyerId,
    reviewerName: data.reviewerName,
    rating: Math.min(5, Math.max(1, data.rating)),
    text: data.text,
    isApproved,
    aiScore,
    createdAt: new Date().toISOString(),
  };

  reviews.push(review);

  // Update lawyer rating
  if (isApproved) {
    const approvedReviews = reviews.filter((r) => r.lawyerId === data.lawyerId && r.isApproved);
    const avgRating = approvedReviews.reduce((sum, r) => sum + r.rating, 0) / approvedReviews.length;
    lawyer.rating = Math.round(avgRating * 10) / 10;
    lawyer.reviewCount = approvedReviews.length;
    lawyer.updatedAt = new Date().toISOString();
  }

  return {
    review,
    approved: isApproved,
    reason: isApproved
      ? undefined
      : 'ההמלצה לא פורסמה כי המערכת זיהתה תוכן שלילי או לא ראוי. רק המלצות חיוביות ועניינות מתפרסמות.',
  };
}

export function getReviewsByLawyerId(lawyerId: number, onlyApproved = true): LawyerReview[] {
  return getReviews()
    .filter((r) => r.lawyerId === lawyerId && (!onlyApproved || r.isApproved))
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function getLawyerStats() {
  const lawyers = getLawyers();
  const reviews = getReviews();
  return {
    totalLawyers: lawyers.length,
    activeLawyers: lawyers.filter((l) => l.isActive).length,
    totalReviews: reviews.length,
    approvedReviews: reviews.filter((r) => r.isApproved).length,
    rejectedReviews: reviews.filter((r) => !r.isApproved).length,
  };
}

// All specializations for filter dropdown
export const SPECIALIZATIONS = [
  'דיני משפחה',
  'דיני עבודה',
  'משפט פלילי',
  'נזיקין ותאונות',
  'מקרקעין ונדל"ן',
  'דיני חברות ומסחרי',
  'משפט מנהלי',
  'דיני ביטוח',
  'הוצאה לפועל',
  'דיני מיסים',
  'קניין רוחני',
  'דיני צרכנות',
  'חדלות פירעון',
  'דיני תכנון ובנייה',
  'דיני הגירה',
  'דיני צבא וביטחון',
  'דיני אינטרנט וסייבר',
  'גישור ובוררות',
  'דיני חוזים',
  'דיני בנקאות',
];

export const CITIES = [
  'תל אביב', 'ירושלים', 'חיפה', 'באר שבע', 'ראשון לציון',
  'פתח תקווה', 'אשדוד', 'נתניה', 'חולון', 'בני ברק',
  'רמת גן', 'אשקלון', 'רחובות', 'בת ים', 'הרצליה',
  'כפר סבא', 'רעננה', 'מודיעין', 'נצרת', 'עכו',
  'טבריה', 'קריית שמונה', 'אילת', 'עפולה', 'חדרה',
];
