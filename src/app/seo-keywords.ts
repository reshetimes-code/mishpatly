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
    metaTitle: 'הסרת שם מפסק דין - איך להסיר את שמך מפסיקה | משפטלי',
    metaDescription: 'מדריך להסרת שם מפסק דין באינטרנט. למדו כיצד להגיש בקשה להסרת שמכם ממאגרי פסקי דין ומתוצאות חיפוש בגוגל.',
    h1: 'הסרת שם מפסק דין',
    paragraphs: [
      'הסרת שם מפסק דין היא הליך שמאפשר לאדם שנזכר בפסק דין שפורסם באינטרנט לבקש את הסרת פרטיו המזהים. הצורך בכך עולה כאשר פסק דין ישן פוגע במוניטין, בקריירה או בחיי היומיום של אדם, גם שנים לאחר שניתן.',
      'על פי הפסיקה בישראל, קיימת "זכות להישכח" שמקנה לאדם את היכולת לפנות למאגרי מידע משפטיים ולבקש את הסרת שמו. הזכות אינה מוחלטת ומאוזנת אל מול האינטרס הציבורי בשקיפות מערכת המשפט ובנגישות לפסיקה.',
      'במשפטלי ניתן להגיש בקשת הסרה בקלות. כל שעליכם לעשות הוא לאתר את פסק הדין, ללחוץ על כפתור "בקשת הסרה" ולמלא את הטופס. הצוות שלנו יבחן את הבקשה ויטפל בה בהתאם למדיניות הנהוגה.',
    ],
    relatedSlugs: ['hasarat-azkurim', 'mhikat-psak-din-mgoogle', 'bdika-piskei-din-lefi-shem', 'piskei-din'],
    searchQuery: 'הסרת שם מפסק דין',
  },
  {
    slug: 'mhikat-psak-din-mgoogle',
    hebrewTitle: 'מחיקת פסק דין מגוגל',
    metaTitle: 'מחיקת פסק דין מגוגל - הסרת תוצאות חיפוש | משפטלי',
    metaDescription: 'כיצד למחוק פסק דין מגוגל ומנועי חיפוש אחרים? מדריך מקיף להסרת פסקי דין מתוצאות החיפוש וממאגרי מידע משפטיים באינטרנט.',
    h1: 'מחיקת פסק דין מגוגל',
    paragraphs: [
      'מחיקת פסק דין מגוגל היא אחת הבקשות הנפוצות ביותר שמגיעות אלינו. כאשר פסק דין מופיע בתוצאות החיפוש של גוגל, הוא עלול לגרום נזק למוניטין ולפגוע באפשרויות תעסוקה, עסקים ואף ביחסים אישיים.',
      'התהליך של הסרת פסק דין מגוגל כולל מספר שלבים: ראשית, יש להגיש בקשה לאתר שבו פורסם פסק הדין להסרת התוכן או השם. לאחר מכן, ניתן לפנות לגוגל באמצעות טופס "הזכות להישכח" ולבקש את הסרת הקישור מתוצאות החיפוש.',
      'משפטלי מסייעת בתהליך הזה. אנו מטפלים בבקשות הסרה מהמאגר שלנו ומנחים את הפונים כיצד לפעול גם מול גוגל ומנועי חיפוש אחרים. התהליך לוקח בדרך כלל מספר ימים עד שבועות, בהתאם למורכבות הבקשה.',
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
];
