'use client';

import { useEffect, useState, useCallback } from 'react';
import {
  Eye,
  Check,
  XCircle,
  X,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

interface RemovalRequest {
  id: string;
  fullName: string;
  email: string;
  judgmentTitle: string;
  judgmentId: string;
  reason: string;
  details?: string;
  status: string;
  createdAt: string;
  phone?: string;
  idNumber?: string;
}

export default function AdminRemovalsPage() {
  const [requests, setRequests] = useState<RemovalRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedRequest, setSelectedRequest] = useState<RemovalRequest | null>(null);

  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  const fetchRequests = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams();
      params.set('page', String(page));
      params.set('limit', '15');

      const res = await fetch(`/api/removal-requests?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed');
      const data = await res.json();
      setRequests(data.requests || data.data || []);
      setTotalPages(data.totalPages || 1);
    } catch {
      setError('שגיאה בטעינת בקשות ההסרה');
    } finally {
      setLoading(false);
    }
  }, [page, token]);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  const statusBadge = (status: string) => {
    const map: Record<string, { bg: string; text: string; label: string }> = {
      NEW: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'חדש' },
      IN_PROGRESS: { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'בטיפול' },
      APPROVED: { bg: 'bg-green-100', text: 'text-green-700', label: 'אושר' },
      REJECTED: { bg: 'bg-red-100', text: 'text-red-700', label: 'נדחה' },
    };
    const s = map[status] || { bg: 'bg-gray-100', text: 'text-gray-700', label: status };
    return (
      <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${s.bg} ${s.text}`}>
        {s.label}
      </span>
    );
  };

  const handleApprove = async (id: string) => {
    const Swal = (await import('sweetalert2')).default;
    const result = await Swal.fire({
      title: 'אישור הסרה',
      text: 'האם לאשר את בקשת ההסרה? פסק הדין יוסתר מהאתר.',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#2E7D32',
      cancelButtonText: 'ביטול',
      confirmButtonText: 'אישור הסרה',
    });
    if (!result.isConfirmed) return;

    try {
      const res = await fetch(`/api/removal-requests/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: 'APPROVED' }),
      });
      if (!res.ok) throw new Error('Failed');
      fetchRequests();
      setSelectedRequest(null);
      Swal.fire({ icon: 'success', title: 'אושר', text: 'בקשת ההסרה אושרה', confirmButtonColor: '#0B3C5D' });
    } catch {
      Swal.fire({ icon: 'error', title: 'שגיאה', text: 'הפעולה נכשלה', confirmButtonColor: '#0B3C5D' });
    }
  };

  const handleReject = async (id: string) => {
    const Swal = (await import('sweetalert2')).default;
    const result = await Swal.fire({
      title: 'דחיית בקשה',
      text: 'האם לדחות את בקשת ההסרה?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#B83232',
      cancelButtonText: 'ביטול',
      confirmButtonText: 'דחייה',
    });
    if (!result.isConfirmed) return;

    try {
      const res = await fetch(`/api/removal-requests/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: 'REJECTED' }),
      });
      if (!res.ok) throw new Error('Failed');
      fetchRequests();
      setSelectedRequest(null);
      Swal.fire({ icon: 'success', title: 'נדחה', text: 'בקשת ההסרה נדחתה', confirmButtonColor: '#0B3C5D' });
    } catch {
      Swal.fire({ icon: 'error', title: 'שגיאה', text: 'הפעולה נכשלה', confirmButtonColor: '#0B3C5D' });
    }
  };

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-bold text-legal-text">בקשות הסרה</h1>

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
                  <th className="px-4 py-3 text-right font-medium">שם מלא</th>
                  <th className="px-4 py-3 text-right font-medium">אימייל</th>
                  <th className="px-4 py-3 text-right font-medium">פסק דין</th>
                  <th className="px-4 py-3 text-right font-medium">סיבה</th>
                  <th className="px-4 py-3 text-right font-medium">סטטוס</th>
                  <th className="px-4 py-3 text-right font-medium">תאריך</th>
                  <th className="px-4 py-3 text-right font-medium">פעולות</th>
                </tr>
              </thead>
              <tbody>
                {requests.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-4 py-8 text-center text-gray-400">
                      אין בקשות הסרה
                    </td>
                  </tr>
                ) : (
                  requests.map((r, idx) => (
                    <tr key={r.id} className="border-t border-gray-100 hover:bg-gray-50/50">
                      <td className="px-4 py-3 text-gray-400">{(page - 1) * 15 + idx + 1}</td>
                      <td className="px-4 py-3 text-legal-text font-medium">{r.fullName}</td>
                      <td className="px-4 py-3 text-gray-500 text-xs">{r.email}</td>
                      <td className="px-4 py-3 text-gray-500 max-w-[150px] truncate">
                        {r.judgmentTitle}
                      </td>
                      <td className="px-4 py-3 text-gray-500 max-w-[120px] truncate">{r.reason}</td>
                      <td className="px-4 py-3">{statusBadge(r.status)}</td>
                      <td className="px-4 py-3 text-gray-500 text-xs">
                        {new Date(r.createdAt).toLocaleDateString('he-IL')}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => setSelectedRequest(r)}
                            className="p-1.5 text-gray-400 hover:text-accent hover:bg-accent/10 rounded-lg transition"
                            title="צפייה"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          {(r.status === 'NEW' || r.status === 'IN_PROGRESS') && (
                            <>
                              <button
                                onClick={() => handleApprove(r.id)}
                                className="p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition"
                                title="אישור הסרה"
                              >
                                <Check className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleReject(r.id)}
                                className="p-1.5 text-gray-400 hover:text-legal-danger hover:bg-red-50 rounded-lg transition"
                                title="דחייה"
                              >
                                <XCircle className="w-4 h-4" />
                              </button>
                            </>
                          )}
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

      {/* Detail Modal */}
      {selectedRequest && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="text-lg font-bold text-legal-text">פרטי בקשת הסרה</h2>
              <button
                onClick={() => setSelectedRequest(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-400 mb-0.5">שם מלא</p>
                  <p className="text-sm font-medium text-legal-text">{selectedRequest.fullName}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-0.5">אימייל</p>
                  <p className="text-sm text-legal-text">{selectedRequest.email}</p>
                </div>
                {selectedRequest.phone && (
                  <div>
                    <p className="text-xs text-gray-400 mb-0.5">טלפון</p>
                    <p className="text-sm text-legal-text">{selectedRequest.phone}</p>
                  </div>
                )}
                {selectedRequest.idNumber && (
                  <div>
                    <p className="text-xs text-gray-400 mb-0.5">ת.ז.</p>
                    <p className="text-sm text-legal-text">{selectedRequest.idNumber}</p>
                  </div>
                )}
                <div>
                  <p className="text-xs text-gray-400 mb-0.5">סטטוס</p>
                  {statusBadge(selectedRequest.status)}
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-0.5">תאריך הגשה</p>
                  <p className="text-sm text-legal-text">
                    {new Date(selectedRequest.createdAt).toLocaleDateString('he-IL')}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-xs text-gray-400 mb-0.5">פסק דין</p>
                <p className="text-sm font-medium text-legal-text">{selectedRequest.judgmentTitle}</p>
              </div>

              <div>
                <p className="text-xs text-gray-400 mb-0.5">סיבת הבקשה</p>
                <p className="text-sm text-legal-text">{selectedRequest.reason}</p>
              </div>

              {selectedRequest.details && (
                <div>
                  <p className="text-xs text-gray-400 mb-0.5">פרטים נוספים</p>
                  <p className="text-sm text-legal-text whitespace-pre-wrap">{selectedRequest.details}</p>
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100">
              <button
                onClick={() => setSelectedRequest(null)}
                className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 transition"
              >
                סגירה
              </button>
              {(selectedRequest.status === 'NEW' || selectedRequest.status === 'IN_PROGRESS') && (
                <>
                  <button
                    onClick={() => handleReject(selectedRequest.id)}
                    className="px-4 py-2 bg-legal-danger text-white text-sm font-medium rounded-lg hover:opacity-90 transition"
                  >
                    דחייה
                  </button>
                  <button
                    onClick={() => handleApprove(selectedRequest.id)}
                    className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:opacity-90 transition"
                  >
                    אישור הסרה
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
