import { Suspense } from 'react';
import ThanksContent from './ThanksContent';

export const metadata = {
  title: '¡Gracias por acompañarnos! | Recuerdos',
  description: 'Un mensaje especial de Dayan y Diego.',
  openGraph: {
    title: '¡Gracias por acompañarnos! | Recuerdos',
    description: 'Un mensaje especial de Dayan y Diego.',
    images: ['/assets/portada.png'],
    url: 'https://dyd-revelacion.vercel.app/gracias',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: '¡Gracias por acompañarnos! | Recuerdos',
    images: ['/assets/portada.png'],
  }
};

export default function ThanksPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#fce7f3] flex items-center justify-center font-boss text-girl-pink uppercase tracking-[0.2em]">
        Cargando gratitud...
      </div>
    }>
      <ThanksContent />
    </Suspense>
  );
}
