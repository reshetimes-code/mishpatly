/**
 * SEO Keywords for משפטלי (MishpatLi) - Legal Judgments Database
 * Organized by category and search volume priority
 */

import { SPECIALIZATIONS, CITIES } from '@/lib/lawyer-constants';

export interface SeoKeyword {
  hebrew: string;
  slug: string;
  volume: 'high' | 'medium' | 'low';
  category: string;
}

// ─── Primary Keywords (Highest Volume) ───────────────────────────────

export const primaryKeywords: SeoKeyword[] = [
  { hebrew: 'פסקי דין', slug: 'piskei-din', volume: 'high', category: 'primary' },
  { hebrew: 'מאגר פסקי דין', slug: 'magar-piskei-din', volume: 'high', category: 'primary' },
  { hebrew: 'חיפוש פסקי דין', slug: 'hipus-piskei-din', volume: 'high', category: 'primary' },
  { hebrew: 'פסק דין', slug: 'psak-din', volume: 'high', category: 'primary' },
  { hebrew: 'הסרת אזכורים משפטיים', slug: 'hasarat-azkurim', volume: 'high', category: 'primary' },
  { hebrew: 'החלטות משפטיות', slug: 'hahlatot-mishpatiyot', volume: 'high', category: 'primary' },
  { hebrew: 'מאגר משפטי', slug: 'magar-mishpati', volume: 'high', category: 'primary' },
  { hebrew: 'פסיקה ישראלית', slug: 'psika-israelit', volume: 'high', category: 'primary' },
  { hebrew: 'משפט פלילי', slug: 'mishpat-plili', volume: 'high', category: 'primary' },
  { hebrew: 'משפט לי', slug: 'mishpat-li', volume: 'high', category: 'primary' },
  { hebrew: 'פסקי דין לפי שם', slug: 'piskei-din-lefi-shem', volume: 'high', category: 'primary' },
];

// ─── Secondary Keywords ──────────────────────────────────────────────

export const secondaryKeywords: SeoKeyword[] = [
  { hebrew: 'הסרת פסק דין מגוגל', slug: 'mhikat-psak-din-mgoogle', volume: 'medium', category: 'secondary' },
  { hebrew: 'מחיקת פסק דין', slug: 'mhikat-psak-din', volume: 'medium', category: 'secondary' },
  { hebrew: 'הסרת אזכור משפטי', slug: 'hasarat-azkur-mishpati', volume: 'medium', category: 'secondary' },
  { hebrew: 'חיפוש לפי שם בפסקי דין', slug: 'hipus-lefi-shem', volume: 'medium', category: 'secondary' },
  { hebrew: 'בדיקת פסקי דין לפי שם', slug: 'bdika-piskei-din-lefi-shem', volume: 'medium', category: 'secondary' },
  { hebrew: 'חיפוש פסקי דין לפי מספר תיק', slug: 'hipus-lefi-mispar-tik', volume: 'medium', category: 'secondary' },
  { hebrew: 'הסרת שם מפסק דין', slug: 'hasarat-shem-mipsak-din', volume: 'medium', category: 'secondary' },
  { hebrew: 'פסקי דין חינם', slug: 'piskei-din-hinam', volume: 'medium', category: 'secondary' },
  { hebrew: 'פסקי דין באינטרנט', slug: 'piskei-din-baInternet', volume: 'medium', category: 'secondary' },
  { hebrew: 'חיפוש משפטי', slug: 'hipus-mishpati', volume: 'medium', category: 'secondary' },
  { hebrew: 'מאגר פסיקה', slug: 'magar-psika', volume: 'medium', category: 'secondary' },
  { hebrew: 'פסקי דין אחרונים', slug: 'piskei-din-aharonim', volume: 'medium', category: 'secondary' },
  { hebrew: 'חיפוש שם בפסקי דין', slug: 'hipus-shem-bpiskei-din', volume: 'medium', category: 'secondary' },
  { hebrew: 'פסקי דין נגד', slug: 'piskei-din-neged', volume: 'medium', category: 'secondary' },
  { hebrew: 'בדיקת רקע משפטי', slug: 'bdikat-reka-mishpati', volume: 'medium', category: 'secondary' },
  { hebrew: 'מאגר פסקי דין חינם', slug: 'magar-piskei-din-hinam', volume: 'medium', category: 'secondary' },
];

// ─── Competitor-Beating Keywords (High Volume) ──────────────────────

export const competitorKeywords: SeoKeyword[] = [
  { hebrew: 'חיפוש פסק דין לפי תעודת זהות', slug: 'hipus-psak-din-lefi-tz', volume: 'high', category: 'competitor' },
  { hebrew: 'איתור תיק בבית משפט', slug: 'itur-tik-beit-mishpat', volume: 'high', category: 'competitor' },
  { hebrew: 'נט המשפט חיפוש תיקים', slug: 'net-hamishpat-hipus', volume: 'high', category: 'competitor' },
  { hebrew: 'בדיקת תיקים פתוחים', slug: 'bdikat-tikim-ptuhim', volume: 'high', category: 'competitor' },
  { hebrew: 'פסקי דין להורדה חינם', slug: 'piskei-din-lehorada-hinam', volume: 'high', category: 'competitor' },
  { hebrew: 'פרוטוקול דיון בית משפט', slug: 'protokol-diun-beit-mishpat', volume: 'medium', category: 'competitor' },
  { hebrew: 'גזר דין', slug: 'gzar-din', volume: 'medium', category: 'competitor' },
  { hebrew: 'הכרעת דין', slug: 'hakhrat-din', volume: 'medium', category: 'competitor' },
  { hebrew: 'תיקים משפטיים פתוחים לציבור', slug: 'tikim-mishpatiyim-ptuhim', volume: 'medium', category: 'competitor' },
  { hebrew: 'חיפוש תיק לפי שם', slug: 'hipus-tik-lefi-shem', volume: 'high', category: 'competitor' },
  { hebrew: 'פסקי דין עליון', slug: 'piskei-din-elyon-search', volume: 'medium', category: 'competitor' },
  { hebrew: 'בגץ פסקי דין', slug: 'bagatz-piskei-din', volume: 'medium', category: 'competitor' },
  { hebrew: 'מאגר פסקי דין באינטרנט', slug: 'magar-piskei-din-baInternet', volume: 'medium', category: 'competitor' },
  { hebrew: 'חיפוש פסקי דין לפי שם תובע', slug: 'hipus-lefi-shem-tovea', volume: 'medium', category: 'competitor' },
  { hebrew: 'חיפוש פסקי דין לפי שם נתבע', slug: 'hipus-lefi-shem-nitba', volume: 'medium', category: 'competitor' },
  { hebrew: 'פסקי דין לצפייה חינם', slug: 'piskei-din-letzfiya-hinam', volume: 'medium', category: 'competitor' },
  { hebrew: 'איתור פסק דין', slug: 'itur-psak-din', volume: 'medium', category: 'competitor' },
  { hebrew: 'בדיקת עבר משפטי', slug: 'bdikat-avar-mishpati', volume: 'medium', category: 'competitor' },
  { hebrew: 'פסקי דין חדשים היום', slug: 'piskei-din-hadashim-hayom', volume: 'medium', category: 'competitor' },
  { hebrew: 'מאגר פסיקה חינם', slug: 'magar-psika-hinam', volume: 'medium', category: 'competitor' },
];

// ─── Long Tail Keywords ──────────────────────────────────────────────

export const longTailKeywords: SeoKeyword[] = [
  { hebrew: 'איך למחוק פסק דין מהאינטרנט', slug: 'eikh-limhok-psak-din', volume: 'low', category: 'long-tail' },
  { hebrew: 'הסרת שם מפסק דין באינטרנט', slug: 'hasarat-shem-mipsak-din-baInternet', volume: 'low', category: 'long-tail' },
  { hebrew: 'חיפוש פסקי דין לפי מספר תיק', slug: 'hipus-piskei-din-lefi-mispar-tik', volume: 'low', category: 'long-tail' },
  { hebrew: 'פסקי דין בית משפט השלום', slug: 'piskei-din-bet-mishpat-hashalom', volume: 'low', category: 'long-tail' },
  { hebrew: 'פסקי דין בית המשפט המחוזי', slug: 'piskei-din-bet-mishpat-hamehozi', volume: 'low', category: 'long-tail' },
  { hebrew: 'פסקי דין בית המשפט העליון', slug: 'piskei-din-bet-mishpat-haelyon', volume: 'low', category: 'long-tail' },
  { hebrew: 'פסקי דין בית הדין לעבודה', slug: 'piskei-din-bet-hadin-laavoda', volume: 'low', category: 'long-tail' },
  { hebrew: 'חיפוש פסקי דין לפי שם שופט', slug: 'hipus-lefi-shem-shofet', volume: 'low', category: 'long-tail' },
  { hebrew: 'הורדת פסק דין', slug: 'horadat-psak-din', volume: 'low', category: 'long-tail' },
  { hebrew: 'איך מוצאים פסק דין', slug: 'eikh-motzim-psak-din', volume: 'low', category: 'long-tail' },
  { hebrew: 'באיזה אתר אפשר לחפש פסקי דין', slug: 'eizo-atar-hipus-piskei-din', volume: 'low', category: 'long-tail' },
  { hebrew: 'האם אפשר למחוק פסק דין מהרשת', slug: 'haam-efshar-limhok-psak-din', volume: 'low', category: 'long-tail' },
  { hebrew: 'מחיקת רישום פלילי מגוגל', slug: 'mhikat-rishum-plili-mgoogle', volume: 'low', category: 'long-tail' },
  { hebrew: 'זכות השכחה פסקי דין', slug: 'zkhut-hashikha-piskei-din', volume: 'low', category: 'long-tail' },
  { hebrew: 'הסרת תוצאות חיפוש משפטיות', slug: 'hasarat-totzaot-hipus', volume: 'low', category: 'long-tail' },
];

// ─── Court-Specific Keywords ─────────────────────────────────────────

export const courtKeywords: SeoKeyword[] = [
  { hebrew: 'פסקי דין בית משפט השלום תל אביב', slug: 'piskei-din-shalom-tel-aviv', volume: 'low', category: 'court' },
  { hebrew: 'פסקי דין בית משפט השלום ירושלים', slug: 'piskei-din-shalom-yerushalayim', volume: 'low', category: 'court' },
  { hebrew: 'פסקי דין בית משפט השלום חיפה', slug: 'piskei-din-shalom-haifa', volume: 'low', category: 'court' },
  { hebrew: 'פסקי דין בית משפט השלום באר שבע', slug: 'piskei-din-shalom-beer-sheva', volume: 'low', category: 'court' },
  { hebrew: 'פסקי דין בית משפט מחוזי תל אביב', slug: 'piskei-din-mehozi-tel-aviv', volume: 'low', category: 'court' },
  { hebrew: 'פסקי דין בית משפט מחוזי חיפה', slug: 'piskei-din-mehozi-haifa', volume: 'low', category: 'court' },
  { hebrew: 'פסקי דין בית משפט מחוזי ירושלים', slug: 'piskei-din-mehozi-yerushalayim', volume: 'low', category: 'court' },
  { hebrew: 'פסקי דין בית משפט מחוזי באר שבע', slug: 'piskei-din-mehozi-beer-sheva', volume: 'low', category: 'court' },
  { hebrew: 'פסקי דין בית משפט מחוזי נצרת', slug: 'piskei-din-mehozi-natzrat', volume: 'low', category: 'court' },
  { hebrew: 'פסקי דין בית המשפט העליון', slug: 'piskei-din-elyon', volume: 'low', category: 'court' },
  { hebrew: 'פסקי דין בית הדין הארצי לעבודה', slug: 'piskei-din-artzi-avoda', volume: 'low', category: 'court' },
  { hebrew: 'פסקי דין בית הדין האזורי לעבודה', slug: 'piskei-din-ezori-avoda', volume: 'low', category: 'court' },
  { hebrew: 'פסקי דין בית המשפט לענייני משפחה', slug: 'piskei-din-mishpaha', volume: 'low', category: 'court' },
];

// ─── Topic-Specific Keywords ─────────────────────────────────────────

