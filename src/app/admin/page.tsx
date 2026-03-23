'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, UserPlus, Link, Copy, CheckCircle, Briefcase, Trash2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface Invitation {
  id: string;
  guest_name: string;
  slots_assigned: number;
  ha_confirmado: boolean;
  created_at: string;
  confirmed_at?: string;
}

export default function AdminPage() {
  const [guestName, setGuestName] = useState('');
  const [slots, setSlots] = useState('1');
  const [generatedLink, setGeneratedLink] = useState('');
  const [confirmations, setConfirmations] = useState<Invitation[]>([]);
  const [loading, setLoading] = useState(true);
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      fetchConfirmations();
      
      const channel = supabase
        .channel('schema-db-changes')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'invitations' },
          () => {
            fetchConfirmations();
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [isAuthenticated]);

  const fetchConfirmations = async () => {
    try {
      const { data, error } = await supabase
        .from('invitations')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setConfirmations(data || []);
    } catch (err) {
      console.error('Error fetching invitations:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`¿Estás seguro de que deseas eliminar la invitación de ${name}?`)) return;

    try {
      const { error } = await supabase
        .from('invitations')
        .delete()
        .eq('id', id);

      if (error) throw error;
      await fetchConfirmations();
    } catch (err) {
      console.error('Error deleting:', err);
      alert('Error al eliminar la invitación');
    }
  };

  const generateLink = async () => {
    if (!guestName) return;

    try {
      // Insert a pending invitation record and get its UUID
      const { data, error } = await supabase
        .from('invitations')
        .insert([{
          guest_name: guestName.trim(),
          slots_assigned: parseInt(slots),
          ha_confirmado: false
        }])
        .select()
        .single();

      if (error) throw error;

      const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
      const link = `${baseUrl}/invitacion/${data.id}`;
      setGeneratedLink(link);
      setCopied(false);
      setGuestName('');
      setSlots('1');
    } catch (err) {
      console.error('Error generating invitation:', err);
      alert('Error técnico al generar la invitación. Revisa la consola.');
    }
  };

  const copyToClipboard = () => {
    if (!generatedLink) return;
    navigator.clipboard.writeText(generatedLink).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const checkPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'bossbaby2026') {
      setIsAuthenticated(true);
    } else {
      alert('Contraseña Incorrecta');
    }
  };

  const totalConfirmed = confirmations.reduce((acc, curr) => acc + curr.slots_assigned, 0);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-boss flex items-center justify-center p-6">
        <motion.form 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={checkPassword}
          className="bg-white p-10 rounded-3xl shadow-2xl flex flex-col items-center gap-6 max-w-xs w-full"
        >
          <div className="bg-boss p-4 rounded-2xl text-white">
            <Briefcase size={48} />
          </div>
          <h1 className="font-boss text-2xl uppercase text-center">Solo Personal Autorizado</h1>
          <input 
            type="password" 
            placeholder="Contraseña Ejecutiva"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-4 bg-gray-50 rounded-xl border-2 border-transparent focus:border-boss outline-none font-bold text-center"
          />
          <button type="submit" className="w-full py-4 boss-gradient-blue text-white rounded-xl font-boss uppercase shadow-lg">
            Ingresar
          </button>
        </motion.form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F0F2F5] text-[#191C1D] p-4 md:p-10 font-inter">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
        <div className="flex items-center gap-3">
          <div className="bg-boss p-3 rounded-2xl text-white">
            <Briefcase size={32} />
          </div>
          <div>
            <h1 className="text-3xl font-boss uppercase">Panel Ejecutivo</h1>
            <p className="text-sm opacity-60 uppercase font-bold tracking-widest">Control de Operaciones</p>
          </div>
        </div>

        <div className="flex gap-4">
          <div className="glass p-4 rounded-2xl flex flex-col items-center min-w-[120px]">
            <span className="text-xs opacity-50 font-bold uppercase">Total Invitados</span>
            <span className="text-2xl font-boss text-boss">{totalConfirmed}</span>
          </div>
          <div className="glass p-4 rounded-2xl flex flex-col items-center min-w-[120px]">
            <span className="text-xs opacity-50 font-bold uppercase">Confirmaciones</span>
            <span className="text-2xl font-boss text-boss">{confirmations.length}</span>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Generator Section */}
        <motion.section 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-1 flex flex-col gap-6"
        >
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-2 mb-6">
              <UserPlus className="text-boss" size={20} />
              <h2 className="font-boss text-xl uppercase">Generar Invitación</h2>
            </div>

            <div className="flex flex-col gap-4">
              <div>
                <label className="text-xs font-bold opacity-50 mb-1 block">NOMBRE DEL INVITADO</label>
                <input 
                  type="text" 
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  placeholder="Ej: Familia Perez"
                  className="w-full p-4 bg-gray-50 rounded-xl border border-transparent focus:border-boss outline-none transition-all font-medium"
                />
              </div>

              <div>
                <label className="text-xs font-bold opacity-50 mb-1 block">CUPOS ASIGNADOS</label>
                <input 
                  type="number" 
                  value={slots}
                  onChange={(e) => setSlots(e.target.value)}
                  min="1"
                  className="w-full p-4 bg-gray-50 rounded-xl border border-transparent focus:border-boss outline-none transition-all font-medium"
                />
              </div>

              <button 
                onClick={generateLink}
                className="w-full py-4 boss-gradient-blue text-white rounded-xl font-boss uppercase mt-2 shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
              >
                <Link size={18} />
                Generar Link
              </button>
            </div>

            {generatedLink && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-100 flex flex-col gap-2"
              >
                <p className="text-xs font-bold text-blue-800 uppercase">LINK PARA WHATSAPP</p>
                <div className="flex items-center gap-2 overflow-hidden">
                  <span className="truncate flex-1 text-sm bg-white/50 p-2 rounded">{generatedLink}</span>
                  <button 
                    onClick={copyToClipboard} 
                    className={`p-2 rounded-lg transition-all ${copied ? 'bg-green-500 text-white' : 'text-blue-600 hover:bg-blue-100'}`}
                  >
                    {copied ? <CheckCircle size={18} /> : <Copy size={18} />}
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        </motion.section>

        {/* Data Table Section */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-2"
        >
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 h-full">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-2">
                <Users className="text-boss" size={20} />
                <h2 className="font-boss text-xl uppercase">Confirmaciones en Tiempo Real</h2>
              </div>
              <p className="text-xs bg-green-100 text-green-700 font-bold px-3 py-1 rounded-full animate-pulse">
                • EN VIVO
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left border-b border-gray-100">
                    <th className="pb-4 text-xs font-bold opacity-40 uppercase">Invitado</th>
                    <th className="pb-4 text-xs font-bold opacity-40 uppercase text-center">Cupos</th>
                    <th className="pb-4 text-xs font-bold opacity-40 uppercase text-center">Estado</th>
                    <th className="pb-4 text-xs font-bold opacity-40 uppercase text-right">Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={3} className="py-8 text-center text-sm opacity-50 font-boss uppercase">Sincronizando Archivos...</td>
                    </tr>
                  ) : confirmations.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="py-8 text-center text-sm opacity-50 font-boss uppercase">Ningún Socio ha Confirmado</td>
                    </tr>
                  ) : (
                    confirmations.map((conf) => (
                      <tr key={conf.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                        <td className="py-5">
                          <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-white font-boss text-xs ${conf.ha_confirmado ? 'bg-green-500' : 'bg-gray-300'}`}>
                              {conf.guest_name[0]}
                            </div>
                            <span className="font-bold">{conf.guest_name}</span>
                          </div>
                        </td>
                        <td className="py-5 text-center font-boss text-boss">{conf.slots_assigned}</td>
                        <td className="py-5 text-center">
                          <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${conf.ha_confirmado ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                            {conf.ha_confirmado ? 'Confirmado' : 'Pendiente'}
                          </span>
                        </td>
                        <td className="py-5 text-right">
                          <button 
                            onClick={() => handleDelete(conf.id, conf.guest_name)}
                            className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                            title="Eliminar Invitación"
                          >
                            <Trash2 size={18} />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </motion.section>
      </div>
    </div>
  );
}
