'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'react-hot-toast';

export default function SettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    contact_email: '',
    contact_phone: '',
    company_name: 'Inmobiout',
  });

  useEffect(() => {
    async function loadSettings() {
      // Intentamos cargar la configuración con id = 1
      const { data, error } = await supabase
        .from('settings')
        .select('*')
        .eq('id', 1)
        .single();

      if (data) {
        setFormData({
          contact_email: data.contact_email || '',
          contact_phone: data.contact_phone || '',
          company_name: data.company_name || 'Inmobiout',
        });
      } else if (error && error.code === 'PGRST116') {
        // La fila no existe, se creará al guardar
      }
      setLoading(false);
    }
    loadSettings();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const { error } = await supabase
      .from('settings')
      .upsert({
        id: 1,
        ...formData,
        updated_at: new Date().toISOString(),
      });

    if (error) {
      toast.error('Error al guardar la configuración: ' + error.message);
    } else {
      toast.success('Configuración guardada correctamente');
    }
    setSaving(false);
  };

  if (loading) return <div className="p-8">Cargando configuración...</div>;

  return (
    <div className="max-w-3xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-primary-900 dark:text-white">Configuración</h1>
        <p className="text-primary-600 dark:text-primary-400 mt-1">Administra los datos de contacto público de tu inmobiliaria</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white dark:bg-primary-950 p-8 rounded-lg shadow-sm border border-primary-100 dark:border-primary-900 space-y-6">
        
        <div>
          <label className="block text-sm font-medium text-primary-900 dark:text-primary-200 mb-1">Nombre de la Inmobiliaria</label>
          <input 
            required 
            name="company_name" 
            value={formData.company_name} 
            onChange={handleChange} 
            placeholder="Ej: Inmobiout"
            className="w-full px-4 py-2 rounded-md border border-primary-300 dark:border-primary-700 bg-white dark:bg-primary-900 text-primary-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none" 
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-primary-900 dark:text-primary-200 mb-1">Correo Electrónico de Contacto</label>
          <input 
            required 
            type="email"
            name="contact_email" 
            value={formData.contact_email} 
            onChange={handleChange} 
            placeholder="ventas@tuinmobiliaria.com"
            className="w-full px-4 py-2 rounded-md border border-primary-300 dark:border-primary-700 bg-white dark:bg-primary-900 text-primary-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none" 
          />
          <p className="text-xs text-primary-500 mt-1">Este correo recibirá los mensajes del formulario de contacto.</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-primary-900 dark:text-primary-200 mb-1">Teléfono Móvil (WhatsApp)</label>
          <input 
            required 
            name="contact_phone" 
            value={formData.contact_phone} 
            onChange={handleChange} 
            placeholder="Ej: 5491123456789"
            className="w-full px-4 py-2 rounded-md border border-primary-300 dark:border-primary-700 bg-white dark:bg-primary-900 text-primary-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none" 
          />
          <p className="text-xs text-primary-500 mt-1">Ingresa el número con código de país, sin el símbolo '+'. Ej: 54911 para Argentina.</p>
        </div>

        <div className="pt-6 border-t border-primary-100 dark:border-primary-800">
          <button 
            type="submit" 
            disabled={saving} 
            className="px-6 py-2 bg-accent hover:bg-accent-hover text-white font-medium rounded-md transition-colors disabled:opacity-50"
          >
            {saving ? 'Guardando...' : 'Guardar Cambios'}
          </button>
        </div>

      </form>
    </div>
  );
}