export const topicKeywords: SeoKeyword[] = [
  { hebrew: 'פסקי דין בנושא חוזה', slug: 'piskei-din-hoze', volume: 'low', category: 'topic' },
  { hebrew: 'פסקי דין בנושא נזיקין', slug: 'piskei-din-nezikin', volume: 'low', category: 'topic' },
  { hebrew: 'פסקי דין דיני עבודה', slug: 'piskei-din-dinei-avoda', volume: 'low', category: 'topic' },
  { hebrew: 'פסקי דין חוזים', slug: 'piskei-din-hozim', volume: 'low', category: 'topic' },
  { hebrew: 'פסקי דין מקרקעין', slug: 'piskei-din-mekarkein', volume: 'low', category: 'topic' },
  { hebrew: 'פסקי דין דיני משפחה', slug: 'piskei-din-dinei-mishpaha', volume: 'low', category: 'topic' },
  { hebrew: 'פסקי דין פלילי', slug: 'piskei-din-plili', volume: 'low', category: 'topic' },
  { hebrew: 'פסקי דין מסחרי', slug: 'piskei-din-miskhari', volume: 'low', category: 'topic' },
  { hebrew: 'פסקי דין ביטוח', slug: 'piskei-din-bituah', volume: 'low', category: 'topic' },
  { hebrew: 'פסקי דין רשלנות רפואית', slug: 'piskei-din-rashlanut-refuit', volume: 'low', category: 'topic' },
  { hebrew: 'פסקי דין תאונות דרכים', slug: 'piskei-din-teunot-drakhim', volume: 'low', category: 'topic' },
  { hebrew: 'פסקי דין לשון הרע', slug: 'piskei-din-lashon-hara', volume: 'low', category: 'topic' },
  { hebrew: 'פסקי דין קניין רוחני', slug: 'piskei-din-kinyan-ruhani', volume: 'low', category: 'topic' },
  { hebrew: 'פסקי דין הגנת הצרכן', slug: 'piskei-din-haganat-hatzarkhan', volume: 'low', category: 'topic' },
  { hebrew: 'פסקי דין דיני מיסים', slug: 'piskei-din-dinei-misim', volume: 'low', category: 'topic' },
  { hebrew: 'פסקי דין חדלות פירעון', slug: 'piskei-din-hadlut-piraon', volume: 'low', category: 'topic' },
  { hebrew: 'פסקי דין זכויות יוצרים', slug: 'piskei-din-zkhuyot-yotzrim', volume: 'low', category: 'topic' },
  { hebrew: 'פסקי דין הוצאה לפועל', slug: 'piskei-din-hotza-lapoal', volume: 'low', category: 'topic' },
  { hebrew: 'פסקי דין תכנון ובנייה', slug: 'piskei-din-tikhnun-ubniya', volume: 'low', category: 'topic' },
  { hebrew: 'פסקי דין בנקאות', slug: 'piskei-din-bankaut', volume: 'low', category: 'topic' },
];

// ─── Removal & Privacy Keywords ──────────────────────────────────────

export const removalKeywords: SeoKeyword[] = [
  { hebrew: 'הסרת פרסום פסק דין', slug: 'hasarat-pirsum-psak-din', volume: 'low', category: 'removal' },
  { hebrew: 'מחיקת שם מפסק דין', slug: 'mhikat-shem-mipsak-din', volume: 'low', category: 'removal' },
  { hebrew: 'בקשה להסרת פסק דין', slug: 'bakasha-lehasarat-psak-din', volume: 'low', category: 'removal' },
  { hebrew: 'הגנה על פרטיות במאגרי מידע משפטיים', slug: 'hagana-al-pratiyut', volume: 'low', category: 'removal' },
  { hebrew: 'איך מגישים בקשת הסרה', slug: 'eikh-magishim-bakshat-hasara', volume: 'low', category: 'removal' },
  { hebrew: 'הסרת מידע אישי מפסיקה', slug: 'hasarat-meida-ishi-mipsika', volume: 'low', category: 'removal' },
];

// ─── All Keywords Combined ───────────────────────────────────────────

export const allKeywords: SeoKeyword[] = [
  ...primaryKeywords,
  ...competitorKeywords,
  ...secondaryKeywords,
  ...longTailKeywords,
  ...courtKeywords,
  ...topicKeywords,
  ...removalKeywords,
];

/**
 * Get all Hebrew keywords as a flat string array (useful for meta tags)
 */
export function getAllKeywordsHebrew(): string[] {
  return allKeywords.map((k) => k.hebrew);
}

/**
 * Get keywords by category
 */
export function getKeywordsByCategory(category: string): SeoKeyword[] {
  return allKeywords.filter((k) => k.category === category);
}

/**
 * Find a keyword by its slug
 */
export function getKeywordBySlug(slug: string): SeoKeyword | undefined {
  return allKeywords.find((k) => k.slug === slug);
}

/**
 * Keyword page data for SEO landing pages
 */
export interface KeywordPageData {
  slug: string;
  hebrewTitle: string;
  metaTitle: string;
  metaDescription: string;
  h1: string;
  paragraphs: string[];
  relatedSlugs: string[];
  searchQuery: string;
  lawyerFilter?: { city?: string; specialization?: string };
}

