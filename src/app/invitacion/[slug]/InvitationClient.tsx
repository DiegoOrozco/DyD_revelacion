'use client';

import { Suspense, useState, use } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircleHeart, CheckCircle2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import Image from 'next/image';

function InvitationContent({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = use(params);
  const slug = resolvedParams.slug;
  const searchParams = useSearchParams();

  // Logic to parse slug (format: Name_Guests) or fallback to searchParams
  let nombre = 'Invitado Especial';
  let cupos = '1';

  if (slug && slug !== 'page') {
    const parts = slug.split('_');
    if (parts.length >= 1) {
       nombre = decodeURIComponent(parts[0].replace(/-/g, ' '));
       if (parts.length >= 2) cupos = parts[1];
    }
  } else {
    nombre = searchParams.get('nombre') || 'Invitado Especial';
    cupos = searchParams.get('cupos') || '1';
  }

  const [isOpen, setIsOpen] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);
  const [confirmedAs, setConfirmedAs] = useState<'mama' | 'papa' | null>(null);

  const handleConfirm = async () => {
    setIsConfirming(true);
    try {
      const { error } = await supabase
        .from('confirmations')
        .insert([{ guest_name: nombre, slots_assigned: parseInt(cupos), ha_confirmado: true }]);
      
      if (error) throw error;
      setConfirmedAs('mama'); 
    } catch (err) {
      console.error('Error confirming:', err);
      setConfirmedAs('mama'); 
    } finally {
      setIsConfirming(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#e0f2fe] via-[#fce7f3] to-[#fbcfe8] text-[#191C1D] flex flex-col items-center overflow-x-hidden font-inter relative select-none">
      <svg style={{ position: 'absolute', width: 0, height: 0 }} aria-hidden="true">
        <filter id="remove-bg" colorInterpolationFilters="sRGB">
          <feColorMatrix type="matrix" values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 -1 -1 -1 3 0" />
        </filter>
      </svg>
      <AnimatePresence mode="wait">
        {!isOpen ? (
          <motion.div key="envelope-view" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }} className="w-full min-h-screen flex flex-col items-center justify-center p-6 text-center relative z-10">
            <motion.p initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="text-sm tracking-[0.3em] text-gray-700 uppercase mb-2 font-medium">TE INVITAMOS A NUESTRA</motion.p>
            <div className="flex flex-col items-center justify-center mb-12">
              <h1 className="font-elegant text-7xl text-boy-blue drop-shadow-sm -mb-4 z-10">Revelación</h1>
              <h1 className="font-elegant text-6xl text-girl-pink drop-shadow-sm ml-12">De género</h1>
            </div>
            <div className="relative mt-8 group cursor-pointer" onClick={() => setIsOpen(true)}>
              <div className="w-[300px] h-[200px] bg-white rounded-lg shadow-xl relative overflow-hidden flex items-center justify-center border border-gray-100">
                <svg className="absolute inset-0 w-full h-full opacity-30" viewBox="0 0 300 200"><path d="M0,0 L150,100 L300,0" fill="none" stroke="#000" strokeWidth="2" opacity="0.1"/></svg>
              </div>
              <motion.div className="absolute -top-[140px] left-1/2 -translate-x-1/2 flex items-end justify-center w-[300px] pointer-events-none" animate={{ y: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}>
                <div className="w-[110px] h-[120px] relative top-4 ml-8" style={{ filter: 'url(#remove-bg)' }}><Image src="/assets/user_boss_girl.png" alt="Boss Girl" fill className="object-contain" /></div>
                <div className="w-[140px] h-[160px] relative ml-[-20px]" style={{ filter: 'url(#remove-bg)' }}><Image src="/assets/user_boss_boy.png" alt="Boss Boy" fill className="object-contain" /></div>
              </motion.div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full shadow-lg border-2 border-white flex items-center justify-center overflow-hidden" style={{ background: "linear-gradient(90deg, #FFB6C1 50%, #87CEEB 50%)" }}>
                 <div className="w-14 h-14 rounded-full border border-white/40 shadow-inner flex items-center justify-center bg-transparent backdrop-blur-sm"><div className="w-8 h-8 rounded-full bg-white/20"></div></div>
              </div>
              <p className="absolute -bottom-10 left-1/2 -translate-x-1/2 text-xs tracking-widest uppercase text-gray-600 w-full text-center">Click para abrir la invitación</p>
            </div>
          </motion.div>
        ) : (
          <motion.div key="content-view" initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} className="w-full min-h-screen flex flex-col items-center pt-12 pb-24 px-6 max-w-md mx-auto relative z-10">
            <div className="w-full mb-8 relative rounded-2xl overflow-hidden shadow-lg border-4 border-white aspect-video bg-gray-200">
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/10">
                <div className="w-16 h-16 bg-white/50 backdrop-blur-md rounded-full flex items-center justify-center cursor-pointer hover:bg-white/80 transition-all"><div className="w-0 h-0 border-t-8 border-t-transparent border-l-[16px] border-l-pink-500 border-b-8 border-b-transparent ml-2"></div></div>
                <p className="mt-2 text-sm font-bold text-gray-700 tracking-widest uppercase bg-white/50 px-3 py-1 rounded-full backdrop-blur-sm">Ver Video</p>
              </div>
            </div>
            <div className="text-center mb-8">
               <p className="text-[10px] md:text-xs tracking-widest text-gray-600 uppercase mb-4 font-medium">¡LA DULCE ESPERA ESTÁ POR TERMINAR!</p>
               <div className="flex flex-col items-center justify-center mb-6 relative z-10 w-full space-y-[-10px]">
                  <h1 className="font-elegant text-6xl text-boy-blue drop-shadow-sm relative z-10">Revelación</h1>
                  <h1 className="font-elegant text-5xl text-girl-pink drop-shadow-sm ml-6 relative z-20">De género</h1>
               </div>
            </div>
            <div className="flex justify-center items-end gap-0 mb-8 h-40 relative w-full">
                <div className="w-[140px] h-full relative" style={{ filter: 'url(#remove-bg)' }}><Image src="/assets/user_boss_boy.png" alt="Boss Boy" fill className="object-contain" /></div>
                <div className="w-[110px] h-[75%] relative" style={{ filter: 'url(#remove-bg)' }}><Image src="/assets/user_boss_girl.png" alt="Boss Girl" fill className="object-contain" /></div>
            </div>
            <div className="text-center px-4 mb-4">
               <p className="text-[14px] font-bold text-gray-800 mb-2 tracking-wide font-inter">¡HOLA {nombre.toUpperCase()}!</p>
               <p className="text-[12px] font-bold text-gray-600 mb-6 tracking-[0.2em] font-inter">({cupos} CUPOS)</p>
               <p className="text-[10px] uppercase tracking-widest text-gray-700 leading-relaxed font-semibold">UN NUEVO INTEGRANTE ESTÁ POR LLEGAR A ESTA FAMILIA.<br/>CON AMOR E ILUSIÓN ESPERAMOS SU LLEGADA.<br/>GRACIAS POR SER PARTE DE ESTA ALEGRÍA.</p>
            </div>
            <div className="w-full flex flex-col items-center mb-10 relative mt-8">
               <p className="text-[10px] uppercase tracking-[0.2em] text-gray-600 mb-2">TE INVITAMOS A CELEBRAR EL</p>
               <div className="flex items-center gap-4 w-full justify-center text-gray-800">
                  <div className="flex flex-col items-center border-y border-gray-400/30 py-1 w-20"><span className="text-[11px] uppercase tracking-widest font-bold">ABRIL</span></div>
                  <div className="flex flex-col items-center px-2"><span className="text-[10px] uppercase tracking-widest font-medium mb-[-5px]">SÁBADO</span><span className="text-6xl font-elegant text-boy-blue leading-none">11</span></div>
                  <div className="flex flex-col items-center border-y border-gray-400/30 py-1 w-20">
                     <span className="text-[11px] uppercase tracking-widest font-bold">3:30 PM</span>
                  </div>
               </div>
            </div>
            <div className="w-full flex flex-col items-center mb-16 text-center px-4">
               <h2 className="font-elegant text-4xl text-girl-pink/80 mb-2 drop-shadow-sm">Dirección</h2>
               <p className="text-[10px] font-bold uppercase tracking-widest text-gray-700 leading-relaxed mb-4">
                  San Antonio del Cobre,<br/>San Antonio, Desamparados
               </p>
               <button onClick={() => window.open('https://waze.com/ul/hd1u0r6pmg', '_blank')} className="bg-[#87CEEB] text-white px-8 py-3 rounded-full shadow-md hover:bg-blue-400 font-bold tracking-wider text-xs flex items-center gap-2 uppercase">
                 <div className="bg-white rounded-full p-1"><CheckCircle2 size={16} className="text-[#87CEEB]"/></div>
                 VER UBICACIÓN
               </button>
               <p className="text-[8px] uppercase font-bold tracking-widest text-gray-500 mt-6 leading-relaxed max-w-[280px]">
                  AL MOMENTO DE LLEGAR, EN LA PORTERÍA INDICAR QUE VAN PARA LA CASA 15.
               </p>
            </div>
            <div className="w-full text-center mb-16 relative z-20">
               <h2 className="font-elegant text-5xl text-girl-pink/80 mb-4 drop-shadow-sm">Confirmación</h2>
               <div className="flex flex-col gap-3 w-full px-12 items-center">
                  {!confirmedAs ? (
                     <button onClick={handleConfirm} disabled={isConfirming} className="w-[240px] bg-gradient-to-r from-boy-blue to-girl-pink text-white py-4 rounded-full shadow-xl flex items-center justify-center gap-3 border-2 border-white"><MessageCircleHeart size={20} /><span className="font-bold tracking-widest text-[11px]">CONFIRMAR ASISTENCIA</span></button>
                  ) : (
                  <div className="w-[240px] py-4 rounded-full shadow-xl flex items-center justify-center gap-2 text-white bg-green-500 border-2 border-white"><CheckCircle2 size={20} /><span className="font-bold tracking-widest text-[11px]">¡CONÉCTATE CON ÉXITO!</span></div>
                  )}
               </div>
            </div>
            <div className="w-full flex justify-between px-2 mb-20 gap-4 relative">
              <div className="flex flex-col items-center w-1/2 relative">
                <div className="w-full h-[220px] relative pointer-events-none" style={{ filter: 'url(#remove-bg)' }}><Image src="/assets/user_boss_boy.png" alt="Boy" fill className="object-contain" /></div>
                <p className="text-[10px] text-blue-500 font-bold uppercase tracking-widest mt-2">VISTE DE CELESTE</p>
              </div>
              <div className="flex flex-col items-center w-1/2 relative mt-4">
                <div className="w-full h-[180px] relative pointer-events-none mt-10" style={{ filter: 'url(#remove-bg)' }}><Image src="/assets/user_boss_girl.png" alt="Girl" fill className="object-contain" /></div>
                <p className="text-[10px] text-pink-500 font-bold uppercase tracking-widest mt-2">VISTE DE ROSADO</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}

export default function Page() { 
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#fce7f3] flex items-center justify-center font-boss">Cargando la magia...</div>}>
      <InvitationContent params={Promise.resolve({ slug: 'page' })} />
    </Suspense>
  ); 
}
