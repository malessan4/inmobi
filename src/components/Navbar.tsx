import Link from 'next/link';
import ThemeToggle from './ThemeToggle';

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 w-full backdrop-blur-md bg-white/80 dark:bg-primary-950/80 border-b border-primary-100 dark:border-primary-900 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded bg-primary-800 text-white flex items-center justify-center font-bold text-xl">
                C
              </div>
              <span className="font-bold text-xl text-primary-900 dark:text-white tracking-tight">
                CRM<span className="text-primary-500 font-light">Inmobiliario</span>
              </span>
            </Link>
          </div>
          
          <div className="hidden md:flex space-x-8">
            <Link href="/venta" className="text-primary-700 hover:text-accent dark:text-primary-200 dark:hover:text-accent-hover font-medium transition-colors">
              En Venta
            </Link>
            <Link href="/alquiler" className="text-primary-700 hover:text-accent dark:text-primary-200 dark:hover:text-accent-hover font-medium transition-colors">
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