const curatedKeywordPages: KeywordPageData[] = [
  {
    slug: 'piskei-din',
    hebrewTitle: 'פסקי דין',
    metaTitle: 'פסקי דין - מאגר פסקי דין מקיף | משפטלי',
    metaDescription: 'חיפוש וצפייה בפסקי דין מכל בתי המשפט בישראל. מאגר פסקי דין עדכני הכולל פסיקה מבית המשפט העליון, המחוזי, השלום ובתי הדין לעבודה.',
    h1: 'פסקי דין - מאגר הפסיקה הישראלית',
    paragraphs: [
      'פסקי דין הם החלטות שיפוטיות המתפרסמות על ידי בתי המשפט בישראל ומהווים מקור משפטי מרכזי עבור עורכי דין, חוקרים ואזרחים. המאגר שלנו כולל עשרות אלפי פסקי דין מכל הערכאות השיפוטיות, כולל בית המשפט העליון, בתי המשפט המחוזיים, בתי משפט השלום ובתי הדין לעבודה.',
      'באמצעות משפטלי תוכלו לחפש פסקי דין לפי שם צד, מספר תיק, שם שופט, נושא משפטי או מילות מפתח. המערכת מציגה תוצאות רלוונטיות במהירות ומאפשרת סינון לפי בית משפט, שנה וסוג הליך.',
      'הגישה למאגר הפסיקה חשובה לכל מי שעוסק בתחום המשפטי - בין אם מדובר בעורך דין המחפש תקדימים, סטודנט למשפטים הכותב עבודה אקדמית, או אזרח המעוניין לבדוק האם שמו מופיע בפסק דין כלשהו.',
    ],
    relatedSlugs: ['magar-piskei-din', 'hipus-piskei-din', 'piskei-din-bet-mishpat-hashalom', 'piskei-din-bet-mishpat-hamehozi'],
    searchQuery: 'פסקי דין',
  },
  {
    slug: 'hasarat-azkurim',
    hebrewTitle: 'הסרת אזכורים משפטיים',
    metaTitle: 'הסרת אזכורים משפטיים - בקשה להסרת שם מפסק דין | משפטלי',
    metaDescription: 'שירות הסרת אזכורים משפטיים ממאגרי מידע ומנועי חיפוש. הגישו בקשה להסרת שמכם מפסקי דין באינטרנט בקלות ובמהירות.',
    h1: 'הסרת אזכורים משפטיים',
    paragraphs: [
      'הסרת אזכורים משפטיים היא תהליך שבו אדם מבקש להסיר את שמו או פרטיו מפסקי דין המפורסמים באינטרנט. זוהי זכות המעוגנת בחוק הגנת הפרטיות ובעקרונות הזכות להישכח, ומאפשרת לאנשים להגן על שמם הטוב ופרטיותם.',
      'משפטלי מציעה שירות נוח להגשת בקשות הסרה. התהליך פשוט: מאתרים את פסק הדין, ממלאים טופס בקשה, והצוות שלנו מטפל בבקשה בהקדם. בקשות הסרה מטופלות בהתאם להוראות הדין ולמדיניות בתי המשפט.',
      'חשוב לדעת: לא כל בקשת הסרה מתקבלת אוטומטית. ישנם שיקולים של אינטרס ציבורי, חופש המידע וחשיבות הנגשת הפסיקה. אנו בוחנים כל בקשה לגופה ומנחים את הפונים בדרך הטובה ביותר לממש את זכויותיהם.',
    ],
    relatedSlugs: ['hasarat-shem-mipsak-din', 'mhikat-psak-din-mgoogle', 'bdika-piskei-din-lefi-shem', 'piskei-din'],
    searchQuery: 'הסרת אזכורים',
  },
  {
    slug: 'magar-piskei-din',
    hebrewTitle: 'מאגר פסקי דין',
    metaTitle: 'מאגר פסקי דין - חיפוש בפסיקה הישראלית | משפטלי',
    metaDescription: 'מאגר פסקי דין מקיף ועדכני. חפשו בעשרות אלפי פסקי דין מכל בתי המשפט בישראל - מהעליון ועד השלום, כולל בתי דין לעבודה ולענייני משפחה.',
    h1: 'מאגר פסקי דין מקיף',
    paragraphs: [
      'מאגר פסקי הדין של משפטלי הוא אחד המאגרים המשפטיים המקיפים ביותר בישראל. המאגר כולל פסקי דין מכל הערכאות השיפוטיות, החל מבית המשפט העליון ועד בתי משפט השלום, ומתעדכן באופן שוטף בפסיקה חדשה.',
      'המאגר מציע חיפוש חכם המאפשר לאתר פסקי דין באמצעות מילות מפתח, שמות צדדים, מספרי תיקים, שמות שופטים ותחומים משפטיים. כמו כן, ניתן לסנן את התוצאות לפי בית משפט, תקופה וסוג הליך.',
      'בין אם אתם עורכי דין המחפשים תקדימים לתיק שאתם מנהלים, סטודנטים למשפטים או אזרחים פרטיים - המאגר שלנו נותן מענה מקיף. הנגשת הפסיקה חשובה לשקיפות מערכת המשפט ולמימוש זכויות הציבור.',
    ],
    relatedSlugs: ['piskei-din', 'hipus-piskei-din', 'piskei-din-bet-mishpat-hamehozi', 'piskei-din-bet-mishpat-hashalom'],
    searchQuery: 'מאגר פסקי דין',
  },
  {
    slug: 'hipus-piskei-din',
    hebrewTitle: 'חיפוש פסקי דין',
    metaTitle: 'חיפוש פסקי דין - חיפוש מהיר במאגר הפסיקה | משפטלי',
    metaDescription: 'חיפוש פסקי דין מהיר ומדויק. חפשו לפי שם, מספר תיק, שופט או נושא. מנוע חיפוש משפטי חכם למציאת פסקי דין מכל בתי המשפט בישראל.',
    h1: 'חיפוש פסקי דין',
    paragraphs: [
      'חיפוש פסקי דין הוא הכלי המרכזי של עורכי דין, יועצים משפטיים ואזרחים לאיתור מידע משפטי רלוונטי. משפטלי מספקת מנוע חיפוש משפטי מתקדם שמאפשר למצוא פסקי דין בקלות ובמהירות.',
      'ניתן לחפש פסקי דין במספר דרכים: חיפוש חופשי לפי מילות מפתח, חיפוש לפי שם של צד להליך (תובע או נתבע), חיפוש לפי מספר תיק, חיפוש לפי שם שופט, או סינון לפי תחום משפטי ספציפי כגון נזיקין, חוזים, עבודה ועוד.',
      'המערכת מציגה תוצאות ממוינות לפי רלוונטיות ומאפשרת סינון נוח. לכל פסק דין מוצג סיכום קצר, פרטי בית המשפט, תאריך מתן פסק הדין ותגיות לנושאים העיקריים שנדונו בו.',
    ],
    relatedSlugs: ['piskei-din', 'magar-piskei-din', 'bdika-piskei-din-lefi-shem', 'hasarat-azkurim'],
    searchQuery: 'חיפוש פסקי דין',
  },
  {
    slug: 'hasarat-shem-mipsak-din',
    hebrewTitle: 'הסרת שם מפסק דין',
    metaTitle: 'הסרת שם מפסק דין - המדריך המלא להסרת שמך מפסיקה באינטרנט 2026 | משפטלי',
    metaDescription: 'מדריך מקיף להסרת שם מפסק דין באינטרנט. שלב אחר שלב: איך להסיר את שמכם ממאגרי פסקי דין, מגוגל ומתולעת המשפט. הזכות להישכח בישראל.',
    h1: 'הסרת שם מפסק דין - המדריך המלא',
    paragraphs: [
      'הסרת שם מפסק דין היא הליך משפטי שמאפשר לאדם שנזכר בפסק דין שפורסם באינטרנט לבקש את הסרת פרטיו המזהים ממאגרי פסקי דין, ממנועי חיפוש כמו גוגל, ומאתרים משפטיים. הצורך בכך עולה כאשר פסק דין ישן פוגע במוניטין, בקריירה, באפשרויות תעסוקה או בחיי היומיום של אדם - גם שנים רבות לאחר שניתן. בעידן הדיגיטלי, כל חיפוש של שמכם בגוגל עלול לחשוף פסקי דין שבהם הייתם מעורבים, וזה יכול לפגוע בכם באופן משמעותי.',
      'מהי הזכות להישכח? על פי הפסיקה בישראל ובהתאם לתקדימים מהאיחוד האירופי, קיימת "זכות להישכח" (Right to be Forgotten) שמקנה לאדם את היכולת לפנות למאגרי מידע משפטיים ולמנועי חיפוש ולבקש את הסרת שמו מתוצאות חיפוש ומפסקי דין ישנים. הזכות אינה מוחלטת ומאוזנת אל מול האינטרס הציבורי בשקיפות מערכת המשפט, אך בית המשפט העליון בישראל הכיר בכך שלאדם עומדת זכות להגנה על פרטיותו ועל שמו הטוב.',
      'שלב 1: איתור פסקי הדין שבהם מופיע שמכם. הצעד הראשון הוא לאתר את כל פסקי הדין שבהם שמכם מופיע באינטרנט. חפשו את שמכם המלא בגוגל ובמאגרי פסקי דין כמו משפטלי, תקדין, נבו, תולעת המשפט ו-myjudgments. רשמו את כל התוצאות שאתם רוצים להסיר.',
      'שלב 2: הגשת בקשת הסרה למאגרי פסקי הדין. לאחר שאיתרתם את פסקי הדין, יש לפנות לכל אתר בנפרד ולהגיש בקשת הסרה. במשפטלי, התהליך פשוט: לחצו על כפתור "בקשת הסרה" בדף פסק הדין, מלאו את הפרטים והצוות שלנו יטפל בבקשה. באתרים אחרים כמו תקדין, ניתן להגיש בקשת הסרת אזכור ישירות מדף פסק הדין.',
      'שלב 3: פנייה לגוגל להסרת תוצאות חיפוש. גם אם פסק הדין הוסר מהאתר המקורי, ייתכן שגוגל עדיין מציג את התוצאה מהמטמון. במקרה כזה, יש להגיש בקשה לגוגל להסרת מידע אישי באמצעות טופס "הזכות להישכח" של גוגל. גוגל בוחנים את הבקשה ומחליטים האם להסיר את התוצאה מהחיפוש.',
      'שלב 4: מעקב ובקרה. לאחר הגשת הבקשות, יש לעקוב אחרי התוצאות. גוגל מעדכן את האינדקס שלו לאורך זמן, כך שייתכן שתוצאות מסוימות ייעלמו רק לאחר מספר שבועות. מומלץ לחפש את שמכם בגוגל אחת לכמה ימים ולבדוק שהתוצאות הוסרו.',
      'מתי בקשת הסרה תתקבל? הסיכויים לקבלת בקשת הסרה גבוהים יותר כאשר: פסק הדין ישן (מעל 5 שנים), מדובר בעניין אזרחי ולא פלילי חמור, אין אינטרס ציבורי מיוחד בפרסום, פסק הדין פוגע בפרטיותכם באופן משמעותי, או כשמדובר בתיק שהסתיים בזיכוי.',
      'במשפטלי אנו מטפלים במאות בקשות הסרה בחודש. השירות שלנו כולל: הסרת שמכם ממאגר פסקי הדין של משפטלי, הנחייה לגבי פנייה לאתרים אחרים, וליווי בתהליך הגשת בקשה לגוגל. להגשת בקשת הסרה, היכנסו לדף פסק הדין באתר ולחצו על "מחיקת אזכור".',
    ],
    relatedSlugs: ['hasarat-azkurim', 'mhikat-psak-din-mgoogle', 'bdika-piskei-din-lefi-shem', 'piskei-din'],
    searchQuery: 'הסרת שם מפסק דין',
  },
  {
    slug: 'mhikat-psak-din-mgoogle',
    hebrewTitle: 'מחיקת פסק דין מגוגל',
    metaTitle: 'מחיקת פסק דין מגוגל - המדריך המלא להסרת פסקי דין מתוצאות חיפוש 2026 | משפטלי',
    metaDescription: 'איך למחוק פסק דין מגוגל? מדריך שלב אחר שלב להסרת פסקי דין מתוצאות החיפוש, מתקדין, מתולעת המשפט ומאתרי פסיקה. הזכות להישכח.',
    h1: 'מחיקת פסק דין מגוגל - המדריך המלא',
    paragraphs: [
      'מחיקת פסק דין מגוגל היא אחת הבקשות הנפוצות ביותר שמגיעות אלינו במשפטלי. כאשר פסק דין מופיע בתוצאות החיפוש של גוגל כשמחפשים את שמכם, הוא עלול לגרום נזק חמור למוניטין שלכם ולפגוע באפשרויות תעסוקה, בעסקים, במשכנתא ואף ביחסים אישיים. מעסיקים, שותפים עסקיים ואפילו שכנים מחפשים שמות בגוגל - ופסק דין ישן יכול לעקוב אחריכם שנים.',
      'למה פסקי דין מופיעים בגוגל? פסקי דין הם מידע ציבורי על פי חוק, ומאגרי פסיקה כמו תקדין, נבו, תולעת המשפט, myjudgments ומשפטלי מנגישים אותם לציבור. גוגל סורק את האתרים הללו ומאנדקס את פסקי הדין, כך שחיפוש של שמכם בגוגל עשוי להציג את פסק הדין בתוצאות הראשונות. ככל שפסק הדין ישן יותר וככל שעבר זמן רב יותר - כך הפגיעה בכם פחות מוצדקת.',
      'שלב 1: מחיקה מהמקור - מאגרי פסקי הדין. הצעד הראשון והחשוב ביותר הוא להגיש בקשת הסרה לאתרים שבהם מופיע פסק הדין. במשפטלי, לחצו על "מחיקת אזכור" בדף פסק הדין. בתקדין, יש כפתור "הסרת אזכור" בכל פסק דין. בתולעת המשפט וב-myjudgments, צרו קשר עם צוות האתר. אם פסק הדין מופיע גם באתר הרשות השופטת, ניתן לפנות באמצעות טופס פנייה לציבור.',
      'שלב 2: פנייה לגוגל - הזכות להישכח. לאחר שהתוכן הוסר מהמקור, פנו לגוגל והגישו בקשת הסרה. גוגל מציעים טופס ייעודי להסרת מידע אישי מתוצאות החיפוש. מלאו את הטופס עם קישורים ספציפיים לתוצאות שאתם רוצים להסיר. גוגל בוחנים כל בקשה ומחליטים תוך מספר ימים עד שבועות.',
      'שלב 3: הסרה מ-Bing ומנועי חיפוש אחרים. אל תשכחו שגם Bing, Yahoo ומנועי חיפוש נוספים מציגים פסקי דין. ל-Bing יש טופס דומה להסרת מידע אישי. מומלץ להגיש בקשות הסרה לכל מנועי החיפוש במקביל.',
      'כמה זמן לוקח? מרגע הגשת בקשת ההסרה למאגר פסקי הדין, התהליך לוקח בדרך כלל 1-7 ימי עסקים. הסרה מגוגל לוקחת בין שבוע ל-4 שבועות, כי גוגל צריך לסרוק מחדש את הדף ולוודא שהתוכן אכן הוסר. בסך הכל, תהליך מלא של מחיקת פסק דין מגוגל אורך בין שבועיים לחודשיים.',
      'מה אם הבקשה נדחית? במקרים מסוימים, גוגל או מאגר פסקי הדין עשויים לדחות את הבקשה - למשל כשמדובר בפסק דין פלילי חמור עם אינטרס ציבורי גבוה. במקרה כזה, האפשרויות הן: פנייה לבית המשפט בבקשה לאנונימיזציה של פסק הדין, יצירת תוכן חיובי שידחוף את פסק הדין למטה בתוצאות, או פנייה לעורך דין המתמחה בהגנת פרטיות ברשת.',
      'משפטלי מסייעת בתהליך. אנו מטפלים בבקשות הסרה מהמאגר שלנו ומנחים את הפונים כיצד לפעול גם מול גוגל ומנועי חיפוש אחרים. להגשת בקשת הסרה, חפשו את שמכם באתר, היכנסו לדף פסק הדין ולחצו על "מחיקת אזכור". בקשות מטופלות תוך 1-3 ימי עסקים.',
    ],
    relatedSlugs: ['hasarat-shem-mipsak-din', 'hasarat-azkurim', 'bdika-piskei-din-lefi-shem', 'piskei-din'],
    searchQuery: 'מחיקת פסק דין מגוגל',
  },
  {
    slug: 'piskei-din-bet-mishpat-hashalom',
    hebrewTitle: 'פסקי דין בית משפט השלום',
    metaTitle: 'פסקי דין בית משפט השלום - מאגר פסיקת השלום | משפטלי',
    metaDescription: 'חיפוש פסקי דין של בית משפט השלום בכל רחבי ישראל. מאגר פסיקה מקיף הכולל תביעות אזרחיות, תיקים פליליים ועוד מכל סניפי השלום.',
    h1: 'פסקי דין בית משפט השלום',
    paragraphs: [
      'בית משפט השלום הוא הערכאה השיפוטית הראשונה במערכת בתי המשפט בישראל ודן בחלק הארי של התיקים המשפטיים. סמכותו כוללת תביעות אזרחיות בסכומים של עד 2.5 מיליון שקלים, תיקים פליליים שעונשם עד 7 שנות מאסר, ותיקים נוספים.',
      'המאגר שלנו כולל פסקי דין מכל סניפי בית משפט השלום ברחבי הארץ - תל אביב, ירושלים, חיפה, באר שבע, נתניה, פתח תקווה, ראשון לציון ועוד. ניתן לסנן את התוצאות לפי סניף, שנה ותחום משפטי.',
      'פסקי דין של בית משפט השלום מהווים מקור חשוב להבנת הפסיקה בתחומים כגון סכסוכי שכנים, תביעות קטנות, תעבורה, עבירות פליליות קלות ותביעות אזרחיות. חפשו במאגר שלנו ומצאו את פסקי הדין הרלוונטיים עבורכם.',
    ],
    relatedSlugs: ['piskei-din', 'piskei-din-bet-mishpat-hamehozi', 'hipus-piskei-din', 'magar-piskei-din'],
    searchQuery: 'בית משפט השלום',
  },
  {
    slug: 'piskei-din-bet-mishpat-hamehozi',
    hebrewTitle: 'פסקי דין בית המשפט המחוזי',
    metaTitle: 'פסקי דין בית המשפט המחוזי - מאגר פסיקה מחוזית | משפטלי',
    metaDescription: 'חיפוש פסקי דין של בתי המשפט המחוזיים בישראל. פסיקה בתחומי אזרחי, פלילי, מנהלי, תכנון ובנייה ועוד מכל המחוזות.',
    h1: 'פסקי דין בית המשפט המחוזי',
    paragraphs: [
      'בית המשפט המחוזי הוא ערכאת ביניים במערכת המשפט הישראלית ודן בתיקים בעלי משקל משפטי וכלכלי משמעותי. הוא משמש הן כערכאה ראשונה לתביעות בסכומים גבוהים והן כערכאת ערעור על פסקי דין של בית משפט השלום.',
      'בישראל פועלים שישה בתי משפט מחוזיים: תל אביב, ירושלים, חיפה, באר שבע, נצרת ולוד (מרכז). כל בית משפט מחוזי מפרסם מאות פסקי דין בשנה בתחומים מגוונים, כולל אזרחי, פלילי, מנהלי, פשיטת רגל ועוד.',
      'פסקי הדין של בתי המשפט המחוזיים מהווים תקדימים חשובים ומשפיעים על הפסיקה בערכאות הנמוכות. במאגר משפטלי תמצאו פסקי דין מכל בתי המשפט המחוזיים, עם אפשרויות חיפוש וסינון מתקדמות.',
    ],
    relatedSlugs: ['piskei-din', 'piskei-din-bet-mishpat-hashalom', 'hipus-piskei-din', 'magar-piskei-din'],
    searchQuery: 'בית המשפט המחוזי',
  },
  {
    slug: 'piskei-din-dinei-avoda',
    hebrewTitle: 'פסקי דין דיני עבודה',
    metaTitle: 'פסקי דין דיני עבודה - פסיקה בתחום העבודה | משפטלי',
    metaDescription: 'מאגר פסקי דין בתחום דיני עבודה. חיפוש פסיקה בנושאי פיטורין, שכר, תנאים סוציאליים, הטרדה מינית, חופשה, מחלה ועוד.',
    h1: 'פסקי דין דיני עבודה',
    paragraphs: [
      'דיני עבודה הם אחד התחומים המשפטיים הדינמיים ביותר בישראל, והפסיקה בתחום זה משתנה ומתפתחת כל הזמן. פסקי הדין בתחום העבודה ניתנים על ידי בתי הדין האזוריים לעבודה ובית הדין הארצי לעבודה.',
      'המאגר שלנו כולל פסקי דין בנושאים מגוונים: פיטורין שלא כדין, אי-תשלום שכר, זכויות סוציאליות (פנסיה, הבראה, נסיעות), הטרדה מינית, אפליה בעבודה, תאונות עבודה, יחסי עובד-מעסיק ועוד.',
      'חיפוש פסקי דין בתחום דיני העבודה חשוב במיוחד לעובדים המעוניינים לדעת את זכויותיהם, למעסיקים הרוצים להבין את חובותיהם, ולעורכי דין המייצגים בתיקי עבודה. היכנסו לחיפוש ומצאו פסקי דין רלוונטיים.',
    ],
    relatedSlugs: ['piskei-din', 'piskei-din-nezikin', 'piskei-din-hozim', 'hipus-piskei-din'],
    searchQuery: 'דיני עבודה',
  },
  {
    slug: 'piskei-din-nezikin',
    hebrewTitle: 'פסקי דין נזיקין',
    metaTitle: 'פסקי דין נזיקין - פסיקה בתחום דיני הנזיקין | משפטלי',
    metaDescription: 'מאגר פסקי דין בתחום הנזיקין. חיפוש פסיקה בנושאי רשלנות, תאונות דרכים, נזקי גוף, רשלנות רפואית, פיצויים ועוד.',
    h1: 'פסקי דין נזיקין',
    paragraphs: [
      'דיני הנזיקין עוסקים בפיצוי על נזקים שנגרמו לאדם או לרכושו כתוצאה ממעשה עוולה של אחר. זהו אחד התחומים המשפטיים הנרחבים ביותר, הכולל תביעות בגין רשלנות, תאונות דרכים, נזקי גוף, רשלנות רפואית, נפילות, פגיעות ועוד.',
      'פסקי הדין בתחום הנזיקין קובעים תקדימים חשובים בנוגע לאחריות, קביעת אשם תורם, הערכת נזק וחישוב פיצויים. פסיקת בתי המשפט בתחום זה משפיעה ישירות על גובה הפיצויים שנפסקים בתיקים דומים.',
      'במאגר משפטלי תמצאו מגוון רחב של פסקי דין בנזיקין, מסודרים לפי סוג הנזק, סוג העוולה וגובה הפיצוי. חיפוש ממוקד בתחום זה יסייע לכם להבין את הפסיקה ולהעריך את סיכויי התביעה שלכם.',
    ],
    relatedSlugs: ['piskei-din', 'piskei-din-dinei-avoda', 'piskei-din-hozim', 'hipus-piskei-din'],
    searchQuery: 'נזיקין',
  },
  {
    slug: 'piskei-din-hozim',
    hebrewTitle: 'פסקי דין חוזים',
    metaTitle: 'פסקי דין חוזים - פסיקה בדיני חוזים | משפטלי',
    metaDescription: 'מאגר פסקי דין בתחום דיני החוזים. חיפוש פסיקה בנושאי הפרת חוזה, ביטול חוזה, פיצויים חוזיים, חוזי מכר, שכירות ועוד.',
    h1: 'פסקי דין חוזים',
    paragraphs: [
      'דיני החוזים הם מאבני היסוד של המשפט האזרחי בישראל. כל עסקה מסחרית, הסכם שכירות, רכישת דירה או התקשרות עסקית מבוססת על דיני החוזים. כשצד מפר את התחייבויותיו, הפסיקה בתחום זה קובעת את הסעדים העומדים לרשות הצד הנפגע.',
      'פסקי הדין בתחום דיני החוזים עוסקים בסוגיות כגון: כריתת חוזה, תום לב במשא ומתן, הפרת חוזה, ביטול חוזה מחמת טעות או הטעיה, פיצויים בגין הפרה, אכיפת חוזה ופרשנות חוזית.',
      'המאגר שלנו מאפשר חיפוש ממוקד בפסקי דין הקשורים לדיני חוזים. תוכלו למצוא תקדימים רלוונטיים בנושאי חוזי מכר מקרקעין, חוזי שכירות, חוזי עבודה, חוזים מסחריים, חוזי שירותים ועוד.',
    ],
    relatedSlugs: ['piskei-din', 'piskei-din-nezikin', 'piskei-din-dinei-avoda', 'hipus-piskei-din'],
    searchQuery: 'חוזים',
  },
  {
    slug: 'bdika-piskei-din-lefi-shem',
    hebrewTitle: 'בדיקת פסקי דין לפי שם',
    metaTitle: 'בדיקת פסקי דין לפי שם - חיפוש שם בפסיקה | משפטלי',
    metaDescription: 'בדיקת פסקי דין לפי שם אדם או חברה. גלו האם שמכם מופיע בפסקי דין באינטרנט. חיפוש מהיר ודיסקרטי במאגר הפסיקה.',
    h1: 'בדיקת פסקי דין לפי שם',
    paragraphs: [
      'בדיקת פסקי דין לפי שם היא אחת הפעולות הנפוצות ביותר במאגרי מידע משפטיים. אנשים רבים מעוניינים לבדוק האם שמם מופיע בפסקי דין המפורסמים באינטרנט - בין אם מתוך סקרנות, לצורכי בדיקת רקע, או כדי לוודא שפרטיותם נשמרת.',
      'באמצעות משפטלי תוכלו לבצע חיפוש מהיר ודיסקרטי לפי שם מלא או חלקי. המערכת סורקת את כל מאגר הפסיקה ומציגה תוצאות רלוונטיות הכוללות פסקי דין שבהם מופיע השם כתובע, נתבע, עד או גורם אחר.',
      'אם גיליתם שפסק דין שבו שמכם מופיע פוגע בפרטיותכם או במוניטין שלכם, תוכלו להגיש בקשת הסרה ישירות דרך המערכת. שירות ההסרה שלנו מאפשר לכם להגן על שמכם הטוב ועל פרטיותכם באינטרנט.',
    ],
    relatedSlugs: ['hipus-piskei-din', 'hasarat-shem-mipsak-din', 'hasarat-azkurim', 'piskei-din'],
    searchQuery: '',
  },
  {
    slug: 'mishpat-plili',
    hebrewTitle: 'משפט פלילי',
    metaTitle: 'משפט פלילי - פסקי דין פליליים מכל בתי המשפט | משפטלי',
    metaDescription: 'מאגר פסקי דין בתחום המשפט הפלילי. חיפוש פסיקה פלילית לפי שם נאשם, מספר תיק, סוג עבירה ובית משפט. פסקי דין פליליים עדכניים מכל הערכאות.',
    h1: 'משפט פלילי - מאגר פסקי דין פליליים',
    paragraphs: [
      'המשפט הפלילי בישראל עוסק בעבירות על החוק ובענישת עבריינים. פסקי דין פליליים ניתנים על ידי כל ערכאות בתי המשפט - מבית משפט השלום (עבירות שעונשן עד 7 שנות מאסר) דרך בית המשפט המחוזי (עבירות חמורות) ועד בית המשפט העליון (ערעורים פליליים).',
      'במאגר משפטלי תמצאו פסקי דין פליליים בנושאים מגוונים: עבירות אלימות, עבירות רכוש, עבירות מין, עבירות סמים, עבירות צווארון לבן, הונאה, זיוף, נהיגה בשכרות, עבירות תנועה חמורות ועוד. כל פסק דין כולל פרטי התיק, שמות הצדדים, השופט והחלטת בית המשפט.',
      'חיפוש פסקי דין פליליים חשוב לעורכי דין פליליים המחפשים תקדימים, לנאשמים המעוניינים להבין את העונשים המקובלים, ולכל מי שמעוניין לבדוק רקע פלילי. אם שמכם מופיע בפסק דין פלילי ואתם מעוניינים בהסרתו, ניתן להגיש בקשת הסרה דרך המערכת.',
    ],
    relatedSlugs: ['piskei-din', 'piskei-din-bet-mishpat-hashalom', 'piskei-din-bet-mishpat-hamehozi', 'hasarat-azkurim'],
    searchQuery: 'פלילי',
  },
  {
    slug: 'mishpat-li',
    hebrewTitle: 'משפט לי',
    metaTitle: 'משפט לי - משפטלי | מאגר פסקי דין לחיפוש לפי שם',
    metaDescription: 'משפט לי (משפטלי) - המאגר המשפטי המוביל בישראל לחיפוש פסקי דין לפי שם. חפשו פסקי דין, בדקו רקע משפטי והגישו בקשות הסרה. משפט לי - המידע המשפטי שלך.',
    h1: 'משפט לי - המאגר המשפטי שלך',
    paragraphs: [
      'משפט לי (משפטלי) הוא המאגר המשפטי המקיף ביותר בישראל לחיפוש פסקי דין לפי שם. בין אם אתם מחפשים פסק דין ספציפי, רוצים לבדוק האם שמכם מופיע בפסיקה, או מעוניינים להסיר אזכור משפטי - משפט לי נותן לכם את כל הכלים.',
      'השם "משפט לי" מבטא את הרעיון שהמידע המשפטי שייך לכולם. כל אזרח זכאי לגישה חופשית לפסיקה הישראלית, לדעת מה נפסק בתיקים שמעניינים אותו, ולהגן על פרטיותו כשמידע אישי מפורסם ללא הסכמתו.',
      'משפט לי מאגד פסקי דין מכל בתי המשפט בישראל - בית המשפט העליון, בתי המשפט המחוזיים, בתי משפט השלום, בתי הדין לעבודה ובתי המשפט לענייני משפחה. חיפוש חינמי, מהיר ודיסקרטי.',
    ],
    relatedSlugs: ['piskei-din', 'hipus-piskei-din', 'bdika-piskei-din-lefi-shem', 'magar-piskei-din'],
    searchQuery: '',
  },
  {
    slug: 'piskei-din-lefi-shem',
    hebrewTitle: 'פסקי דין לפי שם',
    metaTitle: 'פסקי דין לפי שם - חיפוש שם בפסקי דין | משפטלי',
    metaDescription: 'חיפוש פסקי דין לפי שם אדם או חברה. בדקו האם שמכם מופיע בפסקי דין. חיפוש מהיר, חינמי ודיסקרטי במאגר הפסיקה הישראלית.',
    h1: 'פסקי דין לפי שם - חיפוש שם במאגר הפסיקה',
    paragraphs: [
      'חיפוש פסקי דין לפי שם הוא הכלי המרכזי של משפטלי. הזינו שם של אדם, חברה או עמותה ומצאו את כל פסקי הדין שבהם הם מוזכרים - כתובעים, כנתבעים, כעדים או כצדדים אחרים להליך.',
      'רבים מחפשים פסקי דין לפי שם כדי לבצע בדיקת רקע, לוודא שאין פסקי דין נגדם, או כדי לאתר מידע על צד שני בעסקה. המערכת שלנו מאפשרת חיפוש לפי שם מלא או חלקי, עם תוצאות מדויקות ורלוונטיות.',
      'כל פסק דין שנמצא במאגר מוצג עם שם הנתבע, שם התובע, בית המשפט, תאריך ותקציר. אם מצאתם פסק דין שפוגע בפרטיותכם, ניתן להגיש בקשת הסרה ישירות מדף פסק הדין.',
    ],
    relatedSlugs: ['bdika-piskei-din-lefi-shem', 'hipus-piskei-din', 'hasarat-shem-mipsak-din', 'piskei-din'],
    searchQuery: '',
  },
  {
    slug: 'hipus-shem-bpiskei-din',
    hebrewTitle: 'חיפוש שם בפסקי דין',
    metaTitle: 'חיפוש שם בפסקי דין - בדיקת שם במאגר פסיקה | משפטלי',
    metaDescription: 'חיפוש שם בפסקי דין - בדקו האם שמכם או שם של אדם אחר מופיע בפסקי דין באינטרנט. חיפוש מהיר וחינמי במאגר משפטלי.',
    h1: 'חיפוש שם בפסקי דין',
    paragraphs: [
      'חיפוש שם בפסקי דין הפך לפעולה נפוצה בעידן הדיגיטלי. כל אדם יכול לחפש את שמו או את שמם של אחרים ולבדוק האם הם מוזכרים בפסקי דין שפורסמו באינטרנט. המידע הזה חשוב לבדיקות רקע, לפני חתימה על עסקאות או לפני גיוס עובדים.',
      'משפטלי מאפשרת חיפוש שם בפסקי דין מכל בתי המשפט בישראל. פשוט הקלידו את השם בשורת החיפוש והמערכת תציג את כל פסקי הדין הרלוונטיים עם פרטים מלאים - שם התובע, שם הנתבע, בית המשפט ותקציר.',
      'אם גיליתם שהשם שלכם מופיע בפסק דין ואתם רוצים להסירו, ניתן להגיש בקשת הסרה. הזכות להישכח מאפשרת לכם לבקש הסרת שמכם מפסקי דין ישנים שפוגעים בפרטיותכם.',
    ],
    relatedSlugs: ['piskei-din-lefi-shem', 'bdika-piskei-din-lefi-shem', 'hasarat-shem-mipsak-din', 'hipus-piskei-din'],
    searchQuery: '',
  },
  {
    slug: 'piskei-din-neged',
    hebrewTitle: 'פסקי דין נגד',
    metaTitle: 'פסקי דין נגד - חיפוש פסקי דין לפי שם נתבע | משפטלי',
    metaDescription: 'חיפוש פסקי דין נגד אדם או חברה. מצאו את כל פסקי הדין שניתנו נגד נתבע ספציפי מכל בתי המשפט בישראל.',
    h1: 'פסקי דין נגד - חיפוש לפי שם נתבע',
    paragraphs: [
      'חיפוש פסקי דין נגד אדם או חברה מאפשר לבדוק את ההיסטוריה המשפטית שלהם. כשמחפשים "פסקי דין נגד" ואחריו שם, מקבלים תמונה מלאה של כל ההליכים המשפטיים שבהם אותו אדם או חברה היו נתבעים.',
      'חיפוש כזה חשוב במיוחד לפני כניסה לעסקאות, בעת ביצוע בדיקת נאותות, או לצורך הערכת סיכונים. אם אתם שוקלים לעשות עסקים עם מישהו, כדאי לבדוק האם יש פסקי דין נגדו בנושאים כמו הפרת חוזה, הונאה או חובות.',
      'במשפטלי תוכלו לחפש פסקי דין נגד כל אדם או חברה. כל תוצאה מציגה את שם הנתבע בצורה בולטת, יחד עם פרטי התיק, בית המשפט והתוצאה. החיפוש חינמי ודיסקרטי.',
    ],
    relatedSlugs: ['piskei-din-lefi-shem', 'bdika-piskei-din-lefi-shem', 'hipus-piskei-din', 'piskei-din'],
    searchQuery: '',
  },
  {
    slug: 'bdikat-reka-mishpati',
    hebrewTitle: 'בדיקת רקע משפטי',
    metaTitle: 'בדיקת רקע משפטי - חיפוש פסקי דין לפי שם | משפטלי',
    metaDescription: 'בדיקת רקע משפטי חינמית. בדקו האם לאדם או לחברה יש פסקי דין. חיפוש מהיר ומקיף במאגר הפסיקה הישראלית.',
    h1: 'בדיקת רקע משפטי',
    paragraphs: [
      'בדיקת רקע משפטי היא תהליך שבו בודקים האם לאדם, לחברה או לעמותה יש הליכים משפטיים או פסקי דין. בדיקה כזו חשובה לפני חתימה על חוזים, גיוס עובדים, השקעות, ועסקאות נדל"ן.',
      'משפטלי מאפשרת לבצע בדיקת רקע משפטי בקלות ובמהירות. הזינו את השם ותקבלו רשימה מלאה של כל פסקי הדין הקשורים - כולל פרטי בית המשפט, סוג ההליך, התוצאה ותקציר. כל המידע זמין בחינם ובצורה דיסקרטית.',
      'שימו לב: בדיקת רקע משפטי אינה מחליפה בדיקה מקיפה הכוללת בדיקת פלילית רשמית, בדיקת חדלות פירעון ובדיקות נוספות. עם זאת, חיפוש בפסקי דין נותן מידע חשוב וזמין מיידית.',
    ],
    relatedSlugs: ['piskei-din-lefi-shem', 'bdika-piskei-din-lefi-shem', 'piskei-din-neged', 'hipus-piskei-din'],
    searchQuery: '',
  },
  {
    slug: 'hipus-psak-din-lefi-tz',
    hebrewTitle: 'חיפוש פסק דין לפי תעודת זהות',
    metaTitle: 'חיפוש פסק דין לפי תעודת זהות - איתור תיקים משפטיים | משפטלי',
    metaDescription: 'חיפוש פסק דין לפי תעודת זהות או שם. איתור תיקים משפטיים, פסקי דין והחלטות מכל בתי המשפט בישראל. חיפוש חינמי ומהיר באתר משפטלי.',
    h1: 'חיפוש פסק דין לפי תעודת זהות',
    paragraphs: [
      'חיפוש פסק דין לפי תעודת זהות הוא אחד החיפושים הנפוצים ביותר בתחום המשפטי בישראל. אנשים רבים מעוניינים לבדוק האם יש פסקי דין או תיקים משפטיים הרשומים על שמם או על שם אחרים, לצורכי בדיקת רקע, לפני כניסה לעסקה, או סתם מתוך סקרנות.',
      'חשוב לדעת: חיפוש פסקי דין לפי מספר תעודת זהות אינו אפשרי באופן ישיר ברוב המאגרים המשפטיים הפתוחים לציבור. הסיבה היא שפסקי דין מפורסמים עם שמות הצדדים ומספרי תיק, ולא עם מספרי תעודת זהות (למעט מערכת נט המשפט הפנימית של בתי המשפט). לכן, הדרך היעילה ביותר לאתר פסקי דין היא חיפוש לפי שם מלא.',
      'במשפטלי ניתן לחפש פסקי דין לפי שם אדם, שם חברה, מספר תיק או שם שופט. המערכת סורקת את כל מאגר הפסיקה ומציגה תוצאות רלוונטיות מכל בתי המשפט בישראל - בית המשפט העליון, בתי המשפט המחוזיים, בתי משפט השלום, בתי הדין לעבודה ובתי המשפט לענייני משפחה.',
      'אם אתם מעוניינים בגישה מלאה לתיק ספציפי (כולל כתבי טענות ופרוטוקולים), ניתן לפנות למזכירות בית המשפט הרלוונטי עם מספר תעודת הזהות ולבקש עיון בתיק. לחלופין, ניתן להיכנס למערכת נט המשפט עם הזדהות דיגיטלית.',
    ],
    relatedSlugs: ['piskei-din-lefi-shem', 'bdika-piskei-din-lefi-shem', 'itur-tik-beit-mishpat', 'bdikat-reka-mishpati'],
    searchQuery: '',
  },
  {
    slug: 'itur-tik-beit-mishpat',
    hebrewTitle: 'איתור תיק בבית משפט',
    metaTitle: 'איתור תיק בבית משפט - חיפוש תיקים משפטיים | משפטלי',
    metaDescription: 'איתור תיק בבית משפט לפי שם או מספר תיק. חיפוש תיקים משפטיים מכל בתי המשפט בישראל. מדריך מלא לאיתור תיקים - נט המשפט ומאגרי פסיקה.',
    h1: 'איתור תיק בבית משפט',
    paragraphs: [
      'איתור תיק בבית משפט הוא צורך נפוץ בקרב אזרחים, עורכי דין ובעלי עסקים. ישנן מספר דרכים לאתר תיק בבית המשפט: דרך מערכת נט המשפט של הרשות השופטת, דרך מאגרי פסקי דין חינמיים כמו משפטלי, או באמצעות פנייה ישירה למזכירות בית המשפט.',
      'במשפטלי ניתן לאתר תיקים משפטיים לפי שם של צד להליך (תובע, נתבע, שופט), לפי מספר תיק, או לפי מילות מפתח. המערכת מכילה אלפי פסקי דין והחלטות מכל בתי המשפט בישראל ומתעדכנת באופן יומי.',
      'לאיתור תיק במערכת נט המשפט של הרשות השופטת, יש צורך בהזדהות דיגיטלית או בכרטיס חכם. מערכת זו מאפשרת צפייה בפרטי תיקים שאתם צד להם, כולל מועדי דיון, כתבי טענות, החלטות ופסקי דין. תיקים שאינכם צד להם ניתנים לצפייה חלקית בלבד.',
      'חשוב לזכור: לא כל המידע המשפטי נגיש לציבור. תיקי משפחה, תיקי נוער ותיקים שהוטל עליהם חיסיון אינם פתוחים לעיון ציבורי. בנוסף, חלק מפסקי הדין מפורסמים בצורה אנונימית (ללא שמות הצדדים) בהתאם להחלטת בית המשפט.',
    ],
    relatedSlugs: ['hipus-psak-din-lefi-tz', 'net-hamishpat-hipus', 'bdikat-tikim-ptuhim', 'hipus-piskei-din'],
    searchQuery: '',
  },
  {
    slug: 'net-hamishpat-hipus',
    hebrewTitle: 'נט המשפט חיפוש תיקים',
    metaTitle: 'נט המשפט - חיפוש תיקים ופסקי דין | מדריך מלא | משפטלי',
    metaDescription: 'מדריך מלא לשימוש בנט המשפט - מערכת חיפוש התיקים של הרשות השופטת. איך לחפש תיקים, לצפות בפסקי דין ולמצוא מועדי דיון. חלופה חינמית: משפטלי.',
    h1: 'נט המשפט - חיפוש תיקים ופסקי דין',
    paragraphs: [
      'נט המשפט היא מערכת ניהול התיקים האלקטרונית של הרשות השופטת בישראל. המערכת מאפשרת לעורכי דין, לצדדים להליך ולציבור הרחב לצפות בתיקים משפטיים, לבדוק מועדי דיון ולקרוא החלטות ופסקי דין.',
      'כדי לחפש תיקים בנט המשפט, יש להיכנס לאתר הרשות השופטת ולהזדהות באמצעות הזדהות ממשלתית או כרטיס חכם. לאחר ההזדהות, ניתן לחפש תיקים לפי מספר תיק, שם צד, או מספר תעודת זהות.',
      'חלופה נגישה יותר: משפטלי מציעה חיפוש חינמי בפסקי דין ללא צורך בהזדהות. המאגר שלנו כולל אלפי פסקי דין מכל בתי המשפט ומתעדכן מדי יום. פשוט הקלידו שם או מספר תיק ותקבלו תוצאות מיידיות.',
      'ההבדלים בין נט המשפט למשפטלי: נט המשפט מציגה מידע מלא על תיקים (כתבי טענות, פרוטוקולים, מועדים) אך דורשת הזדהות. משפטלי מציגה פסקי דין והחלטות בלבד אך נגישה מיידית ללא הרשמה. מומלץ להשתמש בשניהם לקבלת תמונה מלאה.',
    ],
    relatedSlugs: ['itur-tik-beit-mishpat', 'hipus-psak-din-lefi-tz', 'bdikat-tikim-ptuhim', 'hipus-piskei-din'],
    searchQuery: '',
  },
  {
    slug: 'bdikat-tikim-ptuhim',
    hebrewTitle: 'בדיקת תיקים פתוחים',
    metaTitle: 'בדיקת תיקים פתוחים - חיפוש תיקים משפטיים פתוחים | משפטלי',
    metaDescription: 'בדיקת תיקים פתוחים בבתי המשפט. בדקו האם יש תיקים משפטיים פתוחים על שמכם או על שם אחרים. חיפוש חינמי במאגר משפטלי.',
    h1: 'בדיקת תיקים פתוחים',
    paragraphs: [
      'בדיקת תיקים פתוחים היא פעולה חשובה לפני כניסה לעסקאות, גיוס עובדים, או בחירת שותף עסקי. תיק פתוח בבית משפט מעיד על הליך משפטי שטרם הסתיים - תביעה אזרחית, הליך פלילי, בקשה לפירוק חברה או הליכי חדלות פירעון.',
      'איך בודקים תיקים פתוחים? ישנן מספר דרכים: (1) חיפוש בנט המשפט עם הזדהות דיגיטלית, (2) חיפוש במאגרי פסקי דין כמו משפטלי - שם ניתן לראות פסקי דין והחלטות, (3) בדיקה באתר רשם החברות לגבי חברות, (4) פנייה למזכירות בית המשפט.',
      'במשפטלי תוכלו לחפש את שמו של כל אדם או חברה ולראות את כל פסקי הדין הקשורים אליהם. אם ישנם תיקים שעדיין בהליכים - ייתכן שנמצא החלטות ביניים או פסקי דין חלקיים. המאגר מתעדכן מדי יום עם מידע חדש מהרשות השופטת.',
      'חשוב: בדיקת תיקים פתוחים במשפטלי מציגה מידע על פסקי דין והחלטות שהתפרסמו. לתמונה מלאה של כל התיקים (כולל אלו שטרם ניתנה בהם החלטה), מומלץ גם לבדוק בנט המשפט או לפנות לעורך דין.',
    ],
    relatedSlugs: ['itur-tik-beit-mishpat', 'bdikat-reka-mishpati', 'hipus-psak-din-lefi-tz', 'piskei-din-neged'],
    searchQuery: '',
  },
  {
    slug: 'piskei-din-lehorada-hinam',
    hebrewTitle: 'פסקי דין להורדה חינם',
    metaTitle: 'פסקי דין להורדה חינם - הורדת פסקי דין PDF | משפטלי',
    metaDescription: 'פסקי דין להורדה חינם בפורמט PDF. צפייה בעמוד הראשון בחינם, הורדה מלאה במחיר מוזל. מאגר פסקי דין מעודכן מכל בתי המשפט בישראל.',
    h1: 'פסקי דין להורדה חינם',
    paragraphs: [
      'משפטלי מציעה גישה חינמית לתקצירי פסקי דין ולעמוד הראשון של כל מסמך. ניתן לצפות בפרטי התיק, שמות הצדדים, שם השופט, תקציר ההחלטה ואף להוריד את העמוד הראשון של פסק הדין בחינם בפורמט PDF.',
      'לצפייה במסמך המלא של פסק הדין (כל העמודים), ניתן לרכוש הורדה מלאה. המחיר כולל את המסמך המלא כפי שפורסם על ידי הרשות השופטת, בפורמט PDF נוח לקריאה ולהדפסה.',
      'מאגרים אחרים כמו נבו ותקדין דורשים מנוי חודשי של מאות שקלים. במשפטלי, אתם משלמים רק על מה שאתם צריכים - ללא מנוי, ללא התחייבות. חיפוש וצפייה בתקציר - תמיד בחינם.',
      'איך זה עובד? (1) חפשו את פסק הדין לפי שם או מספר תיק, (2) צפו בתקציר ובפרטי התיק בחינם, (3) הורידו את העמוד הראשון בחינם, (4) אם אתם צריכים את המסמך המלא - רכשו הורדה בלחיצה אחת.',
    ],
    relatedSlugs: ['magar-piskei-din-hinam', 'piskei-din', 'hipus-piskei-din', 'magar-piskei-din'],
    searchQuery: '',
  },
  {
    slug: 'hipus-tik-lefi-shem',
    hebrewTitle: 'חיפוש תיק לפי שם',
    metaTitle: 'חיפוש תיק לפי שם - איתור תיקים משפטיים לפי שם | משפטלי',
    metaDescription: 'חיפוש תיק משפטי לפי שם אדם, חברה או עמותה. מצאו תיקים ופסקי דין מכל בתי המשפט בישראל. חיפוש חינמי ומהיר במאגר משפטלי.',
    h1: 'חיפוש תיק לפי שם',
    paragraphs: [
      'חיפוש תיק משפטי לפי שם הוא הדרך הנפוצה ביותר לאתר מידע משפטי על אדם או חברה. במשפטלי ניתן להקליד כל שם - של אדם פרטי, חברה, עמותה או כל ישות אחרת - ולקבל מיידית את כל פסקי הדין שבהם השם מוזכר.',
      'המערכת מחפשת את השם בכל השדות הרלוונטיים: שם תובע, שם נתבע, שם שופט/ת, ואף בגוף פסק הדין. כך מתקבלת תמונה מלאה של כל ההליכים המשפטיים הקשורים לאותו שם.',
      'חיפוש תיק לפי שם חשוב במיוחד עבור: בדיקות רקע לפני עסקאות, בדיקת שותפים עסקיים פוטנציאליים, בדיקת היסטוריה משפטית של דיירים או שוכרים, בדיקת מועמדים לעבודה, או סתם בדיקה האם שמכם מופיע בפסיקה.',
      'כל התוצאות מוצגות עם מלוא הפרטים: מספר תיק, בית משפט, שם שופט/ת, תאריך, שמות הצדדים ותקציר. ניתן גם להוריד את פסק הדין בפורמט PDF.',
    ],
    relatedSlugs: ['piskei-din-lefi-shem', 'itur-tik-beit-mishpat', 'bdikat-reka-mishpati', 'hipus-piskei-din'],
    searchQuery: '',
  },
  {
    slug: 'bdikat-avar-mishpati',
    hebrewTitle: 'בדיקת עבר משפטי',
    metaTitle: 'בדיקת עבר משפטי - חיפוש היסטוריה משפטית לפי שם | משפטלי',
    metaDescription: 'בדיקת עבר משפטי חינמית. גלו האם לאדם או לחברה יש עבר משפטי - תביעות, פסקי דין, הליכים פליליים. חיפוש מהיר ודיסקרטי במשפטלי.',
    h1: 'בדיקת עבר משפטי',
    paragraphs: [
      'בדיקת עבר משפטי היא תהליך שבו בודקים את ההיסטוריה המשפטית של אדם או חברה. בדיקה זו חושפת תביעות אזרחיות, הליכים פליליים, חדלות פירעון ועוד - מידע שיכול להיות קריטי לפני קבלת החלטות עסקיות או אישיות.',
      'מתי כדאי לבצע בדיקת עבר משפטי? לפני חתימה על חוזה שכירות, לפני כניסה לשותפות עסקית, לפני העסקת עובד בתפקיד אמון, לפני רכישת נכס, לפני מתן הלוואה, ולפני כל עסקה משמעותית.',
      'במשפטלי, בדיקת עבר משפטי פשוטה: הקלידו את שם האדם או החברה בחיפוש ותקבלו מיידית רשימה של כל פסקי הדין וההחלטות הקשורים. המידע כולל: סוג ההליך (אזרחי/פלילי), בית המשפט, תאריך, והאם האדם היה תובע או נתבע.',
      'שימו לב: בדיקת עבר משפטי במשפטלי מבוססת על פסקי דין שפורסמו. לא כל ההליכים המשפטיים מסתיימים בפסק דין מפורסם. לבדיקה מקיפה יותר, מומלץ גם לבדוק בנט המשפט, באתר רשם החברות, ובמאגר ההוצאה לפועל.',
    ],
    relatedSlugs: ['bdikat-reka-mishpati', 'piskei-din-neged', 'bdikat-tikim-ptuhim', 'hipus-tik-lefi-shem'],
    searchQuery: '',
  },
  {
    slug: 'piskei-din-hadashim-hayom',
    hebrewTitle: 'פסקי דין חדשים היום',
    metaTitle: 'פסקי דין חדשים היום - פסיקה עדכנית מכל בתי המשפט | משפטלי',
    metaDescription: 'פסקי דין חדשים שפורסמו היום. עדכוני פסיקה יומיים מכל בתי המשפט בישראל - עליון, מחוזי, שלום, עבודה ומשפחה. מאגר משפטלי מתעדכן מדי יום.',
    h1: 'פסקי דין חדשים היום',
    paragraphs: [
      'משפטלי מתעדכן מדי יום עם פסקי דין חדשים מהרשות השופטת. המאגר שלנו מייבא אוטומטית פסקי דין חדשים מכל בתי המשפט - בית המשפט העליון, בתי המשפט המחוזיים, בתי משפט השלום, בתי הדין לעבודה ובתי המשפט לענייני משפחה.',
      'כל פסק דין חדש עובר עיבוד אוטומטי הכולל: זיהוי שמות הצדדים (תובע, נתבע, שופט), סיווג לפי תחום משפטי, יצירת תקציר, וחילוץ נושאים משפטיים מרכזיים. כך תוכלו למצוא בקלות את הפסיקה העדכנית ביותר.',
      'מעקב אחרי פסקי דין חדשים חשוב במיוחד לעורכי דין שרוצים להישאר מעודכנים בהתפתחויות הפסיקה, לחוקרי משפט, ולכל מי שמעורב בהליך משפטי פעיל ומחכה להחלטה.',
      'חפשו במשפטלי ותמצאו את הפסיקה החדשה ביותר - הכל במקום אחד, מסודר, עם תקציר ופרטים מלאים. ללא מנוי, ללא הרשמה.',
    ],
    relatedSlugs: ['piskei-din', 'magar-piskei-din', 'hipus-piskei-din', 'piskei-din-lefi-shem'],
    searchQuery: 'פסקי דין חדשים',
  },
  {
    slug: 'gzar-din',
    hebrewTitle: 'גזר דין',
    metaTitle: 'גזר דין - חיפוש גזרי דין מכל בתי המשפט | משפטלי',
    metaDescription: 'חיפוש גזרי דין מכל בתי המשפט בישראל. גזר דין פלילי, עונשים, מאסר, קנסות. מאגר פסיקה עדכני ומקיף - חיפוש חינמי במשפטלי.',
    h1: 'גזר דין - חיפוש גזרי דין',
    paragraphs: [
      'גזר דין הוא ההחלטה השיפוטית הקובעת את העונש שנגזר על נאשם שהורשע בעבירה פלילית. גזר הדין ניתן לאחר הכרעת הדין (קביעת אשמה) ובו השופט קובע את העונש - מאסר, מאסר על תנאי, קנס, שירות לתועלת הציבור, פיצוי לנפגע או שילוב של עונשים.',
      'במשפטלי תמצאו גזרי דין מכל בתי המשפט בישראל. החיפוש מאפשר לאתר גזרי דין לפי שם הנאשם, סוג העבירה, בית המשפט או תקופה. המידע כולל את פרטי העונש, נימוקי בית המשפט ושיקולי הענישה.',
      'גזרי דין הם מקור חשוב למידע על מדיניות ענישה. עורכי דין משתמשים בגזרי דין כדי להציג לבית המשפט עונשים שנגזרו בתיקים דומים (טיעוני ענישה). גם אנשים שהורשעו מעוניינים לדעת מהם העונשים המקובלים לעבירה שלהם.',
    ],
    relatedSlugs: ['hakhrat-din', 'mishpat-plili', 'piskei-din', 'hipus-piskei-din'],
    searchQuery: 'גזר דין',
  },
  {
    slug: 'hakhrat-din',
    hebrewTitle: 'הכרעת דין',
    metaTitle: 'הכרעת דין - חיפוש הכרעות דין פליליות | משפטלי',
    metaDescription: 'חיפוש הכרעות דין מכל בתי המשפט. הכרעת דין פלילית - הרשעה או זיכוי. מאגר פסיקה פלילית מקיף. חיפוש חינמי במשפטלי.',
    h1: 'הכרעת דין - חיפוש הכרעות דין',
    paragraphs: [
      'הכרעת דין היא ההחלטה השיפוטית שבה בית המשפט קובע האם הנאשם אשם או זכאי. זהו השלב הראשון בתיק פלילי - לפני גזר הדין (קביעת העונש). הכרעת הדין מבוססת על הראיות שהוצגו במשפט ועל טיעוני הצדדים.',
      'במאגר משפטלי תמצאו הכרעות דין מכל הערכאות הפליליות. ניתן לחפש לפי שם נאשם, סוג עבירה, בית משפט או תקופה. כל הכרעת דין מוצגת עם פרטי התיק המלאים, שמות הצדדים ותקציר ההחלטה.',
      'הכרעות דין חשובות במיוחד לעורכי דין פליליים שמחפשים תקדימים, לנאשמים שרוצים להבין את סיכויי הזיכוי שלהם, ולכל מי שמעוניין לעקוב אחרי הליכים פליליים. אם שמכם מופיע בהכרעת דין ואתם מעוניינים בהסרה - ניתן להגיש בקשה דרך האתר.',
    ],
    relatedSlugs: ['gzar-din', 'mishpat-plili', 'piskei-din', 'hipus-piskei-din'],
    searchQuery: 'הכרעת דין',
  },
  {
    slug: 'magar-piskei-din-hinam',
    hebrewTitle: 'מאגר פסקי דין חינם',
    metaTitle: 'מאגר פסקי דין חינם - חיפוש פסיקה בחינם | משפטלי',
    metaDescription: 'מאגר פסקי דין חינם לחיפוש פסיקה מכל בתי המשפט בישראל. גישה חופשית ללא תשלום, חיפוש מהיר ומקיף. משפטלי - המאגר המשפטי החינמי.',
    h1: 'מאגר פסקי דין חינם',
    paragraphs: [
      'משפטלי מציעה מאגר פסקי דין חינמי ונגיש לכל. בניגוד למאגרים משפטיים מסחריים הגובים מאות שקלים בחודש, משפטלי מנגישה את הפסיקה הישראלית ללא תשלום ולכל אזרח.',
      'המאגר החינמי כולל פסקי דין מכל הערכאות: בית המשפט העליון, בתי המשפט המחוזיים, בתי משפט השלום, בתי הדין לעבודה ובתי המשפט לענייני משפחה. ניתן לחפש לפי שם, מספר תיק, שופט או נושא.',
      'אנו מאמינים שמידע משפטי צריך להיות נגיש לכולם. הנגשת הפסיקה חשובה לשקיפות מערכת המשפט, למימוש זכויות הציבור ולקידום הצדק. היכנסו לחיפוש ומצאו את פסקי הדין שאתם מחפשים - בחינם.',
    ],
    relatedSlugs: ['magar-piskei-din', 'piskei-din', 'hipus-piskei-din', 'piskei-din-lefi-shem'],
    searchQuery: '',
  },

  // ─── Lawyer Portal Landing Pages ─────────────────────────────────────────
  {
    slug: 'orech-din-tel-aviv',
    hebrewTitle: 'עורך דין תל אביב',
    metaTitle: 'עורך דין תל אביב - מצאו עורך דין מומלץ בתל אביב | משפטלי',
    metaDescription: 'חיפוש עורך דין בתל אביב לפי תחום התמחות. עורכי דין פלילי, משפחה, נזיקין, עבודה, מקרקעין בתל אביב. פרופיל מלא, דירוג לקוחות ויצירת קשר ישירה.',
    h1: 'עורך דין תל אביב - פורטל עורכי הדין המוביל',
    paragraphs: [
      'מחפשים עורך דין בתל אביב? משפטלי מרכז את כל עורכי הדין הפעילים בתל אביב ובמרכז הארץ. ניתן לסנן לפי תחום התמחות - פלילי, משפחה, נזיקין, עבודה, מקרקעין, הוצאה לפועל ועוד. כל פרופיל כולל ביוגרפיה, ניסיון, דירוג לקוחות ופרטי קשר ישירים.',
      'תל אביב מרכזת חלק ניכר ממשרדי עורכי הדין בישראל. בין אם אתם מחפשים עורך דין לתביעה אזרחית, ייצוג פלילי, ייעוץ לרכישת דירה, גירושין או סכסוך עבודה - תמצאו בפורטל משפטלי עורכי דין מנוסים בתל אביב עם מומחיות ספציפית בתחום שלכם.',
      'פורטל עורכי הדין של משפטלי מאפשר השוואה בין עורכי דין בתל אביב לפי שנות ניסיון, תחומי התמחות, ודירוג לקוחות. ניתן ליצור קשר ישיר בטלפון או בוואטסאפ. שירות חינמי לחלוטין.',
    ],
    relatedSlugs: ['orech-din-haifa', 'orech-din-plili-tel-aviv', 'orech-din-mishpacha-tel-aviv', 'orech-din'],
    searchQuery: '',
    lawyerFilter: { city: 'תל אביב' },
  },
  {
    slug: 'orech-din-haifa',
    hebrewTitle: 'עורך דין חיפה',
    metaTitle: 'עורך דין חיפה - מצאו עורך דין מומלץ בחיפה | משפטלי',
    metaDescription: 'חיפוש עורך דין בחיפה לפי תחום התמחות. עורכי דין פלילי, משפחה, נזיקין, עבודה, מקרקעין בחיפה. פרופיל מלא, דירוג לקוחות ויצירת קשר ישירה.',
    h1: 'עורך דין חיפה - פורטל עורכי הדין',
    paragraphs: [
      'מחפשים עורך דין בחיפה? פורטל משפטלי מרכז עורכי דין מחיפה ומאזור הצפון. כל עורך דין מוצג עם פרטי הניסיון, תחומי ההתמחות ודירוג הלקוחות. ניתן ליצור קשר ישיר בטלפון או בוואטסאפ.',
      'חיפה מאכלסת מגוון רחב של עורכי דין המתמחים בכל תחומי המשפט. בין אם תזדקקו לעורך דין לייצוג בבית הדין לעבודה בחיפה, בבית המשפט המחוזי חיפה, או בבית המשפט השלום - תמצאו בפורטל שלנו עורכי דין מנוסים עם הכרות מעמיקה של מערכת המשפט באזור.',
      'משפטלי מציג גם את היסטוריית פסקי הדין הקשורים לכל עורך דין - שקיפות מלאה לפני שאתם בוחרים. בדקו דירוגים, קראו המלצות ובחרו את עורך הדין המתאים לכם בחיפה.',
    ],
    relatedSlugs: ['orech-din-tel-aviv', 'orech-din-plili-haifa', 'orech-din', 'orech-din-mishpacha-haifa'],
    searchQuery: '',
    lawyerFilter: { city: 'חיפה' },
  },
  {
    slug: 'orech-din-plili-tel-aviv',
    hebrewTitle: 'עורך דין פלילי תל אביב',
    metaTitle: 'עורך דין פלילי תל אביב - ייצוג פלילי מנוסה | משפטלי',
    metaDescription: 'עורך דין פלילי בתל אביב - ייצוג בחקירות, הסדרי טיעון וערעורים. מצאו עורך דין פלילי מומלץ עם ניסיון בבתי משפט תל אביב. פורטל משפטלי.',
    h1: 'עורך דין פלילי תל אביב',
    paragraphs: [
      'עורך דין פלילי בתל אביב הוא מקצוען המתמחה בייצוג חשודים ונאשמים בהליכים פליליים. אם אתם מחפשים עורך דין פלילי בתל אביב, חשוב לבחור מישהו עם ניסיון רב בבתי המשפט הספציפיים - בית משפט השלום תל אביב, בית המשפט המחוזי תל אביב ובית המשפט לתיקים קטנים.',
      'עורכי דין פליליים בתל אביב מייצגים לקוחות בעבירות תנועה, עבירות כלכליות, עבירות אלימות, עבירות מין ועוד. בפורטל משפטלי תמצאו עורכי דין פליליים בתל אביב עם הניסיון הרלוונטי לסוג התיק שלכם.',
      'בחירת עורך דין פלילי בתל אביב: בדקו כמה שנות ניסיון יש לו, האם הוא מתמחה בסוג העבירה שלכם, ומהו דירוג הלקוחות שלו. ביצירת קשר ראשוני, שאלו על אסטרטגיית ההגנה המומלצת ועלויות הייצוג.',
    ],
    relatedSlugs: ['orech-din-tel-aviv', 'orech-din-plili-haifa', 'mishpat-plili', 'orech-din'],
    searchQuery: '',
    lawyerFilter: { city: 'תל אביב', specialization: 'פלילי' },
  },
  {
    slug: 'orech-din-mishpacha-tel-aviv',
    hebrewTitle: 'עורך דין משפחה תל אביב',
    metaTitle: 'עורך דין משפחה תל אביב - גירושין, ירושות, משמורת | משפטלי',
    metaDescription: 'עורך דין דיני משפחה בתל אביב - גירושין, חלוקת רכוש, משמורת ילדים, מזונות, ירושות. מצאו עורך דין משפחה מומלץ בתל אביב. פורטל משפטלי.',
    h1: 'עורך דין משפחה תל אביב',
    paragraphs: [
      'עורך דין לדיני משפחה בתל אביב מתמחה בייצוג בהליכי גירושין, חלוקת רכוש, הסכמי ממון, משמורת ילדים, מזונות, צוואות וירושות. בחירת עורך דין משפחה נכון בתל אביב יכולה להשפיע מאוד על תוצאת ההליך.',
      'עורכי דין משפחה בתל אביב מייצגים בבית משפט לענייני משפחה בתל אביב ובבית הדין הרבני. בפורטל משפטלי תמצאו עורכי דין משפחה עם ניסיון מוכח, דירוג גבוה מלקוחות והמלצות אמיתיות.',
      'דיני משפחה הם תחום רגיש הדורש שילוב של מקצועיות משפטית ורגישות אנושית. עורך דין משפחה טוב בתל אביב יידע לנהל את הסכסוך בצורה שתשמור על האינטרסים שלכם ושל ילדיכם. ניתן לתאם ייעוץ ראשוני ישירות דרך פרופיל העורך דין.',
    ],
    relatedSlugs: ['orech-din-tel-aviv', 'orech-din-mishpacha-jerusalem', 'orech-din-mishpacha-haifa', 'orech-din'],
    searchQuery: '',
    lawyerFilter: { city: 'תל אביב', specialization: 'משפחה' },
  },
  {
    slug: 'orech-din-nezikin-tel-aviv',
    hebrewTitle: 'עורך דין נזיקין תל אביב',
    metaTitle: 'עורך דין נזיקין תל אביב - תאונות ופיצויים | משפטלי',
    metaDescription: 'עורך דין נזיקין בתל אביב - תאונות דרכים, תאונות עבודה, רשלנות רפואית. מצאו עורך דין נזיקין מומלץ בתל אביב עם ניסיון בתביעות פיצויים.',
    h1: 'עורך דין נזיקין תל אביב',
    paragraphs: [
      'עורך דין נזיקין בתל אביב מתמחה בייצוג נפגעים בתאונות דרכים, תאונות עבודה, רשלנות רפואית ונזקי גוף. אם נפגעתם בתאונה באזור תל אביב, חשוב לפנות לעורך דין נזיקין מוקדם ככל האפשר כדי לשמר ראיות ולמקסם את הפיצויים.',
      'תביעות נזיקין בתל אביב נדונות בבית משפט השלום תל אביב ובבית המשפט המחוזי תל אביב. עורכי הדין שלנו מכירים היטב את מערכת המשפט באזור ואת השופטים הדנים בתיקי נזיקין.',
      'בפורטל משפטלי תמצאו עורכי דין נזיקין בתל אביב עם ניסיון מוכח בקבלת פיצויים גבוהים ללקוחות. הפגישה הראשונה היא בדרך כלל ללא תשלום, ועורכי הדין עובדים לעיתים בשיטת שכר הצלחה.',
    ],
    relatedSlugs: ['orech-din-tel-aviv', 'orech-din', 'magar-piskei-din'],
    searchQuery: '',
    lawyerFilter: { city: 'תל אביב', specialization: 'נזיקין' },
  },
  {
    slug: 'orech-din-plili-haifa',
    hebrewTitle: 'עורך דין פלילי חיפה',
    metaTitle: 'עורך דין פלילי חיפה - ייצוג פלילי מנוסה | משפטלי',
    metaDescription: 'עורך דין פלילי בחיפה - ייצוג בחקירות, הסדרי טיעון וערעורים. מצאו עורך דין פלילי מומלץ בחיפה עם ניסיון בבתי משפט חיפה.',
    h1: 'עורך דין פלילי חיפה',
    paragraphs: [
      'עורך דין פלילי בחיפה מתמחה בייצוג חשודים ונאשמים בהליכים פליליים בבית משפט השלום חיפה ובבית המשפט המחוזי חיפה. אם אתם מחפשים עורך דין פלילי בחיפה, חשוב לבחור מישהו עם ניסיון מוכח במערכת המשפט בצפון.',
      'עורכי דין פליליים בחיפה מייצגים לקוחות בכל סוגי העבירות - מעבירות תנועה ועד תיקים חמורים. בפורטל משפטלי תמצאו עורכי דין פליליים בחיפה עם הניסיון הדרוש.',
      'פנו לעורך דין פלילי בחיפה בהקדם האפשרי - ייצוג מוקדם בשלב החקירה יכול לשנות את תוצאת התיק. ניתן ליצור קשר ישיר דרך פרופיל העורך דין בפורטל משפטלי.',
    ],
    relatedSlugs: ['orech-din-haifa', 'orech-din-plili-tel-aviv', 'mishpat-plili', 'orech-din'],
    searchQuery: '',
    lawyerFilter: { city: 'חיפה', specialization: 'פלילי' },
  },
  {
    slug: 'orech-din',
    hebrewTitle: 'עורך דין',
    metaTitle: 'עורך דין - פורטל עורכי הדין המוביל בישראל | משפטלי',
    metaDescription: 'מצאו עורך דין מומלץ לפי תחום התמחות ועיר. פורטל עורכי הדין של משפטלי - פרופיל מלא, דירוג לקוחות, טלפון ווואטסאפ. כל עורכי הדין במקום אחד.',
    h1: 'עורך דין - פורטל עורכי הדין של ישראל',
    paragraphs: [
      'פורטל עורכי הדין של משפטלי הוא הכלי המהיר ביותר למציאת עורך דין מתאים. בחרו את תחום ההתמחות הרלוונטי לבעיה שלכם - פלילי, משפחה, נזיקין, עבודה, מקרקעין, ביטוח לאומי, הוצאה לפועל ועוד - ואת העיר שבה אתם צריכים ייצוג.',
      'כל עורך דין בפורטל מציג פרופיל מפורט עם שנות ניסיון, תחומי התמחות, ביוגרפיה מקצועית, דירוג לקוחות וחוות דעת. ניתן ליצור קשר ישיר בטלפון, בוואטסאפ או באימייל ישירות מהפרופיל.',
      'הייחוד של משפטלי: לצד פרטי עורך הדין, תוכלו לראות גם את פסקי הדין הקשורים לתחום ההתמחות שלו - שקיפות מלאה לפני שאתם מחליטים. חיפוש עורך דין ופסקי דין - הכל במקום אחד.',
    ],
    relatedSlugs: ['orech-din-tel-aviv', 'orech-din-haifa', 'orech-din-plili-tel-aviv', 'orech-din-mishpacha-tel-aviv'],
    searchQuery: '',
    lawyerFilter: {},
  },
];

