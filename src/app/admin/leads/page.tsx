'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { toast } from 'react-hot-toast';

type Lead = {
  id: string;
  property_id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  status: string;
  created_at: string;
  properties: {
    title: string;
  };
};

export default function AdminLeads() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeads();
  }, []);

  async function fetchLeads() {
    setLoading(true);
    const { data, error } = await supabase
      .from('leads')
      .select('*, properties(title)')
      .order('created_at', { ascending: false });
    
    if (data) {
      setLeads(data as Lead[]);
    } else {
      console.error(error);
    }
    setLoading(false);
  }

  async function updateStatus(id: string, newStatus: string) {
    const { error } = await supabase.from('leads').update({ status: newStatus }).eq('id', id);
    if (!error) {
      toast.success('Estado actualizado');
      setLeads(leads.map(lead => lead.id === id ? { ...lead, status: newStatus } : lead));
    } else {
      toast.error('Error al actualizar el estado: ' + error.message);
    }
  }

  if (loading) {
    return <div className="p-10 text-center text-primary-500">Cargando contactos...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-primary-900 dark:text-white">Mis Contactos</h1>
          <p className="text-primary-600 dark:text-primary-400 mt-1">
            Gestiona los clientes interesados en tus propiedades.
          </p>
        </div>
      </div>

      <div className="bg-white dark:bg-primary-950 rounded-lg shadow-sm border border-primary-100 dark:border-primary-900 overflow-hidden">
        {leads.length === 0 ? (
          <div className="p-10 text-center text-primary-500">
            Aún no tienes contactos.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-primary-50 dark:bg-primary-900 border-b border-primary-100 dark:border-primary-800">
                <tr className="text-left text-xs font-semibold tracking-wide text-primary-500 dark:text-primary-400 uppercase">
                  <th className="p-4">Fecha</th>
                  <th className="p-4">Cliente</th>
                  <th className="p-4">Propiedad de Interés</th>
                  <th className="p-4">Estado</th>
                  <th className="p-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-primary-100 dark:divide-primary-800">
                {leads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-primary-50/50 dark:hover:bg-primary-900/50 transition-colors">
                    <td className="p-4 text-sm text-primary-900 dark:text-primary-200">
                      {new Date(lead.created_at).toLocaleDateString()}
                    </td>
                    <td className="p-4">
                      <p className="text-sm font-bold text-primary-900 dark:text-white">{lead.name}</p>
                      <p className="text-xs text-primary-500">{lead.email}</p>
                      <p className="text-xs text-primary-500">{lead.phone}</p>
                    </td>
                    <td className="p-4">
                      <Link href={`/property/${lead.property_id}`} target="_blank" className="text-sm text-accent hover:underline line-clamp-1">
                        {lead.properties?.title || 'Propiedad Eliminada'}
                      </Link>
                      <div className="mt-2 text-xs text-primary-600 dark:text-primary-300 p-2 bg-primary-50 dark:bg-primary-900 rounded border border-primary-100 dark:border-primary-800">
                        {lead.message}
                      </div>
                    </td>
                    <td className="p-4">
                      <select 
                        value={lead.status}
                        onChange={(e) => updateStatus(lead.id, e.target.value)}
                        className={`text-xs font-bold px-2 py-1 rounded-full outline-none cursor-pointer ${
                          lead.status === 'nuevo' ? 'bg-blue-100 text-blue-800' :
                          lead.status === 'contactado' ? 'bg-yellow-100 text-yellow-800' :
                          lead.status === 'cerrado' ? 'bg-green-100 text-green-800' :
                          'bg-red-100 text-red-800'
                        }`}
                      >
                        <option value="nuevo">Nuevo</option>
                        <option value="contactado">Contactado</option>
                        <option value="descartado">Descartado</option>
                        <option value="cerrado">Cerrado</option>
                      </select>
                    </td>
                    <td className="p-4 text-right">
                      <a href={`mailto:${lead.email}`} className="text-accent hover:text-accent-hover font-medium text-sm">Responder</a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
