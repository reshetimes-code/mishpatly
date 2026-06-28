'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { SPECIALIZATIONS, CITIES } from '@/lib/lawyer-constants';

function ImageUploadBox({
  label,
  description,
  image,
  onSelect,
  onRemove,
  aspect,
}: {
  label: string;
  description: string;
  image: string | null;
  onSelect: (dataUrl: string) => void;
  onRemove: () => void;
  aspect: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      alert('הקובץ גדול מדי. גודל מקסימלי: 5MB');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => onSelect(reader.result as string);
    reader.readAsDataURL(file);
  }

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <p className="text-xs text-gray-400 mb-2">{description}</p>
      {image ? (
        <div className="relative group">
          <div className={`relative overflow-hidden rounded-lg border border-gray-200 ${aspect}`}>
            <img src={image} alt={label} className="w-full h-full object-cover" />
          </div>
          <button
            type="button"
            onClick={onRemove}
            className="absolute top-2 left-2 rounded-full bg-legal-danger p-1.5 text-white opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className={`w-full rounded-lg border-2 border-dashed border-gray-300 ${aspect} flex flex-col items-center justify-center gap-2 text-gray-400 hover:border-accent hover:text-accent transition-colors cursor-pointer bg-gray-50`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span className="text-sm font-medium">לחצו להעלאת תמונה</span>
          <span className="text-xs">JPG, PNG - עד 5MB</span>
        </button>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleFile}
        className="hidden"
      />
    </div>
  );
}

