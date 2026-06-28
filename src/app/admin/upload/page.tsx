'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';

interface UploadResult {
  filename: string;
  status: string;
  caseNumber?: string;
  error?: string;
}

export default function UploadPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [folderDate, setFolderDate] = useState(new Date().toISOString().split('T')[0]);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState<UploadResult[] | null>(null);
  const [summary, setSummary] = useState('');
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files) {
      const pdfFiles = Array.from(e.target.files).filter(f => f.name.endsWith('.pdf'));
      setFiles(pdfFiles);
      setResults(null);
      setError('');
    }
  }

  async function handleUpload() {
    if (files.length === 0) return;

    const token = localStorage.getItem('adminToken');
    if (!token) {
      setError('יש להתחבר למערכת ניהול');
      return;
    }

    setUploading(true);
    setProgress(0);
    setResults(null);
    setError('');

    // Upload in batches of 5
    const batchSize = 5;
    const allResults: UploadResult[] = [];

    for (let i = 0; i < files.length; i += batchSize) {
      const batch = files.slice(i, i + batchSize);
      const formData = new FormData();
      formData.append('folderDate', folderDate);
      batch.forEach(f => formData.append('files', f));

      try {
        const res = await fetch('/api/admin/upload', {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}` },
          body: formData,
        });

        const data = await res.json();
        if (data.results) {
          allResults.push(...data.results);
        }
        if (!res.ok) {
          setError(data.error || 'שגיאה בהעלאה');
        }
      } catch {
        setError('שגיאה בחיבור לשרת');
      }

      setProgress(Math.round(((i + batch.length) / files.length) * 100));
    }

    setResults(allResults);
    const success = allResults.filter(r => r.status === 'success').length;
    const exists = allResults.filter(r => r.status === 'exists').length;
    const errors = allResults.filter(r => r.status === 'error').length;
    setSummary(`${success} חדשים | ${exists} קיימים | ${errors} שגיאות`);
    setUploading(false);
  }

  return (
    <div dir="rtl" className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-[#0B3C5D]">העלאת פסקי דין מ-GOV.IL</h1>
        <Link href="/admin/dashboard" className="text-sm text-gray-500 hover:text-[#C9A84C]">
          &larr; חזרה ללוח בקרה
        </Link>
      </div>

      {/* Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <h3 className="font-semibold text-blue-800 mb-2">הוראות:</h3>
        <ol className="text-sm text-blue-700 space-y-1 list-decimal list-inside">
          <li>היכנס ל-<strong>decisions.court.gov.il</strong> עם שם המשתמש והסיסמה</li>
          <li>בחר תיקיית תאריך (למשל 2026-6-18)</li>
          <li>סמן את כל קבצי ה-PDF והורד אותם למחשב</li>
          <li>העלה אותם כאן - המערכת תחלץ טקסט ומטא-דאטה אוטומטית</li>
        </ol>
      </div>

      {/* Date folder input */}
      <div className="bg-white rounded-lg shadow border border-gray-200 p-6 mb-6">
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            תאריך תיקייה ב-GOV.IL
          </label>
          <input
            type="date"
            value={folderDate}
            onChange={(e) => setFolderDate(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C9A84C] outline-none"
          />
          <p className="text-xs text-gray-400 mt-1">התאריך של התיקייה שממנה הורדת את הקבצים</p>
        </div>

        {/* File select */}
        <div
          className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-[#C9A84C] transition-colors"
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf"
            multiple
            onChange={handleFileSelect}
            className="hidden"
          />
          {files.length === 0 ? (
            <>
              <div className="text-4xl mb-2">&#128196;</div>
              <p className="text-gray-600 font-medium">לחץ כאן או גרור קבצי PDF</p>
              <p className="text-sm text-gray-400 mt-1">ניתן לבחור מספר קבצים בו-זמנית</p>
            </>
          ) : (
            <>
              <div className="text-4xl mb-2">&#9989;</div>
              <p className="text-gray-700 font-medium">{files.length} קבצים נבחרו</p>
              <p className="text-sm text-gray-400 mt-1">
                {(files.reduce((sum, f) => sum + f.size, 0) / 1024 / 1024).toFixed(1)} MB סה&quot;כ
              </p>
            </>
          )}
        </div>

        {/* File list */}
        {files.length > 0 && (
          <div className="mt-4 max-h-40 overflow-y-auto">
            <div className="text-xs text-gray-500 space-y-1">
              {files.slice(0, 20).map((f, i) => (
                <div key={i} className="flex justify-between">
                  <span className="truncate ml-2">{f.name}</span>
                  <span>{(f.size / 1024).toFixed(0)} KB</span>
                </div>
              ))}
              {files.length > 20 && (
                <p className="text-gray-400">... ועוד {files.length - 20} קבצים</p>
              )}
            </div>
          </div>
        )}

        {/* Upload button */}
        <button
          onClick={handleUpload}
          disabled={uploading || files.length === 0}
          className="mt-4 w-full bg-gradient-to-l from-[#C9A84C] to-[#D4B85E] text-[#072a42] font-bold py-3 rounded-lg transition-all shadow hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {uploading ? `מעלה... ${progress}%` : `העלה ${files.length} קבצים`}
        </button>

        {/* Progress bar */}
        {uploading && (
          <div className="mt-3 w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-[#C9A84C] h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {/* Results */}
      {results && (
        <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
          <h3 className="font-bold text-[#0B3C5D] mb-2">תוצאות העלאה</h3>
          <p className="text-sm text-gray-600 mb-4">{summary}</p>

          <div className="max-h-60 overflow-y-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-gray-500">
                  <th className="text-right py-2">קובץ</th>
                  <th className="text-right py-2">סטטוס</th>
                  <th className="text-right py-2">מספר תיק</th>
                </tr>
              </thead>
              <tbody>
                {results.map((r, i) => (
                  <tr key={i} className="border-b border-gray-100">
                    <td className="py-1.5 truncate max-w-[200px]" title={r.filename}>
                      {r.filename.slice(0, 20)}...
                    </td>
                    <td className="py-1.5">
                      {r.status === 'success' && <span className="text-green-600 font-medium">&#10003; חדש</span>}
                      {r.status === 'exists' && <span className="text-yellow-600">קיים</span>}
                      {r.status === 'error' && <span className="text-red-600">&#10007; {r.error}</span>}
                      {r.status === 'skipped' && <span className="text-gray-400">דולג</span>}
                    </td>
                    <td className="py-1.5 text-gray-600">{r.caseNumber || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
