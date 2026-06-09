'use client';

import { useEffect, useState, useCallback } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

export default function TopLoader() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  const startLoading = useCallback(() => {
    setLoading(true);
    setProgress(20);
    const t1 = setTimeout(() => setProgress(50), 150);
    const t2 = setTimeout(() => setProgress(70), 400);
    const t3 = setTimeout(() => setProgress(85), 800);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, []);

  const stopLoading = useCallback(() => {
    setProgress(100);
    setTimeout(() => {
      setLoading(false);
      setProgress(0);
    }, 300);
  }, []);

  // Stop loading on route change complete
  useEffect(() => {
    stopLoading();
  }, [pathname, searchParams, stopLoading]);

  // Intercept link clicks to start loading
  useEffect(() => {
    let cleanup: (() => void) | undefined;

    function handleClick(e: MouseEvent) {
      const link = (e.target as HTMLElement).closest('a');
      if (!link) return;
      const href = link.getAttribute('href');
      if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:') || href.startsWith('http')) return;
      if (link.target === '_blank') return;
      // Same page
      if (href === pathname) return;
      cleanup = startLoading();
    }

    document.addEventListener('click', handleClick);
    return () => {
      document.removeEventListener('click', handleClick);
      cleanup?.();
    };
  }, [pathname, startLoading]);

  if (!loading && progress === 0) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[9999] h-[3px]">
      <div
        className="h-full bg-gradient-to-l from-[#C9A84C] to-[#D4B85E] transition-all duration-300 ease-out shadow-[0_0_10px_rgba(201,168,76,0.5)]"
        style={{ width: `${progress}%`, opacity: loading ? 1 : 0 }}
      />
    </div>
  );
}
