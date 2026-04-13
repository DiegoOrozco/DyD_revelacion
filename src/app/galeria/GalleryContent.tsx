'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import UploadSection from './UploadSection';

export default function GalleryContent() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-[#e0f2fe] via-[#fce7f3] to-[#fbcfe8] text-[#191C1D] flex flex-col items-center pt-12 pb-32 px-6 font-inter overflow-x-hidden relative select-none">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="flex items-center gap-4 mb-10 overflow-hidden">
           <Link href="/invitacion" className="p-3 bg-white/40 backdrop-blur-md rounded-2xl border border-white/50 text-gray-600 hover:bg-white transition-all active:scale-95">
              <ArrowLeft size={24} />
           </Link>
           <div className="flex flex-col">
             <h1 className="font-boss text-3xl uppercase tracking-tighter text-gray-800 leading-none">Recuerdos</h1>
             <p className="text-[10px] uppercase tracking-[0.3em] font-extrabold text-[#0c6780]">Compartir es Amar</p>
           </div>
        </div>

        {/* Intro */}
        <div className="bg-white/30 backdrop-blur-lg rounded-[2.5rem] border-2 border-white p-8 mb-8 text-center shadow-xl relative overflow-hidden">
           <div className="absolute top-0 right-0 w-32 h-32 bg-blue-400/10 blur-3xl rounded-full -mr-10 -mt-10" />
           <div className="absolute bottom-0 left-0 w-32 h-32 bg-pink-400/10 blur-3xl rounded-full -ml-10 -mb-10" />
           
           <h2 className="font-boss text-lg uppercase tracking-widest text-gray-800 mb-3">Sube tus fotos y videos</h2>
           <p className="text-xs text-gray-600 leading-relaxed uppercase tracking-wider font-semibold">
             Queremos guardar cada detalle de este día especial. <br/>
             <span className="text-[10px] text-girl-pink">Tus archivos se guardarán directamente en nuestro Drive.</span>
           </p>
        </div>

        <UploadSection />
      </div>

      {/* SVG Filters */}
      <svg style={{ position: 'absolute', width: 0, height: 0 }} aria-hidden="true">
        <filter id="remove-bg" colorInterpolationFilters="sRGB">
          <feColorMatrix type="matrix" values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 -1.5 -1.5 -1.5 4.5 0" />
        </filter>
      </svg>
    </main>
  );
}
