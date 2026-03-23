'use client';

import { Suspense, useState, use } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircleHeart, CheckCircle2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import Image from 'next/image';
import { Metadata } from 'next';


export default function InvitationContent({ params }: { params: Promise<{ slug: string }> }) {
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
      setConfirmedAs('mama'); // Using mama as flag for generic success
    } catch (err) {
      console.error('Error confirming:', err);
      setConfirmedAs('mama'); 
    } finally {
      setIsConfirming(false);
    }
  };

  return (
    <Suspense fallback={<div className="min-h-screen bg-[#fce7f3] flex items-center justify-center font-boss">Cargando la magia...</div>}>
    <main className="min-h-screen bg-gradient-to-b from-[#e0f2fe] via-[#fce7f3] to-[#fbcfe8] text-[#191C1D] flex flex-col items-center overflow-x-hidden font-inter relative select-none">
      
      {/* SVG Filter for Background Removal (Removes White) */}
      <svg style={{ position: 'absolute', width: 0, height: 0 }} aria-hidden="true">
        <filter id="remove-bg" colorInterpolationFilters="sRGB">
          <feColorMatrix type="matrix" values="1 0 0 0 0
                                              0 1 0 0 0
                                              0 0 1 0 0
                                              -1 -1 -1 3 0" />
        </filter>
      </svg>

      <AnimatePresence mode="wait">
        {!isOpen ? (
          <motion.div 
            key="envelope-view"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
            transition={{ duration: 0.8 }}
            className="w-full min-h-screen flex flex-col items-center justify-center p-6 text-center relative z-10"
          >
            <motion.p 
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-sm tracking-[0.3em] text-gray-700 uppercase mb-2 font-medium"
            >
              TE INVITAMOS A NUESTRA
            </motion.p>
            
            <div className="flex flex-col items-center justify-center mb-12">
              <motion.h1 
                initial={{ scale: 0.8, opacity: 0, rotate: -5 }}
                animate={{ scale: 1, opacity: 1, rotate: -2 }}
                transition={{ type: "spring", bounce: 0.5, delay: 0.5 }}
                className="font-elegant text-7xl md:text-8xl text-boy-blue drop-shadow-sm -mb-4 z-10"
                style={{ textShadow: "2px 2px 4px rgba(0,0,0,0.1)" }}
              >
                Revelación
              </motion.h1>
              <motion.h1 
                initial={{ scale: 0.8, opacity: 0, rotate: 5 }}
                animate={{ scale: 1, opacity: 1, rotate: 2 }}
                transition={{ type: "spring", bounce: 0.5, delay: 0.7 }}
                className="font-elegant text-6xl md:text-7xl text-girl-pink drop-shadow-sm ml-12"
                style={{ textShadow: "2px 2px 4px rgba(0,0,0,0.1)" }}
              >
                De género
              </motion.h1>
            </div>

            <div className="relative mt-8 group cursor-pointer" onClick={() => setIsOpen(true)}>
              {/* Envelope Body */}
              <div className="w-[300px] h-[200px] bg-white rounded-lg shadow-xl relative overflow-hidden flex items-center justify-center border border-gray-100">
                <div className="absolute inset-0 bg-gradient-to-br from-white to-gray-50 opacity-50"></div>
                {/* Envelope Flap Lines */}
                <svg className="absolute inset-0 w-full h-full opacity-30" viewBox="0 0 300 200">
                  <path d="M0,0 L150,100 L300,0" fill="none" stroke="#000" strokeWidth="2" opacity="0.1"/>
                </svg>
              </div>
              
              {/* Characters peeking */}
              <motion.div 
                className="absolute -top-[140px] left-1/2 -translate-x-1/2 flex items-end justify-center w-[300px] pointer-events-none"
                animate={{ y: [0, -10, 0] }}
                transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              >
                <div className="w-[110px] h-[120px] relative top-4 ml-8" style={{ filter: 'url(#remove-bg)' }}>
                     <Image src="/assets/user_boss_girl.png" alt="Boss Girl" fill className="object-contain" />
                </div>
                <div className="w-[140px] h-[160px] relative ml-[-20px]" style={{ filter: 'url(#remove-bg)' }}>
                     <Image src="/assets/user_boss_boy.png" alt="Boss Boy" fill className="object-contain" />
                </div>
              </motion.div>

              {/* Bicolor Wax Seal */}
              <motion.div 
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full shadow-lg border-2 border-white flex items-center justify-center overflow-hidden"
                style={{ background: "linear-gradient(90deg, #FFB6C1 50%, #87CEEB 50%)" }}
              >
                <div className="w-14 h-14 rounded-full border border-white/40 shadow-inner flex items-center justify-center bg-transparent backdrop-blur-sm">
                   <div className="w-8 h-8 rounded-full bg-white/20"></div>
                </div>
              </motion.div>

              <motion.p 
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="absolute -bottom-10 left-1/2 -translate-x-1/2 text-xs tracking-widest uppercase text-gray-600 w-full text-center"
              >
                Click para abrir la invitación
              </motion.p>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="content-view"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="w-full min-h-screen flex flex-col items-center pt-12 pb-24 px-6 max-w-md mx-auto relative z-10"
          >
            {/* 1. Video Section */}
            <div className="w-full mb-8 relative rounded-2xl overflow-hidden shadow-lg border-4 border-white aspect-video bg-gray-200">
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/10">
                <div className="w-16 h-16 bg-white/50 backdrop-blur-md rounded-full flex items-center justify-center cursor-pointer hover:bg-white/80 transition-all">
                  <div className="w-0 h-0 border-t-8 border-t-transparent border-l-[16px] border-l-pink-500 border-b-8 border-b-transparent ml-2"></div>
                </div>
                <p className="mt-2 text-sm font-bold text-gray-700 tracking-widest uppercase bg-white/50 px-3 py-1 rounded-full backdrop-blur-sm">Ver Video</p>
              </div>
            </div>

            {/* 2. Header Texts */}
            <div className="text-center mb-8">
               <p className="text-[10px] md:text-xs tracking-widest text-gray-600 uppercase mb-4 font-medium">¡LA DULCE ESPERA ESTÁ POR TERMINAR!</p>
               <div className="flex flex-col items-center justify-center mb-6 relative z-10 w-full space-y-[-10px]">
                  <h1 className="font-elegant text-6xl text-boy-blue drop-shadow-sm relative z-10" style={{ transform: 'rotate(-2deg)' }}>Revelación</h1>
                  <h1 className="font-elegant text-5xl text-girl-pink drop-shadow-sm ml-6 relative z-20" style={{ transform: 'rotate(1deg)' }}>De género</h1>
               </div>
            </div>

            {/* 3. Characters Top */}
            <div className="flex justify-center items-end gap-0 mb-8 h-40 relative w-full">
                <div className="w-[140px] h-full relative" style={{ transform: 'rotate(-5deg)', filter: 'url(#remove-bg)' }}>
                    <Image src="/assets/user_boss_boy.png" alt="Boss Boy" fill className="object-contain" />
                </div>
                <div className="w-[110px] h-[75%] relative" style={{ transform: 'rotate(5deg)', filter: 'url(#remove-bg)' }}>
                    <Image src="/assets/user_boss_girl.png" alt="Boss Girl" fill className="object-contain" />
                </div>
            </div>

            {/* 4. Intro Paragraph & Personalization */}
            <div className="text-center px-4 mb-4">
               <p className="text-[14px] font-bold text-gray-800 mb-2 tracking-wide font-inter">
                 ¡HOLA {nombre.toUpperCase()}!
               </p>
               <p className="text-[12px] font-bold text-gray-600 mb-6 tracking-[0.2em] font-inter">
                 ({cupos} CUPOS)
               </p>
               <p className="text-[10px] uppercase tracking-widest text-gray-700 leading-relaxed font-semibold">
                 UN NUEVO INTEGRANTE ESTÁ POR LLEGAR A ESTA FAMILIA.<br/>
                 CON AMOR E ILUSIÓN ESPERAMOS SU LLEGADA.<br/>
                 GRACIAS POR SER PARTE DE ESTA ALEGRÍA.
               </p>
            </div>

            {/* 6. Date & Time Block */}
            <div className="w-full flex flex-col items-center mb-10 relative mt-8">
               <p className="text-[10px] uppercase tracking-[0.2em] text-gray-600 mb-2">TE INVITAMOS A CELEBRAR EL</p>
               <div className="flex items-center gap-4 w-full justify-center text-gray-800">
                  <div className="flex flex-col items-center border-y border-gray-400/30 py-1 w-20">
                     <span className="text-[11px] uppercase tracking-widest font-bold">ABRIL</span>
                  </div>
                  <div className="flex flex-col items-center px-2">
                     <span className="text-[10px] uppercase tracking-widest font-medium mb-[-5px]">SÁBADO</span>
                     <span className="text-6xl font-elegant text-boy-blue leading-none">11</span>
                  </div>
                  <div className="flex flex-col items-center border-y border-gray-400/30 py-1 w-20">
                     <span className="text-[11px] uppercase tracking-widest font-bold">16:00 HRS</span>
                  </div>
               </div>
            </div>

            {/* 7. Location Block */}
            <div className="w-full flex flex-col items-center mb-16 text-center px-4">
               <h2 className="font-elegant text-4xl text-girl-pink/80 mb-2 drop-shadow-sm">Dirección</h2>
               <p className="text-[10px] font-bold uppercase tracking-widest text-gray-700 leading-relaxed mb-4">
                  Salón de Conferencias "La Cuna"<br/>
                  CALLE DE LOS BEBÉS #07575, PUENTE ALTO
               </p>
               <button onClick={() => window.open('waze://?q=Calle+Ficticia+123,+Ciudad', '_blank')} className="bg-[#87CEEB] text-white px-8 py-3 rounded-full shadow-md hover:bg-blue-400 hover:shadow-lg transition-all flex items-center gap-2 font-bold tracking-wider text-xs w-auto uppercase">
                 <div className="bg-white rounded-full p-1"><CheckCircle2 size={16} className="text-[#87CEEB]"/></div>
                 VER UBICACIÓN
               </button>
               <p className="text-[8px] uppercase font-bold tracking-widest text-gray-500 mt-6 leading-relaxed max-w-[280px]">
                  AL MOMENTO DE SU LLEGADA, AGRADECEREMOS PUEDAN LLAMAR PARA RECIBIR EL CÓDIGO DE ENTRADA.
               </p>
            </div>

            {/* 8. Confirmation Section */}
            <div className="w-full text-center mb-16 relative z-20">
               <h2 className="font-elegant text-5xl text-girl-pink/80 mb-4 drop-shadow-sm">Confirmación</h2>
               <p className="text-[9px] uppercase tracking-widest text-gray-700 font-bold mb-6 px-4 leading-relaxed">
                  NOS ENCANTARÍA SABER QUE NOS ACOMPAÑARÁS.<br/>
                  PERMÍTENOS PREPARAR LOS DETALLES<br/>
                  CONFIRMANDO AQUÍ:
               </p>
               
               <div className="flex flex-col gap-3 w-full px-12 items-center">
                  {!confirmedAs ? (
                     <motion.button 
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleConfirm}
                        disabled={isConfirming}
                        className="w-[240px] bg-gradient-to-r from-boy-blue to-girl-pink text-white py-4 rounded-full shadow-xl flex items-center justify-center gap-3 transition-all border-2 border-white"
                     >
                        <MessageCircleHeart size={20} />
                        <span className="font-bold tracking-widest text-[11px]">CONFIRMAR ASISTENCIA</span>
                     </motion.button>
                  ) : (
                  <motion.div
                     initial={{ opacity: 0, scale: 0.8 }}
                     animate={{ opacity: 1, scale: 1 }}
                     className="w-[240px] py-4 rounded-full shadow-xl flex items-center justify-center gap-2 text-white bg-green-500 border-2 border-white"
                  >
                     <CheckCircle2 size={20} />
                     <span className="font-bold tracking-widest text-[11px]">¡CONÉCTATE CON ÉXITO!</span>
                  </motion.div>
                  )}
               </div>
            </div>

            {/* 9. Teams Section (Redesigned) */}
            <div className="w-full flex justify-between px-2 mb-20 gap-4 relative">
              {/* Background Glows */}
              <div className="absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-boy-blue opacity-10 blur-3xl rounded-full"></div>
              <div className="absolute top-1/2 right-1/4 translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-girl-pink opacity-10 blur-3xl rounded-full"></div>

              {/* Team Boy */}
              <div className="flex flex-col items-center w-1/2 relative">
                {/* Curved Text */}
                <svg viewBox="0 0 160 50" className="w-full h-12 overflow-visible mb-[-10px] drop-shadow-sm">
                   <path id="curve-boy-v3" d="M 10 40 Q 80 0 150 40" fill="transparent" />
                   <text className="text-[10px] font-bold tracking-[0.1em] fill-gray-700 uppercase" textAnchor="middle">
                     <textPath href="#curve-boy-v3" startOffset="50%">SI ERES TEAM NIÑO</textPath>
                   </text>
                </svg>
                <div className="w-full h-[220px] relative pointer-events-none" style={{ filter: 'url(#remove-bg)' }}>
                    <Image src="/assets/user_boss_boy.png" alt="Boss Boy" fill className="object-contain" />
                </div>
                <div className="text-center mt-2">
                   <p className="text-[10px] text-blue-500 font-bold uppercase tracking-widest leading-tight">VISTE DE CELESTE Y<br/>TRAE TOALLAS HÚMEDAS</p>
                </div>
              </div>

              {/* Team Girl */}
              <div className="flex flex-col items-center w-1/2 relative mt-4">
                 {/* Curved Text */}
                <svg viewBox="0 0 160 50" className="w-full h-12 overflow-visible mb-[-10px] drop-shadow-sm">
                   <path id="curve-girl-v3" d="M 10 40 Q 80 0 150 40" fill="transparent" />
                   <text className="text-[10px] font-bold tracking-[0.1em] fill-gray-700 uppercase" textAnchor="middle">
                     <textPath href="#curve-girl-v3" startOffset="50%">SI ERES TEAM NIÑA</textPath>
                   </text>
                </svg>
                <div className="w-full h-[180px] relative pointer-events-none mt-10" style={{ filter: 'url(#remove-bg)' }}>
                    <Image src="/assets/user_boss_girl.png" alt="Boss Girl" fill className="object-contain" />
                </div>
                <div className="text-center mt-2">
                   <p className="text-[10px] text-pink-500 font-bold uppercase tracking-widest leading-tight">VISTE DE ROSADO Y<br/>TRAE PAÑALES</p>
                </div>
              </div>
            </div>

            {/* 10. Footer Te Esperamos */}
            <div className="mt-8 text-center pb-8 border-b border-gray-400/20 w-full mb-4">
               <svg viewBox="0 0 300 100" className="w-full h-24 overflow-visible">
                   <path id="curve-footer" d="M 20 80 Q 150 20 280 80" fill="transparent" />
                   <text className="text-4xl font-elegant fill-gray-800 drop-shadow-sm" textAnchor="middle">
                     <textPath href="#curve-footer" startOffset="50%">¡Te esperamos!</textPath>
                   </text>
                </svg>
            </div>
            
            {/* Legal / Tiny footer */}
            <div className="flex gap-4 text-[9px] text-gray-800 font-bold uppercase tracking-widest opacity-80">
              <span className="bg-black/80 text-white px-2 py-1 rounded">Términos y ayuda</span>
              <span className="bg-black/80 text-white px-2 py-1 rounded">Política de privacidad</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
    </Suspense>
  );
}
