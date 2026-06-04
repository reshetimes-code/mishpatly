'use client';

import { useEffect, useState, useCallback } from 'react';
import {
  Search,
  Plus,
  Edit3,
  Eye,
  EyeOff,
  Trash2,
  X,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
} from 'lucide-react';

interface Judgment {
  id: string;
  title: string;
  caseNumber: string;
  courtName: string;
  judgmentDate: string;
  status: string;
  slug?: string;
  sourceName?: string;
  category?: string;
}

const emptyForm = {
  title: '',
  caseNumber: '',
  courtName: '',
  procedureType: '',
  judgmentDate: '',
  judge: '',
  plaintiff: '',
  defendant: '',
  summary: '',
  fullText: '',
  seoTitle: '',
  seoDescription: '',
  status: 'DRAFT',
  pdfUrl: '',
};

export default function AdminJudgmentsPage() {
  const [judgments, setJudgments] = useState<Judgment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [sourceFilter, setSourceFilter] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);

  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  const fetchJudgments = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams();
      params.set('page', String(page));
      params.set('limit', '15');
      if (search) params.set('q', search);
      if (statusFilter) params.set('status', statusFilter);
      if (sourceFilter) params.set('source', sourceFilter);

      const res = await fetch(`/api/judgments?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed');
      const data = await res.json();
      setJudgments(data.judgments || data.data || []);
      setTotalPages(data.totalPages || 1);
      setTotal(data.total || 0);
    } catch {
      setError('שגיאה בטעינת פסקי הדין');
    } finally {
      setLoading(false);
    }
  }, [page, search, statusFilter, sourceFilter, token]);

  useEffect(() => {
    fetchJudgments();
  }, [fetchJudgments]);

  const statusBadge = (status: string) => {
    const map: Record<string, { bg: string; text: string; label: string }> = {
      PUBLISHED: { bg: 'bg-green-100', text: 'text-green-700', label: 'פורסם' },
      DRAFT: { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'טיוטה' },
      HIDDEN: { bg: 'bg-red-100', text: 'text-red-700', label: 'מוסתר' },
      PENDING: { bg: 'bg-orange-100', text: 'text-orange-700', label: 'ממתין לבדיקה' },
    };
    const s = map[status] || { bg: 'bg-gray-100', text: 'text-gray-700', label: status };
    return (
      <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${s.bg} ${s.text}`}>
        {s.label}
      </span>
    );
  };

  const handleToggleVisibility = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'PUBLISHED' ? 'HIDDEN' : 'PUBLISHED';
    const Swal = (await import('sweetalert2')).default;
    const result = await Swal.fire({
      title: newStatus === 'HIDDEN' ? 'הסתרת פסק דין' : 'פרסום פסק דין',
      text: newStatus === 'HIDDEN' ? 'האם להסתיר את פסק הדין?' : 'האם לפרסם את פסק הדין?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#0B3C5D',
      cancelButtonText: 'ביטול',
      confirmButtonText: 'אישור',
    });
    if (!result.isConfirmed) return;

    try {
      const res = await fetch(`/api/judgments/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error('Failed');
      fetchJudgments();
    } catch {
      Swal.fire({ icon: 'error', title: 'שגיאה', text: 'הפעולה נכשלה', confirmButtonColor: '#0B3C5D' });
    }
  };

  const handleDelete = async (id: string) => {
    const Swal = (await import('sweetalert2')).default;
    const result = await Swal.fire({
      title: 'מחיקת פסק דין',
      text: 'פעולה זו אינה ניתנת לביטול. האם למחוק?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#B83232',
      cancelButtonText: 'ביטול',
      confirmButtonText: 'מחיקה',
    });
    if (!result.isConfirmed) return;

    try {
      const res = await fetch(`/api/judgments/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed');
      fetchJudgments();
      Swal.fire({ icon: 'success', title: 'נמחק', text: 'פסק הדין נמחק בהצלחה', confirmButtonColor: '#0B3C5D' });
    } catch {
      Swal.fire({ icon: 'error', title: 'שגיאה', text: 'המחיקה נכשלה', confirmButtonColor: '#0B3C5D' });
    }
  };

  const openAddModal = () => {
    setEditId(null);
    setForm(emptyForm);
    setShowModal(true);
  };

  const openEditModal = async (id: string) => {
    try {
      const res = await fetch(`/api/judgments/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed');
      const data = await res.json();
      const j = data.judgment || data;
      setForm({
        title: j.title || '',
        caseNumber: j.caseNumber || '',
        courtName: j.courtName || '',
        procedureType: j.procedureType || '',
        judgmentDate: j.judgmentDate ? j.judgmentDate.slice(0, 10) : '',
        judge: j.judge || '',
        plaintiff: j.plaintiff || '',
        defendant: j.defendant || '',
        summary: j.summary || '',
        fullText: j.fullText || '',
        seoTitle: j.seoTitle || '',
        seoDescription: j.seoDescription || '',
        status: j.status || 'DRAFT',
        pdfUrl: j.pdfUrl || '',
      });
      setEditId(id);
      setShowModal(true);
    } catch {
      const Swal = (await import('sweetalert2')).default;
      Swal.fire({ icon: 'error', title: 'שגיאה', text: 'לא ניתן לטעון את הנתונים', confirmButtonColor: '#0B3C5D' });
    }
  };

  const handleSubmitForm = async () => {
    setSubmitting(true);
    try {
      const url = editId ? `/api/judgments/${editId}` : '/api/judgments';
      const method = editId ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error('Failed');
      setShowModal(false);
      fetchJudgments();
      const Swal = (await import('sweetalert2')).default;
      Swal.fire({
        icon: 'success',
        title: editId ? 'עודכן' : 'נוסף',
        text: editId ? 'פסק הדין עודכן בהצלחה' : 'פסק הדין נוסף בהצלחה',
        confirmButtonColor: '#0B3C5D',
      });
    } catch {
      const Swal = (await import('sweetalert2')).default;
      Swal.fire({ icon: 'error', title: 'שגיאה', text: 'השמירה נכשלה', confirmButtonColor: '#0B3C5D' });
    } finally {
      setSubmitting(false);
    }
  };

  const updateField = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-legal-text">ניהול פסקי דין</h1>
        <button
          onClick={openAddModal}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary-light transition"
        >
          <Plus className="w-4 h-4" />
          הוספת פסק דין
        </button>
      </div>

      {/* Search & filter */}
      <div className="bg-white rounded-xl shadow-sm p-4 flex flex-col sm:flex-row gap-3 items-center">
        <div className="relative flex-1">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="חיפוש לפי כותרת, מספר תיק..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="w-full pr-10 pl-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-accent focus:border-transparent outline-none text-legal-text"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
          className="px-4 py-2.5 border border-gray-300 rounded-lg text-sm text-legal-text focus:ring-2 focus:ring-accent outline-none"
        >
          <option value="">כל הסטטוסים</option>
          <option value="PUBLISHED">פורסם</option>
          <option value="DRAFT">טיוטה</option>
          <option value="HIDDEN">מוסתר</option>
          <option value="PENDING_REVIEW">ממתין לבדיקה</option>
        </select>
        <select
          value={sourceFilter}
          onChange={(e) => { setSourceFilter(e.target.value); setPage(1); }}
          className="px-4 py-2.5 border border-gray-300 rounded-lg text-sm text-legal-text focus:ring-2 focus:ring-accent outline-none"
        >
          <option value="">כל המקורות</option>
          <option value="data.gov.il">data.gov.il</option>
          <option value="נבו (Nevo)">נבו</option>
          <option value="פסק דין (PsakDin)">פסק דין</option>
          <option value="הרשות השופטת (court.gov.il)">הרשות השופטת</option>
          <option value="תקדין (Takdin)">תקדין</option>
          <option value="דין אונליין (Din)">דין אונליין</option>
          <option value="בית הדין הרבני">בית הדין הרבני</option>
        </select>
        <span className="text-xs text-gray-400 whitespace-nowrap">{total} תוצאות</span>
      </div>

      {/* Table */}
      {loading ? (
        <div className="bg-white rounded-xl shadow-sm p-10 text-center">
          <div className="animate-pulse text-primary">טוען...</div>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <AlertTriangle className="w-8 h-8 text-legal-danger mx-auto mb-2" />
          <p className="text-legal-danger font-medium">{error}</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-gray-500">
                  <th className="px-4 py-3 text-right font-medium w-10">#</th>
                  <th className="px-4 py-3 text-right font-medium">כותרת</th>
                  <th className="px-4 py-3 text-right font-medium">מספר תיק</th>
                  <th className="px-4 py-3 text-right font-medium">בית משפט</th>
                  <th className="px-4 py-3 text-right font-medium">תאריך</th>
                  <th className="px-4 py-3 text-right font-medium">מקור</th>
                  <th className="px-4 py-3 text-right font-medium">קטגוריה</th>
                  <th className="px-4 py-3 text-right font-medium">סטטוס</th>
                  <th className="px-4 py-3 text-right font-medium">פעולות</th>
                </tr>
              </thead>
              <tbody>
                {judgments.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="px-4 py-8 text-center text-gray-400">
                      {total === 0 ? 'לא נמצאו פסקי דין. לחץ "ייבוא עכשיו" בלוח הבקרה כדי לייבא פסיקות.' : 'לא נמצאו תוצאות לחיפוש'}
                    </td>
                  </tr>
                ) : (
                  judgments.map((j, idx) => (
                    <tr key={j.id} className="border-t border-gray-100 hover:bg-gray-50/50">
                      <td className="px-4 py-3 text-gray-400">{(page - 1) * 15 + idx + 1}</td>
                      <td className="px-4 py-3 text-legal-text font-medium max-w-[200px] truncate">
                        {j.title}
                      </td>
                      <td className="px-4 py-3 text-gray-500">{j.caseNumber}</td>
                      <td className="px-4 py-3 text-gray-500">{j.courtName}</td>
                      <td className="px-4 py-3 text-gray-500">
                        {j.judgmentDate ? new Date(j.judgmentDate).toLocaleDateString('he-IL') : '-'}
                      </td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-blue-50 text-blue-700 whitespace-nowrap">
                          {j.sourceName || '-'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-primary/10 text-primary whitespace-nowrap">
                          {j.category || '-'}
                        </span>
                      </td>
                      <td className="px-4 py-3">{statusBadge(j.status)}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => openEditModal(j.id)}
                            className="p-1.5 text-gray-400 hover:text-accent hover:bg-accent/10 rounded-lg transition"
                            title="עריכה"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleToggleVisibility(j.id, j.status)}
                            className="p-1.5 text-gray-400 hover:text-primary hover:bg-primary/10 rounded-lg transition"
                            title={j.status === 'PUBLISHED' ? 'הסתר' : 'הצג'}
                          >
                            {j.status === 'PUBLISHED' ? (
                              <EyeOff className="w-4 h-4" />
                            ) : (
                              <Eye className="w-4 h-4" />
                            )}
                          </button>
                          <button
                            onClick={() => handleDelete(j.id)}
                            className="p-1.5 text-gray-400 hover:text-legal-danger hover:bg-red-50 rounded-lg transition"
                            title="מחיקה"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 py-4 border-t border-gray-100">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
              <span className="text-sm text-gray-500">
                עמוד {page} מתוך {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      )}

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center overflow-y-auto py-8 px-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="text-lg font-bold text-legal-text">
                {editId ? 'עריכת פסק דין' : 'הוספת פסק דין'}
              </h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-legal-text mb-1">כותרת *</label>
                  <input
                    type="text"
                    value={form.title}
                    onChange={(e) => updateField('title', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-accent outline-none text-legal-text"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-legal-text mb-1">מספר תיק *</label>
                  <input
                    type="text"
                    value={form.caseNumber}
                    onChange={(e) => updateField('caseNumber', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-accent outline-none text-legal-text"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-legal-text mb-1">בית משפט</label>
                  <input
                    type="text"
                    value={form.courtName}
                    onChange={(e) => updateField('courtName', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-accent outline-none text-legal-text"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-legal-text mb-1">סוג הליך</label>
                  <input
                    type="text"
                    value={form.procedureType}
                    onChange={(e) => updateField('procedureType', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-accent outline-none text-legal-text"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-legal-text mb-1">תאריך פסק דין</label>
                  <input
                    type="date"
                    value={form.judgmentDate}
                    onChange={(e) => updateField('judgmentDate', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-accent outline-none text-legal-text"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-legal-text mb-1">שופט/ת</label>
                  <input
                    type="text"
                    value={form.judge}
                    onChange={(e) => updateField('judge', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-accent outline-none text-legal-text"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-legal-text mb-1">תובע</label>
                  <input
                    type="text"
                    value={form.plaintiff}
                    onChange={(e) => updateField('plaintiff', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-accent outline-none text-legal-text"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-legal-text mb-1">נתבע</label>
                  <input
                    type="text"
                    value={form.defendant}
                    onChange={(e) => updateField('defendant', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-accent outline-none text-legal-text"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-legal-text mb-1">סטטוס</label>
                  <select
                    value={form.status}
                    onChange={(e) => updateField('status', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-accent outline-none text-legal-text"
                  >
                    <option value="DRAFT">טיוטה</option>
                    <option value="PUBLISHED">פורסם</option>
                    <option value="HIDDEN">מוסתר</option>
                    <option value="PENDING">ממתין לבדיקה</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-legal-text mb-1">קישור PDF</label>
                  <input
                    type="url"
                    value={form.pdfUrl}
                    onChange={(e) => updateField('pdfUrl', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-accent outline-none text-legal-text"
                    placeholder="https://..."
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-legal-text mb-1">תקציר</label>
                <textarea
                  value={form.summary}
                  onChange={(e) => updateField('summary', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-accent outline-none text-legal-text resize-y"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-legal-text mb-1">טקסט מלא</label>
                <textarea
                  value={form.fullText}
                  onChange={(e) => updateField('fullText', e.target.value)}
                  rows={5}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-accent outline-none text-legal-text resize-y"
                />
              </div>

              <div className="border-t border-gray-100 pt-4">
                <h3 className="text-sm font-bold text-legal-text mb-3">SEO</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-legal-text mb-1">כותרת SEO</label>
                    <input
                      type="text"
                      value={form.seoTitle}
                      onChange={(e) => updateField('seoTitle', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-accent outline-none text-legal-text"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-legal-text mb-1">תיאור SEO</label>
                    <input
                      type="text"
                      value={form.seoDescription}
                      onChange={(e) => updateField('seoDescription', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-accent outline-none text-legal-text"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 transition"
              >
                ביטול
              </button>
              <button
                onClick={handleSubmitForm}
                disabled={submitting || !form.title || !form.caseNumber}
                className="px-6 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary-light transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? 'שומר...' : editId ? 'עדכון' : 'הוספה'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
