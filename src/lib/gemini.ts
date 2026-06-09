/**
 * Gemini AI - Comprehensive judgment document analysis
 * Scans legal document text and generates rich, detailed content
 */

import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export interface JudgmentAnalysis {
  judge: string;
  plaintiff: string;
  defendant: string;
  procedureType: string;
  category: string;
  summary: string;
  decisionType: string;
  courtName: string;
  date: string;
  relatedCaseNumbers: string[];
}

export interface ComprehensiveAnalysis extends JudgmentAnalysis {
  aiAnalysis: string;        // Detailed legal analysis (multiple paragraphs)
  legalTopics: string[];     // Legal topics and keywords
  keyFindings: string;       // Key findings and conclusions
  partiesArgs: string;       // Summary of parties' arguments
  courtReasoning: string;    // Court's reasoning and legal basis
  verdict: string;           // The actual verdict/decision
}

/**
 * Analyze a judgment document using Gemini AI
 * Returns structured metadata extracted from the text
 */
export async function analyzeJudgment(
  fullText: string,
  existingData?: {
    caseNumber?: string;
    courtName?: string;
    judge?: string;
    plaintiff?: string;
    defendant?: string;
    summary?: string;
  }
): Promise<JudgmentAnalysis | null> {
  if (!process.env.GEMINI_API_KEY) {
    console.error('[Gemini] No API key configured');
    return null;
  }

  if (!fullText || fullText.length < 50) {
    return null;
  }

  const textToAnalyze = fullText.length > 8000 ? fullText.slice(0, 8000) : fullText;

  const prompt = `אתה מנתח מסמכים משפטיים ישראליים. נתח את פסק הדין הבא וחלץ את המידע הבא בפורמט JSON בלבד.

החזר JSON בלבד, ללא הסברים, בפורמט הבא:
{
  "judge": "שם השופט/ת המלא (כולל תואר כמו 'סגן נשיאה')",
  "plaintiff": "שם התובע/העותר",
  "defendant": "שם הנתבע/המשיב",
  "procedureType": "סוג ההליך (אזרחי/פלילי/מנהלי/משפחה/עבודה/וכו')",
  "category": "קטגוריה (אזרחי/פלילי/משפחה/עבודה/מנהלי/נזיקין/חוזים/מקרקעין/ביטוח/מיסים/חדלות פירעון/בית דין רבני)",
  "summary": "תקציר קצר וענייני של פסק הדין ב-2-3 משפטים",
  "decisionType": "סוג ההחלטה (פסק דין/החלטה/גזר דין/פסק דין חלקי/החלטה בבקשה)",
  "courtName": "שם בית המשפט המלא",
  "date": "תאריך ההחלטה בפורמט YYYY-MM-DD",
  "relatedCaseNumbers": ["מספרי תיקים נוספים המוזכרים במסמך"]
}

כללים:
- אם לא ניתן לזהות שדה מסוים, החזר מחרוזת ריקה ""
- שמות צדדים: רק שם האדם/חברה, בלי "עו"ד", בלי "התובע/הנתבע"
- שופט: השם המלא כולל תואר אם יש (למשל "אבישי רובס, סגן נשיאה")
- תקציר: תמצת את עיקר ההחלטה, לא את הרקע
- אם יש מספר תובעים/נתבעים, כתוב את הראשון בלבד

${existingData?.caseNumber ? `מספר תיק ידוע: ${existingData.caseNumber}` : ''}
${existingData?.courtName ? `בית משפט ידוע: ${existingData.courtName}` : ''}

טקסט המסמך:
${textToAnalyze}`;

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();

    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error('[Gemini] No JSON found in response');
      return null;
    }

    const parsed = JSON.parse(jsonMatch[0]);

    return {
      judge: parsed.judge || '',
      plaintiff: parsed.plaintiff || '',
      defendant: parsed.defendant || '',
      procedureType: parsed.procedureType || '',
      category: parsed.category || '',
      summary: parsed.summary || '',
      decisionType: parsed.decisionType || '',
      courtName: parsed.courtName || '',
      date: parsed.date || '',
      relatedCaseNumbers: Array.isArray(parsed.relatedCaseNumbers) ? parsed.relatedCaseNumbers : [],
    };
  } catch (error) {
    console.error('[Gemini] Analysis error:', error);
    return null;
  }
}

/**
 * Generate comprehensive, rich legal analysis for a judgment
 * This creates the premium content that customers pay for
 */
