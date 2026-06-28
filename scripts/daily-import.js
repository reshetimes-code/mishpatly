/**
 * Daily GOV.IL Import Script
 * Runs via Windows Task Scheduler every day at 08:00
 * Downloads 50 new judgments and saves to DB
 */

const httpntlm = require('httpntlm');
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

const GOV_USER = process.env.GOV_USER;
const GOV_PASS = process.env.GOV_PASS;
const GEMINI_KEY = process.env.GEMINI_API_KEY;
const MAX_IMPORT = 500;

const BLACKLISTED_CASES = new Set(['26544-03-26', 'ת"א 26544-03-26']);

function ntlmGet(url) {
  return new Promise((resolve, reject) => {
    httpntlm.get({ url, username: GOV_USER, password: GOV_PASS }, (err, res) => {
      if (err) reject(err); else resolve(res);
    });
  });
}

function ntlmDownload(url) {
  return new Promise((resolve, reject) => {
    httpntlm.get({ url, username: GOV_USER, password: GOV_PASS, binary: true }, (err, res) => {
      if (err) reject(err); else resolve(Buffer.from(res.body));
    });
  });
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function run() {
  const startTime = Date.now();
  console.log(`[${new Date().toLocaleString('he-IL')}] Starting daily import...`);

  // Get existing file IDs
  const existingRes = await pool.query('SELECT gov_file_id FROM judgments WHERE gov_file_id IS NOT NULL');
  const existingIds = new Set(existingRes.rows.map(r => r.gov_file_id));
  console.log('Existing in DB:', existingIds.size);

  // Get folder list
  const rootRes = await ntlmGet('https://decisions.court.gov.il/');
  if (rootRes.statusCode !== 200) {
    console.error('Failed to connect to GOV.IL:', rootRes.statusCode);
    await pool.end();
    return;
  }

  const folderMatches = rootRes.body.match(/\d{4}-\d{1,2}-\d{1,2}/g) || [];
  const folders = [...new Set(folderMatches)];
  folders.sort((a, b) => new Date(b) - new Date(a));
  console.log('Folders found:', folders.length, '| Newest:', folders[0]);

  let imported = 0;
  let errors = 0;

  for (const folder of folders) {
    if (imported >= MAX_IMPORT) break;

    await sleep(1500);
    const folderRes = await ntlmGet('https://decisions.court.gov.il/' + folder + '/');
    const fileMatches = [...folderRes.body.matchAll(/HREF="[^"]*\/([0-9a-f]+\.pdf)"/gi)];
    const files = fileMatches.map(m => m[1]);

    let newInFolder = 0;
    for (const filename of files) {
      if (imported >= MAX_IMPORT) break;
      const fileId = filename.replace('.pdf', '');
      if (existingIds.has(fileId)) continue;

      await sleep(1000);
      try {
        // Download PDF
        const buffer = await ntlmDownload('https://decisions.court.gov.il/' + folder + '/' + filename);

        // Extract text
        const { PDFParse } = require('pdf-parse');
        const parser = new PDFParse({ data: new Uint8Array(buffer) });
        const textResult = await parser.getText();
        const fullText = textResult.text || '';
        const pageCount = textResult.total || 1;
        const firstPageText = (textResult.pages && textResult.pages[0] && textResult.pages[0].text) || fullText.slice(0, 2000);
        await parser.destroy().catch(() => {});

        if (!firstPageText) continue;

        // Extract case number
        let caseNumber = '';
        const cm = firstPageText.match(/([\u0590-\u05FF"'\u05F3]{1,8}(?:\s*\([^)]+\))?\s+\d[\d\/-]+\d{2,4})/);
        if (cm) caseNumber = cm[1].trim();
        if (!caseNumber) { const nm = firstPageText.match(/(\d{3,6}-\d{2}-\d{2,4})/); if (nm) caseNumber = nm[1]; }
        if (!caseNumber) caseNumber = 'GOV-' + fileId.slice(0, 8);

        // Check blacklist
        if (BLACKLISTED_CASES.has(caseNumber) || [...BLACKLISTED_CASES].some(bc => caseNumber.includes(bc))) {
          console.log('  BLACKLISTED:', caseNumber);
          continue;
        }

        // Gemini AI metadata
        let judge = '', plaintiff = '', defendant = '', courtName = 'בית משפט';
        let summary = '', procedureType = 'אזרחי', category = 'אזרחי';
        const fp = folder.split('-');
        let judgmentDate = fp.length === 3 ? fp[0] + '-' + fp[1].padStart(2, '0') + '-' + fp[2].padStart(2, '0') : folder;

        try {
          const { GoogleGenerativeAI } = require('@google/generative-ai');
          const genAI = new GoogleGenerativeAI(GEMINI_KEY);
          const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
          const result = await model.generateContent(
            'נתח פסק דין וחלץ JSON בלבד: {"judge":"","plaintiff":"","defendant":"","procedureType":"","category":"","summary":"","courtName":"","date":""}\n\n' +
            firstPageText.slice(0, 4000)
          );
          const jm = result.response.text().match(/\{[\s\S]*\}/);
          if (jm) {
            const p = JSON.parse(jm[0]);
            judge = p.judge || ''; plaintiff = p.plaintiff || ''; defendant = p.defendant || '';
            courtName = p.courtName || 'בית משפט'; summary = p.summary || '';
            procedureType = p.procedureType || 'אזרחי'; category = p.category || 'אזרחי';
            if (p.date) judgmentDate = p.date;
          }
        } catch (e) { /* Gemini error, continue with basic data */ }

        // Build record
        const parties = plaintiff && defendant ? plaintiff + ' נגד ' + defendant : '';
        const title = (parties ? caseNumber + ' - ' + parties : caseNumber + ' - ' + courtName).slice(0, 200);
        let slug = ('gov-' + caseNumber + '-' + (defendant || fileId.slice(0, 8)))
          .replace(/[^\w\u0590-\u05FF\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-')
          .replace(/^-|-$/g, '').toLowerCase().slice(0, 80) || 'gov-' + fileId.slice(0, 16);

        let finalSlug = slug;
        let counter = 1;
        while ((await pool.query('SELECT 1 FROM judgments WHERE slug = $1', [finalSlug])).rows.length > 0) {
          finalSlug = slug + '-' + counter++;
        }

        await pool.query(
          `INSERT INTO judgments (title,slug,case_number,court_name,procedure_type,judgment_date,judge,
           plaintiff,defendant,parties,summary,full_text,first_page_text,source_url,pdf_url,
           source_name,category,gov_file_id,gov_folder_date,pdf_page_count,status,is_indexable,
           created_at,updated_at)
           VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,NOW(),NOW())`,
          [title, finalSlug, caseNumber, courtName, procedureType, judgmentDate,
           judge || null, plaintiff || null, defendant || null, parties || null,
           summary || firstPageText.slice(0, 300), fullText, firstPageText,
           'https://decisions.court.gov.il/' + folder + '/' + filename,
           'https://decisions.court.gov.il/' + folder + '/' + filename,
           'decisions.court.gov.il', category, fileId, folder, pageCount, 'PUBLISHED', true]
        );

        existingIds.add(fileId);
        imported++;
        newInFolder++;
        console.log(`  [${imported}/${MAX_IMPORT}] ${caseNumber} | ${judge || '-'} | ${(plaintiff || '-')} vs ${(defendant || '-')}`);

        await sleep(500);
      } catch (e) {
        errors++;
        console.log('  Error:', e.message?.slice(0, 60));
      }
    }

    if (newInFolder > 0) console.log(`Folder ${folder}: +${newInFolder} new`);
  }

  const total = await pool.query('SELECT COUNT(*) FROM judgments');
  const duration = Math.round((Date.now() - startTime) / 1000);

  console.log(`\n========================================`);
  console.log(`Import complete in ${duration}s`);
  console.log(`Imported: ${imported} | Errors: ${errors} | Total in DB: ${total.rows[0].count}`);
  console.log(`========================================`);

  await pool.end();
}

run().catch(e => {
  console.error('FATAL:', e);
  pool.end().catch(() => {});
  process.exit(1);
});