// ─── Programmatic city × specialization landing pages ────────────────
//
// One page per (specialization, city) combination - 20 specializations ×
// 25 cities = 500 pages. Four of those combinations (Tel Aviv/Haifa ×
// plili/mishpacha/nezikin) are already hand-authored above with richer,
// bespoke copy, so the generator below is skipped for those and only fills
// in the remaining ~496. Slugs are built the same way for both
// ("orech-din-{specSlug}-{citySlug}") so relatedSlugs links resolve
// correctly regardless of which page authored a given combination.
//
// Paragraph text is templated, not hand-written per page - each page still
// gets a real, substantive difference (its own matched-lawyer listing from
// the DB, its own city/specialization/court-district facts), the same
// pattern legal directories like Avvo use for city×practice-area pages.
// Content variety across the grid comes from rotating through a handful of
// template variants per combo rather than writing 500 unique paragraphs.

const CITY_SLUGS: Record<string, string> = {
  'תל אביב': 'tel-aviv', 'ירושלים': 'jerusalem', 'חיפה': 'haifa', 'באר שבע': 'beer-sheva',
  'ראשון לציון': 'rishon-lezion', 'פתח תקווה': 'petah-tikva', 'אשדוד': 'ashdod', 'נתניה': 'netanya',
  'חולון': 'holon', 'בני ברק': 'bnei-brak', 'רמת גן': 'ramat-gan', 'אשקלון': 'ashkelon',
  'רחובות': 'rehovot', 'בת ים': 'bat-yam', 'הרצליה': 'herzliya', 'כפר סבא': 'kfar-saba',
  'רעננה': 'raanana', 'מודיעין': 'modiin', 'נצרת': 'nazareth', 'עכו': 'akko',
  'טבריה': 'tiberias', 'קריית שמונה': 'kiryat-shmona', 'אילת': 'eilat', 'עפולה': 'afula', 'חדרה': 'hadera',
};

