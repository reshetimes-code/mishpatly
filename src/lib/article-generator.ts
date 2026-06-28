/**
 * Article Generator — Creates daily legal articles using Gemini AI
 * Articles are written to sound like a real Israeli lawyer wrote them,
 * with personal tone, real-world examples, and varied structure.
 */

import { GoogleGenerativeAI } from '@google/generative-ai';
import { prisma } from './db';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

// Pool of fictional author personas — each with a distinct voice
const AUTHORS = [
  { name: 'עו"ד רחל כהן', style: 'ישירה ותכליתית, משתמשת בדוגמאות מהשטח' },
  { name: 'עו"ד דוד לוי', style: 'אקדמי אבל נגיש, אוהב לצטט פסיקה' },
  { name: 'עו"ד שרה ישראלי', style: 'חמה ואמפתית, פונה ישירות לקורא' },
  { name: 'עו"ד משה אברהם', style: 'מעשי ומפורט, נותן טיפים קונקרטיים' },
  { name: 'עו"ד יעל גולדשטיין', style: 'מקצועית עם הומור עדין, כותבת בצורה סיפורית' },
  { name: 'עו"ד אבי פרידמן', style: 'ותיק ומנוסה, משתף מניסיון אישי' },
  { name: 'עו"ד מיכל ברק', style: 'צעירה ורעננה, משתמשת בשפה עכשווית' },
  { name: 'עו"ד נועם שלומי', style: 'מדויק ומסודר, אוהב רשימות וסעיפים' },
  { name: 'עו"ד דנה אורן', style: 'מתמקדת בזכויות הפרט, כותבת ברגש' },
  { name: 'עו"ד איתן רוזנפלד', style: 'ישיר וקולע, לא מסתובב סביב הנקודה' },
];

// Diverse legal topics with sub-topics for variety
const TOPIC_POOL = [
  { category: 'דיני עבודה', topics: ['פיטורין שלא כדין', 'הטרדה מינית במקום העבודה', 'זכויות עובדים בהריון', 'שעות נוספות - מה מגיע לך', 'חופשה שנתית ודמי מחלה', 'עבודה בשבת וחגים', 'הסכמים קיבוציים', 'פנסיה וביטוח מנהלים', 'עובדי קבלן - זכויות', 'פיצויי פיטורין - חישוב'] },
  { category: 'דיני משפחה', topics: ['הסכם ממון לפני נישואין', 'משמורת ילדים משותפת', 'מזונות ילדים - איך מחשבים', 'חלוקת רכוש בגירושין', 'אימוץ ילדים בישראל', 'צו הגנה מפני אלימות', 'ידועים בציבור - זכויות', 'גישור משפחתי כחלופה לבית משפט', 'שינוי שם משפחה', 'הסדרי ראייה - מדריך'] },
  { category: 'דיני נזיקין', topics: ['תביעת נזקי גוף - שלב אחר שלב', 'רשלנות רפואית - מתי יש עילת תביעה', 'תאונות עבודה - זכויות הנפגע', 'נפילה במקום ציבורי', 'תאונות דרכים - מה עושים אחרי', 'נזק נפשי כעילת תביעה', 'אחריות מוצרים פגומים', 'כלב תקף אותי - מה עושים', 'נזקי רכוש מקבלן', 'התיישנות בתביעות נזיקין'] },
  { category: 'משפט פלילי', topics: ['מה קורה אחרי מעצר', 'עבירות סמים - סוגי עבירות ועונשים', 'עבירות תנועה חמורות', 'הליך השימוע - איך להתכונן', 'מחיקת רישום פלילי', 'עבירות אלימות במשפחה', 'הונאה וזיוף - מה העונש', 'שירות לתועלת הציבור כעונש', 'ערעור על גזר דין', 'עבירות סייבר'] },
  { category: 'דיני מקרקעין', topics: ['רכישת דירה - בדיקות חובה', 'ליקויי בנייה - איך תובעים', 'סכסוכי שכנים - פתרונות', 'דירה מקבלן - זכויות הרוכש', 'טאבו ורישום מקרקעין', 'היטל השבחה - מתי משלמים', 'פינוי-בינוי - זכויות הדיירים', 'שכירות דירה - טיפים משפטיים', 'ועד בית - סמכויות וחובות', 'חריגות בנייה - מה הסיכון'] },
  { category: 'דיני חוזים', topics: ['הפרת חוזה - מה הסעדים', 'סעיף פיצויים מוסכמים', 'ביטול חוזה מחמת הטעיה', 'חוזה בעל פה - האם תקף', 'חוזה אחיד - תנאים מקפחים', 'ערבות בנקאית בעסקאות', 'חוזה שכירות - סעיפים חשובים', 'זכות חזרה בעסקאות צרכניות', 'חתימה דיגיטלית - תוקף משפטי', 'מכרזים - כללי השתתפות'] },
  { category: 'דיני חברות', topics: ['הקמת חברה בע"מ - מדריך', 'אחריות דירקטורים', 'הסכם מייסדים - למה חשוב', 'פירוק חברה - ההליך', 'סכסוכי שותפים - פתרונות', 'עוסק מורשה או חברה', 'הרמת מסך התאגדות', 'חובת דיווח לרשם החברות', 'מיזוגים ורכישות', 'אופציות לעובדים'] },
  { category: 'דיני צרכנות', topics: ['זכות ביטול עסקה', 'רכישה באינטרנט - זכויות', 'מוצר פגום - החזר כספי', 'פרסום מטעה - מה עושים', 'חוק הגנת הצרכן - עיקרים', 'תביעות קטנות - מדריך', 'גביית יתר - איך מתלוננים', 'אחריות יצרן - מה מכוסה', 'שירות לקוחות גרוע - יש מה לעשות', 'הטעיה בעסקאות מקוונות'] },
  { category: 'דיני ביטוח', topics: ['תביעת ביטוח שנדחתה - מה עושים', 'ביטוח בריאות פרטי - מה כדאי', 'ביטוח רכב - זכויות המבוטח', 'ביטוח דירה - מה מכוסה באמת', 'חובת הגילוי של המבוטח', 'ביטוח חיים - סוגים ותנאים', 'ויתור על סודיות רפואית', 'ביטוח אובדן כושר עבודה', 'ביטוח נסיעות לחו"ל', 'תקופת אכשרה - מה זה אומר'] },
  { category: 'הוצאה לפועל', topics: ['חייב בהוצאה לפועל - מה הזכויות', 'עיקול משכורת - כמה מותר', 'הסדר חוב בהוצאה לפועל', 'צו עיכוב יציאה מהארץ', 'מאסר בגין חובות', 'התנגדות לביצוע שטר', 'עיקול חשבון בנק', 'פשיטת רגל - מדריך', 'מימוש משכנתא', 'חוב ארנונה - הליכי גבייה'] },
  { category: 'משפט מנהלי', topics: ['ערעור על דוח תנועה', 'רישיון עסק - הליך הוצאה', 'חופש המידע - איך מגישים בקשה', 'ערעור על החלטת ועדה רפואית', 'זכויות מול הביטוח הלאומי', 'עתירה מנהלית - מתי ואיך', 'היתר בנייה - ההליך', 'ערעור על שומת מס', 'זכויות נכי צה"ל', 'רישוי מקצועי - הליכים'] },
  { category: 'פרטיות ומידע', topics: ['הזכות להישכח באינטרנט', 'הגנה על מידע אישי ברשת', 'מצלמות אבטחה - מה מותר', 'לשון הרע ברשתות חברתיות', 'זכויות יוצרים באינטרנט', 'פגיעה בפרטיות במקום העבודה', 'דליפת מידע - מה עושים', 'GDPR והשפעתו על ישראל', 'ציתות והאזנת סתר', 'הגנת פרטיות של קטינים'] },
];

