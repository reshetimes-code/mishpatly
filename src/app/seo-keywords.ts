/**
 * SEO Keywords for משפטלי (MishpatLi) - Legal Judgments Database
 * Organized by category and search volume priority
 */

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
}

export const keywordPages: KeywordPageData[] = [
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
];