// Approximate judicial-district assignment per city - directionally
// accurate for SEO copy, not a substitute for checking the actual court.
const CITY_DISTRICT: Record<string, string> = {
  'תל אביב': 'תל אביב', 'ירושלים': 'ירושלים', 'חיפה': 'חיפה', 'באר שבע': 'דרום',
  'ראשון לציון': 'מרכז', 'פתח תקווה': 'מרכז', 'אשדוד': 'דרום', 'נתניה': 'מרכז',
  'חולון': 'תל אביב', 'בני ברק': 'מרכז', 'רמת גן': 'תל אביב', 'אשקלון': 'דרום',
  'רחובות': 'מרכז', 'בת ים': 'תל אביב', 'הרצליה': 'תל אביב', 'כפר סבא': 'מרכז',
  'רעננה': 'מרכז', 'מודיעין': 'מרכז', 'נצרת': 'צפון', 'עכו': 'צפון',
  'טבריה': 'צפון', 'קריית שמונה': 'צפון', 'אילת': 'דרום', 'עפולה': 'צפון', 'חדרה': 'חיפה',
};

const SPEC_SLUGS: Record<string, string> = {
  'דיני משפחה': 'mishpacha', 'דיני עבודה': 'avoda', 'משפט פלילי': 'plili', 'נזיקין ותאונות': 'nezikin',
  'מקרקעין ונדל"ן': 'nedlan', 'דיני חברות ומסחרי': 'miskhari', 'משפט מנהלי': 'minhali', 'דיני ביטוח': 'bituah',
  'הוצאה לפועל': 'hotzaa-lapoal', 'דיני מיסים': 'misim', 'קניין רוחני': 'kinyan-ruchani', 'דיני צרכנות': 'tzarchanut',
  'חדלות פירעון': 'hadlut-peiraon', 'דיני תכנון ובנייה': 'tichnun-bniya', 'דיני הגירה': 'hagira',
  'דיני צבא וביטחון': 'tzava-bitachon', 'דיני אינטרנט וסייבר': 'internet-sayber', 'גישור ובוררות': 'gishur-borerut',
  'דיני חוזים': 'hozim', 'דיני בנקאות': 'bankaut',
};

