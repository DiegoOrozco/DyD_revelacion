import { Metadata } from 'next';
import { InvitationContent } from '../InvitationContent';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  let nombre = 'Invitado Especial';
  if (slug && slug !== 'page') {
    nombre = decodeURIComponent(slug.split('_')[0].replace(/-/g, ' '));
  }

    return {
    title: `🧁 Invitación para ${nombre} | Revelación de Género`,
    description: `🍬 Estás invitado a nuestra gran revelación de género. ¡Acompáñanos en este momento especial!`,
    openGraph: {
      title: `🍼 Invitación Especial para ${nombre}`,
      description: `Haz clic para confirmar tu asistencia a nuestra revelación de género.`,
      images: ['/assets/portada.png'],
      url: `https://dyd-revelacion.vercel.app/invitacion/${slug}`,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `Invitación para ${nombre}`,
      images: ['/assets/portada.png'],
    }
  };
}

export default function Page({ params }: { params: Promise<{ slug: string }> }) {
  return <InvitationContent params={params} />;
}
