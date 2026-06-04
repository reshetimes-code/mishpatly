/**
 * Scrapers for Israeli legal ruling sources
 * Each scraper fetches rulings and returns normalized data
 */

import { createSlug, type StoredJudgment } from './judgment-store';

type JudgmentInput = Omit<StoredJudgment, 'id' | 'createdAt' | 'updatedAt' | 'isIndexable'>;

// ============================================================
// Helper: detect category from procedure type / court / text
// ============================================================
export function detectCategory(procedureType: string, courtName: string, summary: string): string {
  const text = `${procedureType} ${courtName} ${summary}`.toLowerCase();

  if (text.includes('פלילי') || text.includes('תפ') || text.includes('עפ') || text.includes('פלי')) return 'פלילי';
  if (text.includes('משפחה') || text.includes('גירושין') || text.includes('מזונות') || text.includes('משמורת')) return 'משפחה';
  if (text.includes('עבודה') || text.includes('עב') || text.includes('דמ')) return 'עבודה';
  if (text.includes('מנהלי') || text.includes('עתירה') || text.includes('בג"ץ') || text.includes('עת"מ')) return 'מנהלי';
  if (text.includes('נזיקין') || text.includes('תאונ') || text.includes('פיצוי') || text.includes('נזק')) return 'נזיקין';
  if (text.includes('חוזה') || text.includes('חוזי') || text.includes('הסכם')) return 'חוזים';
  if (text.includes('מקרקעין') || text.includes('דירה') || text.includes('נדל"ן') || text.includes('שכירות')) return 'מקרקעין';
  if (text.includes('ביטוח')) return 'ביטוח';
  if (text.includes('מיסים') || text.includes('מס') || text.includes('מע"מ')) return 'מיסים';
  if (text.includes('חדלות פירעון') || text.includes('פירוק') || text.includes('פשיטת רגל')) return 'חדלות פירעון';
  if (text.includes('רבני') || text.includes('בית דין רבני')) return 'בית דין רבני';
  if (text.includes('אזרחי') || text.includes('תא') || text.includes('ע"א')) return 'אזרחי';

  return 'אזרחי';
}

// ============================================================
// Helper: parse Hebrew date
// ============================================================
function parseDate(dateStr: string): string {
  if (!dateStr) return new Date().toISOString().split('T')[0];
  // DD/MM/YYYY
  const parts = dateStr.split('/');
  if (parts.length === 3) {
    const [d, m, y] = parts;
    const year = y.length === 2 ? `20${y}` : y;
    return `${year}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`;
  }
  // DD.MM.YYYY
  const dotParts = dateStr.split('.');
  if (dotParts.length === 3) {
    const [d, m, y] = dotParts;
    const year = y.length === 2 ? `20${y}` : y;
    return `${year}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`;
  }
  // Already ISO
  if (dateStr.match(/^\d{4}-\d{2}-\d{2}/)) return dateStr.slice(0, 10);
  return new Date().toISOString().split('T')[0];
}

// ============================================================
// Source 1: data.gov.il - Freedom of Information (FOI) judgments
// ============================================================
export async function scrapeDataGovIL(): Promise<{ items: JudgmentInput[]; errors: string[] }> {
  const items: JudgmentInput[] = [];
  const errors: string[] = [];

  try {
    let offset = 0;
    const limit = 100;
    let total = 0;

    do {
      const res = await fetch(
        `https://data.gov.il/api/3/action/datastore_search?resource_id=6a469006-3844-476f-84e8-960a8fd9df22&limit=${limit}&offset=${offset}`,
        { signal: AbortSignal.timeout(15000) }
      );
      const data = await res.json();
      if (!data.success) { errors.push('data.gov.il FOI: שגיאה בשליפה'); break; }

      total = data.result.total;
      for (const r of data.result.records) {
        const caseNumber = r['מספר הליך'] || '';
        const defendant = r['משיבים'] || r['משיבים 2'] || '';
        const plaintiff = r['עותרים'] || '';
        const courtDistrict = r['מחוז'] || '';
        const subject = r['נושא העתירה'] || '';
        const decision = r['החלטה'] || '';
        const details = r['פירוט ההחלטה'] || '';
        const laws = r['סעיפי חוק רלוונטיים'] || '';
        const date = parseDate(r['תאריך פסק הדין'] || '');

        const courtName = courtDistrict ? `בית המשפט המחוזי ${courtDistrict}` : 'בית משפט מחוזי';
        const title = `${caseNumber} - ${plaintiff} נגד ${defendant}`.slice(0, 200);
        const summary = [subject, decision, details].filter(Boolean).join('. ');

        items.push({
          title,
          slug: createSlug(`${caseNumber}-${defendant}`),
          caseNumber,
          courtName,
          procedureType: 'עתירה מנהלית',
          judgmentDate: date,
          judge: '',
          plaintiff,
          defendant,
          parties: `${plaintiff} נגד ${defendant}`,
          summary: summary || `פסק דין בעניין ${defendant}`,
          fullText: [subject, details, decision, laws].filter(Boolean).join('\n\n'),
          sourceUrl: 'https://data.gov.il/dataset/judgments',
          pdfUrl: '',
          sourceName: 'data.gov.il',
          category: detectCategory('עתירה מנהלית', courtName, summary),
          status: 'PUBLISHED',
        });
      }
      offset += limit;
    } while (offset < total);
  } catch (e) {
    errors.push(`data.gov.il FOI: ${String(e)}`);
  }

  return { items, errors };
}

