import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import { supabase } from '@/lib/supabase';
import Image from 'next/image';
import Link from 'next/link';
import FilterBar from '@/components/FilterBar';
import FavoriteButton from '@/components/FavoriteButton';

export const revalidate = 0; // Disable cache for MVP so new properties show up immediately

export default async function Home(props: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const searchParams = await props.searchParams;
  const q = typeof searchParams.q === 'string' ? searchParams.q : '';
  const operation = typeof searchParams.operation === 'string' ? searchParams.operation : '';
  const propertyType = typeof searchParams.type === 'string' ? searchParams.type : '';
  const bedrooms = typeof searchParams.bedrooms === 'string' ? parseInt(searchParams.bedrooms) : 0;
  const sort = typeof searchParams.sort === 'string' ? searchParams.sort : 'newest';

  let query = supabase
    .from('properties')
    .select('*')
    .eq('is_published', true);

  if (q) {
    query = query.or(`title.ilike.%${q}%,city.ilike.%${q}%,address.ilike.%${q}%`);
  }
  if (operation) {
    query = query.eq('operation_type', operation);
  }
  if (propertyType) {
    query = query.eq('property_type', propertyType);
  }
  if (bedrooms > 0) {
    query = query.gte('bedrooms', bedrooms);
  }

  if (sort === 'price_asc') {
    query = query.order('price', { ascending: true });
  } else if (sort === 'price_desc') {
    query = query.order('price', { ascending: false });
  } else {
    query = query.order('created_at', { ascending: false });
  }

  const { data: properties } = await query;

  return (
    <main className="flex min-h-screen flex-col bg-background">
      <Navbar />
      <Hero />
      
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-3xl font-bold text-primary-900 dark:text-white">Propiedades Destacadas</h2>
            <p className="mt-2 text-primary-600 dark:text-primary-300">Descubre las mejores oportunidades del mercado</p>
          </div>
        </div>

        <FilterBar />
        
        {(!properties || properties.length === 0) ? (
          <div className="text-center p-10 border border-primary-200 dark:border-primary-800 rounded-lg text-primary-500">
            Aún no hay propiedades publicadas.
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
                  <div className="absolute top-4 right-4 z-10">
                    <FavoriteButton propertyId={property.id} />
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
