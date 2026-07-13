import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: { flexDirection: 'column', backgroundColor: '#ffffff', padding: 40 },
  header: { fontSize: 24, marginBottom: 5, fontWeight: 'bold', color: '#1e3a8a' },
  subtitle: { fontSize: 12, marginBottom: 20, color: '#6b7280' },
  imageContainer: { width: '100%', height: 250, marginBottom: 20, backgroundColor: '#f3f4f6' },
  image: { width: '100%', height: '100%', objectFit: 'cover' },
  priceRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, paddingBottom: 10, borderBottomWidth: 1, borderBottomColor: '#e5e7eb' },
  price: { fontSize: 22, fontWeight: 'bold', color: '#f97316' },
  type: { fontSize: 14, backgroundColor: '#eff6ff', padding: '4px 8px', borderRadius: 4, color: '#1e3a8a', textTransform: 'uppercase' },
  featuresRow: { flexDirection: 'row', marginBottom: 20 },
  feature: { fontSize: 12, marginRight: 20, color: '#4b5563' },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 10, color: '#111827' },
  text: { fontSize: 11, lineHeight: 1.5, color: '#374151', marginBottom: 20 },
  footer: { position: 'absolute', bottom: 30, left: 40, right: 40, textAlign: 'center', color: '#9ca3af', fontSize: 10, borderTopWidth: 1, borderTopColor: '#e5e7eb', paddingTop: 10 }
});

export const PropertyPDF = ({ property }: { property: any }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Text style={styles.header}>{property.title}</Text>
      <Text style={styles.subtitle}>📍 {property.city} - {property.address}</Text>
      
      {property.image_urls && property.image_urls.length > 0 && (
        <View style={styles.imageContainer}>
          <Image src={property.image_urls[0]} style={styles.image} />
        </View>
      )}
      
      <View style={styles.priceRow}>
        <Text style={styles.price}>
          {property.currency === 'ARS' ? '$' : 'US$'} {property.price.toLocaleString()}
        </Text>
        <Text style={styles.type}>
          {property.operation_type} - {property.property_type}
        </Text>
      </View>
      
      <View style={styles.featuresRow}>
        {property.bedrooms > 0 && <Text style={styles.feature}>🛏️ {property.bedrooms} Habitaciones</Text>}
        {property.bathrooms > 0 && <Text style={styles.feature}>🚿 {property.bathrooms} Baños</Text>}
      </View>
      
      <Text style={styles.sectionTitle}>Descripción del Inmueble</Text>
      <Text style={styles.text}>{property.description}</Text>

      <Text style={styles.footer}>Generado por Inmobiout CRM - {new Date().toLocaleDateString()}</Text>
    </Page>
  </Document>
);