function GalleryUpload({
  images,
  onAdd,
  onRemove,
}: {
  images: string[];
  onAdd: (dataUrl: string) => void;
  onRemove: (index: number) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  function handleFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files) return;
    const remaining = 10 - images.length;
    const toProcess = Array.from(files).slice(0, remaining);
    for (const file of toProcess) {
      if (file.size > 5 * 1024 * 1024) continue;
      const reader = new FileReader();
      reader.onload = () => onAdd(reader.result as string);
      reader.readAsDataURL(file);
    }
    e.target.value = '';
  }

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        גלריה ({images.length}/10)
      </label>
      <p className="text-xs text-gray-400 mb-2">תמונות מהמשרד, מאירועים מקצועיים, תעודות וכד&apos;</p>
      <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
        {images.map((img, i) => (
          <div key={i} className="relative group aspect-square">
            <img src={img} alt={`גלריה ${i + 1}`} className="w-full h-full object-cover rounded-lg border border-gray-200" />
            <button
              type="button"
              onClick={() => onRemove(i)}
              className="absolute top-1 left-1 rounded-full bg-legal-danger p-1 text-white opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        ))}
        {images.length < 10 && (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="aspect-square rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center text-gray-400 hover:border-accent hover:text-accent transition-colors cursor-pointer bg-gray-50"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            <span className="text-xs mt-1">הוסף</span>
          </button>
        )}
      </div>
      <input ref={inputRef} type="file" accept="image/jpeg,image/png,image/webp" multiple onChange={handleFiles} className="hidden" />
    </div>
  );
}

interface LawyerData {
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
}

export default function LawyerEditPage() {
  const params = useParams();
  const router = useRouter();
  const slug = decodeURIComponent(params.slug as string);

  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState('');
  const [lawyer, setLawyer] = useState<LawyerData | null>(null);

  const [form, setForm] = useState({
    fullName: '',
    phone: '',
    email: '',
    city: '',
    address: '',
    courtDistrict: '',
    yearsExperience: '',
    education: '',
    bio: '',
    website: '',
    whatsapp: '',
    specializations: [] as string[],
  });
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [coverImage, setCoverImage] = useState<string | null>(null);
  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  // Verify JWT token and load lawyer data
  useEffect(() => {
    async function load() {
      const token = localStorage.getItem('lawyerToken');
      if (!token) {
        setAuthError('יש להתחבר כדי לערוך את הכרטיס');
        setLoading(false);
        return;
      }

      // Find lawyer by slug
      const res = await fetch(`/api/lawyers/${encodeURIComponent(slug)}`);
      if (!res.ok) {
        setAuthError('הכרטיס לא נמצא');
        setLoading(false);
        return;
      }
      const found = await res.json() as LawyerData | null;

      if (!found) {
        setAuthError('הכרטיס לא נמצא');
        setLoading(false);
        return;
      }

      // Verify the token belongs to this lawyer by checking stored slug
      const storedSlug = localStorage.getItem('lawyerSlug');
      if (storedSlug !== slug) {
        setAuthError('אין הרשאה לערוך כרטיס זה');
        setLoading(false);
        return;
      }

      setLawyer(found);
      const l = found;
      setForm({
        fullName: l.fullName || '',
        phone: l.phone || '',
        email: l.email || '',
        city: l.city || '',
        address: l.address || '',
        courtDistrict: l.courtDistrict || '',
        yearsExperience: l.yearsExperience ? String(l.yearsExperience) : '',
        education: l.education || '',
        bio: l.bio || '',
        website: l.website || '',
        whatsapp: l.whatsapp || '',
        specializations: l.specializations || [],
      });
      setProfileImage(l.profileImage || null);
      setCoverImage(l.coverImage || null);
      setGalleryImages(l.galleryImages || []);
      setLoading(false);
    }
    load();
  }, [slug]);

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

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!lawyer) return;
    setSubmitting(true);
    setError('');

    try {
      const token = localStorage.getItem('lawyerToken');
      const res = await fetch(`/api/lawyers/${lawyer.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          ...form,
          profileImage: profileImage || '',
          coverImage: coverImage || '',
          galleryImages,
        }),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setSuccess(true);
      } else {
        setError(data.error || 'שגיאה בעדכון');
      }
    } catch {
      setError('שגיאה בשליחת הטופס');
    }
    setSubmitting(false);
  }

  // Success screen
  if (success) {
    return (
      <div dir="rtl" className="min-h-screen bg-legal-bg flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-2xl p-8 shadow-lg text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-legal-green/10 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-legal-green" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-primary mb-2">הכרטיס עודכן בהצלחה!</h1>
          <p className="text-gray-600 mb-6">השינויים נשמרו ומופיעים כעת בפורטל.</p>
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link href={`/lawyers/${slug}`} className="rounded-lg bg-primary px-6 py-2.5 text-sm font-medium text-white hover:bg-primary-light transition-colors">
              צפייה בכרטיס
            </Link>
            <Link href="/lawyers" className="rounded-lg border border-gray-300 px-6 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
              לפורטל עורכי הדין
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Loading
  if (loading) {
    return (
      <div dir="rtl" className="min-h-screen bg-legal-bg flex items-center justify-center">
        <div className="animate-pulse text-primary text-lg">טוען...</div>
      </div>
    );
  }

  // Auth error
  if (authError) {
    return (
      <div dir="rtl" className="min-h-screen bg-legal-bg flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-2xl p-8 shadow-lg text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-legal-danger/10 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-legal-danger" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h1 className="text-xl font-bold text-primary mb-2">{authError}</h1>
          <p className="text-gray-600 mb-6">יש להתחבר לחשבון כדי לערוך את כרטיס הביקור.</p>
          <Link href="/lawyers/login" className="inline-block rounded-lg bg-accent px-6 py-2.5 text-sm font-bold text-[#072a42] hover:bg-accent-light transition-colors">
            כניסה לחשבון
          </Link>
        </div>
      </div>
    );
  }

  // Edit form
  return (
    <div dir="rtl" className="min-h-screen bg-legal-bg text-legal-text">
      <div className="bg-gradient-to-bl from-[#0B3C5D] via-[#072a42] to-[#0B3C5D] text-white py-10">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h1 className="text-3xl font-extrabold mb-2">עריכת <span className="text-gradient-gold">כרטיס ביקור</span></h1>
          <p className="text-blue-200">עדכנו את הפרטים שלכם בפורטל עורכי הדין</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-8">
        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Personal Info */}
          <div className="rounded-xl border border-gray-200 bg-white p-6">
            <div className="flex items-center gap-3 mb-1">
              <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold">1</span>
              <h2 className="text-lg font-bold text-primary">פרטים אישיים</h2>
            </div>
            <p className="text-xs text-gray-400 mb-5 mr-11">מידע בסיסי לזיהוי וליצירת קשר</p>

            <div className="flex flex-col sm:flex-row gap-6 mb-6">
              <div className="flex-shrink-0 mx-auto sm:mx-0">
                <ImageUploadBox
                  label="תמונת פרופיל"
                  description="מומלץ 400x400 פיקסלים"
                  image={profileImage}
                  onSelect={setProfileImage}
                  onRemove={() => setProfileImage(null)}
                  aspect="aspect-square w-[140px]"
                />
              </div>
              <div className="flex-1 grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">שם מלא *</label>
                  <input type="text" required value={form.fullName} onChange={(e) => updateField('fullName', e.target.value)}
                    className="w-full rounded-lg border border-gray-300 py-2.5 px-3 text-sm focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">טלפון *</label>
                  <input type="tel" required value={form.phone} onChange={(e) => updateField('phone', e.target.value)}
                    className="w-full rounded-lg border border-gray-300 py-2.5 px-3 text-sm focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">אימייל *</label>
                  <input type="email" required value={form.email} onChange={(e) => updateField('email', e.target.value)}
                    className="w-full rounded-lg border border-gray-300 py-2.5 px-3 text-sm focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp</label>
                  <input type="tel" value={form.whatsapp} onChange={(e) => updateField('whatsapp', e.target.value)}
                    className="w-full rounded-lg border border-gray-300 py-2.5 px-3 text-sm focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30" />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">אתר אינטרנט</label>
                  <input type="url" value={form.website} onChange={(e) => updateField('website', e.target.value)}
                    className="w-full rounded-lg border border-gray-300 py-2.5 px-3 text-sm focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30" placeholder="https://www.example.com" />
                </div>
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="rounded-xl border border-gray-200 bg-white p-6">
            <div className="flex items-center gap-3 mb-1">
              <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold">2</span>
              <h2 className="text-lg font-bold text-primary">מיקום המשרד</h2>
            </div>
            <p className="text-xs text-gray-400 mb-5 mr-11">כתובת ואזור פעילות</p>
            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">עיר *</label>
                <select required value={form.city} onChange={(e) => updateField('city', e.target.value)}
                  className="w-full rounded-lg border border-gray-300 py-2.5 px-3 text-sm focus:border-accent focus:outline-none">
                  <option value="">בחרו עיר</option>
                  {CITIES.map((c) => (<option key={c} value={c}>{c}</option>))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">כתובת משרד</label>
                <input type="text" value={form.address} onChange={(e) => updateField('address', e.target.value)}
                  className="w-full rounded-lg border border-gray-300 py-2.5 px-3 text-sm focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">מחוז בית משפט</label>
                <select value={form.courtDistrict} onChange={(e) => updateField('courtDistrict', e.target.value)}
                  className="w-full rounded-lg border border-gray-300 py-2.5 px-3 text-sm focus:border-accent focus:outline-none">
                  <option value="">בחרו מחוז</option>
                  <option value="מרכז">מרכז</option>
                  <option value="תל אביב">תל אביב</option>
                  <option value="ירושלים">ירושלים</option>
                  <option value="חיפה">חיפה</option>
                  <option value="צפון">צפון</option>
                  <option value="דרום">דרום</option>
                  <option value="באר שבע">באר שבע</option>
                </select>
              </div>
            </div>
          </div>

          {/* Professional */}
          <div className="rounded-xl border border-gray-200 bg-white p-6">
            <div className="flex items-center gap-3 mb-1">
              <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold">3</span>
              <h2 className="text-lg font-bold text-primary">פרטים מקצועיים</h2>
            </div>
            <p className="text-xs text-gray-400 mb-5 mr-11">ניסיון, השכלה ותחומי התמחות</p>
            <div className="grid gap-4 sm:grid-cols-2 mb-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">שנות ניסיון</label>
                <input type="number" min="0" max="60" value={form.yearsExperience} onChange={(e) => updateField('yearsExperience', e.target.value)}
                  className="w-full rounded-lg border border-gray-300 py-2.5 px-3 text-sm focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">השכלה</label>
                <input type="text" value={form.education} onChange={(e) => updateField('education', e.target.value)}
                  className="w-full rounded-lg border border-gray-300 py-2.5 px-3 text-sm focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30" />
              </div>
            </div>
            <div className="mb-5">
              <label className="block text-sm font-medium text-gray-700 mb-2">תחומי התמחות * (בחרו לפחות אחד)</label>
              <div className="flex flex-wrap gap-2">
                {SPECIALIZATIONS.map((s) => (
                  <button key={s} type="button" onClick={() => toggleSpec(s)}
                    className={`rounded-full px-3 py-1.5 text-sm font-medium transition-all ${
                      form.specializations.includes(s) ? 'bg-accent text-[#072a42] shadow-sm' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}>
                    {form.specializations.includes(s) ? '\u2713 ' : ''}{s}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">תיאור מקצועי</label>
              <textarea value={form.bio} onChange={(e) => updateField('bio', e.target.value)} rows={4}
                className="w-full rounded-lg border border-gray-300 py-2.5 px-3 text-sm focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30 resize-none"
                placeholder="ספרו על הניסיון המקצועי שלכם..." />
            </div>
          </div>

          {/* Media */}
          <div className="rounded-xl border border-gray-200 bg-white p-6">
            <div className="flex items-center gap-3 mb-1">
              <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold">4</span>
              <h2 className="text-lg font-bold text-primary">מדיה ותמונות</h2>
            </div>
            <p className="text-xs text-gray-400 mb-5 mr-11">תמונת קאבר וגלריה</p>
            <div className="mb-6">
              <ImageUploadBox label="תמונת קאבר" description="תמונה רחבה - מומלץ 1200x400 פיקסלים"
                image={coverImage} onSelect={setCoverImage} onRemove={() => setCoverImage(null)} aspect="aspect-[3/1]" />
            </div>
            <GalleryUpload images={galleryImages}
              onAdd={(url) => setGalleryImages((prev) => prev.length < 10 ? [...prev, url] : prev)}
              onRemove={(i) => setGalleryImages((prev) => prev.filter((_, idx) => idx !== i))} />
          </div>

          {error && (
            <div className="rounded-lg bg-legal-danger/10 p-4 text-sm text-legal-danger">{error}</div>
          )}

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <button type="submit" disabled={submitting}
              className="rounded-lg bg-accent px-8 py-3 text-sm font-bold text-[#072a42] transition-all hover:bg-accent-light hover:shadow-lg disabled:opacity-50">
              {submitting ? 'שומר...' : 'שמירת שינויים'}
            </button>
            <Link href={`/lawyers/${slug}`} className="text-sm text-gray-500 hover:text-accent transition-colors">
              ביטול וחזרה לכרטיס
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
