import { Suspense } from 'react';
import GalleryContent from './GalleryContent';

export const metadata = {
  title: 'Compartir Recuerdos | Revelación de Género',
  description: 'Sube tus fotos y videos para compartir con nosotros en este día especial.',
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
