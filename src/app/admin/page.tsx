'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { toast } from 'react-hot-toast';

type Property = {
  id: string;
  title: string;
  price: number;
  currency: string;
  operation_type: string;
  property_type: string;
  is_published: boolean;
};

export default function AdminDashboard() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProperties();
  }, []);

  async function fetchProperties() {
    setLoading(true);
    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .order('created_at', { ascending: false });
      
    if (data) setProperties(data);
    setLoading(false);
  }

  async function togglePublish(id: string, currentStatus: boolean) {
    await supabase.from('properties').update({ is_published: !currentStatus }).eq('id', id);
    fetchProperties();
  }

  const deleteProperty = async (id: string) => {
    toast((t) => (
      <div className="p-2">
        <p className="font-bold text-sm text-gray-900 mb-4">¿Estás seguro de que quieres eliminar esta propiedad?</p>
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
              const { error } = await supabase.from('properties').delete().eq('id', id);
              if (error) {
                toast.error('Error al eliminar: ' + error.message);
              } else {
                toast.success('Propiedad eliminada correctamente');
                fetchProperties();
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

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-primary-900 dark:text-white">Propiedades</h1>
          <p className="text-primary-600 dark:text-primary-400 mt-1">Gestiona el inventario de tu inmobiliaria</p>
        </div>
        <Link 
          href="/admin/properties/new" 
          className="px-6 py-3 bg-accent hover:bg-accent-hover text-white font-medium rounded-md transition-colors shadow-sm"
        >
          + Nueva Propiedad
        </Link>
      </div>

      <div className="bg-white dark:bg-primary-950 rounded-lg shadow-sm border border-primary-100 dark:border-primary-900 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-primary-500">Cargando propiedades...</div>
        ) : properties.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-primary-600 dark:text-primary-400 mb-4">Aún no has publicado ninguna propiedad.</p>
            <Link href="/admin/properties/new" className="text-accent hover:underline font-medium">
              Publica tu primera propiedad ahora
            </Link>
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-primary-50 dark:bg-primary-900 border-b border-primary-100 dark:border-primary-800 text-primary-700 dark:text-primary-200">
                <th className="p-4 font-semibold text-sm">Título</th>
                <th className="p-4 font-semibold text-sm">Tipo</th>
                <th className="p-4 font-semibold text-sm">Operación</th>
                <th className="p-4 font-semibold text-sm">Precio</th>
                <th className="p-4 font-semibold text-sm">Estado</th>
                <th className="p-4 font-semibold text-sm text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {properties.map((prop) => (
                <tr key={prop.id} className="border-b border-primary-100 dark:border-primary-800 hover:bg-primary-50/50 dark:hover:bg-primary-900/50">
                  <td className="p-4 font-medium text-primary-900 dark:text-white">{prop.title}</td>
                  <td className="p-4 text-primary-700 dark:text-primary-300 capitalize">{prop.property_type}</td>
                  <td className="p-4 text-primary-700 dark:text-primary-300 capitalize">
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${prop.operation_type === 'venta' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'}`}>
                      {prop.operation_type}
                    </span>
                  </td>
                  <td className="p-4 text-primary-900 dark:text-white font-medium">
                    ${prop.price.toLocaleString()} {prop.currency}
                  </td>
                  <td className="p-4">
                    <button 
                      onClick={() => togglePublish(prop.id, prop.is_published)}
                      className={`px-3 py-1 text-sm rounded-full ${prop.is_published ? 'bg-primary-100 text-primary-800 dark:bg-primary-800 dark:text-primary-100' : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'}`}
                    >
                      {prop.is_published ? 'Publicado' : 'Oculto'}
                    </button>
                  </td>
                  <td className="p-4 text-right space-x-3">
                    <Link href={`/admin/properties/${prop.id}/edit`} className="text-accent hover:text-accent-hover font-medium text-sm">Editar</Link>
                    <button onClick={() => deleteProperty(prop.id)} className="text-red-500 hover:text-red-700 font-medium text-sm">Eliminar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
