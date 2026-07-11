import Link from 'next/link';
import ThemeToggle from './ThemeToggle';
import Image from 'next/image';

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 w-full backdrop-blur-md bg-white/80 dark:bg-primary-950/80 border-b border-primary-100 dark:border-primary-900 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link href="/" className="flex-shrink-0 flex items-center gap-2">
              <img src="/logo.jpg" alt="Inmobiout Logo" className="h-8 w-8 rounded-md object-cover" />
              <span className="font-bold text-2xl text-primary-900 dark:text-white tracking-tight">
                Inmobi<span className="text-accent">out</span>
              </span>
            </Link>
          </div>
          
          <div className="hidden md:flex space-x-8 items-center">
            <Link href="/?operation=venta" className="text-primary-700 hover:text-accent dark:text-primary-200 dark:hover:text-accent-hover font-medium transition-colors">
              En Venta
            </Link>
            <Link href="/?operation=alquiler" className="text-primary-700 hover:text-accent dark:text-primary-200 dark:hover:text-accent-hover font-medium transition-colors">
              Alquileres
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <Link href="/favoritos" className="text-primary-700 hover:text-accent dark:text-primary-200 dark:hover:text-accent-hover transition-colors flex items-center gap-1 font-medium" title="Mis Favoritos">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-red-500">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
              </svg>
              <span className="hidden md:inline">Favoritos</span>
            </Link>
            <ThemeToggle />
            <Link 
              href="/admin" 
              className="px-4 py-2 text-sm font-medium text-white bg-primary-800 hover:bg-primary-900 dark:bg-primary-700 dark:hover:bg-primary-600 rounded-md transition-colors shadow-sm"
            >
              Acceso Inmobiliarias
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
