/**
 * Enrich judgments missing metadata using Gemini 2.5 Flash
 * Scans judgments where judge/plaintiff/defendant are empty and fills them
 */

const { Pool } = require('pg');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

const GEMINI_KEY = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(GEMINI_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function run() {
  const res = await pool.query(`
    SELECT id, case_number, full_text, first_page_text, court_name, title, slug
    FROM judgments
    WHERE (judge IS NULL OR judge = '')
      AND full_text IS NOT NULL AND LENGTH(full_text) > 100
    ORDER BY id DESC
    LIMIT 600
  `);

  console.log(`Found ${res.rows.length} judgments to enrich`);
  let updated = 0;
  let errors = 0;

  for (const j of res.rows) {
    const text = (j.first_page_text || j.full_text || '').slice(0, 4000);
    if (!text) continue;

    try {
      const result = await model.generateContent(
        'נתח את פסק הדין הבא וחלץ JSON בלבד (בלי markdown, בלי ```). החזר אך ורק אובייקט JSON תקין:\n' +
        '{"judge":"שם השופט/ת","plaintiff":"שם התובע/עותר","defendant":"שם הנתבע/משיב","procedureType":"סוג ההליך","category":"קטגוריה","summary":"תקציר קצר של 1-2 משפטים","courtName":"שם בית המשפט המלא","date":"תאריך בפורמט YYYY-MM-DD"}\n\n' +
        text
      );

      const responseText = result.response.text();
      const jm = responseText.match(/\{[\s\S]*\}/);
      if (!jm) { errors++; continue; }

      const p = JSON.parse(jm[0]);

      const updates = {};
      if (p.judge && p.judge !== '-') updates.judge = p.judge;
      if (p.plaintiff && p.plaintiff !== '-') updates.plaintiff = p.plaintiff;
      if (p.defendant && p.defendant !== '-') updates.defendant = p.defendant;
      if (p.courtName && p.courtName !== '-' && p.courtName !== 'בית משפט') updates.court_name = p.courtName;
      if (p.procedureType && p.procedureType !== '-') updates.procedure_type = p.procedureType;
      if (p.category && p.category !== '-') updates.category = p.category;
      if (p.summary && p.summary !== '-' && p.summary.length > 10) updates.summary = p.summary;

      // Update title and slug with party names
      if (p.plaintiff && p.defendant && p.plaintiff !== '-' && p.defendant !== '-') {
        const parties = p.plaintiff + ' נגד ' + p.defendant;
        updates.parties = parties;
        updates.title = (j.case_number.replace(/\t/g, ' ') + ' - ' + parties).slice(0, 200);
      }

      if (Object.keys(updates).length === 0) { continue; }

      const setClauses = Object.keys(updates).map((k, i) => `${k} = $${i + 2}`);
      const values = [j.id, ...Object.values(updates)];
      await pool.query(`UPDATE judgments SET ${setClauses.join(', ')}, updated_at = NOW() WHERE id = $1`, values);

      updated++;
      const judge = updates.judge || '-';
      const pl = updates.plaintiff || p.plaintiff || '-';
      const def = updates.defendant || p.defendant || '-';
      console.log(`  [${updated}] ID ${j.id} | ${j.case_number.replace(/\t/g,' ')} | ${judge} | ${pl} vs ${def}`);

      await sleep(300);
    } catch (e) {
      errors++;
      console.log(`  Error ID ${j.id}: ${e.message?.slice(0, 80)}`);
      await sleep(1000);
    }
  }

  console.log(`\n========================================`);
  console.log(`Enrichment complete: ${updated} updated, ${errors} errors`);
  console.log(`========================================`);
  await pool.end();
}

run().catch(e => { console.error('FATAL:', e); pool.end().catch(() => {}); process.exit(1); });
