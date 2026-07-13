'use client';

import { PDFDownloadLink } from '@react-pdf/renderer';
import { PropertyPDF } from './PropertyPDF';
import { useState, useEffect } from 'react';

export default function DownloadPDFButton({ property }: { property: any }) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null;

  return (
    <PDFDownloadLink 
      document={<PropertyPDF property={property} />} 
      fileName={`Ficha-${property.title.replace(/\s+/g, '-').toLowerCase()}.pdf`}
      className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-white dark:bg-primary-900 border border-primary-200 dark:border-primary-700 text-primary-700 dark:text-primary-200 hover:bg-primary-50 dark:hover:bg-primary-800 rounded-lg shadow-sm font-medium transition-colors"
    >
      {({ loading }) =>
        loading ? (
          <span className="text-sm">Generando...</span>
        ) : (
          <>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m.75 12l3 3m0 0l3-3m-3 3v-6m-1.5-9H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
            </svg>
            <span className="hidden sm:inline text-sm">Descargar Ficha</span>
          </>
        )
      }
    </PDFDownloadLink>
  );
}
