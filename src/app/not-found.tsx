import Link from 'next/link';

export default function NotFound() {
  return (
    <div dir="rtl" className="min-h-[70vh] flex items-center justify-center bg-legal-bg px-4">
      <div className="w-full max-w-2xl text-center">
        {/* 404 Visual */}
        <div className="mb-8">
          <span className="text-8xl font-extrabold text-primary/20 select-none sm:text-9xl">
            404
          </span>
        </div>

        <h1 className="mb-3 text-3xl font-bold text-primary sm:text-4xl">
          הדף לא נמצא
        </h1>
        <p className="mb-8 text-gray-600 leading-relaxed">
          מצטערים, הדף שחיפשתם לא קיים או שהכתובת השתנתה.
          <br />
          נסו לחפש את מה שאתם מחפשים באמצעות שורת החיפוש:
        </p>

        {/* Search Bar */}
        <form
          action="/search"
          method="GET"
          className="mx-auto mb-10 flex max-w-lg flex-col gap-3 sm:flex-row"
        >
          <div className="relative flex-1">
            <input
              type="text"
              name="q"
              placeholder="חיפוש פסקי דין, שמות, מספרי תיק..."
              className="w-full rounded-lg border border-gray-300 bg-white py-3 pr-4 pl-10 text-sm focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
            />
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 103.5 10.5a7.5 7.5 0 0013.15 6.15z"
                />
              </svg>
            </span>
          </div>
          <button
            type="submit"
            className="rounded-lg bg-accent px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-accent/90"
          >
            חיפוש
          </button>
        </form>

        {/* Popular Links */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-bold text-primary">
            דפים מומלצים
          </h2>
          <div className="grid gap-3 sm:grid-cols-2">
            <Link
              href="/"
              className="flex items-center gap-2 rounded-lg border border-gray-100 px-4 py-3 text-sm font-medium text-legal-text transition-colors hover:border-accent hover:bg-accent/5 hover:text-accent"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0h4" />
              </svg>
              דף הבית
            </Link>
            <Link
              href="/search"
              className="flex items-center gap-2 rounded-lg border border-gray-100 px-4 py-3 text-sm font-medium text-legal-text transition-colors hover:border-accent hover:bg-accent/5 hover:text-accent"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 103.5 10.5a7.5 7.5 0 0013.15 6.15z" />
              </svg>
              חיפוש פסקי דין
            </Link>
            <Link
              href="/articles"
              className="flex items-center gap-2 rounded-lg border border-gray-100 px-4 py-3 text-sm font-medium text-legal-text transition-colors hover:border-accent hover:bg-accent/5 hover:text-accent"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              מאמרים משפטיים
            </Link>
            <Link
              href="/removal-request"
              className="flex items-center gap-2 rounded-lg border border-gray-100 px-4 py-3 text-sm font-medium text-legal-text transition-colors hover:border-accent hover:bg-accent/5 hover:text-accent"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              בקשת הסרת אזכור
            </Link>
            <Link
              href="/contact"
              className="flex items-center gap-2 rounded-lg border border-gray-100 px-4 py-3 text-sm font-medium text-legal-text transition-colors hover:border-accent hover:bg-accent/5 hover:text-accent"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              צור קשר
            </Link>
            <Link
              href="/search/piskei-din"
              className="flex items-center gap-2 rounded-lg border border-gray-100 px-4 py-3 text-sm font-medium text-legal-text transition-colors hover:border-accent hover:bg-accent/5 hover:text-accent"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              מאגר פסקי דין
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
