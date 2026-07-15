import { supabase } from '@/lib/supabase';
import { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Link from 'next/link';
import ContactForm from '@/components/ContactForm';
import BackButton from '@/components/BackButton';
import ImageGallery from '@/components/ImageGallery';
import FavoriteButton from '@/components/FavoriteButton';
import DownloadPDFButton from '@/components/DownloadPDFButton';

export const revalidate = 0;

type Props = {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  
  const { data: property } = await supabase
    .from('properties')
    .select('title, operation_type, property_type, city, bedrooms, currency, price, image_urls')
    .eq('id', id)
    .single();

  if (!property) {
    return { title: 'Propiedad no encontrada | Inmobiout' };
  }

  const title = `${property.title} | ${property.operation_type.toUpperCase()}`;
  const description = `${property.property_type.toUpperCase()} en ${property.city}. ${property.bedrooms > 0 ? property.bedrooms + ' hab. ' : ''}${property.currency === 'ARS' ? '$' : 'US$'} ${property.price.toLocaleString()}`;
  const images = property.image_urls && property.image_urls.length > 0 ? [property.image_urls[0]] : [];

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images,
    },
  };
}

export default async function PropertyDetails(props: Props) {
  const { id } = await props.params;

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
            <Link href="/propiedades" className="text-accent hover:underline">Volver al inicio</Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col bg-background">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <div className="flex justify-between items-center mb-6">
          <BackButton fallback="/" />
          <DownloadPDFButton property={property} />
        </div>
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

            <div className="mb-8">
              <h3 className="text-xl font-bold text-primary-900 dark:text-white mb-4">Ubicación</h3>
              <div className="w-full h-64 rounded-xl overflow-hidden shadow-sm border border-primary-100 dark:border-primary-800 relative bg-primary-100 dark:bg-primary-900">
                <iframe
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  loading="lazy"
                  allowFullScreen
                  referrerPolicy="no-referrer-when-downgrade"
                  src={`https://www.google.com/maps?q=${encodeURIComponent(property.address + ', ' + property.city)}&output=embed`}
                ></iframe>
              </div>
            </div>
            
            <ContactForm propertyId={property.id} />
          </div>
        </div>
      </div>
    </main>
  );
}
