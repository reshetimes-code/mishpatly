'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Mail, Phone, MapPin, Clock, Send } from 'lucide-react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const Swal = (await import('sweetalert2')).default;

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      await Swal.fire({
        icon: 'success',
        title: 'הודעתך נשלחה בהצלחה!',
        text: 'נחזור אליך בהקדם האפשרי.',
        confirmButtonText: 'סגור',
        confirmButtonColor: '#0B3C5D',
      });

      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
    } catch {
      await Swal.fire({
        icon: 'error',
        title: 'שגיאה בשליחה',
        text: 'אנא נסה שנית מאוחר יותר.',
        confirmButtonText: 'סגור',
        confirmButtonColor: '#B83232',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div dir="rtl" className="min-h-screen bg-[#F4F6F8]">
      {/* Breadcrumbs */}
      <nav className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center gap-2 text-sm text-gray-500">
          <Link href="/" className="hover:text-[#328CC1] transition-colors">
            דף הבית
          </Link>
          <span>/</span>
          <span className="text-[#1D2731] font-medium">צור קשר</span>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-10">
        <h1 className="text-3xl md:text-4xl font-bold text-[#0B3C5D] mb-8 text-center">
          צור קשר
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <form
              onSubmit={handleSubmit}
              className="bg-white rounded-xl shadow-md p-6 md:p-8 space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-semibold text-[#1D2731] mb-2"
                  >
                    שם מלא *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#328CC1] focus:border-transparent outline-none transition-all text-[#1D2731]"
                    placeholder="הזן את שמך המלא"
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-semibold text-[#1D2731] mb-2"
                  >
                    דוא&quot;ל *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#328CC1] focus:border-transparent outline-none transition-all text-[#1D2731]"
                    placeholder="your@email.com"
                    dir="ltr"
                  />
                </div>

                <div>
                  <label
                    htmlFor="phone"
                    className="block text-sm font-semibold text-[#1D2731] mb-2"
                  >
                    טלפון
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#328CC1] focus:border-transparent outline-none transition-all text-[#1D2731]"
                    placeholder="050-722-9966"
                    dir="ltr"
                  />
                </div>

                <div>
                  <label
                    htmlFor="subject"
                    className="block text-sm font-semibold text-[#1D2731] mb-2"
                  >
                    נושא *
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    required
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#328CC1] focus:border-transparent outline-none transition-all text-[#1D2731] bg-white"
                  >
                    <option value="">בחר נושא</option>
                    <option value="general">שאלה כללית</option>
                    <option value="removal">בקשת הסרה</option>
                    <option value="technical">תמיכה טכנית</option>
                    <option value="legal">ייעוץ משפטי</option>
                    <option value="other">אחר</option>
                  </select>
                </div>
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-semibold text-[#1D2731] mb-2"
                >
                  הודעה *
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={6}
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#328CC1] focus:border-transparent outline-none transition-all text-[#1D2731] resize-vertical"
                  placeholder="כתוב את הודעתך כאן..."
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full md:w-auto flex items-center justify-center gap-2 bg-[#0B3C5D] text-white px-8 py-3 rounded-lg font-semibold hover:bg-[#0a3350] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-5 h-5" />
                {isSubmitting ? 'שולח...' : 'שלח הודעה'}
              </button>
            </form>
          </div>

          {/* Contact Info Sidebar */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-md p-6 space-y-6">
              <h2 className="text-xl font-bold text-[#0B3C5D] border-b border-gray-200 pb-3">
                פרטי התקשרות
              </h2>

              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-[#328CC1] mt-1 shrink-0" />
                <div>
                  <h3 className="font-semibold text-[#1D2731] text-sm">כתובת</h3>
                  <p className="text-gray-600 text-sm">
                    דרך חיפה 19, קרית אתא
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-[#328CC1] mt-1 shrink-0" />
                <div>
                  <h3 className="font-semibold text-[#1D2731] text-sm">טלפון</h3>
                  <p className="text-gray-600 text-sm" dir="ltr">
                    050-722-9966
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-[#328CC1] mt-1 shrink-0" />
                <div>
                  <h3 className="font-semibold text-[#1D2731] text-sm">דוא&quot;ל</h3>
                  <p className="text-gray-600 text-sm" dir="ltr">
                    telaviv2u@gmail.com
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-[#328CC1] mt-1 shrink-0" />
                <div>
                  <h3 className="font-semibold text-[#1D2731] text-sm">שעות פעילות</h3>
                  <p className="text-gray-600 text-sm">ראשון - חמישי: 09:00 - 17:00</p>
                  <p className="text-gray-600 text-sm">שישי: 09:00 - 13:00</p>
                  <p className="text-gray-600 text-sm">שבת: סגור</p>
                </div>
              </div>
            </div>

            {/* Map Placeholder */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-bold text-[#0B3C5D] border-b border-gray-200 pb-3 mb-4">
                מיקום
              </h2>
              <div className="w-full h-48 bg-gray-200 rounded-lg flex items-center justify-center text-gray-500">
                <div className="text-center">
                  <MapPin className="w-10 h-10 mx-auto mb-2 text-gray-400" />
                  <p className="text-sm">מפה תוצג כאן</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
