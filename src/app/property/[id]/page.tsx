import { supabase } from '@/lib/supabase';
import Navbar from '@/components/Navbar';
import Link from 'next/link';
import ContactForm from '@/components/ContactForm';
import BackButton from '@/components/BackButton';
import WhatsAppButton from '@/components/WhatsAppButton';
import ImageGallery from '@/components/ImageGallery';
import FavoriteButton from '@/components/FavoriteButton';

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
        <BackButton fallback="/" />
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Images Section */}
          <div className="w-full">
            <ImageGallery images={property.image_urls || []} operationType={property.operation_type} />
          </div>

          {/* Details Section */}
          <div>
            <div className="mb-6">
              <div className="flex justify-between items-start">
                <p className="text-accent font-semibold uppercase tracking-wider mb-2">{property.property_type}</p>
                <FavoriteButton propertyId={property.id} />
              </div>
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
            
            <ContactForm propertyId={property.id} />
          </div>
        </div>
      </div>
      <WhatsAppButton propertyTitle={property.title} />
    </main>
  );
}
