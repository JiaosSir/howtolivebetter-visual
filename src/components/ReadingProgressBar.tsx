import { useState, useEffect } from 'react';

export default function ReadingProgressBar() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    function updateProgress() {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = docHeight > 0 ? Math.round((scrollTop / docHeight) * 100) : 0;
      setProgress(Math.min(100, Math.max(0, scrollPercent)));
    }

    window.addEventListener('scroll', updateProgress, { passive: true });
    updateProgress();

    return () => window.removeEventListener('scroll', updateProgress);
  }, []);

  return (
    <div
      role="progressbar"
      aria-valuenow={progress}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label="阅读进度"
      className="fixed top-0 left-0 right-0 z-50 h-1 bg-transparent"
    >
      <div
        className="h-full bg-gradient-to-r from-[#32adfe] to-blue-600 dark:from-[#30aefc] dark:to-[#30aefc] transition-all duration-150"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