export async function generateComprehensiveAnalysis(
  fullText: string,
  existingData: {
    caseNumber?: string;
    courtName?: string;
    judge?: string;
    plaintiff?: string;
    defendant?: string;
    summary?: string;
    procedureType?: string;
    category?: string;
    title?: string;
  }
): Promise<ComprehensiveAnalysis | null> {
  if (!process.env.GEMINI_API_KEY) {
    console.error('[Gemini] No API key configured');
    return null;
  }

  // Even minimal text can be enriched using case metadata
  const hasText = fullText && fullText.length >= 30;
  const hasMetadata = existingData.caseNumber || existingData.courtName || existingData.plaintiff || existingData.defendant;

  if (!hasText && !hasMetadata) {
    return null;
  }

  // Use more text for comprehensive analysis
  const textToAnalyze = fullText
    ? (fullText.length > 15000 ? fullText.slice(0, 15000) : fullText)
    : '';

  const contextInfo = [
    existingData.caseNumber ? `מספר תיק: ${existingData.caseNumber}` : '',
    existingData.courtName ? `בית משפט: ${existingData.courtName}` : '',
    existingData.judge ? `שופט/ת: ${existingData.judge}` : '',
    existingData.plaintiff ? `תובע: ${existingData.plaintiff}` : '',
    existingData.defendant ? `נתבע: ${existingData.defendant}` : '',
    existingData.procedureType ? `סוג הליך: ${existingData.procedureType}` : '',
    existingData.category ? `קטגוריה: ${existingData.category}` : '',
    existingData.title ? `כותרת: ${existingData.title}` : '',
    existingData.summary ? `תקציר קיים: ${existingData.summary}` : '',
  ].filter(Boolean).join('\n');

  const prompt = `אתה עורך דין ומנתח משפטי בכיר בישראל. תפקידך לנתח מסמכים משפטיים ולייצר ניתוח מקיף, מפורט ומקצועי שלקוח משלם יקבל ערך ממשי ממנו.

חשוב מאוד: התוצר צריך להיות מפורט, מקצועי ואיכותי. זה מוצר שלקוחות משלמים עליו כסף.

מידע ידוע על המסמך:
${contextInfo}

${textToAnalyze ? `טקסט המסמך:\n${textToAnalyze}` : 'אין טקסט מלא - נתח על סמך המידע הידוע בלבד.'}

החזר JSON בלבד בפורמט הבא (כתוב בעברית מקצועית ומפורטת):
{
  "judge": "שם השופט/ת המלא כולל תואר",
  "plaintiff": "שם התובע/העותר",
  "defendant": "שם הנתבע/המשיב",
  "procedureType": "סוג ההליך",
  "category": "קטגוריה משפטית",
  "decisionType": "סוג ההחלטה (פסק דין/החלטה/גזר דין/פסק דין חלקי)",
  "courtName": "שם בית המשפט המלא",
  "date": "תאריך בפורמט YYYY-MM-DD",
  "relatedCaseNumbers": ["תיקים קשורים"],
  "summary": "תקציר מקיף של פסק הדין ב-3-5 משפטים. כולל רקע, המחלוקת המרכזית, והתוצאה.",
  "aiAnalysis": "ניתוח משפטי מפורט ומקיף של 3-5 פסקאות. כולל: רקע עובדתי מלא, הסוגיות המשפטיות שעלו, הדין החל, ניתוח ההחלטה, והשלכות אפשריות. כתוב כאילו אתה כותב סקירה משפטית מקצועית עבור עורך דין. השתמש בפסקאות מופרדות בשורה ריקה.",
  "legalTopics": ["נושא משפטי 1", "נושא משפטי 2", "נושא משפטי 3", "עד 8 נושאים רלוונטיים - למשל: דיני חוזים, הפרת חוזה, פיצויים, תום לב, נטל הראיה וכו'"],
  "keyFindings": "ממצאי מפתח ומסקנות. 3-5 נקודות מרכזיות שבית המשפט קבע. כל נקודה בשורה נפרדת עם • בתחילתה.",
  "partiesArgs": "סיכום טענות הצדדים. תובע: טענות התובע העיקריות. נתבע: טענות הנתבע העיקריות. כתוב בפסקאות נפרדות.",
  "courtReasoning": "נימוקי בית המשפט. הסבר מפורט של הנמקת בית המשפט, הפסיקה שצוטטה, העקרונות המשפטיים שיושמו, ואיך בית המשפט הגיע למסקנותיו.",
  "verdict": "ההכרעה/פסק הדין. מה בדיוק בית המשפט החליט - כולל סעדים, פיצויים, הוצאות משפט."
}

כללים חשובים:
- כתוב עברית משפטית מקצועית וברורה
- אם אין מספיק מידע לשדה מסוים, נסה להסיק מהמידע הקיים. אם לא ניתן כלל, כתוב מחרוזת ריקה.
- aiAnalysis חייב להיות מפורט ומקיף - לפחות 3 פסקאות
- legalTopics - רשימה של 3-8 נושאים משפטיים רלוונטיים
- keyFindings - לפחות 3 נקודות מפתח
- אם הטקסט קצר מאוד, הרחב את הניתוח על סמך סוג ההליך, בית המשפט, והנושא המשפטי
- שמות צדדים: רק שם האדם/חברה, בלי "עו"ד", בלי "התובע/הנתבע"`;

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();

    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error('[Gemini] No JSON found in comprehensive response');
      return null;
    }

    const parsed = JSON.parse(jsonMatch[0]);

    return {
      judge: parsed.judge || '',
      plaintiff: parsed.plaintiff || '',
      defendant: parsed.defendant || '',
      procedureType: parsed.procedureType || '',
      category: parsed.category || '',
      summary: parsed.summary || '',
      decisionType: parsed.decisionType || '',
      courtName: parsed.courtName || '',
      date: parsed.date || '',
      relatedCaseNumbers: Array.isArray(parsed.relatedCaseNumbers) ? parsed.relatedCaseNumbers : [],
      aiAnalysis: parsed.aiAnalysis || '',
      legalTopics: Array.isArray(parsed.legalTopics) ? parsed.legalTopics : [],
      keyFindings: parsed.keyFindings || '',
      partiesArgs: parsed.partiesArgs || '',
      courtReasoning: parsed.courtReasoning || '',
      verdict: parsed.verdict || '',
    };
  } catch (error) {
    console.error('[Gemini] Comprehensive analysis error:', error);
    return null;
  }
}

