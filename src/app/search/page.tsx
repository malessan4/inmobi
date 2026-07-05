import { supabase } from '@/lib/supabase';
import Navbar from '@/components/Navbar';
import Link from 'next/link';
import BackButton from '@/components/BackButton';

export const revalidate = 0;

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const params = await searchParams;
  const q = typeof params.q === 'string' ? params.q : '';
  const op = typeof params.op === 'string' ? params.op : '';
  const type = typeof params.type === 'string' ? params.type : '';

  let query = supabase
    .from('properties')
    .select('*')
    .eq('is_published', true);

  if (op) {
    query = query.eq('operation_type', op);
  }
  if (type) {
    query = query.eq('property_type', type);
  }
  if (q) {
    // Basic full text search fallback to ilike on title or city or address
    query = query.or(`title.ilike.%${q}%,city.ilike.%${q}%,address.ilike.%${q}%`);
  }

  const { data: properties } = await query.order('created_at', { ascending: false });

  return (
    <main className="flex min-h-screen flex-col bg-background">
      <Navbar />
      
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="mb-8">
          <BackButton fallback="/" />
        </div>
        <div className="mb-12">
          <h1 className="text-3xl font-bold text-primary-900 dark:text-white">Resultados de búsqueda</h1>
          <p className="mt-2 text-primary-600 dark:text-primary-300">
            {properties ? properties.length : 0} propiedades encontradas
            {q && ` para "${q}"`}
            {op && ` en ${op}`}
          </p>
        </div>

        {/* Filters bar */}
        <div className="bg-white dark:bg-primary-950 p-4 rounded-lg shadow-sm border border-primary-100 dark:border-primary-900 mb-8 flex flex-wrap gap-4">
          <form className="flex w-full md:w-auto flex-wrap gap-4" action="/search" method="GET">
            <input 
              type="text" 
              name="q" 
              defaultValue={q} 
              placeholder="Ciudad, barrio..." 
              className="px-4 py-2 border border-primary-300 dark:border-primary-700 rounded-md bg-transparent text-primary-900 dark:text-white outline-none focus:ring-2 focus:ring-primary-500"
            />
            <select name="op" defaultValue={op} className="px-4 py-2 border border-primary-300 dark:border-primary-700 rounded-md bg-white dark:bg-primary-950 text-primary-900 dark:text-white outline-none">
              <option value="">Todas las operaciones</option>
              <option value="venta">Comprar</option>
              <option value="alquiler">Alquilar</option>
            </select>
            <select name="type" defaultValue={type} className="px-4 py-2 border border-primary-300 dark:border-primary-700 rounded-md bg-white dark:bg-primary-950 text-primary-900 dark:text-white outline-none">
              <option value="">Cualquier inmueble</option>
              <option value="casa">Casa</option>
              <option value="departamento">Departamento</option>
              <option value="terreno">Terreno</option>
              <option value="comercial">Comercial</option>
            </select>
            <button type="submit" className="px-6 py-2 bg-accent hover:bg-accent-hover text-white font-semibold rounded-md transition-colors">
              Aplicar filtros
            </button>
            <Link href="/search" className="px-6 py-2 bg-primary-100 dark:bg-primary-800 text-primary-900 dark:text-white hover:bg-primary-200 dark:hover:bg-primary-700 font-semibold rounded-md transition-colors inline-flex items-center">
              Limpiar
            </Link>
          </form>
        </div>
        
        {(!properties || properties.length === 0) ? (
          <div className="text-center p-10 border border-primary-200 dark:border-primary-800 rounded-lg text-primary-500 bg-white dark:bg-primary-950">
            No se encontraron propiedades que coincidan con tu búsqueda.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {properties.map((property) => (
              <Link href={`/property/${property.id}`} key={property.id} className="bg-white dark:bg-primary-950 rounded-xl shadow-md overflow-hidden border border-primary-100 dark:border-primary-900 hover:shadow-lg transition-shadow group cursor-pointer block">
                <div className="relative h-64 w-full bg-primary-100 dark:bg-primary-900 overflow-hidden">
                  {property.image_urls && property.image_urls.length > 0 ? (
                    <img 
                      src={property.image_urls[0]} 
                      alt={property.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-primary-400">Sin imagen</div>
                  )}
                  <div className="absolute top-4 left-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                      property.operation_type === 'venta' 
                        ? 'bg-green-500 text-white' 
                        : 'bg-blue-500 text-white'
                    }`}>
                      {property.operation_type}
                    </span>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <p className="text-sm font-medium text-accent uppercase tracking-wider">{property.property_type}</p>
                    <p className="text-xl font-bold text-primary-900 dark:text-white">
                      {property.currency === 'ARS' ? '$' : 'US$'} {property.price.toLocaleString()}
                    </p>
                  </div>
                  <h3 className="text-lg font-bold text-primary-900 dark:text-white mb-2 line-clamp-1">
                    {property.title}
                  </h3>
                  <p className="text-primary-500 text-sm mb-4 flex items-center gap-1">
                    📍 {property.city} - {property.address}
                  </p>
                  
                  <div className="flex items-center gap-4 text-sm text-primary-600 dark:text-primary-400 border-t border-primary-100 dark:border-primary-800 pt-4">
                    {property.bedrooms > 0 && (
                      <span className="flex items-center gap-1">🛏️ {property.bedrooms} Hab</span>
                    )}
                    {property.bathrooms > 0 && (
                      <span className="flex items-center gap-1">🚿 {property.bathrooms} Baños</span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
