import Link from 'next/link';
import { Calendar, User, ArrowLeft } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'מאמרים משפטיים | משפטלי',
  description:
    'מאמרים משפטיים מקצועיים בנושאי משפט פלילי, אזרחי, מסחרי ועוד. מידע משפטי עדכני ומקיף.',
};

interface Article {
  id: string;
  title: string;
  excerpt: string;
  author: string;
  date: string;
  slug: string;
  category: string;
}

const articles: Article[] = [
  {
    id: '1',
    title: 'זכויות הנאשם בהליך פלילי',
    excerpt:
      'סקירה מקיפה של זכויות הנאשם במשפט הפלילי הישראלי, כולל הזכות לייצוג, הזכות להליך הוגן, וזכות השתיקה. מאמר זה מפרט את ההגנות החוקתיות העומדות לרשות כל נאשם.',
    author: 'עו"ד רחל כהן',
    date: '2025-03-15',
    slug: 'zchuyot-hanesham-bahalikh-pelili',
    category: 'משפט פלילי',
  },
  {
    id: '2',
    title: 'חוק הגנת הפרטיות - מדריך מקיף',
    excerpt:
      'חוק הגנת הפרטיות, התשמ"א-1981, מהווה את אבן היסוד להגנה על פרטיות הפרט בישראל. מאמר זה סוקר את עיקרי החוק, תיקוניו האחרונים והשפעתם על הציבור.',
    author: 'עו"ד דוד לוי',
    date: '2025-02-28',
    slug: 'hok-haganat-hapratiyut',
    category: 'פרטיות ומידע',
  },
  {
    id: '3',
    title: 'הליכי גירושין בישראל - כל מה שצריך לדעת',
    excerpt:
      'מדריך מפורט להליכי גירושין בישראל, הכולל הסבר על סמכויות בית הדין הרבני ובית המשפט לענייני משפחה, חלוקת רכוש, משמורת ילדים ומזונות.',
    author: 'עו"ד שרה ישראלי',
    date: '2025-01-20',
    slug: 'halikhei-gerushin-beyisrael',
    category: 'דיני משפחה',
  },
  {
    id: '4',
    title: 'זכויות עובדים בפיטורין',
    excerpt:
      'סקירה של זכויות העובד בעת פיטורין, כולל פיצויי פיטורין, הודעה מוקדמת, שימוע, ודמי אבטלה. המאמר מפרט את החובות המוטלות על המעסיק ואת ההגנות שמקנה חוק פיצויי פיטורין.',
    author: 'עו"ד משה אברהם',
    date: '2024-12-10',
    slug: 'zchuyot-ovdim-befiturin',
    category: 'דיני עבודה',
  },
  {
    id: '5',
    title: 'חוזים מסחריים - טיפים לניסוח נכון',
    excerpt:
      'מדריך מעשי לניסוח חוזים מסחריים, הכולל טיפים לגבי סעיפי הגבלת אחריות, תניות שיפוט, מנגנוני יישוב סכסוכים וסעיפי סודיות. כל מה שצריך לדעת לפני החתימה.',
    author: 'עו"ד יעל גולדשטיין',
    date: '2024-11-05',
    slug: 'hozim-miskhariyim-tipim',
    category: 'משפט מסחרי',
  },
  {
    id: '6',
    title: 'תביעות נזיקין - מתי ואיך להגיש תביעה',
    excerpt:
      'מאמר מקיף על דיני נזיקין בישראל, הכולל הסבר על סוגי העוולות, חובת הראייה, חישוב פיצויים, ולוחות זמנים להגשת תביעה. מידע חיוני לכל מי שנפגע.',
    author: 'עו"ד אבי פרידמן',
    date: '2024-10-18',
    slug: 'tviot-nezikin-matai-veekh',
    category: 'דיני נזיקין',
  },
  {
    id: '7',
    title: 'תאונות דרכים - זכויות נפגעים ופיצויים',
    excerpt:
      'מדריך מקיף לנפגעי תאונות דרכים בישראל. הסבר על חוק הפיצויים לנפגעי תאונות דרכים, אופן הגשת תביעה, חישוב פיצויים וזכויות הנפגעים מול חברות הביטוח.',
    author: 'עו"ד נועה ברק',
    date: '2025-04-10',
    slug: 'teunot-drakhim-zchuyot-nifgaim',
    category: 'דיני נזיקין',
  },
  {
    id: '8',
    title: 'הטרדה מינית במקום העבודה - החוק והזכויות',
    excerpt:
      'סקירה מקיפה של החוק למניעת הטרדה מינית, התשנ"ח-1998. מהי הטרדה מינית, כיצד מגישים תלונה, מהן חובות המעסיק ומהם הסעדים העומדים לרשות הנפגעים.',
    author: 'עו"ד מיכל שגב',
    date: '2025-05-22',
    slug: 'hatrada-minit-baavoda',
    category: 'דיני עבודה',
  },
  {
    id: '9',
    title: 'דיני שכירות דירות - זכויות שוכרים ומשכירים',
    excerpt:
      'מדריך מעשי לשוכרים ומשכירים בשוק הדירות הישראלי. חוק השכירות והשאילה, חובות הצדדים, ערבויות, תיקונים, סיום חוזה והגנות חוקיות לשני הצדדים.',
    author: 'עו"ד אורי דגן',
    date: '2025-06-15',
    slug: 'dinei-skhirut-dirot',
    category: 'דיני מקרקעין',
  },
  {
    id: '10',
    title: 'ירושה וצוואות - מדריך מקיף',
    excerpt:
      'כל מה שצריך לדעת על דיני ירושה וצוואות בישראל. סוגי צוואות, הליך קיום צוואה, ירושה על פי דין, התנגדויות לצוואה וחלוקת עיזבון בין היורשים.',
    author: 'עו"ד רונית שמעוני',
    date: '2025-07-03',
    slug: 'yerusha-vetzavaot-madrich',
    category: 'דיני משפחה',
  },
  {
    id: '11',
    title: 'תביעות קטנות - איך להגיש ומה חשוב לדעת',
    excerpt:
      'מדריך מלא להגשת תביעה בבית משפט לתביעות קטנות. הסבר על סמכות בית המשפט, אופן הגשת התביעה, ההתגוננות, סכומי תביעה מקסימליים וטיפים להצלחה.',
    author: 'עו"ד תמר אלון',
    date: '2025-08-18',
    slug: 'tviot-ktanot-eikh-lehagish',
    category: 'משפט אזרחי',
  },
  {
    id: '12',
    title: 'זכויות חייבים בהוצאה לפועל',
    excerpt:
      'סקירה של זכויות החייב בהליכי הוצאה לפועל. הגנה על מינימום קיומי, הגבלות שניתן להטיל, אפשרויות הסדר חוב, צו תשלומים ומנגנוני הגנה מפני עיקולים.',
    author: 'עו"ד יוסי כרמל',
    date: '2025-09-05',
    slug: 'zchuyot-hayavim-hotza-lapoel',
    category: 'משפט אזרחי',
  },
  {
    id: '13',
    title: 'משמורת ילדים - סוגים וקריטריונים',
    excerpt:
      'מדריך מקיף בנושא משמורת ילדים בישראל. סוגי משמורת, קריטריונים לקביעת משמורת, עקרון טובת הילד, שינוי הסדרי משמורת ומעבר של הורה למקום מגורים חדש.',
    author: 'עו"ד דנה פלד',
    date: '2025-10-12',
    slug: 'mishmeret-yeladim-sugim-vekriteryonim',
    category: 'דיני משפחה',
  },
  {
    id: '14',
    title: 'עבירות תנועה - קנסות, נקודות ושלילת רישיון',
    excerpt:
      'מדריך מקיף לעבירות תנועה בישראל. שיטת הניקוד, קנסות נפוצים, שלילת רישיון נהיגה, הליכי ערעור ואפשרויות משפטיות לנהגים שנתפסו בעבירות תנועה.',
    author: 'עו"ד אלעד מזרחי',
    date: '2025-11-28',
    slug: 'avirot-tnua-knasot-nekudot',
    category: 'דיני תנועה',
  },
  {
    id: '15',
    title: 'רכישת דירה - היבטים משפטיים',
    excerpt:
      'כל ההיבטים המשפטיים של רכישת דירה בישראל. בדיקות מקדימות, הסכם מכר, רישום בטאבו, מיסוי מקרקעין, ליווי משפטי וטיפים להגנה על הקונה בעסקת נדל"ן.',
    author: 'עו"ד עדי שפירא',
    date: '2025-12-15',
    slug: 'rkhishat-dira-hebetim-mishpatiyim',
    category: 'דיני מקרקעין',
  },
  {
    id: '16',
    title: 'דיני אינטרנט וסייבר - הגנה על מידע אישי',
    excerpt:
      'סקירה של דיני האינטרנט והסייבר בישראל. הגנה על מידע אישי ברשת, עבירות מחשב, לשון הרע באינטרנט, זכויות יוצרים דיגיטליות וחוק הגנת הפרטיות ברשת.',
    author: 'עו"ד ליאור גבע',
    date: '2026-01-10',
    slug: 'dinei-internet-vesayber',
    category: 'דיני אינטרנט',
  },
  {
    id: '17',
    title: 'ביטוח לאומי - זכויות וגמלאות',
    excerpt:
      'מדריך מקיף לזכויות בביטוח לאומי. גמלת נכות, דמי אבטלה, קצבת ילדים, דמי לידה, גמלת סיעוד, קצבת זקנה ושאירים - כל הזכויות שמגיעות לכם מהמוסד לביטוח לאומי.',
    author: 'עו"ד הילה נחמיאס',
    date: '2026-02-20',
    slug: 'bituah-leumi-zchuyot-gimlaot',
    category: 'ביטוח לאומי',
  },
  {
    id: '18',
    title: 'חדלות פירעון - הליך פשיטת רגל החדש',
    excerpt:
      'מדריך מקיף על חוק חדלות פירעון ושיקום כלכלי, התשע"ח-2018. הליך פשיטת רגל החדש, תנאי זכאות, שלבי ההליך, הפטר מחובות ושיקום כלכלי לאחר חדלות פירעון.',
    author: 'עו"ד גיל רוזנברג',
    date: '2026-03-08',
    slug: 'hadlut-peiraon-pshitat-regel',
    category: 'משפט אזרחי',
  },
  {
    id: '19',
    title: 'זכויות דיירים מוגנים',
    excerpt:
      'סקירה מקיפה של זכויות דיירים מוגנים בישראל. חוק הגנת הדייר, תנאי הגנה, דמי מפתח, העברת זכויות, פינוי דייר מוגן ופיצויים - כל מה שדיירים מוגנים צריכים לדעת.',
    author: 'עו"ד שלומית ויס',
    date: '2026-04-14',
    slug: 'zchuyot-dayarim-muganim',
    category: 'דיני מקרקעין',
  },
  {
    id: '20',
    title: 'הסכם ממון - למה חשוב ואיך מכינים',
    excerpt:
      'מדריך מקיף להסכמי ממון בישראל. מהו הסכם ממון, מתי כדאי לערוך אותו, מה צריך לכלול, הליך האישור בבית המשפט ותוקפו המשפטי של הסכם ממון בין בני זוג.',
    author: 'עו"ד קרן אביב',
    date: '2026-05-02',
    slug: 'heskem-mamon-madrich',
    category: 'דיני משפחה',
  },
];

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('he-IL', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export default function ArticlesPage() {
  return (
    <div dir="rtl" className="min-h-screen bg-[#F4F6F8]">
      {/* Breadcrumbs */}
      <nav className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center gap-2 text-sm text-gray-500">
          <Link href="/" className="hover:text-[#328CC1] transition-colors">
            דף הבית
          </Link>
          <span>/</span>
          <span className="text-[#1D2731] font-medium">מאמרים משפטיים</span>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-[#0B3C5D] mb-4">
            מאמרים משפטיים
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            מאמרים מקצועיים בנושאים משפטיים מגוונים, נכתבו על ידי עורכי דין מובילים
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article) => (
            <article
              key={article.id}
              className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow overflow-hidden flex flex-col"
            >
              {/* Category Badge */}
              <div className="bg-[#0B3C5D] px-4 py-2">
                <span className="text-white text-xs font-medium">
                  {article.category}
                </span>
              </div>

              <div className="p-6 flex flex-col flex-1">
                <h2 className="text-lg font-bold text-[#1D2731] mb-3 leading-relaxed">
                  {article.title}
                </h2>

                <p className="text-gray-600 text-sm leading-relaxed mb-4 flex-1">
                  {article.excerpt}
                </p>

                {/* Meta info */}
                <div className="flex items-center gap-4 text-xs text-gray-500 mb-4 border-t border-gray-100 pt-4">
                  <div className="flex items-center gap-1">
                    <User className="w-3.5 h-3.5" />
                    <span>{article.author}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{formatDate(article.date)}</span>
                  </div>
                </div>

                <Link
                  href={`/articles/${article.slug}`}
                  className="inline-flex items-center gap-1 text-[#328CC1] font-semibold text-sm hover:text-[#0B3C5D] transition-colors"
                >
                  קרא עוד
                  <ArrowLeft className="w-4 h-4" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
