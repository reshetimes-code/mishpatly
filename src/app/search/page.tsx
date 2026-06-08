import Link from "next/link";
import { prisma } from "@/lib/db";
import type { StoredJudgment } from "@/lib/judgment-store";

export const dynamic = "force-dynamic";

const ITEMS_PER_PAGE = 10;

function formatDate(dateStr: string) {
  if (!dateStr) return "";
  const [y, m, d] = dateStr.split("-");
  return d && m && y ? `${d}/${m}/${y}` : dateStr;
}

function dbToStored(j: {
  id: number; title: string; slug: string; caseNumber: string; courtName: string;
  procedureType: string | null; judgmentDate: Date; judge: string | null;
  plaintiff: string | null; defendant: string | null; parties: string | null;
  summary: string | null; fullText: string | null; sourceUrl: string | null;
  pdfUrl: string | null; sourceName: string | null; category: string | null;
  status: string; isIndexable: boolean; createdAt: Date; updatedAt: Date;
}): StoredJudgment {
  return {
    id: j.id, title: j.title, slug: j.slug, caseNumber: j.caseNumber,
    courtName: j.courtName, procedureType: j.procedureType || '',
    judgmentDate: j.judgmentDate.toISOString().split('T')[0],
    judge: j.judge || '', plaintiff: j.plaintiff || '', defendant: j.defendant || '',
    parties: j.parties || '', summary: j.summary || '', fullText: j.fullText || '',
    sourceUrl: j.sourceUrl || '', pdfUrl: j.pdfUrl || '', sourceName: j.sourceName || '',
    category: j.category || '', status: j.status as StoredJudgment['status'],
    isIndexable: j.isIndexable,
    createdAt: j.createdAt.toISOString(), updatedAt: j.updatedAt.toISOString(),
  };
}

