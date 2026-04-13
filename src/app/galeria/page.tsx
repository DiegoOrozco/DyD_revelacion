import { Suspense } from 'react';
import GalleryContent from './GalleryContent';

export const metadata = {
  title: 'Compartir Recuerdos | Revelación de Género',
  description: 'Sube tus fotos y videos para compartir con nosotros en este día especial.',
  openGraph: {
    title: 'Compartir Recuerdos | Revelación de Género',
    description: 'Sube tus fotos y videos para compartir con nosotros en este día especial.',
    images: ['/assets/portada.png'],
    url: 'https://dyd-revelacion.vercel.app/galeria',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Compartir Recuerdos | Revelación de Género',
    images: ['/assets/portada.png'],
  }
};

export default function GalleryPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#fce7f3] flex items-center justify-center font-boss text-girl-pink">
        Cargando la magia...
      </div>
    }>
      <GalleryContent />
    </Suspense>
  );
}