function slugify(text: string): string {
  const map: Record<string, string> = {
    'א': 'a', 'ב': 'b', 'ג': 'g', 'ד': 'd', 'ה': 'h', 'ו': 'v', 'ז': 'z',
    'ח': 'kh', 'ט': 't', 'י': 'y', 'כ': 'k', 'ך': 'k', 'ל': 'l', 'מ': 'm',
    'ם': 'm', 'נ': 'n', 'ן': 'n', 'ס': 's', 'ע': 'a', 'פ': 'p', 'ף': 'f',
    'צ': 'tz', 'ץ': 'tz', 'ק': 'k', 'ר': 'r', 'ש': 'sh', 'ת': 't',
  };
  return text
    .trim()
    .split('')
    .map(ch => map[ch] || ch)
    .join('')
    .replace(/[^a-z0-9\s-]/gi, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .toLowerCase()
    .slice(0, 80);
}

/**
 * Pick a random topic that hasn't been written about recently
 */
async function pickTopic(): Promise<{ category: string; topic: string }> {
  // Get recent article titles to avoid repetition
  const recentArticles = await prisma.article.findMany({
    where: { isAutoGenerated: true },
    select: { title: true, category: true },
    orderBy: { publishedAt: 'desc' },
    take: 50,
  });
  const recentTitles = new Set(recentArticles.map(a => a.title));
  const recentCategories = recentArticles.slice(0, 3).map(a => a.category);

  // Shuffle categories, preferring ones not used recently
  const shuffled = [...TOPIC_POOL].sort((a, b) => {
    const aRecent = recentCategories.includes(a.category) ? 1 : 0;
    const bRecent = recentCategories.includes(b.category) ? 1 : 0;
    return aRecent - bRecent || Math.random() - 0.5;
  });

  for (const group of shuffled) {
    const available = group.topics.filter(t => !recentTitles.has(t));
    if (available.length > 0) {
      const topic = available[Math.floor(Math.random() * available.length)];
      return { category: group.category, topic };
    }
  }

  // Fallback: random from entire pool
  const group = TOPIC_POOL[Math.floor(Math.random() * TOPIC_POOL.length)];
  const topic = group.topics[Math.floor(Math.random() * group.topics.length)];
  return { category: group.category, topic };
}

/**
 * Generate a full article using Gemini with human-like writing prompt
 */
async function generateArticleContent(
  topic: string,
  category: string,
  author: typeof AUTHORS[number]
): Promise<{
  title: string;
  excerpt: string;
  content: string[];
  metaTitle: string;
  metaDescription: string;
} | null> {
  if (!process.env.GEMINI_API_KEY) {
    console.error('[ArticleGen] No Gemini API key');
    return null;
  }

  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

  const prompt = `אתה ${author.name}, עורך/ת דין ישראלי/ת שכותב/ת מאמרים לאתר משפטי בעברית.
הסגנון שלך: ${author.style}.

כתוב מאמר מקצועי בנושא: "${topic}" (קטגוריה: ${category})

הנחיות חשובות לכתיבה:
- כתוב כאילו אתה עורך דין אמיתי שיושב וכותב מאמר לבלוג שלו
- השתמש בשפה טבעית ולא רובוטית. אל תכתוב בצורה שניכר שזה AI
- הוסף דוגמאות מהחיים (אפשר להמציא מקרים אמינים, בלי שמות אמיתיים)
- לפעמים תשתמש בגוף ראשון ("נתקלתי במקרה ש...", "מניסיוני...")
- שנה את אורך הפסקאות - לא כולן באותו אורך
- אפשר להתחיל פסקה בשאלה ("מה קורה כש...?")
- הזכר חוקים וסעיפים ספציפיים אמיתיים מהחקיקה הישראלית
- אל תשתמש ב-bullet points או רשימות - כתוב בפסקאות זורמות
- אל תכתוב "לסיכום" בפסקה האחרונה. סיים בצורה טבעית
- אורך: 6-9 פסקאות, כל פסקה 3-6 משפטים
- אל תוסיף כותרות משנה בתוך המאמר

החזר JSON בפורמט הבא בלבד (בלי markdown, בלי backticks):
{
  "title": "כותרת המאמר (קצרה וקולעת, עד 70 תווים)",
  "excerpt": "תיאור קצר של המאמר ב-2 משפטים (עד 160 תווים)",
  "content": ["פסקה 1", "פסקה 2", "פסקה 3", ...],
  "metaTitle": "כותרת SEO (עד 60 תווים) | משפטלי",
  "metaDescription": "תיאור מטא ל-SEO (עד 155 תווים)"
}`;

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text().trim();

    // Clean potential markdown wrapping
    const cleaned = text
      .replace(/^```json\s*/i, '')
      .replace(/^```\s*/i, '')
      .replace(/\s*```$/i, '')
      .trim();

    const parsed = JSON.parse(cleaned);

    if (!parsed.title || !parsed.content || !Array.isArray(parsed.content) || parsed.content.length < 4) {
      console.error('[ArticleGen] Invalid response structure');
      return null;
    }

    return {
      title: parsed.title,
      excerpt: parsed.excerpt || parsed.title,
      content: parsed.content,
      metaTitle: parsed.metaTitle || `${parsed.title} | משפטלי`,
      metaDescription: parsed.metaDescription || parsed.excerpt,
    };
  } catch (e) {
    console.error('[ArticleGen] Gemini error:', e);
    return null;
  }
}

/**
 * Generate and save one new article to the database
 */
async function generateSingleArticle(): Promise<{
  success: boolean;
  slug?: string;
  title?: string;
  error?: string;
}> {
  try {
    const { category, topic } = await pickTopic();
    const author = AUTHORS[Math.floor(Math.random() * AUTHORS.length)];

    console.log(`[ArticleGen] Generating: "${topic}" by ${author.name}`);

    const article = await generateArticleContent(topic, category, author);
    if (!article) {
      return { success: false, error: 'Gemini generation failed' };
    }

    const baseSlug = slugify(article.title);
    const slug = `${baseSlug}-${Date.now().toString(36)}`;

    const saved = await prisma.article.create({
      data: {
        slug,
        title: article.title,
        excerpt: article.excerpt,
        author: author.name,
        category,
        content: article.content,
        metaTitle: article.metaTitle,
        metaDescription: article.metaDescription,
        isAutoGenerated: true,
        isPublished: true,
        publishedAt: new Date(),
      },
    });

    console.log(`[ArticleGen] Published: "${saved.title}" -> /articles/${saved.slug}`);

    return { success: true, slug: saved.slug, title: saved.title };
  } catch (e) {
    console.error('[ArticleGen] Error:', e);
    return { success: false, error: String(e) };
  }
}

/**
 * Generate one article per day
 */
export async function generateDailyArticle(): Promise<{
  success: boolean;
  slug?: string;
  title?: string;
  error?: string;
}> {
  return generateSingleArticle();
}
