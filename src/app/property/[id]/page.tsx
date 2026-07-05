import { supabase } from '@/lib/supabase';
import Navbar from '@/components/Navbar';
import Link from 'next/link';

export const revalidate = 0;

export default async function PropertyDetails({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const { data: property } = await supabase
    .from('properties')
    .select('*')
    .eq('id', id)
    .single();

  if (!property) {
    return (
      <main className="flex min-h-screen flex-col bg-background">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-primary-900 mb-4">Propiedad no encontrada</h1>
            <Link href="/" className="text-accent hover:underline">Volver al inicio</Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col bg-background">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        <Link href="/" className="inline-flex items-center text-primary-600 hover:text-accent mb-8 font-medium">
          ← Volver a resultados
        </Link>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Images Section */}
          <div className="space-y-4">
            {property.image_urls && property.image_urls.length > 0 ? (
              <>
                <div className="relative h-96 w-full rounded-xl overflow-hidden bg-primary-100">
                  <img 
                    src={property.image_urls[0]} 
                    alt="Imagen principal" 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 left-4">
                    <span className={`px-4 py-2 rounded-full text-sm font-bold uppercase tracking-wider ${
                      property.operation_type === 'venta' 
                        ? 'bg-green-500 text-white' 
                        : 'bg-blue-500 text-white'
                    }`}>
                      {property.operation_type}
                    </span>
                  </div>
                </div>
                {property.image_urls.length > 1 && (
                  <div className="grid grid-cols-4 gap-4">
                    {property.image_urls.slice(1).map((url: string, index: number) => (
                      <div key={index} className="h-24 rounded-lg overflow-hidden bg-primary-100">
                        <img src={url} alt={`Imagen ${index + 2}`} className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div className="h-96 rounded-xl bg-primary-100 flex items-center justify-center text-primary-400">
                Sin imágenes disponibles
              </div>
            )}
          </div>

          {/* Details Section */}
          <div>
            <div className="mb-6">
              <p className="text-accent font-semibold uppercase tracking-wider mb-2">{property.property_type}</p>
              <h1 className="text-3xl md:text-4xl font-bold text-primary-900 dark:text-white mb-4">
                {property.title}
              </h1>
              <p className="text-4xl font-extrabold text-primary-900 dark:text-white">
                {property.currency === 'ARS' ? '$' : 'US$'} {property.price.toLocaleString()}
              </p>
            </div>
            
            <div className="flex items-center gap-6 py-6 border-y border-primary-200 dark:border-primary-800 mb-8">
              {property.bedrooms > 0 && (
                <div className="flex items-center gap-2">
                  <span className="text-2xl">🛏️</span>
                  <div>
                    <p className="text-sm text-primary-500">Habitaciones</p>
                    <p className="font-bold text-primary-900 dark:text-white">{property.bedrooms}</p>
                  </div>
                </div>
              )}
              {property.bathrooms > 0 && (
                <div className="flex items-center gap-2 border-l border-primary-200 dark:border-primary-800 pl-6">
                  <span className="text-2xl">🚿</span>
                  <div>
                    <p className="text-sm text-primary-500">Baños</p>
                    <p className="font-bold text-primary-900 dark:text-white">{property.bathrooms}</p>
                  </div>
                </div>
              )}
              <div className="flex items-center gap-2 border-l border-primary-200 dark:border-primary-800 pl-6">
                <span className="text-2xl">📍</span>
                <div>
                  <p className="text-sm text-primary-500">Ubicación</p>
                  <p className="font-bold text-primary-900 dark:text-white">{property.city}</p>
                </div>
              </div>
            </div>

            <div className="mb-8">
              <h3 className="text-xl font-bold text-primary-900 dark:text-white mb-4">Descripción</h3>
              <p className="text-primary-700 dark:text-primary-300 whitespace-pre-line leading-relaxed">
                {property.description}
              </p>
            </div>
            
            <div className="bg-primary-50 dark:bg-primary-900 p-6 rounded-xl">
              <h3 className="text-lg font-bold text-primary-900 dark:text-white mb-2">¿Te interesa esta propiedad?</h3>
              <p className="text-primary-600 dark:text-primary-400 mb-6">Contacta a la inmobiliaria para coordinar una visita o hacer una consulta.</p>
              <button className="w-full py-4 bg-accent hover:bg-accent-hover text-white font-bold rounded-lg transition-colors">
                Contactar Inmobiliaria
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
