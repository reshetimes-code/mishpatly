import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getLawyerBySlug, getReviewsByLawyerId } from '@/lib/lawyer-store';
import ReviewSection from './ReviewSection';

function StarRating({ rating, size = 'text-lg' }: { rating: number; size?: string }) {
  return (
    <span className={size}>
      {[1, 2, 3, 4, 5].map((i) => (
        <span key={i} className={i <= Math.round(rating) ? 'text-accent' : 'text-gray-300'}>&#9733;</span>
      ))}
    </span>
  );
}

export default async function LawyerProfilePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug: rawSlug } = await params;
  const slug = decodeURIComponent(rawSlug);
  const lawyer = await getLawyerBySlug(slug);

  if (!lawyer) {
    notFound();
  }

  const reviews = await getReviewsByLawyerId(lawyer.id);

  return (
    <div dir="rtl" className="min-h-screen bg-legal-bg text-legal-text">
      {/* Breadcrumbs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 py-3 sm:px-6">
          <nav className="text-sm text-gray-500">
            <Link href="/" className="hover:text-accent transition-colors">דף הבית</Link>
            <span className="mx-2">&gt;</span>
            <Link href="/lawyers" className="hover:text-accent transition-colors">פורטל עורכי דין</Link>
            <span className="mx-2">&gt;</span>
            <span className="text-legal-text font-medium">{lawyer.fullName}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8 sm:px-6">
        <div className="grid gap-6 lg:grid-cols-3">
          {/* ===== Main Profile Card ===== */}
          <div className="lg:col-span-2 space-y-6">
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="flex items-start gap-4 mb-4">
                {lawyer.profileImage ? (
                  <img
                    src={lawyer.profileImage}
                    alt={lawyer.fullName}
                    className="w-20 h-20 rounded-full object-cover shrink-0 border-2 border-gray-200"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-primary-light flex items-center justify-center text-white text-3xl font-bold shrink-0">
                    {lawyer.fullName.charAt(0)}
                  </div>
                )}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h1 className="text-2xl font-extrabold text-primary">{lawyer.fullName}</h1>
                    {lawyer.isVerified && (
                      <span className="rounded-full bg-legal-green/10 px-2.5 py-0.5 text-xs font-semibold text-legal-green">&#10003; מאומת</span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 mb-2">רישיון מספר {lawyer.licenseNumber}</p>
                  <div className="flex items-center gap-2">
                    <StarRating rating={lawyer.rating} />
                    <span className="text-sm text-gray-500">({lawyer.reviewCount} המלצות)</span>
                  </div>
                </div>
              </div>

              {/* Specializations */}
              <div className="flex flex-wrap gap-2 mb-4">
                {lawyer.specializations.map((s: string) => (
                  <span key={s} className="rounded-full bg-accent/10 px-3 py-1 text-sm font-medium text-accent">{s}</span>
                ))}
              </div>

              {/* Bio */}
              {lawyer.bio && (
                <div className="mb-4">
                  <h2 className="text-sm font-bold text-primary mb-2">אודות</h2>
                  <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">{lawyer.bio}</p>
                </div>
              )}

              {/* Details */}
              <div className="grid grid-cols-2 gap-3 text-sm">
                {lawyer.yearsExperience > 0 && (
                  <div className="flex items-center gap-2">
                    <span className="text-gray-400">&#128188;</span>
                    <span>{lawyer.yearsExperience} שנות ניסיון</span>
                  </div>
                )}
                {lawyer.education && (
                  <div className="flex items-center gap-2">
                    <span className="text-gray-400">&#127891;</span>
                    <span>{lawyer.education}</span>
                  </div>
                )}
                {lawyer.courtDistrict && (
                  <div className="flex items-center gap-2">
                    <span className="text-gray-400">&#9878;</span>
                    <span>מחוז {lawyer.courtDistrict}</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <span className="text-gray-400">&#128205;</span>
                  <span>{lawyer.city}{lawyer.address ? `, ${lawyer.address}` : ''}</span>
                </div>
              </div>
            </div>

            {/* Gallery */}
            {lawyer.galleryImages && lawyer.galleryImages.length > 0 && (
              <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                <h2 className="text-lg font-bold text-primary mb-4">גלריה</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {lawyer.galleryImages.map((img: string, i: number) => (
                    <img key={i} src={img} alt={`${lawyer.fullName} - תמונה ${i + 1}`} className="rounded-lg object-cover w-full h-32" />
                  ))}
                </div>
              </div>
            )}

            {/* Reviews */}
            <ReviewSection
              lawyerId={lawyer.id}
              initialReviews={reviews.map((r) => ({
                id: r.id,
                reviewerName: r.reviewerName,
                rating: r.rating,
                text: r.text,
                createdAt: r.createdAt.toISOString(),
              }))}
            />
          </div>

          {/* ===== Contact Sidebar ===== */}
          <div className="space-y-4">
            <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm sticky top-24">
              <h3 className="text-sm font-bold text-primary mb-4">יצירת קשר</h3>

              <div className="space-y-3">
                {lawyer.phone && (
                  <a
                    href={`tel:${lawyer.phone}`}
                    className="flex items-center gap-3 rounded-lg bg-primary p-3 text-white text-sm font-medium transition-colors hover:bg-primary-light"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    {lawyer.phone}
                  </a>
                )}

                {lawyer.whatsapp && (
                  <a
                    href={`https://wa.me/972${lawyer.whatsapp.replace(/^0/, '').replace(/[-\s]/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 rounded-lg bg-[#25D366] p-3 text-white text-sm font-medium transition-colors hover:bg-[#20bd5a]"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                      <path d="M12 0C5.373 0 0 5.373 0 12c0 2.146.562 4.158 1.547 5.898L.06 23.399a.5.5 0 00.611.617l5.584-1.44A11.94 11.94 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.932 0-3.778-.53-5.382-1.527l-.385-.234-3.335.86.894-3.264-.256-.404A9.96 9.96 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" />
                    </svg>
                    WhatsApp
                  </a>
                )}

                {lawyer.email && (
                  <a
                    href={`mailto:${lawyer.email}`}
                    className="flex items-center gap-3 rounded-lg border border-gray-300 p-3 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    {lawyer.email}
                  </a>
                )}

                {lawyer.website && (
                  <a
                    href={lawyer.website.startsWith('http') ? lawyer.website : `https://${lawyer.website}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 rounded-lg border border-gray-300 p-3 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                    </svg>
                    אתר אינטרנט
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
