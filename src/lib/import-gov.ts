/**
 * Import judgments from data.gov.il - Freedom of Information Unit judgments dataset
 * Resource ID: 6a469006-3844-476f-84e8-960a8fd9df22
 * Source: https://data.gov.il/dataset/judgments
 */

const RESOURCE_ID = '6a469006-3844-476f-84e8-960a8fd9df22';
const API_BASE = 'https://data.gov.il/api/3/action/datastore_search';

export interface GovJudgment {
  _id: number;
  מחוז: string;
  'מספר הליך': string;
  'תאריך הגשת העתירה': string;
  עותרים: string;
  משיבים: string;
  'משיבים 2': string;
  'תאריך פסק הדין': string;
  'מעמד המשיב': string;
  'מעמד המשיב 2': string;
  'נושא העתירה': string;
  'הוצאות לעותר': string;
  'הוצאות למשיב': string;
  'פירוט ההחלטה': string;
  החלטה: string;
  'סעיפי חוק רלוונטיים': string;
}

export interface NormalizedJudgment {
  title: string;
  slug: string;
  caseNumber: string;
  courtName: string;
  procedureType: string;
  judgmentDate: string;
  judge: string;
  plaintiff: string;
  defendant: string;
  parties: string;
  summary: string;
  fullText: string;
  status: string;
}

function createSlug(caseNumber: string, defendant: string): string {
  const clean = `${caseNumber}-${defendant}`
    .replace(/[^\w\u0590-\u05FF\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .substring(0, 80);
  return clean || `case-${Date.now()}`;
}

function parseDate(dateStr: string): string {
  if (!dateStr) return new Date().toISOString().split('T')[0];
  // Handle DD/MM/YYYY format
  const parts = dateStr.split('/');
  if (parts.length === 3) {
    return `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
  }
  return dateStr;
}

function districtToCourt(district: string): string {
  const mapping: Record<string, string> = {
    'ירושלים': 'בית המשפט המחוזי ירושלים',
    'תל אביב': 'בית המשפט המחוזי תל אביב',
    'חיפה': 'בית המשפט המחוזי חיפה',
    'נצרת': 'בית המשפט המחוזי נצרת',
    'באר שבע': 'בית המשפט המחוזי באר שבע',
    'מרכז': 'בית המשפט המחוזי מרכז',
  };
  return mapping[district] || `בית המשפט המחוזי ${district}`;
}

export function normalizeJudgment(raw: GovJudgment): NormalizedJudgment {
  const defendant = raw.משיבים || raw['משיבים 2'] || 'לא ידוע';
  const plaintiff = raw.עותרים || 'לא ידוע';
  const caseNumber = raw['מספר הליך'] || '';
  const courtName = districtToCourt(raw.מחוז || '');
  const subject = raw['נושא העתירה'] || '';
  const decision = raw.החלטה || '';
  const details = raw['פירוט ההחלטה'] || '';

  const title = `${caseNumber} - ${plaintiff} נגד ${defendant}`;
  const summary = [subject, decision, details].filter(Boolean).join('. ');

  return {
    title,
    slug: createSlug(caseNumber, defendant),
    caseNumber,
    courtName,
    procedureType: 'עתירה מנהלית',
    judgmentDate: parseDate(raw['תאריך פסק הדין']),
    judge: '',
    plaintiff,
    defendant,
    parties: `${plaintiff} נגד ${defendant}`,
    summary: summary || `פסק דין בעניין ${defendant}`,
    fullText: [subject, details, decision, raw['סעיפי חוק רלוונטיים'] || ''].filter(Boolean).join('\n\n'),
    status: 'PUBLISHED',
  };
}

export async function fetchJudgments(limit = 100, offset = 0): Promise<{
  records: NormalizedJudgment[];
  total: number;
}> {
  const url = `${API_BASE}?resource_id=${RESOURCE_ID}&limit=${limit}&offset=${offset}`;
  const res = await fetch(url);
  const data = await res.json();

  if (!data.success) {
    throw new Error('Failed to fetch from data.gov.il');
  }

  const records = (data.result.records as GovJudgment[]).map(normalizeJudgment);
  const total = data.result.total;

  return { records, total };
}

export async function fetchAllJudgments(): Promise<NormalizedJudgment[]> {
  const all: NormalizedJudgment[] = [];
  let offset = 0;
  const limit = 100;

  while (true) {
    const { records, total } = await fetchJudgments(limit, offset);
    all.push(...records);
    offset += limit;
    if (offset >= total) break;
  }

  return all;
}
