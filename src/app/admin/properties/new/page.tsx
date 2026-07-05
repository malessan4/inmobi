'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';

export default function NewProperty() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<File[]>([]);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    currency: 'USD',
    operation_type: 'venta',
    property_type: 'casa',
    bedrooms: '',
    bathrooms: '',
    city: '',
    address: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImages(Array.from(e.target.files));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Upload Images
      const uploadedUrls: string[] = [];
      for (const file of images) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
        const filePath = `properties/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('property-images')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('property-images')
          .getPublicUrl(filePath);

        uploadedUrls.push(publicUrl);
      }

      // 2. Insert Property
      const { error } = await supabase.from('properties').insert([
        {
          title: formData.title,
          description: formData.description,
          price: parseFloat(formData.price),
          currency: formData.currency,
          operation_type: formData.operation_type,
          property_type: formData.property_type,
          bedrooms: parseInt(formData.bedrooms) || 0,
          bathrooms: parseInt(formData.bathrooms) || 0,
          city: formData.city,
          address: formData.address,
          image_urls: uploadedUrls,
          is_published: true
        }
      ]);

      if (error) throw error;
      toast.success('Propiedad publicada correctamente');
      router.push('/admin');

    } catch (error: any) {
      toast.error('Error al crear la propiedad: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto pb-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-primary-900 dark:text-white">Nueva Propiedad</h1>
        <p className="text-primary-600 dark:text-primary-400 mt-1">Completa los datos para publicar una casa o departamento.</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white dark:bg-primary-950 p-8 rounded-lg shadow-sm border border-primary-100 dark:border-primary-900 space-y-8">
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="col-span-1 md:col-span-2">
            <label className="block text-sm font-medium text-primary-900 dark:text-primary-200 mb-1">Título de la Publicación</label>
            <input required name="title" value={formData.title} onChange={handleChange} className="w-full px-4 py-2 rounded-md border border-primary-300 dark:border-primary-700 bg-white dark:bg-primary-900 text-primary-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none" placeholder="Ej: Hermosa casa con piscina en zona norte" />
          </div>

          <div>
            <label className="block text-sm font-medium text-primary-900 dark:text-primary-200 mb-1">Operación</label>
            <select name="operation_type" value={formData.operation_type} onChange={handleChange} className="w-full px-4 py-2 rounded-md border border-primary-300 dark:border-primary-700 bg-white dark:bg-primary-900 text-primary-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none">
              <option value="venta">Venta</option>
              <option value="alquiler">Alquiler</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-primary-900 dark:text-primary-200 mb-1">Tipo de Inmueble</label>
            <select name="property_type" value={formData.property_type} onChange={handleChange} className="w-full px-4 py-2 rounded-md border border-primary-300 dark:border-primary-700 bg-white dark:bg-primary-900 text-primary-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none">
              <option value="casa">Casa</option>
              <option value="departamento">Departamento</option>
              <option value="terreno">Terreno</option>
              <option value="comercial">Comercial</option>
            </select>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div className="col-span-2">
              <label className="block text-sm font-medium text-primary-900 dark:text-primary-200 mb-1">Precio</label>
              <input required type="number" name="price" value={formData.price} onChange={handleChange} className="w-full px-4 py-2 rounded-md border border-primary-300 dark:border-primary-700 bg-white dark:bg-primary-900 text-primary-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none" placeholder="Ej: 150000" />
            </div>
            <div>
              <label className="block text-sm font-medium text-primary-900 dark:text-primary-200 mb-1">Moneda</label>
              <select name="currency" value={formData.currency} onChange={handleChange} className="w-full px-4 py-2 rounded-md border border-primary-300 dark:border-primary-700 bg-white dark:bg-primary-900 text-primary-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none">
                <option value="USD">USD</option>
                <option value="ARS">ARS</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-primary-900 dark:text-primary-200 mb-1">Habitaciones</label>
              <input type="number" name="bedrooms" value={formData.bedrooms} onChange={handleChange} className="w-full px-4 py-2 rounded-md border border-primary-300 dark:border-primary-700 bg-white dark:bg-primary-900 text-primary-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none" placeholder="0" />
            </div>
            <div>
              <label className="block text-sm font-medium text-primary-900 dark:text-primary-200 mb-1">Baños</label>
              <input type="number" name="bathrooms" value={formData.bathrooms} onChange={handleChange} className="w-full px-4 py-2 rounded-md border border-primary-300 dark:border-primary-700 bg-white dark:bg-primary-900 text-primary-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none" placeholder="0" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-primary-900 dark:text-primary-200 mb-1">Ciudad</label>
            <input required name="city" value={formData.city} onChange={handleChange} className="w-full px-4 py-2 rounded-md border border-primary-300 dark:border-primary-700 bg-white dark:bg-primary-900 text-primary-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none" placeholder="Ej: Buenos Aires" />
          </div>

          <div>
            <label className="block text-sm font-medium text-primary-900 dark:text-primary-200 mb-1">Dirección</label>
            <input required name="address" value={formData.address} onChange={handleChange} className="w-full px-4 py-2 rounded-md border border-primary-300 dark:border-primary-700 bg-white dark:bg-primary-900 text-primary-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none" placeholder="Ej: Av. Libertador 1234" />
          </div>

          <div className="col-span-1 md:col-span-2">
            <label className="block text-sm font-medium text-primary-900 dark:text-primary-200 mb-1">Descripción</label>
            <textarea required rows={4} name="description" value={formData.description} onChange={handleChange} className="w-full px-4 py-2 rounded-md border border-primary-300 dark:border-primary-700 bg-white dark:bg-primary-900 text-primary-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none" placeholder="Describe las características principales..." />
          </div>

          <div className="col-span-1 md:col-span-2">
            <label className="block text-sm font-medium text-primary-900 dark:text-primary-200 mb-1">Fotos de la Propiedad</label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-primary-300 dark:border-primary-700 border-dashed rounded-md hover:border-primary-500 dark:hover:border-primary-500 transition-colors">
              <div className="space-y-1 text-center">
                <svg className="mx-auto h-12 w-12 text-primary-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                  <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <div className="flex text-sm text-primary-600 dark:text-primary-400 justify-center">
                  <label htmlFor="file-upload" className="relative cursor-pointer rounded-md font-medium text-accent hover:text-accent-hover focus-within:outline-none">
                    <span>Sube archivos</span>
                    <input id="file-upload" name="file-upload" type="file" multiple accept="image/*" className="sr-only" onChange={handleImageChange} />
                  </label>
                  <p className="pl-1">o arrastra y suelta</p>
                </div>
                <p className="text-xs text-primary-500">
                  PNG, JPG, GIF hasta 10MB
                </p>
                {images.length > 0 && (
                  <p className="text-sm font-medium text-green-600 mt-2">{images.length} archivo(s) seleccionado(s)</p>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t border-primary-100 dark:border-primary-800 space-x-4">
          <button type="button" onClick={() => router.back()} className="px-6 py-2 text-primary-700 dark:text-primary-300 font-medium hover:bg-primary-50 dark:hover:bg-primary-900 rounded-md transition-colors">
            Cancelar
          </button>
          <button type="submit" disabled={loading} className="px-6 py-2 bg-accent hover:bg-accent-hover text-white font-medium rounded-md transition-colors disabled:opacity-50 flex items-center gap-2">
            {loading ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                Publicando...
              </>
            ) : 'Publicar Propiedad'}
          </button>
        </div>
      </form>
    </div>
  );
}
