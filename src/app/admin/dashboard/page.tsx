'use client';

import { useEffect, useState } from 'react';
import { FileText, Eye, EyeOff, Clock, Download, RefreshCw, Globe, Tag, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';

interface ImportRecord {
  id: string;
  source: string;
  sourceName: string;
  importDate: string;
  importTime: string;
  count: number;
  status: string;
  newItems: number;
  updatedItems: number;
  errors: string[];
  duration: number;
  items: ImportedItem[];
}

interface ImportedItem {
  caseNumber: string;
  defendant: string;
  plaintiff: string;
  court: string;
  date: string;
  subject: string;
  decision: string;
  source: string;
  category: string;
}

interface SourceInfo {
  source: string;
  sourceName: string;
  lastCount: number;
  lastDate: string;
  status: string;
}

interface Stats {
  totalJudgments: number;
  publishedCount: number;
  hiddenCount: number;
  draftCount: number;
  pendingReviewCount: number;
  pendingRemovalRequests: number;
  sourceBreakdown: Record<string, number>;
  categoryBreakdown: Record<string, number>;
  lastImportDate: string | null;
  sources: SourceInfo[];
}

export default function AdminDashboardPage() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<Stats>({
    totalJudgments: 0, publishedCount: 0, hiddenCount: 0, draftCount: 0,
    pendingReviewCount: 0, pendingRemovalRequests: 0,
    sourceBreakdown: {}, categoryBreakdown: {},
    lastImportDate: null, sources: [],
  });
  const [importHistory, setImportHistory] = useState<ImportRecord[]>([]);
  const [importing, setImporting] = useState(false);
  const [expandedRecord, setExpandedRecord] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'sources' | 'history'>('overview');

  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : '';

  useEffect(() => {
    fetchAll();
  }, []);

  async function fetchAll() {
    setLoading(true);
    try {
      const [statsRes, historyRes] = await Promise.all([
        fetch('/api/admin/stats', { headers: { Authorization: `Bearer ${token}` } }),
        fetch('/api/admin/daily-import?view=history', { headers: { Authorization: `Bearer ${token}` } }),
      ]);
      if (statsRes.status === 401) {
        const Swal = (await import('sweetalert2')).default;
        await Swal.fire({
          icon: 'warning',
          title: 'שים לב!',
          text: 'אתה לא מחובר. כדי להתחבר ולצפות בנתונים יש להתחבר מחדש.',
          confirmButtonText: 'התחבר עכשיו',
          confirmButtonColor: '#C9A84C',
        });
        window.location.href = '/admin/login';
        return;
      }
      if (statsRes.ok) setStats(await statsRes.json());
      if (historyRes.ok) {
        const h = await historyRes.json();
        setImportHistory(h.history || []);
      }
    } catch { /* ignore */ }
    setLoading(false);
  }

  async function triggerImport() {
    setImporting(true);
    try {
      const Swal = (await import('sweetalert2')).default;
      const res = await fetch('/api/admin/daily-import', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.status === 401) {
        Swal.fire({
          icon: 'warning',
          title: 'שים לב!',
          text: 'אתה לא מחובר. כדי להתחבר ולצפות בנתונים יש להתחבר מחדש.',
          confirmButtonText: 'התחבר עכשיו',
          confirmButtonColor: '#C9A84C',
        }).then(() => { window.location.href = '/admin/login'; });
        setImporting(false);
        return;
      }
      if (res.ok) {
        Swal.fire({
          icon: 'success',
          title: 'ייבוא הושלם!',
          html: `<div style="text-align:right;direction:rtl">
            <p><b>${data.result?.count || 0}</b> פסקי דין נסרקו</p>
            <p><b>${data.result?.newItems || 0}</b> חדשים הוספו</p>
            <p><b>${data.result?.updatedItems || 0}</b> עודכנו</p>
            ${data.result?.errors?.length ? `<p style="color:orange">${data.result.errors.length} שגיאות</p>` : ''}
          </div>`,
          confirmButtonColor: '#0B3C5D',
        });
        fetchAll();
      } else {
        Swal.fire({ icon: 'error', title: 'שגיאה', text: data.error, confirmButtonColor: '#B83232' });
      }
    } catch {
      const Swal = (await import('sweetalert2')).default;
      Swal.fire({ icon: 'error', title: 'שגיאה', text: 'שגיאה בייבוא', confirmButtonColor: '#B83232' });
    }
    setImporting(false);
  }

  if (loading) {
    return <div className="flex items-center justify-center h-64"><div className="animate-pulse text-primary text-lg">טוען נתונים...</div></div>;
  }

  const statCards = [
    { label: 'סה"כ פסקי דין', value: stats.totalJudgments, icon: FileText, border: 'border-primary', iconBg: 'bg-primary/10', iconColor: 'text-primary' },
    { label: 'פורסמו', value: stats.publishedCount, icon: Eye, border: 'border-green-500', iconBg: 'bg-green-50', iconColor: 'text-green-600' },
    { label: 'מוסתרים', value: stats.hiddenCount, icon: EyeOff, border: 'border-legal-danger', iconBg: 'bg-red-50', iconColor: 'text-legal-danger' },
    { label: 'בקשות הסרה', value: stats.pendingRemovalRequests, icon: Clock, border: 'border-amber-500', iconBg: 'bg-amber-50', iconColor: 'text-amber-600' },
  ];

  const sourceColors: Record<string, string> = {
    'data.gov.il': 'bg-blue-100 text-blue-700',
    'נבו (Nevo)': 'bg-purple-100 text-purple-700',
    'פסק דין (PsakDin)': 'bg-green-100 text-green-700',
    'הרשות השופטת (court.gov.il)': 'bg-indigo-100 text-indigo-700',
    'תקדין (Takdin)': 'bg-orange-100 text-orange-700',
    'דין אונליין (Din)': 'bg-teal-100 text-teal-700',
    'בית הדין הרבני': 'bg-yellow-100 text-yellow-800',
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-legal-text">לוח בקרה</h1>
        {stats.lastImportDate && (
          <span className="text-sm text-gray-400">ייבוא אחרון: {stats.lastImportDate}</span>
        )}
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.label} className={`bg-white rounded-xl p-5 shadow-sm border-r-4 ${card.border}`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 mb-1">{card.label}</p>
                  <p className="text-3xl font-bold text-legal-text">{card.value}</p>
                </div>
                <div className={`w-12 h-12 rounded-lg ${card.iconBg} flex items-center justify-center`}>
                  <Icon className={`w-6 h-6 ${card.iconColor}`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm">
        <div className="px-5 py-3 border-b border-gray-100 flex items-center justify-between">
          <div className="flex gap-1">
            {[
              { key: 'overview' as const, label: 'סקירה כללית' },
              { key: 'sources' as const, label: 'מקורות' },
              { key: 'history' as const, label: 'היסטוריית ייבוא' },
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition ${
                  activeTab === tab.key ? 'bg-primary text-white' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <button
            onClick={triggerImport}
            disabled={importing}
            className="px-4 py-2 bg-accent text-white text-sm font-medium rounded-lg hover:bg-primary-light transition flex items-center gap-1 disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${importing ? 'animate-spin' : ''}`} />
            {importing ? 'מייבא מכל המקורות...' : 'ייבוא עכשיו'}
          </button>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="p-5 space-y-6">
            {/* Source Breakdown */}
            {Object.keys(stats.sourceBreakdown).length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-gray-500 mb-3 flex items-center gap-2">
                  <Globe className="w-4 h-4" /> פסקי דין לפי מקור
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {Object.entries(stats.sourceBreakdown).sort((a, b) => b[1] - a[1]).map(([source, count]) => (
                    <div key={source} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${sourceColors[source] || 'bg-gray-100 text-gray-700'}`}>
                        {source}
                      </span>
                      <span className="font-bold text-legal-text">{count}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Category Breakdown */}
            {Object.keys(stats.categoryBreakdown).length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-gray-500 mb-3 flex items-center gap-2">
                  <Tag className="w-4 h-4" /> פסקי דין לפי קטגוריה
                </h3>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(stats.categoryBreakdown).sort((a, b) => b[1] - a[1]).map(([cat, count]) => (
                    <span key={cat} className="px-3 py-1.5 bg-primary/5 border border-primary/20 text-primary text-sm font-medium rounded-full">
                      {cat} ({count})
                    </span>
                  ))}
                </div>
              </div>
            )}

            {stats.totalJudgments === 0 && (
              <div className="p-8 text-center text-gray-400">
                <Download className="w-10 h-10 mx-auto mb-3 opacity-30" />
                <p>עדיין לא בוצע ייבוא. לחץ &quot;ייבוא עכשיו&quot; לסרוק פסקי דין מכל המקורות.</p>
              </div>
            )}
          </div>
        )}

        {/* Sources Tab */}
        {activeTab === 'sources' && (
          <div className="p-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { name: 'data.gov.il', label: 'data.gov.il - חופש המידע', desc: 'עתירות מנהליות מפורטל הנתונים הפתוחים', url: 'https://data.gov.il' },
                { name: 'בית הדין הרבני', label: 'בית הדין הרבני', desc: 'פסקי דין מבית הדין הרבני', url: 'https://data.gov.il' },
                { name: 'נבו (Nevo)', label: 'נבו - Nevo', desc: 'גיליונות יומיים מנבו עם פסיקה עדכנית', url: 'https://www.nevo.co.il' },
                { name: 'פסק דין (PsakDin)', label: 'פסק דין - PsakDin', desc: 'מאגר פסקי דין וניתוחים משפטיים', url: 'https://www.psakdin.co.il' },
                { name: 'הרשות השופטת (court.gov.il)', label: 'הרשות השופטת', desc: 'אתר הרשות השופטת של מדינת ישראל', url: 'https://www.court.gov.il' },
                { name: 'תקדין (Takdin)', label: 'תקדין - Takdin', desc: 'מאגר משפטי מוביל בישראל', url: 'https://www.takdin.co.il' },
                { name: 'דין אונליין (Din)', label: 'דין אונליין - Din', desc: 'פורטל משפטי עם מאמרים ופסיקה', url: 'https://www.din.co.il' },
              ].map(source => {
                const sourceData = stats.sources?.find(s => s.sourceName === source.name);
                const count = stats.sourceBreakdown[source.name] || 0;

                return (
                  <div key={source.name} className="p-4 border border-gray-200 rounded-lg hover:border-primary/30 transition">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-bold text-legal-text">{source.label}</h4>
                        <p className="text-xs text-gray-400">{source.desc}</p>
                      </div>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        count > 0 ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                      }`}>
                        {count > 0 ? `${count} פסקי דין` : 'טרם יובא'}
                      </span>
                    </div>
                    {sourceData && (
                      <div className="flex items-center gap-3 text-xs text-gray-400 mt-2">
                        <span>ייבוא אחרון: {sourceData.lastDate}</span>
                        {sourceData.status === 'success' ? (
                          <CheckCircle className="w-3.5 h-3.5 text-green-500" />
                        ) : sourceData.status === 'failed' ? (
                          <XCircle className="w-3.5 h-3.5 text-red-500" />
                        ) : (
                          <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* History Tab */}
        {activeTab === 'history' && (
          <div className="px-5 py-3">
            {importHistory.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-gray-500 bg-gray-50">
                      <th className="px-3 py-2 text-right font-medium">תאריך</th>
                      <th className="px-3 py-2 text-right font-medium">שעה</th>
                      <th className="px-3 py-2 text-right font-medium">מקור</th>
                      <th className="px-3 py-2 text-right font-medium">סה&quot;כ</th>
                      <th className="px-3 py-2 text-right font-medium">חדשים</th>
                      <th className="px-3 py-2 text-right font-medium">עודכנו</th>
                      <th className="px-3 py-2 text-right font-medium">סטטוס</th>
                      <th className="px-3 py-2 text-right font-medium">פרטים</th>
                    </tr>
                  </thead>
                  <tbody>
                    {importHistory.map((h) => (
                      <>
                        <tr key={h.id} className="border-t border-gray-50 hover:bg-gray-50/50">
                          <td className="px-3 py-2">{h.importDate}</td>
                          <td className="px-3 py-2">{h.importTime}</td>
                          <td className="px-3 py-2">
                            <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${sourceColors[h.sourceName] || 'bg-gray-100 text-gray-700'}`}>
                              {h.sourceName}
                            </span>
                          </td>
                          <td className="px-3 py-2 font-bold">{h.count}</td>
                          <td className="px-3 py-2 font-bold text-green-600">+{h.newItems}</td>
                          <td className="px-3 py-2 text-gray-500">{h.updatedItems || 0}</td>
                          <td className="px-3 py-2">
                            <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                              h.status === 'success' ? 'bg-green-100 text-green-700' :
                              h.status === 'partial' ? 'bg-amber-100 text-amber-700' :
                              'bg-red-100 text-red-700'
                            }`}>
                              {h.status === 'success' ? 'הצלחה' : h.status === 'partial' ? 'חלקי' : 'נכשל'}
                            </span>
                          </td>
                          <td className="px-3 py-2">
                            {h.items.length > 0 && (
                              <button
                                onClick={() => setExpandedRecord(expandedRecord === h.id ? null : h.id)}
                                className="text-primary hover:underline text-xs"
                              >
                                {expandedRecord === h.id ? 'הסתר' : `הצג (${h.items.length})`}
                              </button>
                            )}
                          </td>
                        </tr>
                        {expandedRecord === h.id && h.items.length > 0 && (
                          <tr key={`${h.id}-items`}>
                            <td colSpan={8} className="bg-gray-50/50 px-6 py-3">
                              <table className="w-full text-xs">
                                <thead>
                                  <tr className="text-gray-400">
                                    <th className="px-2 py-1 text-right">מס&apos; הליך</th>
                                    <th className="px-2 py-1 text-right">נושא</th>
                                    <th className="px-2 py-1 text-right">בית משפט</th>
                                    <th className="px-2 py-1 text-right">תאריך</th>
                                    <th className="px-2 py-1 text-right">קטגוריה</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {h.items.map((item, i) => (
                                    <tr key={i} className="border-t border-gray-100">
                                      <td className="px-2 py-1 font-mono text-gray-600">{item.caseNumber}</td>
                                      <td className="px-2 py-1 max-w-xs truncate">{item.subject}</td>
                                      <td className="px-2 py-1 text-gray-500">{item.court}</td>
                                      <td className="px-2 py-1 text-gray-500">{item.date}</td>
                                      <td className="px-2 py-1">
                                        <span className="px-1.5 py-0.5 bg-primary/10 text-primary text-xs rounded">{item.category || '-'}</span>
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </td>
                          </tr>
                        )}
                        {h.errors.length > 0 && expandedRecord === h.id && (
                          <tr key={`${h.id}-errors`}>
                            <td colSpan={8} className="bg-red-50/50 px-6 py-2">
                              {h.errors.map((err, i) => (
                                <p key={i} className="text-xs text-red-600 flex items-center gap-1">
                                  <AlertTriangle className="w-3 h-3" /> {err}
                                </p>
                              ))}
                            </td>
                          </tr>
                        )}
                      </>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-8 text-center text-gray-400">
                <Download className="w-10 h-10 mx-auto mb-3 opacity-30" />
                <p>עדיין לא בוצע ייבוא. לחץ &quot;ייבוא עכשיו&quot; להתחיל.</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Quick actions */}
      <div className="bg-white rounded-xl shadow-sm p-5">
        <h2 className="font-bold text-legal-text mb-4">פעולות מהירות</h2>
        <div className="flex flex-wrap gap-3">
          <a href="/admin/judgments" className="px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary-light transition">
            ניהול פסקי דין ({stats.totalJudgments})
          </a>
          <a href="/admin/removals" className="px-4 py-2 bg-legal-danger text-white text-sm font-medium rounded-lg hover:bg-red-700 transition">
            בקשות הסרה
          </a>
          <button onClick={triggerImport} disabled={importing} className="px-4 py-2 bg-accent text-white text-sm font-medium rounded-lg hover:bg-primary-light transition disabled:opacity-50">
            {importing ? 'מייבא...' : 'ייבוא מכל המקורות'}
          </button>
        </div>
      </div>
    </div>
  );
}
