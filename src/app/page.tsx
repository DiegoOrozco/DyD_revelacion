import { redirect } from 'next/navigation';

export default function Home() {
  redirect('/invitacion?nombre=Invitado&cupos=1');
}
