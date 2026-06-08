'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
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
    // Reset input
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

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        multiple
        onChange={handleFiles}
        className="hidden"
      />
    </div>
  );
}

export default function LawyerRegisterPage() {
  const [form, setForm] = useState({
    fullName: '',
    licenseNumber: '',
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
  const [logoImage, setLogoImage] = useState<string | null>(null);
  const [coverImage, setCoverImage] = useState<string | null>(null);
  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

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

  function addGalleryImage(dataUrl: string) {
    setGalleryImages((prev) => (prev.length < 10 ? [...prev, dataUrl] : prev));
  }

  function removeGalleryImage(index: number) {
    setGalleryImages((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const res = await fetch('/api/lawyers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          profileImage: logoImage || '',
          coverImage: coverImage || '',
          galleryImages,
        }),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setSuccess(true);
      } else {
        setError(data.error || 'שגיאה בהרשמה');
      }
    } catch {
      setError('שגיאה בשליחת הטופס');
    }
    setSubmitting(false);
  }

  if (success) {
    return (
      <div dir="rtl" className="min-h-screen bg-legal-bg flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-2xl p-8 shadow-lg text-center animate-fade-in-up">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-legal-green/10 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-legal-green" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-primary mb-2">ההרשמה התקבלה!</h1>
          <p className="text-gray-600 mb-6">
            הכרטיס שלכם נוצר בהצלחה ומופיע כעת בפורטל עורכי הדין.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link href="/lawyers" className="rounded-lg bg-primary px-6 py-2.5 text-sm font-medium text-white hover:bg-primary-light transition-colors">
              לפורטל עורכי הדין
            </Link>
            <Link href="/" className="rounded-lg border border-gray-300 px-6 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
              לדף הבית
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div dir="rtl" className="min-h-screen bg-legal-bg text-legal-text">
      {/* Header */}
      <div className="bg-gradient-to-bl from-[#0B3C5D] via-[#072a42] to-[#0B3C5D] text-white py-10">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h1 className="text-3xl font-extrabold mb-2">
            הצטרפו ל<span className="text-gradient-gold">פורטל עורכי הדין</span>
          </h1>
          <p className="text-blue-200">צרו כרטיס ביקור מקצועי וקבלו חשיפה ללקוחות חדשים</p>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-3xl mx-auto px-4 py-8">
        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Step 1 - Personal Info + Profile Image */}
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
                  image={logoImage}
                  onSelect={setLogoImage}
                  onRemove={() => setLogoImage(null)}
                  aspect="aspect-square w-[140px]"
                />
              </div>
              <div className="flex-1 grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">שם מלא *</label>
                  <input
                    type="text"
                    required
                    value={form.fullName}
                    onChange={(e) => updateField('fullName', e.target.value)}
                    className="w-full rounded-lg border border-gray-300 py-2.5 px-3 text-sm focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
                    placeholder="עו״ד ישראל ישראלי"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">מספר רישיון *</label>
                  <input
                    type="text"
                    required
                    value={form.licenseNumber}
                    onChange={(e) => updateField('licenseNumber', e.target.value)}
                    className="w-full rounded-lg border border-gray-300 py-2.5 px-3 text-sm focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
                    placeholder="12345"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">טלפון *</label>
                  <input
                    type="tel"
                    required
                    value={form.phone}
                    onChange={(e) => updateField('phone', e.target.value)}
                    className="w-full rounded-lg border border-gray-300 py-2.5 px-3 text-sm focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
                    placeholder="050-1234567"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">אימייל *</label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => updateField('email', e.target.value)}
                    className="w-full rounded-lg border border-gray-300 py-2.5 px-3 text-sm focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
                    placeholder="lawyer@example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp</label>
                  <input
                    type="tel"
                    value={form.whatsapp}
                    onChange={(e) => updateField('whatsapp', e.target.value)}
                    className="w-full rounded-lg border border-gray-300 py-2.5 px-3 text-sm focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
                    placeholder="050-1234567"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">אתר אינטרנט</label>
                  <input
                    type="url"
                    value={form.website}
                    onChange={(e) => updateField('website', e.target.value)}
                    className="w-full rounded-lg border border-gray-300 py-2.5 px-3 text-sm focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
                    placeholder="https://www.example.com"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Step 2 - Location */}
          <div className="rounded-xl border border-gray-200 bg-white p-6">
            <div className="flex items-center gap-3 mb-1">
              <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold">2</span>
              <h2 className="text-lg font-bold text-primary">מיקום המשרד</h2>
            </div>
            <p className="text-xs text-gray-400 mb-5 mr-11">כתובת ואזור פעילות</p>

            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">עיר *</label>
                <select
                  required
                  value={form.city}
                  onChange={(e) => updateField('city', e.target.value)}
                  className="w-full rounded-lg border border-gray-300 py-2.5 px-3 text-sm focus:border-accent focus:outline-none"
                >
                  <option value="">בחרו עיר</option>
                  {CITIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">כתובת משרד</label>
                <input
                  type="text"
                  value={form.address}
                  onChange={(e) => updateField('address', e.target.value)}
                  className="w-full rounded-lg border border-gray-300 py-2.5 px-3 text-sm focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
                  placeholder="רחוב הרצל 15"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">מחוז בית משפט</label>
                <select
                  value={form.courtDistrict}
                  onChange={(e) => updateField('courtDistrict', e.target.value)}
                  className="w-full rounded-lg border border-gray-300 py-2.5 px-3 text-sm focus:border-accent focus:outline-none"
                >
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

          {/* Step 3 - Professional */}
          <div className="rounded-xl border border-gray-200 bg-white p-6">
            <div className="flex items-center gap-3 mb-1">
              <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold">3</span>
              <h2 className="text-lg font-bold text-primary">פרטים מקצועיים</h2>
            </div>
            <p className="text-xs text-gray-400 mb-5 mr-11">ניסיון, השכלה ותחומי התמחות</p>

            <div className="grid gap-4 sm:grid-cols-2 mb-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">שנות ניסיון</label>
                <input
                  type="number"
                  min="0"
                  max="60"
                  value={form.yearsExperience}
                  onChange={(e) => updateField('yearsExperience', e.target.value)}
                  className="w-full rounded-lg border border-gray-300 py-2.5 px-3 text-sm focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">השכלה</label>
                <input
                  type="text"
                  value={form.education}
                  onChange={(e) => updateField('education', e.target.value)}
                  className="w-full rounded-lg border border-gray-300 py-2.5 px-3 text-sm focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
                  placeholder="LL.B אוניברסיטת תל אביב"
                />
              </div>
            </div>

            {/* Specializations */}
            <div className="mb-5">
              <label className="block text-sm font-medium text-gray-700 mb-2">תחומי התמחות * (בחרו לפחות אחד)</label>
              <div className="flex flex-wrap gap-2">
                {SPECIALIZATIONS.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => toggleSpec(s)}
                    className={`rounded-full px-3 py-1.5 text-sm font-medium transition-all ${
                      form.specializations.includes(s)
                        ? 'bg-accent text-[#072a42] shadow-sm'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {form.specializations.includes(s) ? '\u2713 ' : ''}{s}
                  </button>
                ))}
              </div>
            </div>

            {/* Bio */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">תיאור מקצועי</label>
              <textarea
                value={form.bio}
                onChange={(e) => updateField('bio', e.target.value)}
                rows={4}
                className="w-full rounded-lg border border-gray-300 py-2.5 px-3 text-sm focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30 resize-none"
                placeholder="ספרו על הניסיון המקצועי שלכם, תחומי עיסוק מרכזיים, הישגים מקצועיים..."
              />
            </div>
          </div>

          {/* Step 4 - Media */}
          <div className="rounded-xl border border-gray-200 bg-white p-6">
            <div className="flex items-center gap-3 mb-1">
              <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold">4</span>
              <h2 className="text-lg font-bold text-primary">מדיה ותמונות</h2>
            </div>
            <p className="text-xs text-gray-400 mb-5 mr-11">תמונת קאבר וגלריה לכרטיס המקצועי שלכם</p>

            <div className="mb-6">
              <ImageUploadBox
                label="תמונת קאבר"
                description="תמונה רחבה - מומלץ 1200x400 פיקסלים"
                image={coverImage}
                onSelect={setCoverImage}
                onRemove={() => setCoverImage(null)}
                aspect="aspect-[3/1]"
              />
            </div>

            <GalleryUpload
              images={galleryImages}
              onAdd={addGalleryImage}
              onRemove={removeGalleryImage}
            />
          </div>

          {error && (
            <div className="rounded-lg bg-legal-danger/10 p-4 text-sm text-legal-danger">
              {error}
            </div>
          )}

          {/* Submit */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <button
              type="submit"
              disabled={submitting}
              className="rounded-lg bg-accent px-8 py-3 text-sm font-bold text-[#072a42] transition-all hover:bg-accent-light hover:shadow-lg disabled:opacity-50"
            >
              {submitting ? 'שולח...' : 'צרו את הכרטיס שלי'}
            </button>
            <p className="text-xs text-gray-400">* שדות חובה. הכרטיס יופיע מיד בפורטל.</p>
          </div>
        </form>
      </div>
    </div>
  );
}
