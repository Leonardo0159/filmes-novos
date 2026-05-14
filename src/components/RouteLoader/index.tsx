import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';

const RouteLoader = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);

  useEffect(() => {
    const handleStart = () => {
      setLoading(true);
      setShowOverlay(false);
    };
    const handleComplete = () => {
      setLoading(false);
      setShowOverlay(false);
    };

    router.events.on('routeChangeStart', handleStart);
    router.events.on('routeChangeComplete', handleComplete);
    router.events.on('routeChangeError', handleComplete);

    return () => {
      router.events.off('routeChangeStart', handleStart);
      router.events.off('routeChangeComplete', handleComplete);
      router.events.off('routeChangeError', handleComplete);
    };
  }, [router]);

  useEffect(() => {
    if (!loading) return;
    const timer = setTimeout(() => setShowOverlay(true), 300);
    return () => clearTimeout(timer);
  }, [loading]);

  if (!loading) return null;

  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-[100] h-1.5">
        <div className="h-full bg-gold-500 animate-loading-bar" />
      </div>

      {showOverlay && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-cinema-900/60 backdrop-blur-sm transition-opacity duration-300">
          <div className="flex flex-col items-center gap-4">
            <div className="spinner" />
            <p className="text-gold-500 text-sm font-semibold uppercase tracking-wider animate-pulse">
              Carregando...
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default RouteLoader;
