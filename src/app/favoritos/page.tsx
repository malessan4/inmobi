'use client';

import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import FavoriteButton from '@/components/FavoriteButton';

export default function FavoritosPage() {
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFavorites();

    // Listen for changes if they remove a favorite while on this page
    const handleFavoritesUpdate = () => {
      fetchFavorites();
    };

    window.addEventListener('favoritesUpdated', handleFavoritesUpdate);
    return () => window.removeEventListener('favoritesUpdated', handleFavoritesUpdate);
  }, []);

  const fetchFavorites = async () => {
    setLoading(true);
    try {
      const favoritesIds = JSON.parse(localStorage.getItem('favorites') || '[]');
      
      if (favoritesIds.length === 0) {
        setProperties([]);
        setLoading(false);
        return;
      }

      const { data } = await supabase
        .from('properties')
        .select('*')
        .in('id', favoritesIds)
        .eq('is_published', true);

      if (data) {
        setProperties(data);
      }
    } catch (error) {
      console.error('Error fetching favorites:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col bg-background">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        <div className="mb-8 border-b border-primary-200 dark:border-primary-800 pb-4">
          <h1 className="text-3xl font-bold text-primary-900 dark:text-white">Mis Favoritos</h1>
          <p className="text-primary-600 dark:text-primary-400 mt-2">
            Propiedades que has guardado para ver más tarde.
          </p>
        </div>

        {loading ? (
          <div className="text-center py-20 text-primary-500">
            Cargando tus propiedades favoritas...
          </div>
        ) : properties.length === 0 ? (
          <div className="text-center py-20 bg-white dark:bg-primary-950 rounded-xl border border-primary-100 dark:border-primary-900 shadow-sm">
            <span className="text-4xl block mb-4">💔</span>
            <h3 className="text-xl font-bold text-primary-900 dark:text-white mb-2">Aún no tienes favoritos</h3>
            <p className="text-primary-500 mb-6">Explora nuestro catálogo y guarda las propiedades que más te gusten.</p>
            <Link href="/" className="px-6 py-2 bg-accent hover:bg-accent-hover text-white font-medium rounded-md transition-colors inline-block">
              Ver Propiedades
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {properties.map((property) => (
              <Link href={`/property/${property.id}`} key={property.id} className="bg-white dark:bg-primary-950 rounded-xl shadow-md overflow-hidden border border-primary-100 dark:border-primary-900 hover:shadow-lg transition-shadow group cursor-pointer block relative">
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
      </div>
    </main>
  );
}
