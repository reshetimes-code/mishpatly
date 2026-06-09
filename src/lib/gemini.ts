/**
 * Gemini AI - Judgment document analysis
 * Scans legal document text and extracts structured metadata
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
  decisionType: string; // החלטה, פסק דין, גזר דין, etc.
  courtName: string;
  date: string;
  relatedCaseNumbers: string[];
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

  // Limit text to ~8000 chars to stay within token limits
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
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();

    // Extract JSON from response (may be wrapped in markdown code block)
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
