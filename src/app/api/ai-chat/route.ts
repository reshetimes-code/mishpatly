import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(request: NextRequest) {
  if (!process.env.GEMINI_API_KEY) {
    return NextResponse.json({ answer: 'שירות ה-AI אינו זמין כרגע.' }, { status: 503 });
  }

  try {
    const { question, caseData, history } = await request.json();

    if (!question || !caseData) {
      return NextResponse.json({ answer: 'שאלה לא תקינה.' }, { status: 400 });
    }

    // Build conversation context from case data
    const caseContext = [
      caseData.caseNumber ? `מספר תיק: ${caseData.caseNumber}` : '',
      caseData.court ? `בית משפט: ${caseData.court}` : '',
      caseData.judge ? `שופט/ת: ${caseData.judge}` : '',
      caseData.plaintiff ? `תובע: ${caseData.plaintiff}` : '',
      caseData.defendant ? `נתבע: ${caseData.defendant}` : '',
      caseData.date ? `תאריך: ${caseData.date}` : '',
      caseData.proceedingType ? `סוג הליך: ${caseData.proceedingType}` : '',
      caseData.category ? `קטגוריה: ${caseData.category}` : '',
      caseData.decisionType ? `סוג החלטה: ${caseData.decisionType}` : '',
      caseData.summary ? `תקציר: ${caseData.summary}` : '',
    ].filter(Boolean).join('\n');

    // Build conversation history
    const historyText = (history || [])
      .map((m: { role: string; text: string }) => `${m.role === 'user' ? 'שאלה' : 'תשובה'}: ${m.text}`)
      .join('\n\n');

    const prompt = `אתה עוזר משפטי מבוסס בינה מלאכותית. המשתמש שואל שאלות על פסק דין ישראלי.

חשוב מאוד:
- תן תשובות מקצועיות, מפורטות ומועילות
- התבסס על המידע שיש לך על פסק הדין
- אם אין מספיק מידע, ציין זאת בכנות
- סיים כל תשובה במשפט: "לייעוץ משפטי מקצועי מומלץ לפנות לעורך דין."
- כתוב בעברית ברורה ומקצועית
- אל תמציא עובדות שלא מופיעות במידע

פרטי פסק הדין:
${caseContext}

${historyText ? `היסטוריית שיחה:\n${historyText}\n\n` : ''}שאלת המשתמש: ${question}`;

    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    const result = await model.generateContent(prompt);
    const answer = result.response.text();

    return NextResponse.json({ answer });
  } catch (error) {
    console.error('[AI Chat] Error:', error);
    return NextResponse.json({ answer: 'שגיאה בשירות ה-AI. נסה שוב מאוחר יותר.' }, { status: 500 });
  }
}