const SPEC_DESCRIPTIONS: Record<string, string> = {
  'דיני משפחה': 'תחום זה כולל ליווי בהליכי גירושין, חלוקת רכוש, משמורת ילדים, מזונות והסכמי ממון.',
  'דיני עבודה': 'התחום עוסק בייצוג עובדים ומעסיקים בסכסוכי עבודה, פיטורין שלא כדין, הפליה ותנאי העסקה.',
  'משפט פלילי': 'עורך דין בתחום זה מייצג חשודים ונאשמים בחקירות משטרה, הליכים פליליים, הסדרי טיעון וערעורים.',
  'נזיקין ותאונות': 'התמחות זו כוללת תביעות נזקי גוף, תאונות דרכים, תאונות עבודה ורשלנות רפואית.',
  'מקרקעין ונדל"ן': 'התחום עוסק בליווי עסקאות מקרקעין, רכישת דירות, הסכמי שכירות ורישום בטאבו.',
  'דיני חברות ומסחרי': 'עורך דין בתחום זה מלווה עסקים, הסכמים מסחריים, הקמת חברות ודיני תאגידים.',
  'משפט מנהלי': 'התחום עוסק בהתדיינות מול רשויות המדינה, עתירות מנהליות וערעורים על החלטות רשויות.',
  'דיני ביטוח': 'התמחות זו כוללת תביעות מול חברות ביטוח, סכסוכי פוליסה ותביעות שיבוב.',
  'הוצאה לפועל': 'התחום עוסק בייצוג בהליכי הוצאה לפועל, עיקולים, פשיטות רגל והסדרי חובות.',
  'דיני מיסים': 'עורך דין בתחום זה עוסק בתכנון מס, ייצוג מול רשות המיסים, מע"מ ומיסוי מקרקעין.',
  'קניין רוחני': 'התחום כולל רישום פטנטים, סימני מסחר, זכויות יוצרים והגנה על קניין רוחני.',
  'דיני צרכנות': 'התמחות זו עוסקת בתביעות צרכניות, הטעיית צרכנים, ביטול עסקאות ותביעות ייצוגיות.',
  'חדלות פירעון': 'התחום עוסק בהליכי חדלות פירעון, פשיטת רגל, הסדרי חוב ופירוק חברות.',
  'דיני תכנון ובנייה': 'עורך דין בתחום זה מלווה הליכי היתרי בנייה, ועדות תכנון וערעורים על החלטות תכנוניות.',
  'דיני הגירה': 'התחום כולל ויזות עבודה, אשרות שהייה, הסדרת מעמד ואזרחות.',
  'דיני צבא וביטחון': 'התמחות זו עוסקת בייצוג חיילים בהליכים משמעתיים, ועדות פטור וזכויות משרתים.',
  'דיני אינטרנט וסייבר': 'התחום עוסק בפרטיות מקוונת, לשון הרע ברשת, הגנת סייבר וסחר אלקטרוני.',
  'גישור ובוררות': 'התמחות זו כוללת פתרון סכסוכים מחוץ לכותלי בית המשפט בהליכי גישור ובוררות.',
  'דיני חוזים': 'התחום עוסק בניסוח, בחינה והפרת חוזים, תביעות אזרחיות וסכסוכים מסחריים.',
  'דיני בנקאות': 'עורך דין בתחום זה מייצג לקוחות מול בנקים בהסדרי חוב, עיקולים והלוואות.',
};

