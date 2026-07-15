'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import Navbar from '@/components/Navbar';

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Verificar si realmente estamos en una sesión de recuperación
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) {
        toast.error('Sesión inválida o expirada. Solicita un nuevo enlace.');
        router.push('/forgot-password');
      }
    });
  }, [router]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.updateUser({
      password: password
    });

    if (error) {
      toast.error('Error al actualizar: ' + error.message);
      setLoading(false);
    } else {
      toast.success('Contraseña actualizada correctamente.');
      router.push('/login');
    }
  };

  return (
    <main className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white dark:bg-primary-950 p-8 rounded-xl shadow-lg border border-primary-100 dark:border-primary-900">
          <h1 className="text-2xl font-bold text-primary-900 dark:text-white text-center mb-6">Nueva Contraseña</h1>
          
          <form onSubmit={handleUpdate} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-primary-700 dark:text-primary-300 mb-1">Escribe tu nueva contraseña</label>
              <input 
                required 
                type="password" 
                value={password} 
                onChange={e => setPassword(e.target.value)} 
                minLength={6}
                className="w-full px-4 py-2 rounded-lg border border-primary-300 dark:border-primary-700 bg-white dark:bg-primary-900 text-primary-900 dark:text-white outline-none focus:ring-2 focus:ring-primary-500" 
              />
            </div>
            <button 
              type="submit" 
              disabled={loading} 
              className="w-full py-2.5 mt-2 bg-accent hover:bg-accent-hover text-white font-bold rounded-lg transition-colors disabled:opacity-50"
            >
              {loading ? 'Actualizando...' : 'Actualizar Contraseña'}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
