'use client';

import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';

type FavoriteButtonProps = {
  propertyId: string;
  className?: string;
};

export default function FavoriteButton({ propertyId, className = '' }: FavoriteButtonProps) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    setIsFavorite(favorites.includes(propertyId));
  }, [propertyId]);

  const toggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigating if wrapped in a Link
    e.stopPropagation();
    
    let favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    
    if (isFavorite) {
      favorites = favorites.filter((id: string) => id !== propertyId);
      toast.success('Eliminado de favoritos', { icon: '💔' });
    } else {
      favorites.push(propertyId);
      toast.success('Guardado en favoritos', { icon: '❤️' });
    }
    
    localStorage.setItem('favorites', JSON.stringify(favorites));
    setIsFavorite(!isFavorite);
    
    // Dispatch a custom event so other components (like Navbar) can update
    window.dispatchEvent(new Event('favoritesUpdated'));
  };

  if (!mounted) return null; // Avoid hydration mismatch

  return (
    <button
      onClick={toggleFavorite}
      className={`p-2 rounded-full bg-white/80 backdrop-blur-sm shadow-sm hover:bg-white transition-all hover:scale-110 ${className}`}
      aria-label={isFavorite ? "Quitar de favoritos" : "Añadir a favoritos"}
      title={isFavorite ? "Quitar de favoritos" : "Añadir a favoritos"}
    >
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 24 24" 
        fill={isFavorite ? "#ef4444" : "none"} 
        stroke={isFavorite ? "#ef4444" : "currentColor"} 
        strokeWidth="2"
        className="w-5 h-5 transition-colors"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
      </svg>
    </button>
  );
}