function openingParagraph(spec: string, city: string, variant: number): string {
  const desc = SPEC_DESCRIPTIONS[spec] || '';
  const variants = [
    `מחפשים עורך דין ${spec} ב${city}? ${desc} פורטל משפטלי מרכז עבורכם את עורכי הדין הפעילים ב${city} עם התמחות מוכחת בתחום, כולל שנות ניסיון, דירוג לקוחות ופרטי קשר ישירים.`,
    `עורך דין ${spec} ב${city} מלווה לקוחות בהליכים בתחום זה. ${desc} בפורטל משפטלי תמצאו עורכי דין ${spec} הפעילים ב${city}, עם פרופיל מלא לפני שאתם בוחרים.`,
    `בחירת עורך דין ${spec} מתאים ב${city} יכולה להשפיע משמעותית על תוצאת התיק שלכם. ${desc} משפטלי מאפשר להשוות בין עורכי דין ${spec} ב${city} לפי ניסיון, התמחות ודירוג.`,
    `${desc} אם אתם זקוקים לעורך דין ${spec} ב${city}, פורטל משפטלי מציג את כל עורכי הדין הפעילים בעיר בתחום זה - עם אפשרות ליצירת קשר ישירה בטלפון או בוואטסאפ.`,
  ];
  return variants[variant % variants.length];
}

