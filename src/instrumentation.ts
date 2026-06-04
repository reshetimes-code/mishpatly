/**
 * Next.js Instrumentation - runs once on server startup
 * Sets up daily cron job at 08:00 AM Israel time
 */

export async function register() {
  // Only run on the server (not during build or in edge runtime)
  if (typeof window !== 'undefined') return;
  if (process.env.NEXT_PHASE === 'phase-production-build') return;

  console.log('[cron-scheduler] Starting daily import scheduler...');

  const CRON_SECRET = process.env.CRON_SECRET || 'mishpatli-cron-secret-2026';
  const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://mishpatly.co.il';

  function getMillisUntilNext8AM(): number {
    const now = new Date();
    // Israel timezone: UTC+3 (or UTC+2 in winter, but let's use the Intl API)
    const israelTime = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Jerusalem' }));
    const target = new Date(israelTime);
    target.setHours(8, 0, 0, 0);

    // If it's already past 8AM today, schedule for tomorrow
    if (israelTime >= target) {
      target.setDate(target.getDate() + 1);
    }

    // Convert back to real time difference
    const diff = target.getTime() - israelTime.getTime();
    return Math.max(diff, 60000); // minimum 1 minute
  }

  async function runCron() {
    try {
      console.log(`[cron-scheduler] Running daily import at ${new Date().toISOString()}`);
      const res = await fetch(`${SITE_URL}/api/cron?secret=${CRON_SECRET}`, {
        signal: AbortSignal.timeout(300000), // 5 minute timeout for scraping
      });
      const data = await res.json();
      console.log(`[cron-scheduler] Completed:`, JSON.stringify(data));
    } catch (e) {
      console.error('[cron-scheduler] Failed:', e);
      // Try localhost as fallback
      try {
        const port = process.env.PORT || '1300';
        await fetch(`http://localhost:${port}/api/cron?secret=${CRON_SECRET}`, {
          signal: AbortSignal.timeout(300000),
        });
      } catch {
        console.error('[cron-scheduler] Localhost fallback also failed');
      }
    }
  }

  function scheduleNext() {
    const ms = getMillisUntilNext8AM();
    const hours = Math.round(ms / 3600000 * 10) / 10;
    console.log(`[cron-scheduler] Next import scheduled in ${hours} hours`);

    setTimeout(async () => {
      await runCron();
      // Schedule the next one (24 hours from now, approximately)
      scheduleNext();
    }, ms);
  }

  // Start the scheduler after a short delay to let the server fully start
  setTimeout(() => {
    scheduleNext();
    console.log('[cron-scheduler] Scheduler initialized successfully');
  }, 10000);
}
