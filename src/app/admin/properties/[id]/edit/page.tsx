'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter, useParams } from 'next/navigation';
import { toast } from 'react-hot-toast';
import imageCompression from 'browser-image-compression';
import BackButton from '@/components/BackButton';

export default function EditProperty() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  
  // Existing uploaded images
  const [existingImages, setExistingImages] = useState<string[]>([]);
  // New images to upload
  const [newImages, setNewImages] = useState<File[]>([]);
  
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
    is_published: true,
  });

  useEffect(() => {
    async function loadProperty() {
      const { data, error } = await supabase.from('properties').select('*').eq('id', id).single();
      if (data) {
        setFormData({
          title: data.title,
          description: data.description,
          price: data.price.toString(),
          currency: data.currency,
          operation_type: data.operation_type,
          property_type: data.property_type,
          bedrooms: data.bedrooms?.toString() || '',
          bathrooms: data.bathrooms?.toString() || '',
          city: data.city,
          address: data.address,
          is_published: data.is_published,
        });
        setExistingImages(data.image_urls || []);
      }
      setFetching(false);
    }
    loadProperty();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setNewImages(Array.from(e.target.files));
    }
  };

  const setAsCover = (index: number) => {
    const updatedImages = [...existingImages];
    const [selectedImage] = updatedImages.splice(index, 1);
    updatedImages.unshift(selectedImage); // Move to front
    setExistingImages(updatedImages);
  };

  const deleteExistingImage = (index: number) => {
    toast((t) => (
      <div className="p-2">
        <p className="font-bold text-sm text-gray-900 mb-4">¿Estás seguro de eliminar esta imagen?</p>
        <div className="flex justify-end gap-2">
          <button 
            type="button"
            onClick={() => toast.dismiss(t.id)} 
            className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded text-xs font-medium text-gray-800 transition-colors"
          >
            Cancelar
          </button>
          <button 
            type="button"
            onClick={() => {
              const updatedImages = [...existingImages];
              updatedImages.splice(index, 1);
              setExistingImages(updatedImages);
              toast.dismiss(t.id);
              toast.success('Imagen borrada (Recuerda guardar los cambios)');
            }} 
            className="px-3 py-1.5 bg-red-500 hover:bg-red-600 rounded text-xs font-medium text-white transition-colors"
          >
            Sí, eliminar
          </button>
        </div>
      </div>
    ), { duration: Infinity, position: 'top-center' });
  };

  const deleteProperty = async () => {
    toast((t) => (
      <div className="p-2">
        <p className="font-bold text-sm text-gray-900 mb-4">¿Estás seguro de que quieres eliminar esta propiedad permanentemente?</p>
        <div className="flex justify-end gap-2">
          <button 
            type="button"
            onClick={() => toast.dismiss(t.id)} 
            className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded text-xs font-medium text-gray-800 transition-colors"
          >
            Cancelar
          </button>
          <button 
            type="button"
            onClick={async () => {
              toast.dismiss(t.id);
              setLoading(true);
              const { error } = await supabase.from('properties').delete().eq('id', id);
              if (error) {
                toast.error('Error al eliminar: ' + error.message);
                setLoading(false);
              } else {
                toast.success('Propiedad eliminada correctamente');
                router.push('/admin');
              }
            }} 
            className="px-3 py-1.5 bg-red-500 hover:bg-red-600 rounded text-xs font-medium text-white transition-colors"
          >
            Sí, eliminar
          </button>
        </div>
      </div>
    ), { duration: Infinity, position: 'top-center' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Upload NEW Images
      const uploadedUrls: string[] = [...existingImages];
      for (const file of newImages) {
        // Compress the image
        const options = {
          maxSizeMB: 0.8, // Maximum 800KB
          maxWidthOrHeight: 1920, // Max 1080p resolution
          useWebWorker: true,
        };
        const compressedFile = await imageCompression(file, options);

        const fileExt = compressedFile.name.split('.').pop() || 'jpg';
        const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
        const filePath = `properties/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('property-images')
          .upload(filePath, compressedFile);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('property-images')
          .getPublicUrl(filePath);

        uploadedUrls.push(publicUrl);
      }

      // 2. Update Property
      const { error } = await supabase.from('properties').update({
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
        is_published: formData.is_published,
        image_urls: uploadedUrls, // Final ordered URLs
      }).eq('id', id);

      if (error) throw error;
      toast.success('Propiedad actualizada correctamente');
      router.push('/admin');

    } catch (error: any) {
      toast.error('Error al actualizar la propiedad: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <div className="p-10 text-center">Cargando datos...</div>;

  return (
    <div className="max-w-4xl mx-auto pb-12">
      <div className="mb-8">
        <BackButton fallback="/admin" />
        <h1 className="text-3xl font-bold text-primary-900 dark:text-white mt-4">Editar Propiedad</h1>
      </div>

      <form onSubmit={handleSubmit} className="bg-white dark:bg-primary-950 p-8 rounded-lg shadow-sm border border-primary-100 dark:border-primary-900 space-y-8">
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="col-span-1 md:col-span-2">
            <label className="block text-sm font-medium text-primary-900 dark:text-primary-200 mb-1">Título</label>
            <input required name="title" value={formData.title} onChange={handleChange} className="w-full px-4 py-2 rounded-md border border-primary-300 dark:border-primary-700 bg-white dark:bg-primary-900 text-primary-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none" />
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
              <input required type="number" name="price" value={formData.price} onChange={handleChange} className="w-full px-4 py-2 rounded-md border border-primary-300 dark:border-primary-700 bg-white dark:bg-primary-900 text-primary-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none" />
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
              <input type="number" name="bedrooms" value={formData.bedrooms} onChange={handleChange} className="w-full px-4 py-2 rounded-md border border-primary-300 dark:border-primary-700 bg-white dark:bg-primary-900 text-primary-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-primary-900 dark:text-primary-200 mb-1">Baños</label>
              <input type="number" name="bathrooms" value={formData.bathrooms} onChange={handleChange} className="w-full px-4 py-2 rounded-md border border-primary-300 dark:border-primary-700 bg-white dark:bg-primary-900 text-primary-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-primary-900 dark:text-primary-200 mb-1">Ciudad</label>
            <input required name="city" value={formData.city} onChange={handleChange} className="w-full px-4 py-2 rounded-md border border-primary-300 dark:border-primary-700 bg-white dark:bg-primary-900 text-primary-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none" />
          </div>

          <div>
            <label className="block text-sm font-medium text-primary-900 dark:text-primary-200 mb-1">Dirección</label>
            <input required name="address" value={formData.address} onChange={handleChange} className="w-full px-4 py-2 rounded-md border border-primary-300 dark:border-primary-700 bg-white dark:bg-primary-900 text-primary-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none" />
          </div>

          <div className="col-span-1 md:col-span-2">
            <label className="block text-sm font-medium text-primary-900 dark:text-primary-200 mb-1">Descripción</label>
            <textarea required rows={4} name="description" value={formData.description} onChange={handleChange} className="w-full px-4 py-2 rounded-md border border-primary-300 dark:border-primary-700 bg-white dark:bg-primary-900 text-primary-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none" />
          </div>

          <div className="col-span-1 md:col-span-2">
            <label className="flex items-center space-x-3 cursor-pointer p-4 bg-primary-50 dark:bg-primary-900 rounded-lg border border-primary-200 dark:border-primary-700 hover:bg-primary-100 dark:hover:bg-primary-800 transition-colors">
              <input 
                type="checkbox" 
                checked={formData.is_published} 
                onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })}
                className="w-5 h-5 text-accent border-gray-300 rounded focus:ring-accent accent-accent"
              />
              <span className="text-sm font-bold text-primary-900 dark:text-primary-200">
                Propiedad Pública (Visible en la web para los clientes)
              </span>
            </label>
            <p className="text-xs text-primary-500 mt-2 ml-1">Si desmarcas esta opción, la propiedad quedará "Pausada" (guardada como borrador) y solo la verás tú en el panel de administrador.</p>
          </div>

          {/* Image Management */}
          <div className="col-span-1 md:col-span-2 border-t border-primary-100 dark:border-primary-800 pt-6 mt-4">
            <h3 className="text-lg font-bold text-primary-900 dark:text-white mb-4">Gestión de Imágenes</h3>
            
            {existingImages.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                {existingImages.map((url, idx) => (
                  <div key={idx} className={`relative rounded-lg overflow-hidden border-2 ${idx === 0 ? 'border-accent shadow-md' : 'border-transparent'}`}>
                    <img src={url} alt={`Property ${idx}`} className="w-full h-32 object-cover" />
                    {idx === 0 && (
                      <div className="absolute top-0 left-0 bg-accent text-white text-xs font-bold px-2 py-1">
                        PORTADA
                      </div>
                    )}
                    <div className="absolute bottom-0 left-0 right-0 bg-black/60 p-2 flex justify-between">
                      {idx !== 0 ? (
                        <button type="button" onClick={() => setAsCover(idx)} className="text-xs text-white hover:text-accent font-medium">Fijar Portada</button>
                      ) : (
                        <span className="text-xs text-transparent">Fijar Portada</span>
                      )}
                      <button type="button" onClick={() => deleteExistingImage(idx)} className="text-xs text-red-400 hover:text-red-300 font-medium">Borrar</button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <label className="block text-sm font-medium text-primary-900 dark:text-primary-200 mb-1">Agregar nuevas imágenes</label>
            <input type="file" multiple accept="image/*" onChange={handleImageChange} className="w-full text-sm text-primary-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100 dark:file:bg-primary-900 dark:file:text-primary-200" />
            {newImages.length > 0 && <p className="text-sm mt-2 text-green-600">{newImages.length} imagen(es) nueva(s) por subir.</p>}
          </div>
        </div>

        <div className="flex flex-col-reverse sm:flex-row justify-between items-center pt-4 border-t border-primary-100 dark:border-primary-800 gap-4 sm:gap-0">
          <button type="button" onClick={deleteProperty} className="w-full sm:w-auto px-6 py-2 text-red-500 font-medium hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors border border-transparent hover:border-red-200 dark:hover:border-red-800">
            Eliminar Propiedad
          </button>
          <div className="flex space-x-4 w-full sm:w-auto justify-end">
            <button type="button" onClick={() => router.back()} className="px-6 py-2 text-primary-700 dark:text-primary-300 font-medium hover:bg-primary-50 dark:hover:bg-primary-900 rounded-md transition-colors">
              Cancelar
            </button>
            <button type="submit" disabled={loading} className="px-6 py-2 bg-accent hover:bg-accent-hover text-white font-medium rounded-md transition-colors disabled:opacity-50 whitespace-nowrap">
              {loading ? 'Guardando...' : 'Guardar Cambios'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