function courtParagraph(spec: string, city: string, district: string, variant: number): string {
  const variants = [
    `תיקים בתחום ${spec} ב${city} נדונים בדרך כלל בבתי המשפט של מחוז ${district}. עורך דין ${spec} מנוסה מכיר את הנהלים והשופטים הדנים בתיקים מסוג זה באזור, מה שיכול לייעל את הטיפול בתיק.`,
    `עורכי דין ${spec} הפעילים ב${city} מייצגים לקוחות מול הערכאות במחוז ${district}, ומכירים היטב את האזור והמערכת המשפטית המקומית.`,
    `ב${city} ובמחוז ${district} פועלים עורכי דין רבים בתחום ${spec} - חשוב לבחור מי שיש לו ניסיון ספציפי בסוג התיק שלכם ובבתי המשפט הרלוונטיים באזור.`,
  ];
  return variants[variant % variants.length];
}

function ctaParagraph(spec: string, city: string, variant: number): string {
  const variants = [
    `בפורטל משפטלי תוכלו לצפות בפרופיל המלא של כל עורך דין ${spec} ב${city} - שנות ניסיון, השכלה, דירוג לקוחות וחוות דעת אמיתיות - וליצור קשר ישיר ללא תשלום.`,
    `לפני שאתם בוחרים עורך דין ${spec} ב${city}, השוו בין מספר עורכי דין לפי ניסיון ודירוג לקוחות בפורטל משפטלי. יצירת קשר ראשונית היא בדרך כלל ללא עלות.`,
    `משפטלי מרכז את כל עורכי הדין המתמחים ב${spec} ב${city} במקום אחד - פרופיל מלא, חוות דעת לקוחות וטלפון ישיר, כדי שתוכלו לבחור בביטחון.`,
  ];
  return variants[variant % variants.length];
}

// Combinations already hand-authored above with bespoke copy - skip
// regenerating them so we don't emit a duplicate slug.
const CURATED_COMBOS = new Set([
  'תל אביב|משפט פלילי', 'תל אביב|דיני משפחה', 'תל אביב|נזיקין ותאונות', 'חיפה|משפט פלילי',
]);

function generateLocationSpecPages(): KeywordPageData[] {
  const pages: KeywordPageData[] = [];
  let i = 0;
  for (const spec of SPECIALIZATIONS) {
    for (const city of CITIES) {
      if (CURATED_COMBOS.has(`${city}|${spec}`)) { i++; continue; }
      const citySlug = CITY_SLUGS[city];
      const specSlug = SPEC_SLUGS[spec];
      const district = CITY_DISTRICT[city];
      const slug = `orech-din-${specSlug}-${citySlug}`;

      const nextCity = CITIES[(CITIES.indexOf(city) + 1) % CITIES.length];
      const nextSpec = SPECIALIZATIONS[(SPECIALIZATIONS.indexOf(spec) + 1) % SPECIALIZATIONS.length];

      pages.push({
        slug,
        hebrewTitle: `עורך דין ${spec} ${city}`,
        metaTitle: `עורך דין ${spec} ב${city} - מומלץ ומנוסה | משפטלי`,
        metaDescription: `${SPEC_DESCRIPTIONS[spec]} מצאו עורך דין ${spec} מומלץ ב${city} - פרופיל מלא, דירוג לקוחות ויצירת קשר ישירה. פורטל משפטלי.`,
        h1: `עורך דין ${spec} ב${city}`,
        paragraphs: [
          openingParagraph(spec, city, i),
          courtParagraph(spec, city, district, i + 1),
          ctaParagraph(spec, city, i + 2),
        ],
        relatedSlugs: [
          'orech-din',
          `orech-din-${specSlug}-${CITY_SLUGS[nextCity]}`,
          `orech-din-${SPEC_SLUGS[nextSpec]}-${citySlug}`,
        ],
        searchQuery: '',
        lawyerFilter: { city, specialization: spec },
      });
      i++;
    }
  }
  return pages;
}

export const keywordPages: KeywordPageData[] = [
  ...curatedKeywordPages,
  ...generateLocationSpecPages(),
];
