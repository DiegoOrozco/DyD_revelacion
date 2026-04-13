'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import UploadSection from '../galeria/UploadSection';

export default function ThanksContent() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#e0f2fe] via-[#fce7f3] to-[#fbcfe8] text-[#191C1D] flex flex-col items-center overflow-x-hidden font-inter relative select-none">
      <svg style={{ position: 'absolute', width: 0, height: 0 }} aria-hidden="true">
        <filter id="remove-bg" colorInterpolationFilters="sRGB">
          <feColorMatrix type="matrix" values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 -1.5 -1.5 -1.5 4.5 0" />
        </filter>
      </svg>
      
      <AnimatePresence mode="wait">
        {!isOpen ? (
          <motion.div 
            key="envelope-view" 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }} 
            className="w-full min-h-screen flex flex-col items-center justify-center p-6 text-center relative z-10"
          >
            <motion.p initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="text-sm tracking-[0.4em] text-gray-700 uppercase mb-8 font-bold">UN MENSAJE ESPECIAL DE</motion.p>
            <div className="flex flex-col items-center justify-center mb-16 scale-110">
              <h1 className="font-elegant text-8xl text-boy-blue drop-shadow-md -mb-6 z-10 italic">Dayan</h1>
              <h1 className="font-elegant text-7xl text-girl-pink drop-shadow-md ml-16 italic">& Diego</h1>
            </div>
            
            <div className="relative mt-8 group cursor-pointer" onClick={() => setIsOpen(true)}>
              <div className="w-[300px] h-[200px] bg-white rounded-lg shadow-xl relative overflow-hidden flex items-center justify-center border border-gray-100">
                <svg className="absolute inset-0 w-full h-full opacity-30" viewBox="0 0 300 200"><path d="M0,0 L150,100 L300,0" fill="none" stroke="#000" strokeWidth="2" opacity="0.1"/></svg>
                {/* Heart Seal */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full shadow-lg border-2 border-white flex items-center justify-center overflow-hidden" style={{ background: "linear-gradient(90deg, #FFB6C1 50%, #87CEEB 50%)" }}>
                   <div className="w-14 h-14 rounded-full border border-white/40 shadow-inner flex items-center justify-center bg-transparent backdrop-blur-sm">
                     <span className="text-white text-xl">❤️</span>
                   </div>
                </div>
              </div>
              
              <motion.div 
                className="absolute -top-[120px] left-1/2 -translate-x-1/2 flex items-end justify-center w-[300px] pointer-events-none" 
                animate={{ y: [0, -10, 0] }} 
                transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              >
                <div className="w-[180px] h-[120px] relative top-10 z-20" style={{ filter: 'url(#remove-bg)' }}>
                  <Image src="/assets/portada.png" alt="Thanks" fill className="object-contain" />
                </div>
              </motion.div>
              
              <p className="absolute -bottom-12 left-1/2 -translate-x-1/2 text-[10px] tracking-[0.4em] uppercase text-gray-400 w-full text-center font-bold italic">Nuestros Recuerdos</p>
              <p className="absolute -bottom-20 left-1/2 -translate-x-1/2 text-[9px] tracking-widest uppercase text-gray-400 w-full text-center">Click para abrir</p>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="thanks-content" 
            initial={{ opacity: 0, y: 50 }} 
            animate={{ opacity: 1, y: 0 }} 
            className="w-full min-h-screen flex flex-col items-center pt-16 pb-32 px-6 max-w-md mx-auto relative z-10"
          >
            {/* Couple Photo */}
            <div className="w-full mb-10 relative rounded-[3rem] overflow-hidden shadow-2xl border-4 border-white aspect-square bg-white rotate-2 hover:rotate-0 transition-transform duration-500">
               <Image 
                src="/assets/nosotros.png" 
                alt="Dayan y Diego" 
                fill 
                className="object-cover"
                priority
               />
               <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            </div>

            <div className="text-center mb-12">
               <h1 className="font-elegant text-6xl text-boy-blue mb-2 italic">¡Gracias por estar!</h1>
               <div className="w-16 h-1 bg-girl-pink/30 mx-auto rounded-full mb-6" />
               <p className="text-[12px] uppercase tracking-[0.2em] text-gray-700 leading-relaxed font-bold px-4">
                 FUE UN DÍA INOLVIDABLE Y TU PRESENCIA LO HIZO AÚN MÁS ESPECIAL.
               </p>
            </div>

            <div className="bg-white/40 backdrop-blur-md p-8 rounded-[2.5rem] border-2 border-white shadow-xl text-center mb-10 relative overflow-hidden group">
               <div className="absolute top-0 right-0 w-24 h-24 bg-blue-100/50 rounded-full blur-2xl -mr-8 -mt-8" />
               <p className="text-[11px] text-gray-600 uppercase tracking-widest leading-relaxed font-semibold">
                 NOS ENCANTARÍA REVIVIR CADA <br/>
                 MOMENTO A TRAVÉS DE TUS OJOS.
               </p>
               <div className="mt-6 flex flex-col items-center gap-2">
                 <p className="text-[13px] font-boss text-[#0C6780] uppercase tracking-widest">SUBE TUS FOTOS Y VIDEOS AQUÍ</p>
                 <div className="animate-bounce mt-2 text-girl-pink">⬇️</div>
               </div>
            </div>

            <UploadSection />
            
            <p className="mt-16 text-[9px] uppercase tracking-[0.4em] text-gray-500 font-bold">Con amor, Dayan & Diego</p>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
