// Shared constants for the lawyers portal — safe to import in client components

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

// Judgment categories (src/lib/scrapers.ts's detectCategory) use short,
// different labels than the lawyer specialization list above ("פלילי" vs
// "משפט פלילי", "נזיקין" vs "נזיקין ותאונות", etc.) - this maps one to the
// other so judgment/person/search pages can find real matching lawyers.
// Categories with no confident match (e.g. "אזרחי" is too broad, "בית דין
// רבני" has no portal equivalent) are intentionally omitted.
export const CATEGORY_TO_SPECIALIZATION: Record<string, string> = {
  'פלילי': 'משפט פלילי',
  'משפחה': 'דיני משפחה',
  'עבודה': 'דיני עבודה',
  'מנהלי': 'משפט מנהלי',
  'נזיקין': 'נזיקין ותאונות',
  'חוזים': 'דיני חוזים',
  'מקרקעין': 'מקרקעין ונדל"ן',
  'ביטוח': 'דיני ביטוח',
  'מיסים': 'דיני מיסים',
  'חדלות פירעון': 'חדלות פירעון',
};

export const CITIES = [
  'תל אביב', 'ירושלים', 'חיפה', 'באר שבע', 'ראשון לציון',
  'פתח תקווה', 'אשדוד', 'נתניה', 'חולון', 'בני ברק',
  'רמת גן', 'אשקלון', 'רחובות', 'בת ים', 'הרצליה',
  'כפר סבא', 'רעננה', 'מודיעין', 'נצרת', 'עכו',
  'טבריה', 'קריית שמונה', 'אילת', 'עפולה', 'חדרה',
];
