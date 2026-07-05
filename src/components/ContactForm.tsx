'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'react-hot-toast';

export default function ContactForm({ propertyId }: { propertyId: string }) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.from('leads').insert([
      {
        property_id: propertyId,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        message: formData.message,
      }
    ]);

    setLoading(false);

    if (error) {
      toast.error('Hubo un error al enviar tu mensaje. Por favor intenta de nuevo.');
      console.error(error);
    } else {
      toast.success('¡Mensaje enviado con éxito!');
      setSuccess(true);
      setFormData({ name: '', email: '', phone: '', message: '' });
    }
  };

  if (success) {
    return (
      <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-xl border border-green-200 dark:border-green-800 text-center">
        <div className="text-4xl mb-4">✅</div>
        <h3 className="text-lg font-bold text-green-800 dark:text-green-300 mb-2">¡Mensaje enviado!</h3>
        <p className="text-green-700 dark:text-green-400">
          La inmobiliaria ha recibido tus datos y te contactará a la brevedad.
        </p>
        <button 
          onClick={() => setSuccess(false)}
          className="mt-6 text-green-700 dark:text-green-400 hover:underline text-sm font-medium"
        >
          Enviar otro mensaje
        </button>
      </div>
    );
  }

  return (
    <div className="bg-primary-50 dark:bg-primary-900 p-6 rounded-xl border border-primary-100 dark:border-primary-800">
      <h3 className="text-lg font-bold text-primary-900 dark:text-white mb-2">¿Te interesa esta propiedad?</h3>
      <p className="text-primary-600 dark:text-primary-400 mb-6 text-sm">Déjanos tus datos y la inmobiliaria te contactará para coordinar una visita.</p>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-primary-700 dark:text-primary-300 mb-1">Nombre completo</label>
          <input required type="text" name="name" value={formData.name} onChange={handleChange} className="w-full px-3 py-2 text-sm rounded-md border border-primary-300 dark:border-primary-700 bg-white dark:bg-primary-950 text-primary-900 dark:text-white outline-none focus:ring-2 focus:ring-primary-500" placeholder="Ej: Juan Pérez" />
        </div>
        
        <div>
          <label className="block text-xs font-medium text-primary-700 dark:text-primary-300 mb-1">Email</label>
          <input required type="email" name="email" value={formData.email} onChange={handleChange} className="w-full px-3 py-2 text-sm rounded-md border border-primary-300 dark:border-primary-700 bg-white dark:bg-primary-950 text-primary-900 dark:text-white outline-none focus:ring-2 focus:ring-primary-500" placeholder="ejemplo@correo.com" />
        </div>

        <div>
          <label className="block text-xs font-medium text-primary-700 dark:text-primary-300 mb-1">Teléfono</label>
          <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className="w-full px-3 py-2 text-sm rounded-md border border-primary-300 dark:border-primary-700 bg-white dark:bg-primary-950 text-primary-900 dark:text-white outline-none focus:ring-2 focus:ring-primary-500" placeholder="+54 11 1234-5678" />
        </div>
        
        <div>
          <label className="block text-xs font-medium text-primary-700 dark:text-primary-300 mb-1">Mensaje</label>
          <textarea required name="message" value={formData.message} onChange={handleChange} rows={3} className="w-full px-3 py-2 text-sm rounded-md border border-primary-300 dark:border-primary-700 bg-white dark:bg-primary-950 text-primary-900 dark:text-white outline-none focus:ring-2 focus:ring-primary-500" placeholder="¡Hola! Me gustaría visitar esta propiedad..." />
        </div>

        <button type="submit" disabled={loading} className="w-full py-3 bg-accent hover:bg-accent-hover text-white font-bold rounded-lg transition-colors disabled:opacity-50">
          {loading ? 'Enviando...' : 'Contactar Inmobiliaria'}
        </button>
      </form>
    </div>
  );
}
