'use client';

import { useState } from 'react';

interface Review {
  id: number;
  reviewerName: string;
  rating: number;
  text: string;
  createdAt: string;
}

function StarRating({ rating, size = 'text-lg' }: { rating: number; size?: string }) {
  return (
    <span className={size}>
      {[1, 2, 3, 4, 5].map((i) => (
        <span key={i} className={i <= Math.round(rating) ? 'text-accent' : 'text-gray-300'}>&#9733;</span>
      ))}
    </span>
  );
}

function StarInput({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const [hover, setHover] = useState(0);
  return (
    <span className="text-2xl cursor-pointer select-none">
      {[1, 2, 3, 4, 5].map((i) => (
        <span
          key={i}
          className={i <= (hover || value) ? 'text-accent' : 'text-gray-300'}
          onMouseEnter={() => setHover(i)}
          onMouseLeave={() => setHover(0)}
          onClick={() => onChange(i)}
        >
          &#9733;
        </span>
      ))}
    </span>
  );
}

export default function ReviewSection({ lawyerId, initialReviews }: { lawyerId: number; initialReviews: Review[] }) {
  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const [reviewerName, setReviewerName] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewText, setReviewText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [reviewMessage, setReviewMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  async function submitReview(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setReviewMessage(null);

    try {
      const res = await fetch(`/api/lawyers/${lawyerId}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reviewerName, rating: reviewRating, text: reviewText }),
      });
      const data = await res.json();

      if (data.approved) {
        setReviewMessage({ type: 'success', text: 'ההמלצה פורסמה בהצלחה! תודה.' });
        setReviewerName('');
        setReviewRating(5);
        setReviewText('');
        const revRes = await fetch(`/api/lawyers/${lawyerId}/reviews`);
        const revData = await revRes.json();
        setReviews(revData.reviews || []);
      } else {
        setReviewMessage({ type: 'error', text: data.reason || 'ההמלצה לא אושרה על ידי המערכת.' });
      }
    } catch {
      setReviewMessage({ type: 'error', text: 'שגיאה בשליחת ההמלצה' });
    }
    setSubmitting(false);
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-bold text-primary mb-4">
        המלצות ({reviews.length})
      </h2>

      {reviews.length === 0 ? (
        <p className="text-sm text-gray-400 text-center py-6">עדיין אין המלצות. היו הראשונים!</p>
      ) : (
        <div className="space-y-4">
          {reviews.map((r) => (
            <div key={r.id} className="border-b border-gray-100 pb-4 last:border-0 last:pb-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-semibold text-sm text-legal-text">{r.reviewerName}</span>
                <StarRating rating={r.rating} size="text-sm" />
              </div>
              <p className="text-sm text-gray-700">{r.text}</p>
              <p className="text-xs text-gray-400 mt-1">{new Date(r.createdAt).toLocaleDateString('he-IL')}</p>
            </div>
          ))}
        </div>
      )}

      {/* Add review form */}
      <div className="mt-6 border-t border-gray-200 pt-6">
        <h3 className="text-sm font-bold text-primary mb-3">כתבו המלצה</h3>
        <form onSubmit={submitReview} className="space-y-3">
          <div>
            <label className="block text-xs text-gray-600 mb-1">שם מלא</label>
            <input
              type="text"
              required
              value={reviewerName}
              onChange={(e) => setReviewerName(e.target.value)}
              className="w-full rounded-lg border border-gray-300 py-2 px-3 text-sm focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
              placeholder="השם שלכם"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-600 mb-1">דירוג</label>
            <StarInput value={reviewRating} onChange={setReviewRating} />
          </div>
          <div>
            <label className="block text-xs text-gray-600 mb-1">המלצה</label>
            <textarea
              required
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              rows={3}
              className="w-full rounded-lg border border-gray-300 py-2 px-3 text-sm focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30 resize-none"
              placeholder="ספרו על החוויה שלכם..."
            />
          </div>

          {reviewMessage && (
            <div className={`rounded-lg p-3 text-sm ${reviewMessage.type === 'success' ? 'bg-legal-green/10 text-legal-green' : 'bg-legal-danger/10 text-legal-danger'}`}>
              {reviewMessage.text}
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="rounded-lg bg-accent px-6 py-2.5 text-sm font-bold text-[#072a42] transition-colors hover:bg-accent-light disabled:opacity-50"
          >
            {submitting ? 'שולח...' : 'שלח המלצה'}
          </button>
          <p className="text-xs text-gray-400">
            * המלצות עוברות סינון אוטומטי. רק המלצות חיוביות ועניינות מתפרסמות.
          </p>
        </form>
      </div>
    </div>
  );
}
