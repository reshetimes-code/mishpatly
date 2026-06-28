'use client';

import { useEffect, useState } from 'react';
import { Brain, RefreshCw, CheckCircle, AlertTriangle, FileText, Users, Gavel, BookOpen, Scale, Sparkles, ExternalLink } from 'lucide-react';

interface AiStatusData {
  overview: {
    totalJudgments: number;
    withFullText: number;
    aiEnriched: number;
    notEnriched: number;
    missingMetadata: number;
  };
  fields: Record<string, number>;
  recentlyEnriched: {
    id: number;
    title: string;
    caseNumber: string;
    courtName: string;
    judge: string | null;
    plaintiff: string | null;
    defendant: string | null;
    category: string | null;
    summary: string | null;
    keyFindings: string | null;
    courtReasoning: string | null;
    verdict: string | null;
    decisionType: string | null;
    aiEnrichedAt: string | null;
    slug: string;
  }[];
}

const fieldLabels: Record<string, { label: string; icon: typeof Gavel }> = {
  judge: { label: 'שופט', icon: Gavel },
  plaintiff: { label: 'תובע', icon: Users },
  defendant: { label: 'נתבע', icon: Users },
  summary: { label: 'תקציר', icon: BookOpen },
  category: { label: 'קטגוריה', icon: Scale },
  keyFindings: { label: 'ממצאים עיקריים', icon: Sparkles },
  courtReasoning: { label: 'נימוקי בית המשפט', icon: FileText },
  verdict: { label: 'פסק דין', icon: CheckCircle },
};