// ============================================================
// Source 2: data.gov.il - Rabbinic Court decisions
// ============================================================
export async function scrapeRabbinicCourt(): Promise<{ items: JudgmentInput[]; errors: string[] }> {
  const items: JudgmentInput[] = [];
  const errors: string[] = [];

  try {
    let offset = 0;
    const limit = 100;
    let total = 0;

    do {
      const res = await fetch(
        `https://data.gov.il/api/3/action/datastore_search?resource_id=30035b4c-1bea-467f-a368-b1453d540fd0&limit=${limit}&offset=${offset}`,
        { signal: AbortSignal.timeout(15000) }
      );
      const data = await res.json();
      if (!data.success) { errors.push('בית דין רבני: שגיאה'); break; }

      total = data.result.total;
      for (const r of data.result.records) {
        const name = r['שם פסק דין לגירושין'] || r['שם פסק דין'] || '';
        const year = String(r['שנה'] || '');
        const count = r['כמות'] || '';
        const caseNum = `בד"ר-${year}-${r._id || Math.random().toString(36).slice(2, 6)}`;

        if (!name && !year) continue;

        items.push({
          title: name || `פסק דין בית דין רבני ${year}`,
          slug: createSlug(`rabbinic-${caseNum}`),
          caseNumber: caseNum,
          courtName: 'בית הדין הרבני',
          procedureType: 'גירושין',
          judgmentDate: year.length === 4 ? `${year}-01-01` : parseDate(year),
          judge: '',
          plaintiff: '',
          defendant: '',
          parties: '',
          summary: name ? `${name}. כמות: ${count}` : `פסק דין גירושין - ${year}`,
          fullText: '',
          sourceUrl: 'https://data.gov.il',
          pdfUrl: '',
          sourceName: 'בית הדין הרבני',
          category: 'בית דין רבני',
          status: 'PUBLISHED',
        });
      }
      offset += limit;
    } while (offset < total);
  } catch (e) {
    errors.push(`בית דין רבני: ${String(e)}`);
  }

  return { items, errors };
}

// ============================================================
// Source 3: Nevo.co.il - Daily digests
// ============================================================
export async function scrapeNevo(): Promise<{ items: JudgmentInput[]; errors: string[] }> {
  const items: JudgmentInput[] = [];
  const errors: string[] = [];

  try {
    // Fetch recent daily digests - try the latest message IDs
    // Start from a recent known ID and go back
    const startId = 113030;
    const idsToTry = Array.from({ length: 5 }, (_, i) => startId - i);

    for (const msgId of idsToTry) {
      try {
        const res = await fetch(
          `https://www.nevo.co.il/Handlers/GetMsgContent.ashx?Msgid=${msgId}`,
          {
            signal: AbortSignal.timeout(10000),
            headers: {
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
              'Accept': 'text/html,application/xhtml+xml',
              'Accept-Language': 'he-IL,he;q=0.9',
            },
          }
        );

        if (!res.ok) continue;
        const html = await res.text();
        if (!html || html.length < 100) continue;

        // Parse rulings from digest HTML
        const parsed = parseNevoDigest(html, msgId);
        items.push(...parsed);
      } catch {
        // Skip failed individual fetches
      }
    }
  } catch (e) {
    errors.push(`נבו: ${String(e)}`);
  }

  if (items.length === 0) {
    errors.push('נבו: לא נמצאו פסקי דין בגיליונות האחרונים');
  }

  return { items, errors };
}

