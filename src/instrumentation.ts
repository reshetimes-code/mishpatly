/**
 * Next.js Instrumentation - runs once on server startup
 * Sets up daily cron job at 08:00 AM Israel time
 *
 * PRIMARY: Google Cloud Scheduler should call GET /api/cron?secret=... daily at 08:00
 * FALLBACK: This internal scheduler runs if Cloud Scheduler is not configured
 *
 * To set up Google Cloud Scheduler (recommended):
 *   gcloud scheduler jobs create http mishpatly-daily-import \
 *     --schedule="0 8 * * *" \
 *     --time-zone="Asia/Jerusalem" \
 *     --uri="https://mishpatly.co.il/api/cron?secret=YOUR_SECRET" \
 *     --http-method=GET \
 *     --attempt-deadline=600s
 */

export async function register() {
  // Only run on the server (not during build or in edge runtime)
  if (typeof window !== 'undefined') return;
  if (process.env.NEXT_PHASE === 'phase-production-build') return;

  console.log('[cron-scheduler] Starting daily import scheduler...');

  const CRON_SECRET = process.env.CRON_SECRET || 'mishpatli-cron-secret-2026';
  const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://mishpatly.co.il';

  // Track last run date to prevent double runs
  let lastRunDate = '';

  function getIsraelHour(): { hour: number; dateStr: string } {
    const now = new Date();
    const israelTime = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Jerusalem' }));
    return {
      hour: israelTime.getHours(),
      dateStr: israelTime.toISOString().split('T')[0],
    };
  }

  async function runCron() {
    const { dateStr } = getIsraelHour();

    // Don't run twice on the same day
    if (lastRunDate === dateStr) {
      console.log(`[cron-scheduler] Already ran today (${dateStr}), skipping`);
      return;
    }

    console.log(`[cron-scheduler] Running daily import at ${new Date().toISOString()}`);
    lastRunDate = dateStr;

    try {
      const port = process.env.PORT || '1300';
      // Always use localhost to avoid external network round-trip
      const res = await fetch(`http://localhost:${port}/api/cron?secret=${CRON_SECRET}`, {
        signal: AbortSignal.timeout(300000), // 5 minute timeout
      });
      const data = await res.json();
      console.log(`[cron-scheduler] Completed:`, JSON.stringify(data));
    } catch (e) {
      console.error('[cron-scheduler] Localhost failed, trying external URL:', e);
      try {
        const res = await fetch(`${SITE_URL}/api/cron?secret=${CRON_SECRET}`, {
          signal: AbortSignal.timeout(300000),
        });
        const data = await res.json();
        console.log(`[cron-scheduler] Completed via external URL:`, JSON.stringify(data));
      } catch (e2) {
        console.error('[cron-scheduler] External URL also failed:', e2);
        // Reset lastRunDate so it can retry
        lastRunDate = '';
      }
    }
  }

  // Check every 15 minutes if it's time to run (8:00 AM Israel time)
  // This is more reliable than a single setTimeout which can drift
  const CHECK_INTERVAL = 15 * 60 * 1000; // 15 minutes

  function startPolling() {
    console.log('[cron-scheduler] Scheduler initialized - checking every 15 minutes for 8AM Israel time');

    setInterval(() => {
      const { hour, dateStr } = getIsraelHour();

      // Run between 8:00-8:14 AM (within our 15-min check window)
      if (hour === 8 && lastRunDate !== dateStr) {
        runCron();
      }
    }, CHECK_INTERVAL);

    // Also check immediately on startup - if server restarts after 8 AM
    // and hasn't run today, run now
    setTimeout(async () => {
      const { hour, dateStr } = getIsraelHour();
      if (hour >= 8 && lastRunDate !== dateStr) {
        // Check DB if import already ran today
        try {
          const port = process.env.PORT || '1300';
          const res = await fetch(`http://localhost:${port}/api/admin/stats`, {
            signal: AbortSignal.timeout(10000),
          });
          if (res.ok) {
            const stats = await res.json();
            const lastImport = stats?.lastImportDate;
            if (lastImport) {
              const today = new Date().toLocaleDateString('he-IL');
              if (lastImport === today) {
                lastRunDate = dateStr;
                console.log('[cron-scheduler] Import already ran today, skipping');
                return;
              }
            }
          }
        } catch {
          // Can't check, will try to run
        }

        console.log('[cron-scheduler] Server started after 8 AM, running import now');
        runCron();
      }
    }, 15000); // Wait 15 seconds for server to be ready
  }

  // Start after server is ready
  setTimeout(startPolling, 10000);
}
