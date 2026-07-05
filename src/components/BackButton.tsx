'use client';

import { useRouter } from 'next/navigation';

export default function BackButton({ fallback = "/" }: { fallback?: string }) {
  const router = useRouter();

  return (
    <button 
      onClick={() => {
        if (window.history.length > 2) {
          router.back();
        } else {
          router.push(fallback);
        }
      }}
      className="inline-flex items-center justify-center px-4 py-2 bg-white dark:bg-primary-900 border border-primary-200 dark:border-primary-700 text-primary-700 dark:text-primary-200 hover:bg-primary-50 dark:hover:bg-primary-800 hover:text-accent dark:hover:text-accent-hover font-bold rounded-lg transition-colors shadow-sm mb-8 gap-2"
    >
      <span className="text-xl leading-none">←</span> 
      <span>Volver</span>
    </button>
  );
}
