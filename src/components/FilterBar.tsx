'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState, FormEvent } from 'react';

export default function FilterBar() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [operationType, setOperationType] = useState(searchParams.get('operation') || '');
  const [propertyType, setPropertyType] = useState(searchParams.get('type') || '');
  const [bedrooms, setBedrooms] = useState(searchParams.get('bedrooms') || '');
  const [sort, setSort] = useState(searchParams.get('sort') || '');

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (query) params.set('q', query);
    if (operationType) params.set('operation', operationType);
    if (propertyType) params.set('type', propertyType);
    if (bedrooms) params.set('bedrooms', bedrooms);
    if (sort) params.set('sort', sort);

    router.push(`/?${params.toString()}`);
  };

  const clearFilters = () => {
    setQuery('');
    setOperationType('');
    setPropertyType('');
    setBedrooms('');
    setSort('');
    router.push('/');
  };

  const hasFilters = query || operationType || propertyType || bedrooms || sort;

  return (
    <form onSubmit={handleSearch} className="bg-white dark:bg-primary-950 p-4 rounded-xl shadow-md border border-primary-100 dark:border-primary-900 flex flex-col md:flex-row gap-4 mb-8">
      <div className="flex-1">
        <label htmlFor="q" className="sr-only">Buscar</label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-primary-400">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
          </div>
          <input
            type="text"
            id="q"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar por ciudad, título o dirección..."
            className="block w-full pl-10 pr-3 py-3 border border-primary-300 dark:border-primary-700 rounded-lg bg-primary-50 dark:bg-primary-900 text-primary-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-accent"
          />
        </div>
      </div>
      
      <div className="w-full md:w-48">
        <select
          value={operationType}
          onChange={(e) => setOperationType(e.target.value)}
          className="block w-full px-3 py-3 border border-primary-300 dark:border-primary-700 rounded-lg bg-primary-50 dark:bg-primary-900 text-primary-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-accent appearance-none cursor-pointer"
        >
          <option value="">Operación (Todas)</option>
          <option value="venta">Venta</option>
          <option value="alquiler">Alquiler</option>
        </select>
      </div>

      <div className="w-full md:w-48">
        <select
          value={propertyType}
          onChange={(e) => setPropertyType(e.target.value)}
          className="block w-full px-3 py-3 border border-primary-300 dark:border-primary-700 rounded-lg bg-primary-50 dark:bg-primary-900 text-primary-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-accent appearance-none cursor-pointer"
        >
          <option value="">Inmueble (Todos)</option>
          <option value="casa">Casa</option>
          <option value="departamento">Departamento</option>
          <option value="terreno">Terreno</option>
          <option value="comercial">Comercial</option>
        </select>
      </div>

      <div className="w-full md:w-32">
        <select
          value={bedrooms}
          onChange={(e) => setBedrooms(e.target.value)}
          className="block w-full px-3 py-3 border border-primary-300 dark:border-primary-700 rounded-lg bg-primary-50 dark:bg-primary-900 text-primary-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-accent appearance-none cursor-pointer"
        >
          <option value="">Habitaciones</option>
          <option value="1">1+ Hab</option>
          <option value="2">2+ Hab</option>
          <option value="3">3+ Hab</option>
          <option value="4">4+ Hab</option>
        </select>
      </div>

      <div className="w-full md:w-48">
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="block w-full px-3 py-3 border border-primary-300 dark:border-primary-700 rounded-lg bg-primary-50 dark:bg-primary-900 text-primary-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-accent appearance-none cursor-pointer"
        >
          <option value="">Ordenar por</option>
          <option value="price_asc">Menor Precio</option>
          <option value="price_desc">Mayor Precio</option>
          <option value="newest">Más Recientes</option>
        </select>
      </div>

      <div className="flex gap-2 w-full md:w-auto">
        <button
          type="submit"
          className="flex-1 md:flex-none px-6 py-3 bg-accent hover:bg-accent-hover text-white font-bold rounded-lg transition-colors shadow-sm"
        >
          Buscar
        </button>
        {hasFilters && (
          <button
            type="button"
            onClick={clearFilters}
            className="px-4 py-3 bg-primary-100 hover:bg-primary-200 dark:bg-primary-800 dark:hover:bg-primary-700 text-primary-700 dark:text-primary-200 font-medium rounded-lg transition-colors"
            title="Limpiar filtros"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
    </form>
  );
}
