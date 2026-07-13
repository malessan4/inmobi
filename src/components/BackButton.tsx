'use client';

import { useRouter } from 'next/navigation';

export default function BackButton({ fallback = "/", forceFallback = false }: { fallback?: string, forceFallback?: boolean }) {
  const router = useRouter();

  return (
    <button 
      onClick={() => {
        if (forceFallback || window.history.length <= 2) {
          router.push(fallback);
        } else {
          router.back();
        }
      }}
      className="inline-flex items-center justify-center px-4 py-2 bg-white dark:bg-primary-900 border border-primary-200 dark:border-primary-700 text-primary-700 dark:text-primary-200 hover:bg-primary-50 dark:hover:bg-primary-800 hover:text-accent dark:hover:text-accent-hover font-bold rounded-lg transition-colors shadow-sm mb-8 gap-2"
    >
      <span className="text-xl leading-none">←</span> 
      <span>Volver</span>
    </button>
  );
}