/**
 * Enrich a judgment record with AI-extracted data
 * Only fills in fields that are currently empty
 */
export function mergeAnalysis(
  existing: {
    judge?: string;
    plaintiff?: string;
    defendant?: string;
    procedureType?: string;
    category?: string;
    summary?: string;
    courtName?: string;
  },
  analysis: JudgmentAnalysis
): Record<string, string> {
  const updates: Record<string, string> = {};

  if (!existing.judge && analysis.judge) updates.judge = analysis.judge;
  if (!existing.plaintiff && analysis.plaintiff) updates.plaintiff = analysis.plaintiff;
  if (!existing.defendant && analysis.defendant) updates.defendant = analysis.defendant;
  if (!existing.procedureType && analysis.procedureType) updates.procedureType = analysis.procedureType;
  if (!existing.category && analysis.category) updates.category = analysis.category;
  if (!existing.summary && analysis.summary) updates.summary = analysis.summary;
  if (!existing.courtName && analysis.courtName) updates.courtName = analysis.courtName;

  return updates;
}

/**
 * Merge comprehensive analysis into judgment record
 * Fills empty fields and always updates AI-specific fields
 */
export function mergeComprehensiveAnalysis(
  existing: {
    judge?: string;
    plaintiff?: string;
    defendant?: string;
    procedureType?: string;
    category?: string;
    summary?: string;
    courtName?: string;
    aiAnalysis?: string;
    keyFindings?: string;
    partiesArgs?: string;
    courtReasoning?: string;
    verdict?: string;
    decisionType?: string;
  },
  analysis: ComprehensiveAnalysis
): Record<string, unknown> {
  const updates: Record<string, unknown> = {};

  // Basic metadata - only fill if empty
  if (!existing.judge && analysis.judge) updates.judge = analysis.judge;
  if (!existing.plaintiff && analysis.plaintiff) updates.plaintiff = analysis.plaintiff;
  if (!existing.defendant && analysis.defendant) updates.defendant = analysis.defendant;
  if (!existing.procedureType && analysis.procedureType) updates.procedureType = analysis.procedureType;
  if (!existing.category && analysis.category) updates.category = analysis.category;
  if (!existing.courtName && analysis.courtName) updates.courtName = analysis.courtName;

  // Summary - update if current one is very short or empty
  if ((!existing.summary || existing.summary.length < 50) && analysis.summary) {
    updates.summary = analysis.summary;
  }

  // AI-generated fields - always update (they're the product)
  if (analysis.aiAnalysis) updates.aiAnalysis = analysis.aiAnalysis;
  if (analysis.legalTopics?.length > 0) updates.legalTopics = analysis.legalTopics;
  if (analysis.keyFindings) updates.keyFindings = analysis.keyFindings;
  if (analysis.partiesArgs) updates.partiesArgs = analysis.partiesArgs;
  if (analysis.courtReasoning) updates.courtReasoning = analysis.courtReasoning;
  if (analysis.verdict) updates.verdict = analysis.verdict;
  if (analysis.decisionType) updates.decisionType = analysis.decisionType;
  if (analysis.relatedCaseNumbers?.length > 0) updates.relatedCases = analysis.relatedCaseNumbers;

  // Mark enrichment timestamp
  updates.aiEnrichedAt = new Date();

  return updates;
}
