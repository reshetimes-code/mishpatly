'use client';

import { useEffect, useState, useRef } from 'react';
import { Search, Edit3, Trash2, CheckCircle, XCircle, Eye, Plus, X, Save } from 'lucide-react';
import { SPECIALIZATIONS, CITIES } from '@/lib/lawyer-constants';

interface Lawyer {
  id: number;
  slug: string;
  fullName: string;
  licenseNumber: string;
  phone: string;
  email: string;
  profileImage: string | null;
  coverImage: string | null;
  galleryImages: string[];
  specializations: string[];
  courtDistrict: string | null;
  city: string;
  address: string | null;
  yearsExperience: number;
  education: string | null;
  bio: string | null;
  website: string | null;
  whatsapp: string | null;
  rating: number;
  reviewCount: number;
  isVerified: boolean;
  isActive: boolean;
  createdAt: string;
}

export default function AdminLawyersPage() {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : '';
  const [lawyers, setLawyers] = useState<Lawyer[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [editingLawyer, setEditingLawyer] = useState<Lawyer | null>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Edit form state
  const [form, setForm] = useState({
    fullName: '', phone: '', email: '', city: '', address: '', courtDistrict: '',
    yearsExperience: '', education: '', bio: '', website: '', whatsapp: '',
    specializations: [] as string[],
  });
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [coverImage, setCoverImage] = useState<string | null>(null);
  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  const profileRef = useRef<HTMLInputElement>(null);
  const coverRef = useRef<HTMLInputElement>(null);
  const galleryRef = useRef<HTMLInputElement>(null);

  useEffect(() => { fetchLawyers(); }, []);

  async function fetchLawyers() {
    setLoading(true);
    try {
      const res = await fetch('/api/lawyers?limit=200&all=true');
      const data = await res.json();
      setLawyers(data.lawyers || []);
    } catch { /* ignore */ }
    setLoading(false);
  }

  function openEdit(lawyer: Lawyer) {
    setEditingLawyer(lawyer);
    setForm({
      fullName: lawyer.fullName, phone: lawyer.phone, email: lawyer.email,
      city: lawyer.city, address: lawyer.address || '', courtDistrict: lawyer.courtDistrict || '',
      yearsExperience: lawyer.yearsExperience ? String(lawyer.yearsExperience) : '',
      education: lawyer.education || '', bio: lawyer.bio || '',
      website: lawyer.website || '', whatsapp: lawyer.whatsapp || '',
      specializations: lawyer.specializations || [],
    });
    setProfileImage(lawyer.profileImage || null);
    setCoverImage(lawyer.coverImage || null);
    setGalleryImages(lawyer.galleryImages || []);
    setMessage(null);
  }

  function closeEdit() {
    setEditingLawyer(null);
    setMessage(null);
  }

  function updateField(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function toggleSpec(spec: string) {
    setForm((prev) => ({
      ...prev,
      specializations: prev.specializations.includes(spec)
        ? prev.specializations.filter((s) => s !== spec)
        : [...prev.specializations, spec],
    }));
  }

  function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>, setter: (v: string) => void) {
    const file = e.target.files?.[0];
    if (!file || file.size > 5 * 1024 * 1024) return;
    const reader = new FileReader();
    reader.onload = () => setter(reader.result as string);
    reader.readAsDataURL(file);
  }

  function handleGalleryUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files) return;
    const remaining = 10 - galleryImages.length;
    Array.from(files).slice(0, remaining).forEach((file) => {
      if (file.size > 5 * 1024 * 1024) return;
      const reader = new FileReader();
      reader.onload = () => setGalleryImages((prev) => [...prev, reader.result as string]);
      reader.readAsDataURL(file);
    });
    e.target.value = '';
  }

  async function handleSave() {
    if (!editingLawyer) return;
    setSaving(true);
    setMessage(null);
    try {
      const res = await fetch(`/api/lawyers/${editingLawyer.id}`, {
        method: 'PUT',
        headers: adminHeaders(),
        body: JSON.stringify({
          licenseNumber: editingLawyer.licenseNumber, // admin knows the license
          ...form,
          profileImage: profileImage || '',
          coverImage: coverImage || '',
          galleryImages,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setMessage({ type: 'success', text: 'הכרטיס עודכן בהצלחה' });
        fetchLawyers();
      } else {
        setMessage({ type: 'error', text: data.error || 'שגיאה בעדכון' });
      }
    } catch {
      setMessage({ type: 'error', text: 'שגיאה בשמירה' });
    }
    setSaving(false);
  }

  function adminHeaders(): Record<string, string> {
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;
    return headers;
  }

  async function toggleVerified(lawyer: Lawyer) {
    try {
      const res = await fetch(`/api/lawyers/${lawyer.id}`, {
        method: 'PUT',
        headers: adminHeaders(),
        body: JSON.stringify({ licenseNumber: lawyer.licenseNumber, isVerified: !lawyer.isVerified }),
      });
      if (res.ok) fetchLawyers();
    } catch { /* ignore */ }
  }

  async function toggleActive(lawyer: Lawyer) {
    const Swal = (await import('sweetalert2')).default;
    const action = lawyer.isActive ? 'להסתיר' : 'להפעיל';
    const result = await Swal.fire({
      title: `${action} את הכרטיס?`,
      text: `האם אתה בטוח שברצונך ${action} את ${lawyer.fullName}?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'כן',
      cancelButtonText: 'ביטול',
      confirmButtonColor: '#0B3C5D',
    });
    if (!result.isConfirmed) return;

    try {
      const res = await fetch(`/api/lawyers/${lawyer.id}`, {
        method: 'PUT',
        headers: adminHeaders(),
        body: JSON.stringify({ licenseNumber: lawyer.licenseNumber, isActive: !lawyer.isActive }),
      });
      if (res.ok) fetchLawyers();
    } catch { /* ignore */ }
  }

  const filtered = lawyers.filter((l) =>
    !search || l.fullName.includes(search) || l.email.includes(search) || l.city.includes(search) || l.licenseNumber.includes(search)
  );

  if (loading) {
    return <div className="flex items-center justify-center h-64"><div className="animate-pulse text-primary text-lg">טוען...</div></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-legal-text">ניהול עורכי דין</h1>
        <span className="text-sm text-gray-400">{lawyers.length} רשומים</span>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl shadow-sm p-4">
        <div className="relative">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="חיפוש לפי שם, אימייל, עיר או מספר רישיון..."
            className="w-full pr-10 pl-4 py-2.5 rounded-lg border border-gray-300 text-sm focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {filtered.length === 0 ? (
          <div className="p-12 text-center text-gray-400">
            <p className="text-lg mb-2">{lawyers.length === 0 ? 'אין עורכי דין רשומים' : 'לא נמצאו תוצאות'}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-gray-500">
                  <th className="px-4 py-3 text-right font-medium">עורך דין</th>
                  <th className="px-4 py-3 text-right font-medium">עיר</th>
                  <th className="px-4 py-3 text-right font-medium">התמחויות</th>
                  <th className="px-4 py-3 text-right font-medium">דירוג</th>
                  <th className="px-4 py-3 text-right font-medium">סטטוס</th>
                  <th className="px-4 py-3 text-right font-medium">פעולות</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((l) => (
                  <tr key={l.id} className="border-t border-gray-100 hover:bg-gray-50/50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {l.profileImage ? (
                          <img src={l.profileImage} alt="" className="w-9 h-9 rounded-full object-cover" />
                        ) : (
                          <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                            {l.fullName.charAt(0)}
                          </div>
                        )}
                        <div>
                          <p className="font-bold text-legal-text">{l.fullName}</p>
                          <p className="text-xs text-gray-400">רישיון: {l.licenseNumber} | {l.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{l.city}</td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        {l.specializations.slice(0, 2).map((s: string) => (
                          <span key={s} className="px-2 py-0.5 bg-accent/10 text-accent text-xs rounded-full">{s}</span>
                        ))}
                        {l.specializations.length > 2 && (
                          <span className="px-2 py-0.5 bg-gray-100 text-gray-500 text-xs rounded-full">+{l.specializations.length - 2}</span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-accent font-bold">{l.rating > 0 ? l.rating.toFixed(1) : '-'}</span>
                      <span className="text-xs text-gray-400 mr-1">({l.reviewCount})</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {l.isActive ? (
                          <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full font-medium">פעיל</span>
                        ) : (
                          <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs rounded-full font-medium">מוסתר</span>
                        )}
                        {l.isVerified && (
                          <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full font-medium">מאומת</span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <button onClick={() => openEdit(l)} title="עריכה"
                          className="p-1.5 rounded-lg hover:bg-accent/10 text-accent transition"><Edit3 className="w-4 h-4" /></button>
                        <a href={`/lawyers/${l.slug}`} target="_blank" title="צפייה"
                          className="p-1.5 rounded-lg hover:bg-primary/10 text-primary transition"><Eye className="w-4 h-4" /></a>
                        <button onClick={() => toggleVerified(l)} title={l.isVerified ? 'ביטול אימות' : 'אימות'}
                          className={`p-1.5 rounded-lg transition ${l.isVerified ? 'hover:bg-red-50 text-green-600' : 'hover:bg-green-50 text-gray-400'}`}>
                          <CheckCircle className="w-4 h-4" />
                        </button>
                        <button onClick={() => toggleActive(l)} title={l.isActive ? 'הסתרה' : 'הפעלה'}
                          className={`p-1.5 rounded-lg transition ${l.isActive ? 'hover:bg-red-50 text-legal-danger' : 'hover:bg-green-50 text-green-600'}`}>
                          {l.isActive ? <XCircle className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {editingLawyer && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 overflow-y-auto py-8">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl mx-4">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-bold text-primary">עריכת כרטיס - {editingLawyer.fullName}</h2>
              <button onClick={closeEdit} className="p-1 rounded-lg hover:bg-gray-100 text-gray-400"><X className="w-5 h-5" /></button>
            </div>

            <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">
              {/* Profile Image + Basic Info */}
              <div className="flex flex-col sm:flex-row gap-5">
                <div className="flex-shrink-0">
                  <label className="block text-sm font-medium text-gray-700 mb-1">תמונת פרופיל</label>
                  {profileImage ? (
                    <div className="relative group w-[120px]">
                      <img src={profileImage} alt="" className="w-[120px] h-[120px] rounded-lg object-cover border" />
                      <button type="button" onClick={() => setProfileImage(null)}
                        className="absolute top-1 left-1 rounded-full bg-legal-danger p-1 text-white opacity-0 group-hover:opacity-100 transition-opacity">
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ) : (
                    <button type="button" onClick={() => profileRef.current?.click()}
                      className="w-[120px] h-[120px] rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center text-gray-400 hover:border-accent hover:text-accent transition cursor-pointer bg-gray-50">
                      <Plus className="w-6 h-6" /><span className="text-xs mt-1">העלאה</span>
                    </button>
                  )}
                  <input ref={profileRef} type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, setProfileImage)} />
                </div>
                <div className="flex-1 grid gap-3 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">שם מלא</label>
                    <input type="text" value={form.fullName} onChange={(e) => updateField('fullName', e.target.value)}
                      className="w-full rounded-lg border border-gray-300 py-2 px-3 text-sm focus:border-accent focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">טלפון</label>
                    <input type="tel" value={form.phone} onChange={(e) => updateField('phone', e.target.value)}
                      className="w-full rounded-lg border border-gray-300 py-2 px-3 text-sm focus:border-accent focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">אימייל</label>
                    <input type="email" value={form.email} onChange={(e) => updateField('email', e.target.value)}
                      className="w-full rounded-lg border border-gray-300 py-2 px-3 text-sm focus:border-accent focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">WhatsApp</label>
                    <input type="tel" value={form.whatsapp} onChange={(e) => updateField('whatsapp', e.target.value)}
                      className="w-full rounded-lg border border-gray-300 py-2 px-3 text-sm focus:border-accent focus:outline-none" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-medium text-gray-600 mb-1">אתר אינטרנט</label>
                    <input type="url" value={form.website} onChange={(e) => updateField('website', e.target.value)}
                      className="w-full rounded-lg border border-gray-300 py-2 px-3 text-sm focus:border-accent focus:outline-none" />
                  </div>
                </div>
              </div>

              {/* Location */}
              <div className="grid gap-3 sm:grid-cols-3">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">עיר</label>
                  <select value={form.city} onChange={(e) => updateField('city', e.target.value)}
                    className="w-full rounded-lg border border-gray-300 py-2 px-3 text-sm focus:border-accent focus:outline-none">
                    <option value="">בחרו עיר</option>
                    {CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">כתובת</label>
                  <input type="text" value={form.address} onChange={(e) => updateField('address', e.target.value)}
                    className="w-full rounded-lg border border-gray-300 py-2 px-3 text-sm focus:border-accent focus:outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">מחוז</label>
                  <select value={form.courtDistrict} onChange={(e) => updateField('courtDistrict', e.target.value)}
                    className="w-full rounded-lg border border-gray-300 py-2 px-3 text-sm focus:border-accent focus:outline-none">
                    <option value="">בחרו מחוז</option>
                    {['מרכז', 'תל אביב', 'ירושלים', 'חיפה', 'צפון', 'דרום', 'באר שבע'].map((d) => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
              </div>

              {/* Professional */}
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">שנות ניסיון</label>
                  <input type="number" min="0" max="60" value={form.yearsExperience} onChange={(e) => updateField('yearsExperience', e.target.value)}
                    className="w-full rounded-lg border border-gray-300 py-2 px-3 text-sm focus:border-accent focus:outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">השכלה</label>
                  <input type="text" value={form.education} onChange={(e) => updateField('education', e.target.value)}
                    className="w-full rounded-lg border border-gray-300 py-2 px-3 text-sm focus:border-accent focus:outline-none" />
                </div>
              </div>

              {/* Specializations */}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-2">תחומי התמחות</label>
                <div className="flex flex-wrap gap-1.5">
                  {SPECIALIZATIONS.map((s) => (
                    <button key={s} type="button" onClick={() => toggleSpec(s)}
                      className={`rounded-full px-2.5 py-1 text-xs font-medium transition ${
                        form.specializations.includes(s) ? 'bg-accent text-[#072a42]' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}>
                      {form.specializations.includes(s) ? '\u2713 ' : ''}{s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Bio */}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">תיאור מקצועי</label>
                <textarea value={form.bio} onChange={(e) => updateField('bio', e.target.value)} rows={3}
                  className="w-full rounded-lg border border-gray-300 py-2 px-3 text-sm focus:border-accent focus:outline-none resize-none" />
              </div>

              {/* Cover Image */}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">תמונת קאבר</label>
                {coverImage ? (
                  <div className="relative group">
                    <img src={coverImage} alt="" className="w-full h-32 object-cover rounded-lg border" />
                    <button type="button" onClick={() => setCoverImage(null)}
                      className="absolute top-2 left-2 rounded-full bg-legal-danger p-1 text-white opacity-0 group-hover:opacity-100 transition-opacity">
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ) : (
                  <button type="button" onClick={() => coverRef.current?.click()}
                    className="w-full h-24 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-400 hover:border-accent hover:text-accent transition cursor-pointer bg-gray-50">
                    <Plus className="w-5 h-5 ml-2" /><span className="text-sm">העלאת תמונת קאבר</span>
                  </button>
                )}
                <input ref={coverRef} type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, setCoverImage)} />
              </div>

              {/* Gallery */}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">גלריה ({galleryImages.length}/10)</label>
                <div className="grid grid-cols-5 gap-2">
                  {galleryImages.map((img, i) => (
                    <div key={i} className="relative group aspect-square">
                      <img src={img} alt="" className="w-full h-full object-cover rounded-lg border" />
                      <button type="button" onClick={() => setGalleryImages((prev) => prev.filter((_, idx) => idx !== i))}
                        className="absolute top-1 left-1 rounded-full bg-legal-danger p-0.5 text-white opacity-0 group-hover:opacity-100 transition-opacity">
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                  {galleryImages.length < 10 && (
                    <button type="button" onClick={() => galleryRef.current?.click()}
                      className="aspect-square rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center text-gray-400 hover:border-accent hover:text-accent transition cursor-pointer bg-gray-50">
                      <Plus className="w-5 h-5" />
                    </button>
                  )}
                </div>
                <input ref={galleryRef} type="file" accept="image/*" multiple className="hidden" onChange={handleGalleryUpload} />
              </div>

              {message && (
                <div className={`rounded-lg p-3 text-sm ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                  {message.text}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-2xl">
              <button onClick={closeEdit} className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 transition">ביטול</button>
              <button onClick={handleSave} disabled={saving}
                className="flex items-center gap-2 px-6 py-2.5 bg-accent text-[#072a42] text-sm font-bold rounded-lg hover:bg-accent-light transition disabled:opacity-50">
                <Save className="w-4 h-4" />
                {saving ? 'שומר...' : 'שמירת שינויים'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
