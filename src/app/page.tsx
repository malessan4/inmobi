import Link from 'next/link';
import ThemeToggle from '@/components/ThemeToggle';

export default function WelcomePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4 relative overflow-hidden">
      {/* Theme Toggle - top right corner */}
      <div className="fixed top-4 right-4 z-50">
        <ThemeToggle />
      </div>

      {/* Background Decorative Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-accent/20 rounded-full blur-3xl opacity-50 mix-blend-multiply"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-blue-500/20 rounded-full blur-3xl opacity-50 mix-blend-multiply"></div>

      <div className="relative z-10 text-center max-w-3xl mx-auto space-y-8 bg-white/80 dark:bg-primary-950/80 p-12 rounded-3xl shadow-xl backdrop-blur-sm border border-primary-100 dark:border-primary-900">
        
        <div className="flex justify-center mb-6">
          <div className="flex items-center gap-3">
            <img src="/logo.jpg" alt="Inmobiout Logo" className="h-16 w-16 rounded-xl object-cover shadow-md" />
            <span className="font-bold text-5xl text-primary-900 dark:text-white tracking-tight">
              Inmobi<span className="text-accent">out</span>
            </span>
          </div>
        </div>

        <h1 className="text-4xl md:text-5xl font-extrabold text-primary-900 dark:text-white leading-tight">
          Bienvenido al Portal Inmobiliario
        </h1>
        <p className="text-xl text-primary-600 dark:text-primary-400 max-w-2xl mx-auto">
          Selecciona cómo deseas ingresar a nuestra plataforma para disfrutar de la mejor experiencia.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-8 max-w-2xl mx-auto">
          {/* Botón Cliente */}
          <Link 
            href="/login" 
            className="group flex flex-col items-center p-8 bg-white dark:bg-primary-900 rounded-2xl shadow-sm border border-primary-200 dark:border-primary-800 hover:border-accent hover:shadow-lg transition-all duration-300"
          >
            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-primary-900 dark:text-white mb-2">Soy Cliente</h3>
            <p className="text-sm text-primary-500 text-center">Busco comprar o alquilar una propiedad.</p>
          </Link>

          {/* Botón Inmobiliaria */}
          <Link 
            href="/admin/login" 
            className="group flex flex-col items-center p-8 bg-white dark:bg-primary-900 rounded-2xl shadow-sm border border-primary-200 dark:border-primary-800 hover:border-accent hover:shadow-lg transition-all duration-300"
          >
            <div className="w-16 h-16 bg-accent/10 dark:bg-accent/20 text-accent rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-primary-900 dark:text-white mb-2">Soy Inmobiliaria</h3>
            <p className="text-sm text-primary-500 text-center">Quiero gestionar mis publicaciones.</p>
          </Link>
        </div>

        <div className="pt-8 flex flex-col items-center border-t border-primary-100 dark:border-primary-800/50 mt-8">
          <p className="text-primary-600 dark:text-primary-400 mb-4 font-medium">¿Solo quieres mirar?</p>
          <Link 
            href="/propiedades" 
            className="px-8 py-3 bg-primary-100 dark:bg-primary-800 text-primary-900 dark:text-white font-bold rounded-full hover:bg-primary-200 dark:hover:bg-primary-700 transition-colors shadow-sm"
          >
            Explorar sin Iniciar Sesión
          </Link>
        </div>

      </div>
    </div>
  );
}
