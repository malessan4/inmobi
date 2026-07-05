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
            <Link href="/search?op=venta" className="text-primary-700 hover:text-accent dark:text-primary-200 dark:hover:text-accent-hover font-medium transition-colors">
              En Venta
            </Link>
            <Link href="/search?op=alquiler" className="text-primary-700 hover:text-accent dark:text-primary-200 dark:hover:text-accent-hover font-medium transition-colors">
              Alquileres
            </Link>
          </div>

          <div className="flex items-center space-x-4">
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