function parseNevoDigest(html: string, msgId: number): JudgmentInput[] {
  const items: JudgmentInput[] = [];

  // First strip HTML tags but preserve structure with newlines
  const text = html
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/?(p|div|tr|li)[^>]*>/gi, '\n')
    .replace(/<b>|<strong>/gi, '**')
    .replace(/<\/b>|<\/strong>/gi, '**')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"');

  const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 5);

  // Case number pattern - handles formats like ע"א 53824-11-24 or בר"מ 61508-10-25 or בג"ץ 1234/24
  // Also handles prefix in parens like בר"ע (ארצי) 36110-05-26
  const caseLinePattern = /([א-ת"׳]{1,8}(?:\s*\([^)]+\))?\s+\d[\d\/-]+\d{2,4})\s+\*\*([^*]+)\*\*\s*נ['׳]\s*\*\*([^*]+)\*\*\s*(?:\(([^)]+)\))?/;
  const caseLineSimple = /([א-ת"׳]{1,8}(?:\s*\([^)]+\))?\s+\d[\d\/-]+\d{2,4})\s+([א-ת\s"'.()א-ת]+?)\s+נ['׳]\s+([א-ת\s"'.()א-ת-]+?)(?:\s*\(([^)]+)\)|\s*$)/;

  let currentCase = '';
  let currentCourt = '';
  let currentJudges = '';
  let currentDate = '';
  let currentPlaintiff = '';
  let currentDefendant = '';
  let currentSummary = '';

  for (const line of lines) {
    // Try bold party format first: case **plaintiff** נ' **defendant** (court; judges; date)
    let match = line.match(caseLinePattern);
    if (match) {
      if (currentCase) {
        items.push(createNevoJudgment(currentCase, currentCourt, currentJudges, currentDate, currentPlaintiff, currentDefendant, currentSummary, msgId));
      }
      currentCase = match[1].trim();
      currentPlaintiff = match[2].trim();
      currentDefendant = match[3].trim();
      currentSummary = '';

      if (match[4]) {
        const parts = match[4].split(';').map(s => s.trim());
        currentCourt = mapNevoCourt(parts[0] || '');
        currentJudges = parts.length > 2 ? parts.slice(1, -1).join(', ') : (parts[1] || '');
        currentDate = parts[parts.length - 1] || '';
      }
      continue;
    }

    // Try without bold markers
    match = line.match(caseLineSimple);
    if (match) {
      if (currentCase) {
        items.push(createNevoJudgment(currentCase, currentCourt, currentJudges, currentDate, currentPlaintiff, currentDefendant, currentSummary, msgId));
      }
      currentCase = match[1].trim();
      currentPlaintiff = match[2].trim();
      currentDefendant = match[3].trim();
      currentSummary = '';

      if (match[4]) {
        const parts = match[4].split(';').map(s => s.trim());
        currentCourt = mapNevoCourt(parts[0] || '');
        currentJudges = parts.length > 2 ? parts.slice(1, -1).join(', ') : (parts[1] || '');
        currentDate = parts[parts.length - 1] || '';
      }
      continue;
    }

    // Check if line has just a case number (no parties)
    const caseOnly = line.match(/^([א-ת"׳]{1,8}(?:\s*\([^)]+\))?\s+\d[\d\/-]+\d{2,4})/);
    if (caseOnly && line.length < 100) {
      if (currentCase) {
        items.push(createNevoJudgment(currentCase, currentCourt, currentJudges, currentDate, currentPlaintiff, currentDefendant, currentSummary, msgId));
      }
      currentCase = caseOnly[1].trim();
      currentPlaintiff = '';
      currentDefendant = '';
      currentSummary = '';

      const courtMatch = line.match(/\(([^)]+)\)/);
      if (courtMatch) {
        const parts = courtMatch[1].split(';').map(s => s.trim());
        currentCourt = mapNevoCourt(parts[0] || '');
        currentJudges = parts.length > 2 ? parts.slice(1, -1).join(', ') : (parts[1] || '');
        currentDate = parts[parts.length - 1] || '';
      }
      continue;
    }

    // Summary text for current case
    if (currentCase && line.length > 20 && !line.startsWith('http') && !line.match(/^\d{1,2}[./]/)) {
      if (!currentSummary) {
        currentSummary = line.slice(0, 500);
      }
    }
  }

  // Don't forget the last case
  if (currentCase) {
    items.push(createNevoJudgment(currentCase, currentCourt, currentJudges, currentDate, currentPlaintiff, currentDefendant, currentSummary, msgId));
  }

  return items;
}

function mapNevoCourt(courtCode: string): string {
  const code = courtCode.trim();
  if (code.includes('עליון')) return 'בית המשפט העליון';
  if (code.includes('עבודה ארצי')) return 'בית הדין הארצי לעבודה';
  if (code.includes('עבודה')) return 'בית הדין האזורי לעבודה';
  if (code.includes('מחוזי')) return 'בית המשפט המחוזי';
  if (code.includes('מנהלי')) return 'בית המשפט לעניינים מנהליים';
  if (code.includes('שלום')) return 'בית משפט השלום';
  if (code.includes('משפחה')) return 'בית המשפט לענייני משפחה';
  if (code.includes('תעבורה')) return 'בית משפט לתעבורה';
  return `בית משפט ${code}`;
}

function createNevoJudgment(caseNumber: string, court: string, judges: string, date: string, plaintiff: string, defendant: string, summary: string, msgId: number): JudgmentInput {
  const parties = plaintiff && defendant ? `${plaintiff} נגד ${defendant}` : '';
  const title = parties ? `${caseNumber} - ${parties}` : `${caseNumber} - פסק דין`;

  return {
    title: title.slice(0, 200),
    slug: createSlug(`nevo-${caseNumber}`),
    caseNumber,
    courtName: court || 'בית משפט',
    procedureType: detectProcedureType(caseNumber),
    judgmentDate: parseDate(date),
    judge: judges,
    plaintiff,
    defendant,
    parties: parties || '',
    summary: summary || `פסק דין ${caseNumber}`,
    fullText: '',
    sourceUrl: `https://www.nevo.co.il/Handlers/GetMsgContent.ashx?Msgid=${msgId}`,
    pdfUrl: '',
    sourceName: 'נבו (Nevo)',
    category: detectCategory(detectProcedureType(caseNumber), court, summary),
    status: 'PUBLISHED',
  };
}

function detectProcedureType(caseNumber: string): string {
  const cn = caseNumber.trim();
  if (cn.startsWith('ע"א') || cn.startsWith('עא')) return 'ערעור אזרחי';
  if (cn.startsWith('ע"פ') || cn.startsWith('עפ')) return 'ערעור פלילי';
  if (cn.startsWith('בג"ץ') || cn.startsWith('בגץ')) return 'בג"ץ';
  if (cn.startsWith('ד"נ')) return 'דיון נוסף';
  if (cn.startsWith('תא') || cn.startsWith('ת"א')) return 'אזרחי';
  if (cn.startsWith('תפ') || cn.startsWith('ת"פ')) return 'פלילי';
  if (cn.startsWith('עת"מ')) return 'עתירה מנהלית';
  if (cn.startsWith('ק"ג') || cn.startsWith('קג')) return 'עבודה';
  if (cn.startsWith('בש"א') || cn.startsWith('בשא')) return 'בקשה';
  if (cn.startsWith('בש"פ')) return 'בקשה פלילית';
  if (cn.startsWith('תלה"מ') || cn.startsWith('תמש')) return 'משפחה';
  return 'אזרחי';
}

// ============================================================
// Source 4: PsakDin.co.il - court rulings search
// ============================================================
export async function scrapePsakDin(): Promise<{ items: JudgmentInput[]; errors: string[] }> {
  const items: JudgmentInput[] = [];
  const errors: string[] = [];

  try {
    // PsakDin has a Court search page - try fetching recent results
    const res = await fetch('https://www.psakdin.co.il/Court', {
      signal: AbortSignal.timeout(10000),
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'text/html,application/xhtml+xml',
        'Accept-Language': 'he-IL,he;q=0.9',
      },
    });

    if (!res.ok) {
      errors.push(`פסק דין: HTTP ${res.status}`);
      return { items, errors };
    }

    const html = await res.text();
    const parsed = parsePsakDinResults(html);
    items.push(...parsed);

    if (items.length === 0) {
      // Try fetching the magazine/recent articles which contain ruling summaries
      const magRes = await fetch('https://www.psakdin.co.il/%D7%9E%D7%92%D7%96%D7%99%D7%9F', {
        signal: AbortSignal.timeout(10000),
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          'Accept': 'text/html',
          'Accept-Language': 'he-IL,he;q=0.9',
        },
      });

      if (magRes.ok) {
        const magHtml = await magRes.text();
        const magParsed = parsePsakDinMagazine(magHtml);
        items.push(...magParsed);
      }
    }
  } catch (e) {
    errors.push(`פסק דין: ${String(e)}`);
  }

  return { items, errors };
}

function parsePsakDinResults(html: string): JudgmentInput[] {
  const items: JudgmentInput[] = [];

  // Try to extract ruling links and metadata from HTML
  // PsakDin uses /Document/slug pattern
  const docPattern = /\/Document\/([^"'\s<>]+)/g;
  const titlePattern = /<h[2-4][^>]*>([^<]+)<\/h[2-4]>/gi;
  const datePattern = /(\d{1,2}\.\d{1,2}\.\d{4})/g;

  const titles: string[] = [];
  let match;
  while ((match = titlePattern.exec(html)) !== null) {
    const title = match[1].trim();
    if (title.length > 5 && title.length < 200) {
      titles.push(title);
    }
  }

  const slugs: string[] = [];
  while ((match = docPattern.exec(html)) !== null) {
    slugs.push(match[1]);
  }

  const dates: string[] = [];
  while ((match = datePattern.exec(html)) !== null) {
    dates.push(match[1]);
  }

  // Create items from extracted data
  for (let i = 0; i < Math.min(titles.length, 50); i++) {
    const title = titles[i];
    const slug = slugs[i] || '';
    const date = dates[i] || '';

    items.push({
      title,
      slug: createSlug(`psakdin-${slug || title}`),
      caseNumber: `PD-${i + 1}`,
      courtName: 'בית משפט',
      procedureType: 'אזרחי',
      judgmentDate: parseDate(date),
      judge: '',
      plaintiff: '',
      defendant: '',
      parties: '',
      summary: title,
      fullText: '',
      sourceUrl: slug ? `https://www.psakdin.co.il/Document/${slug}` : 'https://www.psakdin.co.il',
      pdfUrl: '',
      sourceName: 'פסק דין (PsakDin)',
      category: detectCategory('', '', title),
      status: 'PUBLISHED',
    });
  }

  return items;
}

function parsePsakDinMagazine(html: string): JudgmentInput[] {
  const items: JudgmentInput[] = [];

  // Extract articles from the magazine page
  const articlePattern = /<a[^>]*href="(\/Document\/[^"]+)"[^>]*>([^<]+)<\/a>/gi;
  const datePattern = /(\d{1,2}\.\d{1,2}\.\d{4})/g;
  const allDates: string[] = [];
  let match;

  while ((match = datePattern.exec(html)) !== null) {
    allDates.push(match[1]);
  }

  let idx = 0;
  while ((match = articlePattern.exec(html)) !== null) {
    const url = match[1];
    const title = match[2].trim();
    if (title.length < 5 || title.length > 200) continue;

    items.push({
      title,
      slug: createSlug(`psakdin-mag-${url.split('/').pop() || idx}`),
      caseNumber: `PDM-${idx + 1}`,
      courtName: 'בית משפט',
      procedureType: 'אזרחי',
      judgmentDate: parseDate(allDates[idx] || ''),
      judge: '',
      plaintiff: '',
      defendant: '',
      parties: '',
      summary: title,
      fullText: '',
      sourceUrl: `https://www.psakdin.co.il${url}`,
      pdfUrl: '',
      sourceName: 'פסק דין (PsakDin)',
      category: detectCategory('', '', title),
      status: 'PUBLISHED',
    });

    idx++;
    if (idx >= 50) break;
  }

  return items;
}

// ============================================================
// Source 5: court.gov.il - Israeli Courts Authority
// Scrapes from gov.il spokesperson API + court.gov.il NGCS
// ============================================================
export async function scrapeCourtGovIL(): Promise<{ items: JudgmentInput[]; errors: string[] }> {
  const items: JudgmentInput[] = [];
  const errors: string[] = [];

  const browserHeaders = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,application/json,*/*;q=0.8',
    'Accept-Language': 'he-IL,he;q=0.9,en-US;q=0.8,en;q=0.7',
    'Accept-Encoding': 'gzip, deflate, br',
    'Cache-Control': 'no-cache',
    'Pragma': 'no-cache',
  };

  // Strategy 1: gov.il spokesperson API (פסקי דין שהופצו ע"י הדוברות)
  try {
    const govRes = await fetch(
      'https://www.gov.il/he/Departments/DynamicCollectors/spokmanship_court?skip=0&limit=50',
      { signal: AbortSignal.timeout(15000), headers: browserHeaders }
    );

    if (govRes.ok) {
      const html = await govRes.text();
      const govItems = parseGovILSpokesman(html);
      items.push(...govItems);
    } else {
      errors.push(`דוברות הרשות השופטת (gov.il): HTTP ${govRes.status}`);
    }
  } catch (e) {
    errors.push(`דוברות הרשות השופטת (gov.il): ${String(e)}`);
  }

  // Strategy 2: court.gov.il NGCS homepage (פסקי דין מדף הבית)
  try {
    const ngcsRes = await fetch(
      'https://www.court.gov.il/NGCS.Web.Site/HomePage.aspx',
      { signal: AbortSignal.timeout(15000), headers: browserHeaders }
    );

    if (ngcsRes.ok) {
      const html = await ngcsRes.text();
      const ngcsItems = parseCourtGovHTML(html);
      // Only add items that aren't already found via gov.il
      const existingCases = new Set(items.map((i) => i.caseNumber));
      for (const item of ngcsItems) {
        if (!existingCases.has(item.caseNumber)) {
          items.push(item);
        }
      }
    }
  } catch {
    // NGCS failure is non-critical if gov.il succeeded
    if (items.length === 0) {
      errors.push('הרשות השופטת: court.gov.il לא זמין');
    }
  }

  // Strategy 3: court.gov.il PsakDin page
  if (items.length === 0) {
    try {
      const psakRes = await fetch(
        'https://www.court.gov.il/NGCS.Web.Site/HomePage/PsakDin',
        { signal: AbortSignal.timeout(10000), headers: browserHeaders }
      );

      if (psakRes.ok) {
        const html = await psakRes.text();
        const parsed = parseCourtGovHTML(html);
        items.push(...parsed);
      }
    } catch {
      // Already logged above
    }
  }

  if (items.length === 0 && errors.length === 0) {
    errors.push('הרשות השופטת: לא נמצאו פסקי דין');
  }

  return { items, errors };
}

function parseGovILSpokesman(html: string): JudgmentInput[] {
  const items: JudgmentInput[] = [];

  // gov.il DynamicCollectors renders items in structured HTML blocks
  // Each item typically has: title, date, court, link to full ruling

  // Pattern 1: structured result items with title + date + description
  const itemPattern = /<div[^>]*class="[^"]*result[^"]*"[^>]*>([\s\S]*?)<\/div>\s*<\/div>/gi;
  // Pattern 2: list items with links
  const linkPattern = /<a[^>]*href="([^"]*)"[^>]*>([\s\S]*?)<\/a>/gi;
  const datePattern = /(\d{1,2}[./]\d{1,2}[./]\d{2,4})/;
  const casePattern = /([א-ת"׳]{1,8}\s+\d[\d\/-]+\d{2,4})/;
  const judgePattern = /(?:כב(?:וד|')\s*ה?שופט(?:ת)?\s+|השופט(?:ת)?\s+)([א-ת\s\-'׳]+?)(?:\s*[,\-–]|\s*$)/;
  const courtPattern = /(בית\s*(?:ה)?משפט\s*(?:ה)?(?:עליון|מחוזי|שלום|לענייני משפחה|לעבודה)[^,\n]{0,30})/;
  const partiesPattern = /([א-ת\s.]+?)\s+(?:נגד|נ['׳])\s+([א-ת\s.]+)/;

  let match;
  let idx = 0;

  // Try structured items first
  while ((match = itemPattern.exec(html)) !== null && idx < 50) {
    const block = match[1];
    const text = block.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
    if (text.length < 10) continue;

    const dateMatch = text.match(datePattern);
    const caseMatch = text.match(casePattern);
    const judgeMatch = text.match(judgePattern);
    const courtMatch = text.match(courtPattern);
    const partiesMatch = text.match(partiesPattern);
    const urlMatch = block.match(/href="([^"]+)"/);

    const caseNumber = caseMatch ? caseMatch[1] : `GOV-${idx + 1}`;
    const courtName = courtMatch ? courtMatch[1].trim() : 'הרשות השופטת';
    const plaintiff = partiesMatch ? partiesMatch[1].trim() : '';
    const defendant = partiesMatch ? partiesMatch[2].trim() : '';

    items.push({
      title: text.slice(0, 200),
      slug: createSlug(`court-gov-${caseNumber}`),
      caseNumber,
      courtName,
      procedureType: detectProcedureType(caseNumber),
      judgmentDate: dateMatch ? parseDate(dateMatch[1]) : new Date().toISOString().split('T')[0],
      judge: judgeMatch ? judgeMatch[1].trim() : '',
      plaintiff,
      defendant,
      parties: plaintiff && defendant ? `${plaintiff} נגד ${defendant}` : '',
      summary: text.slice(0, 500),
      fullText: text,
      sourceUrl: urlMatch ? (urlMatch[1].startsWith('http') ? urlMatch[1] : `https://www.gov.il${urlMatch[1]}`) : 'https://www.gov.il/he/departments/dynamiccollectors/spokmanship_court',
      pdfUrl: '',
      sourceName: 'הרשות השופטת (court.gov.il)',
      category: detectCategory(detectProcedureType(caseNumber), courtName, text),
      status: 'PUBLISHED',
    });

    idx++;
  }

  // Fallback: parse all links on the page
  if (idx === 0) {
    while ((match = linkPattern.exec(html)) !== null && idx < 50) {
      const url = match[1];
      const text = match[2].replace(/<[^>]+>/g, '').trim();
      if (text.length < 5 || text.length > 300) continue;
      // Skip navigation/menu links
      if (url.includes('javascript:') || url === '#' || url.includes('login') || url.includes('mailto:')) continue;

      const dateMatch = text.match(datePattern);
      const caseMatch = text.match(casePattern);
      const judgeMatch = text.match(judgePattern);
      const courtMatch = text.match(courtPattern);
      const partiesMatch = text.match(partiesPattern);

      const caseNumber = caseMatch ? caseMatch[1] : `GOV-${idx + 1}`;
      const courtName = courtMatch ? courtMatch[1].trim() : 'הרשות השופטת';
      const plaintiff = partiesMatch ? partiesMatch[1].trim() : '';
      const defendant = partiesMatch ? partiesMatch[2].trim() : '';

      items.push({
        title: text.slice(0, 200),
        slug: createSlug(`court-gov-${caseNumber}`),
        caseNumber,
        courtName,
        procedureType: detectProcedureType(caseNumber),
        judgmentDate: dateMatch ? parseDate(dateMatch[1]) : new Date().toISOString().split('T')[0],
        judge: judgeMatch ? judgeMatch[1].trim() : '',
        plaintiff,
        defendant,
        parties: plaintiff && defendant ? `${plaintiff} נגד ${defendant}` : '',
        summary: text.slice(0, 500),
        fullText: '',
        sourceUrl: url.startsWith('http') ? url : `https://www.gov.il${url}`,
        pdfUrl: '',
        sourceName: 'הרשות השופטת (court.gov.il)',
        category: detectCategory(detectProcedureType(caseNumber), courtName, text),
        status: 'PUBLISHED',
      });

      idx++;
    }
  }

  return items;
}

function parseCourtGovHTML(html: string): JudgmentInput[] {
  const items: JudgmentInput[] = [];

  // Parse court.gov.il NGCS structure - links to judgments and viewer pages
  const linkPattern = /<a[^>]*href="([^"]*(?:[Pp]sak|[Vv]iewer|[Dd]ocument)[^"]*)"[^>]*>([\s\S]*?)<\/a>/gi;
  const casePattern = /([א-ת"׳]{1,8}\s+\d[\d\/-]+\d{2,4})/g;
  const datePattern = /(\d{1,2}[./]\d{1,2}[./]\d{2,4})/;
  const judgePattern = /(?:כב(?:וד|')\s*ה?שופט(?:ת)?\s+|השופט(?:ת)?\s+)([א-ת\s\-'׳]+?)(?:\s*[,\-–]|\s*$)/;
  const courtPattern = /(בית\s*(?:ה)?משפט\s*(?:ה)?(?:עליון|מחוזי|שלום|לענייני משפחה|לעבודה)[^,\n]{0,30})/;
  const partiesPattern = /([א-ת\s.]+?)\s+(?:נגד|נ['׳])\s+([א-ת\s.]+)/;

  let match;
  let idx = 0;

  while ((match = linkPattern.exec(html)) !== null) {
    const url = match[1];
    const rawText = match[2];
    const text = rawText.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
    if (text.length < 3) continue;

    const caseMatch = text.match(casePattern);
    const caseNumber = caseMatch ? caseMatch[0] : `CG-${idx + 1}`;
    const dateMatch = text.match(datePattern);
    const judgeMatch = text.match(judgePattern);
    const courtMatch = text.match(courtPattern);
    const partiesMatch = text.match(partiesPattern);

    const courtName = courtMatch ? courtMatch[1].trim() : 'הרשות השופטת';
    const plaintiff = partiesMatch ? partiesMatch[1].trim() : '';
    const defendant = partiesMatch ? partiesMatch[2].trim() : '';

    items.push({
      title: text.slice(0, 200),
      slug: createSlug(`court-gov-${caseNumber}`),
      caseNumber,
      courtName,
      procedureType: detectProcedureType(caseNumber),
      judgmentDate: dateMatch ? parseDate(dateMatch[1]) : new Date().toISOString().split('T')[0],
      judge: judgeMatch ? judgeMatch[1].trim() : '',
      plaintiff,
      defendant,
      parties: plaintiff && defendant ? `${plaintiff} נגד ${defendant}` : '',
      summary: text,
      fullText: '',
      sourceUrl: url.startsWith('http') ? url : `https://www.court.gov.il${url}`,
      pdfUrl: url.toLowerCase().includes('.pdf') ? (url.startsWith('http') ? url : `https://www.court.gov.il${url}`) : '',
      sourceName: 'הרשות השופטת (court.gov.il)',
      category: detectCategory(detectProcedureType(caseNumber), courtName, text),
      status: 'PUBLISHED',
    });

    idx++;
    if (idx >= 50) break;
  }

  return items;
}

// ============================================================
// Source 6: Takdin.co.il - Legal database
// ============================================================
export async function scrapeTakdin(): Promise<{ items: JudgmentInput[]; errors: string[] }> {
  const items: JudgmentInput[] = [];
  const errors: string[] = [];

  try {
    const res = await fetch('https://www.takdin.co.il', {
      signal: AbortSignal.timeout(10000),
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'text/html,application/xhtml+xml',
        'Accept-Language': 'he-IL,he;q=0.9',
      },
    });

    if (!res.ok) {
      errors.push(`תקדין: HTTP ${res.status}`);
      return { items, errors };
    }

    const html = await res.text();

    // Parse ruling links from homepage
    const docPattern = /\/Document\/Index\/(\d+)/g;
    const titlePattern = /<a[^>]*href="\/Document\/Index\/\d+"[^>]*>([^<]+)<\/a>/gi;
    const datePattern = /(\d{1,2}\.\d{1,2}\.\d{4})/g;

    const allDates: string[] = [];
    let match;
    while ((match = datePattern.exec(html)) !== null) {
      allDates.push(match[1]);
    }

    let idx = 0;
    while ((match = titlePattern.exec(html)) !== null) {
      const title = match[1].trim();
      if (title.length < 5 || title.length > 200) continue;

      const docMatch = match[0].match(/\/Document\/Index\/(\d+)/);
      const docId = docMatch ? docMatch[1] : '';

      items.push({
        title,
        slug: createSlug(`takdin-${docId || idx}`),
        caseNumber: `TK-${docId || idx}`,
        courtName: 'בית משפט',
        procedureType: 'אזרחי',
        judgmentDate: parseDate(allDates[idx] || ''),
        judge: '',
        plaintiff: '',
        defendant: '',
        parties: '',
        summary: title,
        fullText: '',
        sourceUrl: docId ? `https://www.takdin.co.il/Document/Index/${docId}` : 'https://www.takdin.co.il',
        pdfUrl: '',
        sourceName: 'תקדין (Takdin)',
        category: detectCategory('', '', title),
        status: 'PUBLISHED',
      });

      idx++;
      if (idx >= 50) break;
    }
  } catch (e) {
    errors.push(`תקדין: ${String(e)}`);
  }

  return { items, errors };
}

// ============================================================
// Source 7: Din.co.il - Legal portal (forums + articles)
// ============================================================
export async function scrapeDin(): Promise<{ items: JudgmentInput[]; errors: string[] }> {
  const items: JudgmentInput[] = [];
  const errors: string[] = [];

  try {
    // Din.co.il is mainly a lawyer directory, but has articles about rulings
    const res = await fetch('https://www.din.co.il/articles/', {
      signal: AbortSignal.timeout(10000),
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'text/html',
        'Accept-Language': 'he-IL,he;q=0.9',
      },
    });

    if (!res.ok) {
      // Try alternative path
      const altRes = await fetch('https://www.din.co.il', {
        signal: AbortSignal.timeout(10000),
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          'Accept': 'text/html',
          'Accept-Language': 'he-IL,he;q=0.9',
        },
      });

      if (altRes.ok) {
        const html = await altRes.text();
        const parsed = parseDinArticles(html);
        items.push(...parsed);
      } else {
        errors.push(`דין אונליין: HTTP ${altRes.status}`);
      }
      return { items, errors };
    }

    const html = await res.text();
    const parsed = parseDinArticles(html);
    items.push(...parsed);
  } catch (e) {
    errors.push(`דין אונליין: ${String(e)}`);
  }

  return { items, errors };
}

function parseDinArticles(html: string): JudgmentInput[] {
  const items: JudgmentInput[] = [];

  const articlePattern = /<a[^>]*href="(\/articles\/\d+[^"]*)"[^>]*>([^<]+)<\/a>/gi;
  let match;
  let idx = 0;

  while ((match = articlePattern.exec(html)) !== null) {
    const url = match[1];
    const title = match[2].trim();
    if (title.length < 5 || title.length > 200) continue;

    items.push({
      title,
      slug: createSlug(`din-${url.split('/')[2] || idx}`),
      caseNumber: `DIN-${idx + 1}`,
      courtName: 'בית משפט',
      procedureType: 'אזרחי',
      judgmentDate: new Date().toISOString().split('T')[0],
      judge: '',
      plaintiff: '',
      defendant: '',
      parties: '',
      summary: title,
      fullText: '',
      sourceUrl: `https://www.din.co.il${url}`,
      pdfUrl: '',
      sourceName: 'דין אונליין (Din)',
      category: detectCategory('', '', title),
      status: 'PUBLISHED',
    });

    idx++;
    if (idx >= 30) break;
  }

  return items;
}

// ============================================================
// Source 8: תולעת המשפט (Tolaat HaMishpat) - Legal database
// ============================================================
export async function scrapeTolaatHamishpat(): Promise<{ items: JudgmentInput[]; errors: string[] }> {
  const items: JudgmentInput[] = [];
  const errors: string[] = [];

  const browserHeaders = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
    'Accept-Language': 'he-IL,he;q=0.9,en-US;q=0.8,en;q=0.7',
    'Accept-Encoding': 'gzip, deflate, br',
    'Cache-Control': 'no-cache',
    'Referer': 'https://www.google.com/',
    'Sec-Fetch-Dest': 'document',
    'Sec-Fetch-Mode': 'navigate',
    'Sec-Fetch-Site': 'cross-site',
    'Sec-Fetch-User': '?1',
    'Upgrade-Insecure-Requests': '1',
  };

  // The domain is תולעת-המשפט.קום (punycode encoded)
  const baseUrl = 'https://xn----8hcborozt8bdd.xn--9dbq2a';

  // Try main page
  try {
    const res = await fetch(baseUrl, {
      signal: AbortSignal.timeout(15000),
      headers: browserHeaders,
    });

    if (res.ok) {
      const html = await res.text();
      const parsed = parseTolaatHTML(html, baseUrl);
      items.push(...parsed);
    } else {
      errors.push(`תולעת המשפט: HTTP ${res.status}`);
    }
  } catch (e) {
    errors.push(`תולעת המשפט: ${String(e)}`);
  }

  // Try alternative URL (tl8.me)
  if (items.length === 0) {
    try {
      const res = await fetch('https://tl8.me', {
        signal: AbortSignal.timeout(15000),
        headers: browserHeaders,
        redirect: 'follow',
      });

      if (res.ok) {
        const html = await res.text();
        const parsed = parseTolaatHTML(html, baseUrl);
        items.push(...parsed);
      }
    } catch {
      // Already logged above
    }
  }

  if (items.length === 0 && errors.length === 0) {
    errors.push('תולעת המשפט: לא נמצאו פסקי דין');
  }

  return { items, errors };
}

function parseTolaatHTML(html: string, baseUrl: string): JudgmentInput[] {
  const items: JudgmentInput[] = [];

  // Pattern for case links - typical structure: /case/XXXXX or /cases/XXXXX or links with case numbers
  const linkPattern = /<a[^>]*href="([^"]*(?:case|tik|psak|document|view)[^"]*)"[^>]*>([\s\S]*?)<\/a>/gi;
  const genericLinkPattern = /<a[^>]*href="(\/[^"]{5,})"[^>]*>([^<]{5,200})<\/a>/gi;
  const casePattern = /([א-ת"׳]{1,8}\s+\d[\d\/-]+\d{2,4})/;
  const datePattern = /(\d{1,2}[./]\d{1,2}[./]\d{2,4})/;
  const judgePattern = /(?:כב(?:וד|')\s*ה?שופט(?:ת)?\s+|השופט(?:ת)?\s+)([א-ת\s\-'׳]+?)(?:\s*[,\-–]|\s*$)/;
  const courtPattern = /(בית\s*(?:ה)?משפט\s*(?:ה)?(?:עליון|מחוזי|שלום|לענייני משפחה|לעבודה)[^,\n]{0,30})/;
  const partiesPattern = /([א-ת\s.]+?)\s+(?:נגד|נ['׳])\s+([א-ת\s.]+)/;

  let match;
  let idx = 0;

  // Try specific case links first
  while ((match = linkPattern.exec(html)) !== null && idx < 50) {
    const url = match[1];
    const rawText = match[2];
    const text = rawText.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
    if (text.length < 5 || text.length > 300) continue;

    const caseMatch = text.match(casePattern);
    const caseNumber = caseMatch ? caseMatch[1] : `TH-${idx + 1}`;
    const dateMatch = text.match(datePattern);
    const judgeMatch = text.match(judgePattern);
    const courtMatch = text.match(courtPattern);
    const partiesMatch = text.match(partiesPattern);

    const courtName = courtMatch ? courtMatch[1].trim() : 'בית משפט';
    const plaintiff = partiesMatch ? partiesMatch[1].trim() : '';
    const defendant = partiesMatch ? partiesMatch[2].trim() : '';

    items.push({
      title: text.slice(0, 200),
      slug: createSlug(`tolaat-${caseNumber}`),
      caseNumber,
      courtName,
      procedureType: detectProcedureType(caseNumber),
      judgmentDate: dateMatch ? parseDate(dateMatch[1]) : new Date().toISOString().split('T')[0],
      judge: judgeMatch ? judgeMatch[1].trim() : '',
      plaintiff,
      defendant,
      parties: plaintiff && defendant ? `${plaintiff} נגד ${defendant}` : '',
      summary: text.slice(0, 500),
      fullText: '',
      sourceUrl: url.startsWith('http') ? url : `${baseUrl}${url}`,
      pdfUrl: '',
      sourceName: 'תולעת המשפט',
      category: detectCategory(detectProcedureType(caseNumber), courtName, text),
      status: 'PUBLISHED',
    });

    idx++;
  }

  // Fallback: parse generic links
  if (idx === 0) {
    while ((match = genericLinkPattern.exec(html)) !== null && idx < 50) {
      const url = match[1];
      const text = match[2].trim();
      // Skip nav/menu/footer links
      if (url.includes('login') || url.includes('register') || url.includes('about') ||
          url.includes('contact') || url.includes('terms') || url.includes('privacy') ||
          url === '/' || url.includes('javascript:') || url === '#') continue;

      const caseMatch = text.match(casePattern);
      if (!caseMatch && text.length < 10) continue;

      const caseNumber = caseMatch ? caseMatch[1] : `TH-${idx + 1}`;
      const dateMatch = text.match(datePattern);
      const judgeMatch = text.match(judgePattern);
      const courtMatch = text.match(courtPattern);
      const partiesMatch = text.match(partiesPattern);

      const courtName = courtMatch ? courtMatch[1].trim() : 'בית משפט';
      const plaintiff = partiesMatch ? partiesMatch[1].trim() : '';
      const defendant = partiesMatch ? partiesMatch[2].trim() : '';

      items.push({
        title: text.slice(0, 200),
        slug: createSlug(`tolaat-${caseNumber}`),
        caseNumber,
        courtName,
        procedureType: detectProcedureType(caseNumber),
        judgmentDate: dateMatch ? parseDate(dateMatch[1]) : new Date().toISOString().split('T')[0],
        judge: judgeMatch ? judgeMatch[1].trim() : '',
        plaintiff,
        defendant,
        parties: plaintiff && defendant ? `${plaintiff} נגד ${defendant}` : '',
        summary: text.slice(0, 500),
        fullText: '',
        sourceUrl: `${baseUrl}${url}`,
        pdfUrl: '',
        sourceName: 'תולעת המשפט',
        category: detectCategory(detectProcedureType(caseNumber), courtName, text),
        status: 'PUBLISHED',
      });

      idx++;
    }
  }

  return items;
}

// ============================================================
// Run all scrapers
// ============================================================
export interface ScrapeResult {
  source: string;
  sourceName: string;
  items: JudgmentInput[];
  errors: string[];
  duration: number;
}

export async function runAllScrapers(): Promise<ScrapeResult[]> {
  const scrapers = [
    { source: 'data.gov.il', sourceName: 'data.gov.il - חופש המידע', fn: scrapeDataGovIL },
    { source: 'rabbinic', sourceName: 'בית הדין הרבני', fn: scrapeRabbinicCourt },
    { source: 'nevo', sourceName: 'נבו (Nevo)', fn: scrapeNevo },
    { source: 'psakdin', sourceName: 'פסק דין (PsakDin)', fn: scrapePsakDin },
    { source: 'court.gov.il', sourceName: 'הרשות השופטת (court.gov.il)', fn: scrapeCourtGovIL },
    { source: 'takdin', sourceName: 'תקדין (Takdin)', fn: scrapeTakdin },
    { source: 'din', sourceName: 'דין אונליין (Din)', fn: scrapeDin },
    { source: 'tolaat', sourceName: 'תולעת המשפט', fn: scrapeTolaatHamishpat },
  ];

  const results: ScrapeResult[] = [];

  // Run all scrapers in parallel
  const promises = scrapers.map(async (s) => {
    const start = Date.now();
    try {
      const { items, errors } = await s.fn();
      return {
        source: s.source,
        sourceName: s.sourceName,
        items,
        errors,
        duration: Date.now() - start,
      };
    } catch (e) {
      return {
        source: s.source,
        sourceName: s.sourceName,
        items: [],
        errors: [String(e)],
        duration: Date.now() - start,
      };
    }
  });

  const settled = await Promise.allSettled(promises);
  for (const result of settled) {
    if (result.status === 'fulfilled') {
      results.push(result.value);
    }
  }

  return results;
}
