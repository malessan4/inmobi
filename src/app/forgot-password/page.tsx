'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { toast } from 'react-hot-toast';
import Navbar from '@/components/Navbar';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (error) {
      toast.error('Error al solicitar recuperación: ' + error.message);
      setLoading(false);
    } else {
      setSuccess(true);
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white dark:bg-primary-950 p-8 rounded-xl shadow-lg border border-primary-100 dark:border-primary-900">
          <h1 className="text-2xl font-bold text-primary-900 dark:text-white text-center mb-2">Recuperar Contraseña</h1>
          <p className="text-primary-600 dark:text-primary-400 text-center text-sm mb-6">Ingresa tu email y te enviaremos un enlace para cambiar tu contraseña.</p>
          
          {success ? (
            <div className="bg-green-50 dark:bg-green-900/30 text-green-800 dark:text-green-300 p-4 rounded-lg text-sm text-center">
              Revisa tu bandeja de entrada o spam. Te hemos enviado un enlace para recuperar tu cuenta.
            </div>
          ) : (
            <form onSubmit={handleReset} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-primary-700 dark:text-primary-300 mb-1">Email</label>
                <input 
                  required 
                  type="email" 
                  value={email} 
                  onChange={e => setEmail(e.target.value)} 
                  className="w-full px-4 py-2 rounded-lg border border-primary-300 dark:border-primary-700 bg-white dark:bg-primary-900 text-primary-900 dark:text-white outline-none focus:ring-2 focus:ring-primary-500" 
                />
              </div>
              <button 
                type="submit" 
                disabled={loading} 
                className="w-full py-2.5 mt-2 bg-accent hover:bg-accent-hover text-white font-bold rounded-lg transition-colors disabled:opacity-50"
              >
                {loading ? 'Enviando enlace...' : 'Enviar enlace'}
              </button>
            </form>
          )}

          <p className="mt-6 text-center text-sm text-primary-600 dark:text-primary-400">
            <Link href="/login" className="text-accent hover:underline font-bold">Volver al login</Link>
          </p>
        </div>
      </div>
    </main>
  );
}
