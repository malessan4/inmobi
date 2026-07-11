'use client';

import { useState } from 'react';

type ImageGalleryProps = {
  images: string[];
  operationType: string;
};

export default function ImageGallery({ images, operationType }: ImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  if (!images || images.length === 0) {
    return (
      <div className="h-96 w-full rounded-xl bg-primary-100 flex items-center justify-center text-primary-400">
        Sin imágenes disponibles
      </div>
    );
  }

  const nextImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setSelectedIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setSelectedIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div 
        className="relative h-96 w-full rounded-xl overflow-hidden bg-primary-100 cursor-pointer group"
        onClick={() => setIsLightboxOpen(true)}
      >
        <img 
          src={images[selectedIndex]} 
          alt={`Imagen de propiedad ${selectedIndex + 1}`} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute top-4 left-4">
          <span className={`px-4 py-2 rounded-full text-sm font-bold uppercase tracking-wider shadow-md ${
            operationType === 'venta' 
              ? 'bg-green-500 text-white' 
              : 'bg-blue-500 text-white'
          }`}>
            {operationType}
          </span>
        </div>
        
        {/* Hover overlay hint */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
          <span className="bg-black/50 text-white px-4 py-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2 backdrop-blur-sm">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
            </svg>
            Ampliar
          </span>
        </div>
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-4">
          {images.map((url, index) => (
            <div 
              key={index} 
              className={`h-24 rounded-lg overflow-hidden cursor-pointer border-2 transition-all ${selectedIndex === index ? 'border-accent opacity-100' : 'border-transparent opacity-70 hover:opacity-100'}`}
              onClick={() => setSelectedIndex(index)}
            >
              <img src={url} alt={`Miniatura ${index + 1}`} className="w-full h-full object-cover" />
            </div>
          ))}
        </div>
      )}

      {/* Lightbox Modal */}
      {isLightboxOpen && (
        <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-sm flex items-center justify-center">
          <button 
            className="absolute top-6 right-6 text-white/70 hover:text-white bg-black/50 hover:bg-black/80 rounded-full p-2 transition-colors z-50"
            onClick={() => setIsLightboxOpen(false)}
            aria-label="Cerrar"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div className="relative w-full max-w-6xl max-h-[90vh] flex items-center justify-center px-12">
            <img 
              src={images[selectedIndex]} 
              alt={`Imagen ampliada ${selectedIndex + 1}`} 
              className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl"
            />
            
            {images.length > 1 && (
              <>
                <button 
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white bg-black/50 hover:bg-black/80 rounded-full p-3 transition-colors"
                  onClick={prevImage}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                  </svg>
                </button>
                <button 
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white bg-black/50 hover:bg-black/80 rounded-full p-3 transition-colors"
                  onClick={nextImage}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                  </svg>
                </button>
              </>
            )}
            
            <div className="absolute bottom-[-40px] text-white/70 font-medium">
              {selectedIndex + 1} / {images.length}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