function getFilterOptions(judgments: StoredJudgment[]) {
  const courts = Array.from(new Set(judgments.map((j) => j.courtName).filter(Boolean))).sort();
  const procedureTypes = Array.from(new Set(judgments.map((j) => j.procedureType).filter(Boolean))).sort();
  const years = Array.from(new Set(judgments.map((j) => j.judgmentDate?.slice(0, 4)).filter(Boolean))).sort((a, b) => b.localeCompare(a));
  const categories = Array.from(new Set(judgments.map((j) => j.category).filter(Boolean))).sort();
  const sources = Array.from(new Set(judgments.map((j) => j.sourceName).filter(Boolean))).sort();
  const judges = Array.from(new Set(judgments.map((j) => j.judge).filter(Boolean))).sort();
  return { courts, procedureTypes, years, categories, sources, judges };
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{
    q?: string;
    court?: string;
    year?: string;
    procedure?: string;
    category?: string;
    source?: string;
    judge?: string;
    page?: string;
    sort?: string;
    advanced?: string;
  }>;
}) {
  const params = await searchParams;
  const query = params.q ?? "";
  const courtFilter = params.court ?? "";
  const yearFilter = params.year ?? "";
  const procedureFilter = params.procedure ?? "";
  const categoryFilter = params.category ?? "";
  const sourceFilter = params.source ?? "";
  const judgeFilter = params.judge ?? "";
  const currentPage = Math.max(1, parseInt(params.page ?? "1", 10) || 1);
  const sortByDate = params.sort === "date";
  const isAdvanced = params.advanced === "true";

  // Always read from DB directly - never from cache
  const dbJudgments = await prisma.judgment.findMany({ orderBy: { judgmentDate: 'desc' } });
  const allJudgments = dbJudgments.map(dbToStored);

  const { courts: allCourts, procedureTypes: allProcedureTypes, years: allYears, categories: allCategories, sources: allSources, judges: allJudges } = getFilterOptions(allJudgments);

  // Apply filters
  let filtered = allJudgments.filter((j) => j.status === "PUBLISHED");

  if (query) {
    const q = query.toLowerCase();
    filtered = filtered.filter(
      (j) =>
        j.title.toLowerCase().includes(q) ||
        j.caseNumber.toLowerCase().includes(q) ||
        j.summary.toLowerCase().includes(q) ||
        j.judge.toLowerCase().includes(q) ||
        j.plaintiff.toLowerCase().includes(q) ||
        j.defendant.toLowerCase().includes(q) ||
        j.category.toLowerCase().includes(q) ||
        j.parties.toLowerCase().includes(q)
    );
  }
  if (courtFilter) filtered = filtered.filter((j) => j.courtName === courtFilter);
  if (yearFilter) filtered = filtered.filter((j) => j.judgmentDate?.startsWith(yearFilter));
  if (procedureFilter) filtered = filtered.filter((j) => j.procedureType === procedureFilter);
  if (categoryFilter) filtered = filtered.filter((j) => j.category === categoryFilter);
  if (sourceFilter) filtered = filtered.filter((j) => j.sourceName === sourceFilter);
  if (judgeFilter) filtered = filtered.filter((j) => j.judge === judgeFilter);

  filtered.sort((a, b) => b.judgmentDate.localeCompare(a.judgmentDate));

  const totalResults = filtered.length;
  const totalPages = Math.max(1, Math.ceil(totalResults / ITEMS_PER_PAGE));
  const safePage = Math.min(currentPage, totalPages);
  const paginatedResults = filtered.slice(
    (safePage - 1) * ITEMS_PER_PAGE,
    safePage * ITEMS_PER_PAGE
  );

  function buildUrl(overrides: Record<string, string>) {
    const base: Record<string, string> = {};
    if (query) base.q = query;
    if (courtFilter) base.court = courtFilter;
    if (yearFilter) base.year = yearFilter;
    if (procedureFilter) base.procedure = procedureFilter;
    if (categoryFilter) base.category = categoryFilter;
    if (sourceFilter) base.source = sourceFilter;
    if (judgeFilter) base.judge = judgeFilter;
    if (sortByDate) base.sort = "date";
    if (isAdvanced) base.advanced = "true";
    const merged = { ...base, ...overrides };
    Object.keys(merged).forEach((k) => {
      if (!merged[k]) delete merged[k];
    });
    const qs = new URLSearchParams(merged).toString();
    return `/search${qs ? `?${qs}` : ""}`;
  }

  const hasActiveFilters = courtFilter || yearFilter || procedureFilter || categoryFilter || sourceFilter || judgeFilter;

  return (
    <div dir="rtl" className="min-h-screen bg-legal-bg text-legal-text">
      {/* ===== Breadcrumbs + Search ===== */}
      <div className="bg-white border-b border-gray-200">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <nav className="mb-3 text-sm text-gray-500">
            <Link href="/" className="hover:text-accent transition-colors">
              דף הבית
            </Link>
            <span className="mx-2">&gt;</span>
            <span className="text-legal-text font-medium">
              {isAdvanced ? "חיפוש מתקדם" : "פסקי דין"}
            </span>
          </nav>

          <h1 className="text-2xl font-bold text-primary mb-4">
            {isAdvanced ? "חיפוש מתקדם" : "פסקי דין"}
          </h1>

          <form
            action="/search"
            method="GET"
            className="flex flex-col gap-3 sm:flex-row sm:items-center"
          >
            <div className="relative flex-1">
              <input
                type="text"
                name="q"
                defaultValue={query}
                placeholder="חיפוש לפי מספר תיק, שם צד, שופט, נושא..."
                className="w-full rounded-lg border border-gray-300 bg-white py-2.5 pr-4 pl-10 text-sm focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
              />
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 103.5 10.5a7.5 7.5 0 0013.15 6.15z" />
                </svg>
              </span>
            </div>
            {isAdvanced && <input type="hidden" name="advanced" value="true" />}
            <button
              type="submit"
              className="rounded-lg bg-accent px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-accent/90"
            >
              חיפוש
            </button>
            {!isAdvanced && (
              <Link
                href={buildUrl({ advanced: "true" })}
                className="rounded-lg border border-accent px-4 py-2.5 text-sm font-medium text-accent transition-colors hover:bg-accent/10 text-center"
              >
                חיפוש מתקדם
              </Link>
            )}
          </form>

          {/* ===== Advanced Search Filters ===== */}
          {isAdvanced && (
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">בית משפט</label>
                <select name="court" defaultValue={courtFilter} className="w-full rounded-md border border-gray-300 bg-white py-2 px-3 text-sm focus:border-accent focus:outline-none" form="advanced-form">
                  <option value="">הכל</option>
                  {allCourts.map((c) => (<option key={c} value={c}>{c}</option>))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">שנה</label>
                <select name="year" defaultValue={yearFilter} className="w-full rounded-md border border-gray-300 bg-white py-2 px-3 text-sm focus:border-accent focus:outline-none" form="advanced-form">
                  <option value="">הכל</option>
                  {allYears.map((y) => (<option key={y} value={y}>{y}</option>))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">סוג הליך</label>
                <select name="procedure" defaultValue={procedureFilter} className="w-full rounded-md border border-gray-300 bg-white py-2 px-3 text-sm focus:border-accent focus:outline-none" form="advanced-form">
                  <option value="">הכל</option>
                  {allProcedureTypes.map((p) => (<option key={p} value={p}>{p}</option>))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">קטגוריה</label>
                <select name="category" defaultValue={categoryFilter} className="w-full rounded-md border border-gray-300 bg-white py-2 px-3 text-sm focus:border-accent focus:outline-none" form="advanced-form">
                  <option value="">הכל</option>
                  {allCategories.map((c) => (<option key={c} value={c}>{c}</option>))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">מקור</label>
                <select name="source" defaultValue={sourceFilter} className="w-full rounded-md border border-gray-300 bg-white py-2 px-3 text-sm focus:border-accent focus:outline-none" form="advanced-form">
                  <option value="">הכל</option>
                  {allSources.map((s) => (<option key={s} value={s}>{s}</option>))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">שופט/ת</label>
                <select name="judge" defaultValue={judgeFilter} className="w-full rounded-md border border-gray-300 bg-white py-2 px-3 text-sm focus:border-accent focus:outline-none" form="advanced-form">
                  <option value="">הכל</option>
                  {allJudges.map((j) => (<option key={j} value={j}>{j}</option>))}
                </select>
              </div>
            </div>
          )}

          <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-gray-600">
              {query ? (
                <>
                  נמצאו{" "}
                  <span className="font-bold text-legal-text">{totalResults}</span>{" "}
                  פסקי דין עבור &quot;
                  <span className="font-semibold text-primary">{query}</span>
                  &quot;
                </>
              ) : (
                <>
                  מוצגים{" "}
                  <span className="font-bold text-legal-text">{totalResults}</span>{" "}
                  פסקי דין
                </>
              )}
            </p>
            <Link
              href={buildUrl({ sort: sortByDate ? "" : "date", page: "1" })}
              className="inline-flex items-center gap-1 text-sm text-accent hover:underline"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 4h13M3 8h9m-9 4h6m4 0l4 4m0 0l4-4m-4 4V4" />
              </svg>
              {sortByDate ? "מיון ברירת מחדל" : "מיין לפי תאריך"}
            </Link>
          </div>
        </div>
      </div>

      {/* ===== Main Content ===== */}
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6 lg:flex-row">
          {/* ===== Filter Sidebar ===== */}
          <aside className="w-full shrink-0 lg:w-64 order-last lg:order-first">
            <details className="group rounded-lg border border-gray-200 bg-white lg:open" open>
              <summary className="cursor-pointer select-none px-4 py-3 text-sm font-bold text-primary lg:pointer-events-none lg:list-none">
                <span className="inline lg:hidden">סינון תוצאות &#x25BE;</span>
                <span className="hidden lg:inline">סינון תוצאות</span>
              </summary>

              <div className="space-y-5 px-4 pb-4">
                {allCourts.length > 0 && (
                  <div>
                    <h3 className="mb-2 text-sm font-semibold text-legal-text">בית משפט</h3>
                    <ul className="space-y-1.5 max-h-48 overflow-y-auto">
                      {allCourts.map((court) => (
                        <li key={court}>
                          <Link href={buildUrl({ court: courtFilter === court ? "" : court, page: "1" })} className={`block rounded px-2 py-1 text-sm transition-colors ${courtFilter === court ? "bg-accent/10 font-semibold text-accent" : "text-gray-700 hover:bg-gray-100"}`}>
                            {court}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {allCategories.length > 0 && (
                  <div>
                    <h3 className="mb-2 text-sm font-semibold text-legal-text">קטגוריה</h3>
                    <ul className="space-y-1.5">
                      {allCategories.map((cat) => (
                        <li key={cat}>
                          <Link href={buildUrl({ category: categoryFilter === cat ? "" : cat, page: "1" })} className={`block rounded px-2 py-1 text-sm transition-colors ${categoryFilter === cat ? "bg-accent/10 font-semibold text-accent" : "text-gray-700 hover:bg-gray-100"}`}>
                            {cat}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {allYears.length > 0 && (
                  <div>
                    <h3 className="mb-2 text-sm font-semibold text-legal-text">שנה</h3>
                    <ul className="space-y-1.5">
                      {allYears.map((year) => (
                        <li key={year}>
                          <Link href={buildUrl({ year: yearFilter === year ? "" : year, page: "1" })} className={`block rounded px-2 py-1 text-sm transition-colors ${yearFilter === year ? "bg-accent/10 font-semibold text-accent" : "text-gray-700 hover:bg-gray-100"}`}>
                            {year}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {allProcedureTypes.length > 0 && (
                  <div>
                    <h3 className="mb-2 text-sm font-semibold text-legal-text">סוג הליך</h3>
                    <ul className="space-y-1.5 max-h-48 overflow-y-auto">
                      {allProcedureTypes.map((proc) => (
                        <li key={proc}>
                          <Link href={buildUrl({ procedure: procedureFilter === proc ? "" : proc, page: "1" })} className={`block rounded px-2 py-1 text-sm transition-colors ${procedureFilter === proc ? "bg-accent/10 font-semibold text-accent" : "text-gray-700 hover:bg-gray-100"}`}>
                            {proc}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {allSources.length > 0 && (
                  <div>
                    <h3 className="mb-2 text-sm font-semibold text-legal-text">מקור</h3>
                    <ul className="space-y-1.5">
                      {allSources.map((src) => (
                        <li key={src}>
                          <Link href={buildUrl({ source: sourceFilter === src ? "" : src, page: "1" })} className={`block rounded px-2 py-1 text-sm transition-colors ${sourceFilter === src ? "bg-accent/10 font-semibold text-accent" : "text-gray-700 hover:bg-gray-100"}`}>
                            {src}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {hasActiveFilters && (
                  <Link
                    href={buildUrl({ court: "", year: "", procedure: "", category: "", source: "", judge: "", page: "1" })}
                    className="block text-center text-sm font-medium text-legal-danger hover:underline"
                  >
                    נקה סינון
                  </Link>
                )}
              </div>
            </details>
          </aside>

          {/* ===== Results Cards ===== */}
          <section className="flex-1 space-y-4">
            {paginatedResults.length === 0 ? (
              <div className="rounded-lg border border-gray-200 bg-white px-6 py-16 text-center">
                <p className="text-lg font-semibold text-gray-500">
                  {allJudgments.length === 0 ? "המאגר ריק - יש להפעיל סריקה מלוח הניהול" : "לא נמצאו תוצאות"}
                </p>
                <p className="mt-1 text-sm text-gray-400">
                  {allJudgments.length === 0
                    ? "עברו ללוח הניהול ולחצו על 'ייבוא יומי' להתחלת סריקה"
                    : "נסו לשנות את מילות החיפוש או להסיר מסננים"}
                </p>
              </div>
            ) : (
              paginatedResults.map((j) => (
                <article key={j.id} className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
                  <div className="mb-1 flex items-start justify-between gap-2">
                    <div>
                      <Link href={`/judgment/${j.slug}`} className="text-lg font-extrabold text-primary hover:text-accent transition-colors sm:text-xl">
                        {j.defendant || j.title}
                      </Link>
                      <span className="mr-2 mt-0.5 inline-block whitespace-nowrap rounded-full bg-accent/10 px-2.5 py-0.5 text-xs font-semibold text-accent">
                        {j.procedureType || j.category}
                      </span>
                    </div>
                    {j.sourceName && (
                      <span className="shrink-0 rounded bg-gray-100 px-2 py-0.5 text-xs text-gray-500">{j.sourceName}</span>
                    )}
                  </div>
                  <Link href={`/judgment/${j.slug}`} className="mb-2 block text-sm font-medium text-gray-600 hover:text-primary transition-colors">
                    {j.caseNumber && j.caseNumber !== j.title ? `${j.caseNumber} - ` : ""}{j.parties || j.title}
                  </Link>
                  <p className="mb-2 text-sm text-gray-500">
                    {j.courtName}
                    {j.judgmentDate && (<><span className="mx-2">|</span>{formatDate(j.judgmentDate)}</>)}
                    {j.judge && (<><span className="mx-2">|</span>{j.judge}</>)}
                  </p>
                  <p className="mb-3 line-clamp-3 text-sm leading-relaxed text-gray-700">{j.summary}</p>
                  {j.category && (
                    <div className="mb-4 flex flex-wrap gap-1.5">
                      <span className="rounded bg-gray-100 px-2 py-0.5 text-xs text-gray-600">{j.category}</span>
                    </div>
                  )}
                  <div className="flex flex-wrap gap-2">
                    <Link href={`/judgment/${j.slug}`} className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-accent/90">
                      לצפייה במסמך
                    </Link>
                    {j.sourceUrl && (
                      <a href={j.sourceUrl} target="_blank" rel="noopener noreferrer" className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50">
                        מקור
                      </a>
                    )}
                    {j.pdfUrl && (
                      <a href={j.pdfUrl} target="_blank" rel="noopener noreferrer" className="rounded-md border border-legal-green px-4 py-2 text-sm font-medium text-legal-green transition-colors hover:bg-legal-green hover:text-white">
                        הורד PDF
                      </a>
                    )}
                    <Link href={`/removal-request?doc=${j.slug}`} className="rounded-md border border-legal-danger px-4 py-2 text-sm font-medium text-legal-danger transition-colors hover:bg-legal-danger hover:text-white">
                      בקשת הסרה
                    </Link>
                  </div>
                </article>
              ))
            )}

            {/* ===== Pagination ===== */}
            {totalPages > 1 && (
              <nav className="flex items-center justify-center gap-1 pt-4">
                {safePage > 1 ? (
                  <Link href={buildUrl({ page: String(safePage - 1) })} className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-50">
                    הקודם
                  </Link>
                ) : (
                  <span className="rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-400 cursor-not-allowed">הקודם</span>
                )}
                {(() => {
                  const pages: number[] = [];
                  let start = Math.max(1, safePage - 3);
                  let end = Math.min(totalPages, safePage + 3);
                  if (end - start < 6) {
                    if (start === 1) end = Math.min(totalPages, 7);
                    else start = Math.max(1, end - 6);
                  }
                  for (let i = start; i <= end; i++) pages.push(i);
                  return pages;
                })().map((p) => (
                  <Link key={p} href={buildUrl({ page: String(p) })} className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${p === safePage ? "bg-primary text-white" : "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"}`}>
                    {p}
                  </Link>
                ))}
                {safePage < totalPages ? (
                  <Link href={buildUrl({ page: String(safePage + 1) })} className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-50">
                    הבא
                  </Link>
                ) : (
                  <span className="rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-400 cursor-not-allowed">הבא</span>
                )}
              </nav>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
