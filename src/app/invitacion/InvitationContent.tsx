'use client';

import { Suspense, useState, use } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircleHeart, CheckCircle2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import Image from 'next/image';

export function InvitationContent({ params }: { params: Promise<{ slug: string }> }) {
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
  const [selectedTeam, setSelectedTeam] = useState<'boy' | 'girl' | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);

  const triggerConfetti = () => {
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 3000);
  };

  const handleTeamSelect = (team: 'boy' | 'girl') => {
    if (selectedTeam === team) {
      setSelectedTeam(null);
    } else {
      setSelectedTeam(team);
      triggerConfetti();
    }
  };

  const particles = [
    { emoji: '🍼', color: 'blue' }, { emoji: '🦆', color: 'blue' }, { emoji: '👕', color: 'blue' }, { emoji: '🧢', color: 'blue' }, { emoji: '🧸', color: 'blue' },
    { emoji: '🎀', color: 'pink' }, { emoji: '👗', color: 'pink' }, { emoji: '🍭', color: 'pink' }, { emoji: '👑', color: 'pink' }, { emoji: '🍼', color: 'pink' }
  ];

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
          <feColorMatrix type="matrix" values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 -1.5 -1.5 -1.5 4.5 0" />
        </filter>
      </svg>
      <AnimatePresence mode="wait">
        {!isOpen ? (
          <motion.div key="envelope-view" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }} className="w-full min-h-screen flex flex-col items-center justify-center p-6 text-center relative z-10">
            <motion.p initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="text-sm tracking-[0.4em] text-gray-700 uppercase mb-8 font-bold">TE INVITAMOS A NUESTRA</motion.p>
            <div className="flex flex-col items-center justify-center mb-16 scale-110">
              <h1 className="font-elegant text-8xl text-boy-blue drop-shadow-md -mb-6 z-10 italic">Revelación</h1>
              <h1 className="font-elegant text-7xl text-girl-pink drop-shadow-md ml-16 italic">De género</h1>
            </div>
            <div className="relative mt-8 group cursor-pointer" onClick={() => setIsOpen(true)}>
              <div className="w-[300px] h-[200px] bg-white rounded-lg shadow-xl relative overflow-hidden flex items-center justify-center border border-gray-100">
                <svg className="absolute inset-0 w-full h-full opacity-30" viewBox="0 0 300 200"><path d="M0,0 L150,100 L300,0" fill="none" stroke="#000" strokeWidth="2" opacity="0.1"/></svg>
              </div>
              <motion.div className="absolute -top-[160px] left-1/2 -translate-x-1/2 flex items-end justify-center w-[400px] pointer-events-none" animate={{ y: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}>
                <div className="w-[320px] h-[220px] relative top-8 z-20" style={{ filter: 'url(#remove-bg)' }}>
                  <Image src="/assets/portada.png" alt="Boss Babies" fill className="object-contain" />
                </div>
              </motion.div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full shadow-lg border-2 border-white flex items-center justify-center overflow-hidden" style={{ background: "linear-gradient(90deg, #FFB6C1 50%, #87CEEB 50%)" }}>
                 <div className="w-14 h-14 rounded-full border border-white/40 shadow-inner flex items-center justify-center bg-transparent backdrop-blur-sm"><div className="w-8 h-8 rounded-full bg-white/20"></div></div>
              </div>
              <p className="absolute -bottom-10 left-1/2 -translate-x-1/2 text-xs tracking-widest uppercase text-gray-600 w-full text-center">Click para abrir la invitación</p>
            </div>
          </motion.div>
        ) : (
          <motion.div key="content-view" initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} className="w-full min-h-screen flex flex-col items-center pt-12 pb-24 px-6 max-w-md mx-auto relative z-10">
            <div className="w-full mb-12 relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white aspect-[9/16] bg-black group">
              <video 
                src="/assets/revelacion.mp4" 
                controls 
                className="w-full h-full object-cover"
                poster="/assets/user_boss_both.png"
                playsInline
              />
              <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full border border-white/30 pointer-events-none">
                <p className="text-[10px] font-bold text-white uppercase tracking-widest">Video Especial</p>
              </div>
            </div>
             <div className="text-center mb-10 pt-4">
               <p className="text-[10px] md:text-xs tracking-[0.4em] text-gray-600 uppercase mb-8 font-bold">¡LA DULCE ESPERA ESTÁ POR TERMINAR!</p>
               <div className="flex flex-col items-center justify-center mb-10 relative z-10 w-full space-y-[-10px] scale-100">
                  <h1 className="font-elegant text-6xl text-boy-blue drop-shadow-md relative z-10 italic">Revelación</h1>
                  <h1 className="font-elegant text-5xl text-girl-pink drop-shadow-md ml-12 relative z-20 italic">De género</h1>
               </div>
            </div>
            <div className="flex justify-center items-end gap-0 mb-10 h-80 relative w-full scale-110">
                <div className="w-full h-full relative z-10" style={{ filter: 'url(#remove-bg)' }}>
                  <Image src="/assets/portada.png" alt="Boss Babies Unified" fill className="object-contain" />
                </div>
            </div>
            <div className="text-center px-4 mb-4">
               <p className="text-[24px] font-boss text-gray-800 mb-2 tracking-widest uppercase">¡HOLA {nombre}!</p>
               <p className="text-[10px] uppercase tracking-widest text-boy-blue leading-relaxed font-extrabold mb-6">
                 MIS PAPITOS DAYAN Y DIEGO HAN RESERVADO {cupos} ESPACIOS PARA TI
               </p>
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
                  Condominio San Antonio del Cobre,<br/>San Antonio, Desamparados
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
                     <button onClick={handleConfirm} disabled={isConfirming} className="w-[260px] bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white py-5 rounded-full shadow-[0_10px_30px_rgba(168,85,247,0.4)] flex items-center justify-center gap-3 border-2 border-white/50 active:scale-95 transition-all"><MessageCircleHeart size={24} className="animate-pulse" /><span className="font-boss tracking-widest text-[13px] uppercase">Confirmar Asistencia</span></button>
                  ) : (
                  <div className="w-[240px] py-4 rounded-full shadow-xl flex items-center justify-center gap-2 text-white bg-green-500 border-2 border-white"><CheckCircle2 size={20} /><span className="font-bold tracking-widest text-[11px]">¡CONÉCTATE CON ÉXITO!</span></div>
                  )}
               </div>
            </div>
            {/* 9. Teams Section (Interactive Version) */}
            <div className="w-full flex flex-col items-center mb-20 relative bg-white/40 p-6 rounded-[2.5rem] backdrop-blur-md border-2 border-white shadow-xl">
              <div className="text-center w-full mb-6">
                <h2 className="font-boss text-2xl text-gray-800 mb-1 uppercase tracking-widest">¿QUÉ TEAM ERES?</h2>
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider italic">selecciona si piensas que será niño o niña</p>
              </div>
              
              <div className="flex justify-between w-full gap-4 relative">
                {/* Confetti Particles Layer */}
                <AnimatePresence>
                  {showConfetti && Array.from({ length: 30 }).map((_, i) => {
                    const myTeam = selectedTeam || 'boy';
                    const myParticle = particles.filter(p => p.color === (myTeam === 'boy' ? 'blue' : 'pink'))[i % 5];
                    return (
                      <motion.div
                        key={`confetti-${i}`}
                        initial={{ opacity: 1, scale: 0, x: 0, y: 0 }}
                        animate={{ 
                          opacity: [1, 1, 0.8, 0], 
                          scale: [1, 2, 1.5, 1],
                          x: (Math.random() - 0.5) * 1000, 
                          y: (Math.random() - 0.5) * 1200 - 200, 
                          rotate: Math.random() * 720 
                        }}
                        transition={{ duration: 4.5, ease: "easeOut" }}
                        className="fixed pointer-events-none z-[100] text-4xl"
                        style={{ left: '50%', top: '40%' }}
                      >
                        {myParticle.emoji}
                      </motion.div>
                    );
                  })}
                </AnimatePresence>

                {/* Team Boy Button */}
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleTeamSelect('boy')}
                  className={`flex flex-col items-center w-1/2 p-4 rounded-3xl transition-all border-2 ${selectedTeam === 'boy' ? 'bg-[#87CEEB] border-white shadow-lg' : 'bg-white/50 border-transparent text-blue-400'}`}
                >
                  <div className="w-full h-24 mb-2 relative" style={{ filter: 'url(#remove-bg)' }}>
                    <Image src="/assets/user_boss_boy.png" alt="Boy" fill className="object-contain" />
                  </div>
                  <span className={`font-boss tracking-wider text-sm uppercase ${selectedTeam === 'boy' ? 'text-white' : ''}`}>NIÑO</span>
                </motion.button>

                {/* Team Girl Button */}
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleTeamSelect('girl')}
                  className={`flex flex-col items-center w-1/2 p-4 rounded-3xl transition-all border-2 ${selectedTeam === 'girl' ? 'bg-[#FFB6C1] border-white shadow-lg' : 'bg-white/50 border-transparent text-pink-400'}`}
                >
                  <div className="w-full h-24 mb-2 relative" style={{ filter: 'url(#remove-bg)' }}>
                    <Image src="/assets/user_boss_girl.png" alt="Girl" fill className="object-contain" />
                  </div>
                  <span className={`font-boss tracking-wider text-sm uppercase ${selectedTeam === 'girl' ? 'text-white' : ''}`}>NIÑA</span>
                </motion.button>
              </div>

              {/* Dynamic Information Reveal with Images */}
              <AnimatePresence mode="wait">
                {selectedTeam && (
                  <motion.div 
                    key={selectedTeam}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="overflow-hidden w-full"
                  >
                    <div className="mt-8 p-6 rounded-[2rem] border-2 border-white shadow-inner bg-white/80 text-center flex flex-col items-center gap-6">
                      <div className="flex justify-around w-full gap-4">
                        <div className="flex flex-col items-center gap-2">
                           <div className="w-20 h-20 relative p-2 bg-white rounded-2xl shadow-sm border border-gray-100">
                             <Image 
                               src={selectedTeam === 'boy' ? "/assets/shirt_boy.png" : "/assets/dress_girl.png"} 
                               alt="Vestimenta" 
                               fill 
                               className="object-contain p-2" 
                             />
                           </div>
                           <p className={`text-[9px] font-extrabold uppercase tracking-widest ${selectedTeam === 'boy' ? 'text-blue-500' : 'text-pink-500'}`}>
                             {selectedTeam === 'boy' ? 'VEN DE CELESTE' : 'VEN DE ROSADO'}
                           </p>
                        </div>
                        <div className="flex flex-col items-center gap-2">
                          <div className="w-20 h-20 relative p-2 bg-white rounded-2xl shadow-sm border border-gray-100">
                             <Image 
                               src={selectedTeam === 'boy' ? "/assets/diaper_boy.png" : "/assets/wipes_girl.png"} 
                               alt="Regalo" 
                               fill 
                               className="object-contain p-2" 
                             />
                           </div>
                           <p className={`text-[9px] font-extrabold uppercase tracking-widest ${selectedTeam === 'boy' ? 'text-blue-500' : 'text-pink-500'}`}>
                             {selectedTeam === 'boy' ? 'TRAE PAÑALES' : 'TRAE TOALLITAS'}
                           </p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
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
