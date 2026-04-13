'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, X, CheckCircle2, Image as ImageIcon, Film, Loader2, Camera } from 'lucide-react';
import Image from 'next/image';

interface FileUpload {
  id: string;
  file: File;
  status: 'pending' | 'uploading' | 'success' | 'error';
  progress: number;
}

export default function UploadSection() {
  const [files, setFiles] = useState<FileUpload[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      addFiles(Array.from(e.target.files));
    }
  };

  const addFiles = (newFiles: File[]) => {
    const uploads = newFiles.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      file,
      status: 'pending' as const,
      progress: 0,
    }));
    setFiles(prev => [...prev, ...uploads]);
  };

  const removeFile = (id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id));
  };

  const uploadAll = async () => {
    setIsUploading(true);
    const filesToUpload = files.filter(f => f.status === 'pending');
    
    for (const fileObj of filesToUpload) {
      updateFileStatus(fileObj.id, 'uploading', 10);
      
      const formData = new FormData();
      formData.append('file', fileObj.file);

      try {
        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        if (response.ok) {
          updateFileStatus(fileObj.id, 'success', 100);
        } else {
          updateFileStatus(fileObj.id, 'error', 0);
        }
      } catch (err) {
        updateFileStatus(fileObj.id, 'error', 0);
      }
    }
    setIsUploading(false);
  };

  const updateFileStatus = (id: string, status: FileUpload['status'], progress: number) => {
    setFiles(prev => prev.map(f => f.id === id ? { ...f, status, progress } : f));
  };

  const pendingCount = files.filter(f => f.status === 'pending').length;

  return (
    <div className="w-full">
        {/* Upload Zone */}
        <motion.div
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(e) => { e.preventDefault(); setIsDragging(false); addFiles(Array.from(e.dataTransfer.files)); }}
          className={`relative h-64 border-4 border-dashed rounded-[3rem] transition-all flex flex-col items-center justify-center p-8 text-center bg-white/20 backdrop-blur-md shadow-inner ${isDragging ? 'border-boy border-opacity-100 scale-[1.02] bg-white/40' : 'border-white border-opacity-40'}`}
        >
          <div className="w-20 h-24 mb-4 relative" style={{ filter: 'url(#remove-bg)' }}>
             <Image src="/assets/portada.png" alt="Upload" fill className="object-contain opacity-30 grayscale contrast-125" />
          </div>
          <p className="font-boss text-xs uppercase tracking-[0.2em] text-gray-700 mb-2">Arrastra aquí</p>
          <p className="text-[9px] text-gray-500 uppercase tracking-widest mb-6 font-bold">O</p>
          
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="bg-white text-[#0c6780] px-8 py-3 rounded-full font-boss tracking-widest text-[10px] shadow-lg hover:shadow-xl active:scale-95 transition-all border border-white/50 uppercase"
          >
            Seleccionar Archivos
          </button>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileSelect} 
            multiple 
            accept="image/*,video/*" 
            className="hidden" 
          />
        </motion.div>

        {/* File List */}
        <div className="mt-10 space-y-4">
          <AnimatePresence initial={false}>
            {files.map((file) => (
              <motion.div
                key={file.id}
                layout
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, x: 50 }}
                className="bg-white/60 backdrop-blur-md px-5 py-4 rounded-3xl flex items-center gap-4 border border-white/50 shadow-md group relative overflow-hidden"
              >
                {file.status === 'uploading' && (
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${file.progress}%` }}
                    className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-boy to-girl opacity-50"
                  />
                )}

                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 transition-colors ${file.status === 'success' ? 'bg-green-100 text-green-500' : 'bg-white/80 text-gray-400'}`}>
                  {file.file.type.startsWith('image') ? <ImageIcon size={24} /> : <Film size={24} />}
                </div>
                
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] font-bold text-gray-700 truncate uppercase tracking-widest">{file.file.name}</p>
                  <div className="flex items-center gap-2">
                    <span className={`text-[8px] px-2 py-0.5 rounded-full font-bold uppercase tracking-tighter ${
                      file.status === 'pending' ? 'bg-blue-100 text-blue-500' :
                      file.status === 'uploading' ? 'bg-yellow-100 text-yellow-600' :
                      file.status === 'success' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                    }`}>
                      {file.status === 'pending' ? 'Listo' : 
                       file.status === 'uploading' ? 'Subiendo...' : 
                       file.status === 'success' ? '¡LISTO!' : 'ERROR'}
                    </span>
                    <span className="text-[8px] text-gray-400 font-bold">{(file.file.size / (1024 * 1024)).toFixed(1)} MB</span>
                  </div>
                </div>
                
                <div className="shrink-0 flex items-center justify-center w-8 h-8">
                  {file.status === 'pending' && (
                    <button onClick={() => removeFile(file.id)} className="p-2 text-gray-400 hover:text-red-500 transition-colors hover:bg-red-50 rounded-full">
                      <X size={18} />
                    </button>
                  )}
                  {file.status === 'uploading' && <Loader2 size={18} className="animate-spin text-boy" />}
                  {file.status === 'success' && <CheckCircle2 size={18} className="text-green-500" />}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Empty State */}
        {files.length === 0 && (
          <div className="mt-12 text-center opacity-40">
            <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-gray-500">Sin archivos seleccionados</p>
          </div>
        )}

      {/* Upload Float Button */}
      <AnimatePresence>
        {pendingCount > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            className="fixed bottom-10 left-1/2 -translate-x-1/2 w-full max-w-sm px-6 z-50"
          >
            <button 
              onClick={uploadAll}
              disabled={isUploading}
              className="w-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white py-5 rounded-full shadow-[0_20px_40px_rgba(168,85,247,0.4)] font-boss tracking-widest text-[13px] uppercase flex items-center justify-center gap-3 border-2 border-white/50 active:scale-95 transition-all disabled:opacity-50 disabled:scale-100"
            >
              {isUploading ? <Loader2 size={24} className="animate-spin" /> : <Upload size={24} className="animate-bounce" />}
              {isUploading ? 'SUBIENDO...' : `SUBIR ${pendingCount} RECUERDO${pendingCount > 1 ? 'S' : ''}`}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