export default function AiStatusPage() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<AiStatusData | null>(null);
  const [scanning, setScanning] = useState(false);
  const [scanMode, setScanMode] = useState<'basic' | 'comprehensive'>('basic');
  const [scanLimit, setScanLimit] = useState(20);

  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : '';

  useEffect(() => {
    fetchStatus();
  }, []);

  async function fetchStatus() {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/ai-status', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status === 401) {
        window.location.href = '/admin/login';
        return;
      }
      if (res.ok) setData(await res.json());
    } catch { /* ignore */ }
    setLoading(false);
  }

  async function triggerScan() {
    setScanning(true);
    try {
      const Swal = (await import('sweetalert2')).default;
      const res = await fetch('/api/admin/ai-scan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          limit: scanLimit,
          onlyMissing: true,
          comprehensive: scanMode === 'comprehensive',
        }),
      });
      const result = await res.json();
      if (res.ok) {
        Swal.fire({
          icon: 'success',
          title: 'סריקת AI הושלמה!',
          html: `<div style="text-align:right;direction:rtl">
            <p>מצב: <b>${result.mode === 'comprehensive' ? 'מקיף' : 'בסיסי'}</b></p>
            <p><b>${result.scanned || 0}</b> פסקי דין נסרקו</p>
            <p><b>${result.updated || 0}</b> עודכנו</p>
            <p><b>${result.failed || 0}</b> נכשלו</p>
          </div>`,
          confirmButtonColor: '#0B3C5D',
        });
        fetchStatus();
      } else {
        Swal.fire({ icon: 'error', title: 'שגיאה', text: result.error, confirmButtonColor: '#B83232' });
      }
    } catch {
      const Swal = (await import('sweetalert2')).default;
      Swal.fire({ icon: 'error', title: 'שגיאה', text: 'שגיאה בסריקת AI', confirmButtonColor: '#B83232' });
    }
    setScanning(false);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-pulse text-primary text-lg">טוען נתוני AI...</div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center py-12 text-gray-500">שגיאה בטעינת נתונים</div>
    );
  }

  const { overview, fields, recentlyEnriched } = data;
  const enrichedPct = overview.totalJudgments > 0
    ? Math.round((overview.aiEnriched / overview.totalJudgments) * 100)
    : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
            <Brain className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-legal-text">מצב פעילות AI</h1>
            <p className="text-sm text-gray-400">סטטוס סריקת Gemini AI ומילוי נתונים</p>
          </div>
        </div>
        <button
          onClick={fetchStatus}
          className="px-3 py-2 text-sm text-gray-500 hover:text-primary hover:bg-gray-100 rounded-lg transition"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-5 shadow-sm border-r-4 border-purple-500">
          <p className="text-sm text-gray-500 mb-1">עובדו עם AI</p>
          <p className="text-3xl font-bold text-legal-text">{overview.aiEnriched}</p>
          <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-purple-500 rounded-full h-2 transition-all"
              style={{ width: `${enrichedPct}%` }}
            />
          </div>
          <p className="text-xs text-gray-400 mt-1">{enrichedPct}% מסה&quot;כ</p>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm border-r-4 border-amber-500">
          <p className="text-sm text-gray-500 mb-1">ממתינים לעיבוד</p>
          <p className="text-3xl font-bold text-legal-text">{overview.notEnriched}</p>
          <p className="text-xs text-gray-400 mt-1">טרם עובדו עם AI</p>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm border-r-4 border-orange-500">
          <p className="text-sm text-gray-500 mb-1">חסרים מטא-דאטה</p>
          <p className="text-3xl font-bold text-legal-text">{overview.missingMetadata}</p>
          <p className="text-xs text-gray-400 mt-1">חסר שופט/תובע/נתבע</p>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm border-r-4 border-blue-500">
          <p className="text-sm text-gray-500 mb-1">עם טקסט מלא</p>
          <p className="text-3xl font-bold text-legal-text">{overview.withFullText}</p>
          <p className="text-xs text-gray-400 mt-1">מתוך {overview.totalJudgments} סה&quot;כ</p>
        </div>
      </div>

      {/* Fields Coverage */}
      <div className="bg-white rounded-xl shadow-sm p-5">
        <h2 className="font-bold text-legal-text mb-4 flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-green-500" />
          כיסוי שדות AI
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Object.entries(fields).map(([key, count]) => {
            const info = fieldLabels[key];
            if (!info) return null;
            const pct = overview.totalJudgments > 0
              ? Math.round((count / overview.totalJudgments) * 100)
              : 0;
            const Icon = info.icon;
            return (
              <div key={key} className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Icon className="w-4 h-4 text-gray-400" />
                    <span className="text-sm font-medium text-legal-text">{info.label}</span>
                  </div>
                  <span className="text-sm font-bold text-legal-text">{count}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1.5">
                  <div
                    className={`rounded-full h-1.5 transition-all ${
                      pct >= 80 ? 'bg-green-500' : pct >= 50 ? 'bg-amber-500' : 'bg-red-400'
                    }`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <p className="text-xs text-gray-400 mt-1">{pct}%</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Scan Controls */}
      <div className="bg-white rounded-xl shadow-sm p-5">
        <h2 className="font-bold text-legal-text mb-4 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-purple-500" />
          הפעלת סריקת AI
        </h2>
        <div className="flex flex-wrap items-end gap-4">
          <div>
            <label className="block text-sm text-gray-500 mb-1">סוג סריקה</label>
            <select
              value={scanMode}
              onChange={(e) => setScanMode(e.target.value as 'basic' | 'comprehensive')}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            >
              <option value="basic">בסיסי - מילוי שדות חסרים</option>
              <option value="comprehensive">מקיף - ניתוח מלא + העשרה</option>
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-500 mb-1">מספר פסקי דין</label>
            <select
              value={scanLimit}
              onChange={(e) => setScanLimit(Number(e.target.value))}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
          </div>
          <button
            onClick={triggerScan}
            disabled={scanning}
            className="px-6 py-2 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700 transition disabled:opacity-50 flex items-center gap-2"
          >
            {scanning ? (
              <><RefreshCw className="w-4 h-4 animate-spin" /> סורק...</>
            ) : (
              <><Brain className="w-4 h-4" /> התחל סריקה</>
            )}
          </button>
        </div>
        {scanMode === 'comprehensive' && (
          <p className="text-xs text-amber-600 mt-2 flex items-center gap-1">
            <AlertTriangle className="w-3 h-3" />
            סריקה מקיפה צורכת יותר קריאות API ולוקחת יותר זמן
          </p>
        )}
      </div>

      {/* Recently Enriched */}
      <div className="bg-white rounded-xl shadow-sm">
        <div className="px-5 py-4 border-b border-gray-100">
          <h2 className="font-bold text-legal-text flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary" />
            עובדו לאחרונה ({recentlyEnriched.length})
          </h2>
        </div>
        {recentlyEnriched.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-gray-500 bg-gray-50">
                  <th className="px-4 py-2 text-right font-medium">מס&apos; הליך</th>
                  <th className="px-4 py-2 text-right font-medium">בית משפט</th>
                  <th className="px-4 py-2 text-right font-medium">שופט</th>
                  <th className="px-4 py-2 text-right font-medium">קטגוריה</th>
                  <th className="px-4 py-2 text-right font-medium">שדות שמולאו</th>
                  <th className="px-4 py-2 text-right font-medium">תאריך עיבוד</th>
                  <th className="px-4 py-2 text-right font-medium">צפייה</th>
                </tr>
              </thead>
              <tbody>
                {recentlyEnriched.map((j) => {
                  const filledFields = [
                    j.judge && 'שופט',
                    j.plaintiff && 'תובע',
                    j.defendant && 'נתבע',
                    j.summary && 'תקציר',
                    j.keyFindings && 'ממצאים',
                    j.courtReasoning && 'נימוקים',
                    j.verdict && 'פסק דין',
                    j.decisionType && 'סוג החלטה',
                  ].filter(Boolean);

                  return (
                    <tr key={j.id} className="border-t border-gray-50 hover:bg-gray-50/50">
                      <td className="px-4 py-2 font-mono text-xs">{j.caseNumber}</td>
                      <td className="px-4 py-2 text-gray-600">{j.courtName}</td>
                      <td className="px-4 py-2">{j.judge || <span className="text-gray-300">—</span>}</td>
                      <td className="px-4 py-2">
                        {j.category ? (
                          <span className="px-2 py-0.5 text-xs bg-primary/10 text-primary rounded-full">{j.category}</span>
                        ) : (
                          <span className="text-gray-300">—</span>
                        )}
                      </td>
                      <td className="px-4 py-2">
                        <div className="flex flex-wrap gap-1">
                          {filledFields.map((f) => (
                            <span key={f as string} className="px-1.5 py-0.5 text-[10px] bg-green-100 text-green-700 rounded">
                              {f}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-4 py-2 text-xs text-gray-400">
                        {j.aiEnrichedAt ? new Date(j.aiEnrichedAt).toLocaleDateString('he-IL') : '—'}
                      </td>
                      <td className="px-4 py-2">
                        <a
                          href={`/judgment/${j.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline flex items-center gap-1 text-xs"
                        >
                          <ExternalLink className="w-3 h-3" />
                          צפה
                        </a>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-8 text-center text-gray-400">
            <Brain className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p>טרם בוצעה סריקת AI. לחץ &quot;התחל סריקה&quot; למעלה.</p>
          </div>
        )}
      </div>
    </div>
  );
}
