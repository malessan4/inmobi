export default function Hero() {
  return (
    <div className="relative bg-primary-900 overflow-hidden">
      <div className="absolute inset-0">
        <img
          className="w-full h-full object-cover opacity-30 mix-blend-multiply"
          src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=2075&q=80"
          alt="Modern luxury house"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-primary-950 via-primary-900/60 to-transparent" />
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32 flex flex-col items-center text-center">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white tracking-tight mb-6">
          Encuentra el hogar <br className="hidden md:block" />
          <span className="text-primary-200">perfecto para ti</span>
        </h1>
        <p className="mt-4 max-w-2xl text-lg md:text-xl text-primary-100 mb-10">
          Explora miles de propiedades en venta y alquiler de las mejores inmobiliarias.
        </p>
        
        {/* Search Bar Stub */}
        <div className="w-full max-w-3xl bg-white dark:bg-primary-950 p-2 rounded-lg shadow-xl flex flex-col md:flex-row gap-2">
          <input 
            type="text" 
            placeholder="Buscar por ciudad, barrio o dirección..."
            className="flex-grow px-4 py-3 rounded-md bg-transparent text-primary-900 dark:text-white border-0 focus:ring-2 focus:ring-primary-500 placeholder-primary-400 outline-none"
          />
          <select className="px-4 py-3 rounded-md bg-primary-50 dark:bg-primary-900 text-primary-900 dark:text-white border-0 outline-none cursor-pointer">
            <option>Comprar</option>
            <option>Alquilar</option>
          </select>
          <button className="px-8 py-3 bg-accent hover:bg-accent-hover text-white font-semibold rounded-md transition-colors">
            Buscar
          </button>
        </div>
      </div>
    </div>
  );
}
