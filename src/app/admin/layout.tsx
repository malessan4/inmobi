'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import ThemeToggle from '@/components/ThemeToggle';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
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
      if (event === 'SIGNED_OUT') {
        router.push('/');
      } else if (!session && pathname !== '/admin/login') {
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
        <div className="h-16 flex items-center px-6 font-bold text-xl border-b border-primary-800 gap-2">
          <img src="/logo.jpg" alt="Logo" className="w-6 h-6 rounded-sm object-cover" />
          <span>Inmobi<span className="text-primary-400 font-light">out</span></span>
        </div>
          <nav className="flex-1 py-6 px-4 space-y-2">
            <Link 
              href="/admin" 
              className={`block px-4 py-3 rounded-lg font-medium transition-colors ${
                pathname === '/admin' || pathname.startsWith('/admin/properties') 
                  ? 'bg-accent text-white shadow-md' 
                  : 'text-primary-600 dark:text-primary-400 hover:bg-primary-100 dark:hover:bg-primary-800'
              }`}
            >
              🏢 Propiedades
            </Link>
            <Link 
              href="/admin/leads" 
              className={`block px-4 py-3 rounded-lg font-medium transition-colors ${
                pathname.startsWith('/admin/leads')
                  ? 'bg-accent text-white shadow-md' 
                  : 'text-primary-600 dark:text-primary-400 hover:bg-primary-100 dark:hover:bg-primary-800'
              }`}
            >
              👥 Mis Contactos
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
      <main className="flex-1 flex flex-col overflow-hidden bg-background transition-colors h-screen">
        <header className="h-16 bg-white dark:bg-primary-900 border-b border-primary-100 dark:border-primary-800 flex items-center justify-between px-4 sm:px-8 relative z-20">
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 text-primary-600 dark:text-primary-300"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                </svg>
              </button>
              <div className="font-bold text-xl dark:text-white md:hidden">Inmobiout</div>
            </div>
            <div className="hidden md:block"></div>
            <div className="flex items-center space-x-4">
              <ThemeToggle />
              <button onClick={() => supabase.auth.signOut()} className="text-red-500 md:hidden font-medium">Salir</button>
            </div>
        </header>

        {/* Mobile Menu Dropdown */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-16 left-0 w-full bg-white dark:bg-primary-900 border-b border-primary-100 dark:border-primary-800 shadow-lg z-10">
            <nav className="flex flex-col p-4 space-y-2">
              <Link 
                href="/admin" 
                onClick={() => setIsMobileMenuOpen(false)}
                className={`block px-4 py-3 rounded-lg font-medium transition-colors ${
                  pathname === '/admin' || pathname.startsWith('/admin/properties') 
                    ? 'bg-accent text-white shadow-md' 
                    : 'text-primary-600 dark:text-primary-400 hover:bg-primary-100 dark:hover:bg-primary-800'
                }`}
              >
                🏢 Propiedades
              </Link>
              <Link 
                href="/admin/leads" 
                onClick={() => setIsMobileMenuOpen(false)}
                className={`block px-4 py-3 rounded-lg font-medium transition-colors ${
                  pathname.startsWith('/admin/leads')
                    ? 'bg-accent text-white shadow-md' 
                    : 'text-primary-600 dark:text-primary-400 hover:bg-primary-100 dark:hover:bg-primary-800'
                }`}
              >
                👥 Mis Contactos
              </Link>
            </nav>
          </div>
        )}

        <div className="flex-1 overflow-auto p-4 sm:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
