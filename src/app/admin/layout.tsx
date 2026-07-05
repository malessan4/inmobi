'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import ThemeToggle from '@/components/ThemeToggle';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session && pathname !== '/admin/login') {
        router.push('/admin/login');
      } else {
        setLoading(false);
      }
    };
    checkUser();
    
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session && pathname !== '/admin/login') {
        router.push('/admin/login');
      }
    });
    
    return () => authListener.subscription.unsubscribe();
  }, [router, pathname]);

  if (loading && pathname !== '/admin/login') {
    return <div className="min-h-screen flex items-center justify-center">Cargando...</div>;
  }

  // Si estamos en la página de login, no mostrar el sidebar
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen flex bg-background">
      {/* Sidebar */}
      <aside className="w-64 bg-primary-950 text-white flex flex-col hidden md:flex">
        <div className="h-16 flex items-center px-6 font-bold text-xl border-b border-primary-800">
          CRM<span className="text-primary-400 font-light">Admin</span>
        </div>
        <nav className="flex-1 py-6 px-4 space-y-2">
          <Link href="/admin" className="block px-4 py-3 rounded bg-primary-800 text-white font-medium">
            Propiedades
          </Link>
          <Link href="/" className="block px-4 py-3 rounded hover:bg-primary-900 text-primary-200 font-medium">
            Volver al portal web
          </Link>
        </nav>
        <div className="p-4 border-t border-primary-800">
          <button 
            onClick={() => supabase.auth.signOut()}
            className="w-full text-left px-4 py-2 text-red-400 hover:text-red-300 font-medium"
          >
            Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden bg-background transition-colors">
        <header className="h-16 bg-white dark:bg-primary-900 border-b border-primary-100 dark:border-primary-800 flex items-center justify-between px-8">
            <div className="font-bold text-xl dark:text-white md:hidden">CRM Admin</div>
            <div className="hidden md:block"></div>
            <div className="flex items-center space-x-4">
              <ThemeToggle />
              <button onClick={() => supabase.auth.signOut()} className="text-red-500 md:hidden">Salir</button>
            </div>
        </header>
        <div className="flex-1 overflow-auto p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
