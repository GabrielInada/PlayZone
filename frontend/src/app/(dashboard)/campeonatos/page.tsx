"use client";
import React, { useState, useEffect, useCallback } from 'react';
import { Search, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { CampeonatoCard } from './CampeonatoCard/CampeonatoCard';
import ModalCriarCampeonato from '@/components/ModalCriarCampeonato';
import ModalExcluirCampeonato from '@/components/ModalExcluirCampeonato';
import ModalEditarCampeonato from '@/components/ModalEditarCampeonato';
import ModalErroExcluirCampeonato from '@/components/ModalErroExcluirCampeonato';
import { useAuth } from '@/context/AuthContext';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000";

interface Tournament {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
}

interface KnockoutEntry {
  id: number;
  tournamentId: number;
  isDecided: boolean;
}

interface Campeonato {
  id: number;
  nome: string;
  ano: string;
  status: string;
  formato: string;
  totalPartidas: number;
}

export default function CampeonatosPage() {
  const router          = useRouter();
  const { user, token } = useAuth();
  const isAdmin         = user?.type === "admin";

  const [campeonatos,           setCampeonatos]           = useState<Campeonato[]>([]);
  const [loading,               setLoading]               = useState(true);
  const [searchTerm,            setSearchTerm]            = useState("");
  const [isModalOpen,           setIsModalOpen]           = useState(false);
  const [isExcluirModalOpen,    setIsExcluirModalOpen]    = useState(false);
  const [isErroModalOpen,       setIsErroModalOpen]       = useState(false);
  const [isEditarModalOpen,     setIsEditarModalOpen]     = useState(false);
  const [campeonatoParaExcluir, setCampeonatoParaExcluir] = useState<Campeonato | null>(null);
  const [campeonatoParaEditar,  setCampeonatoParaEditar]  = useState<Campeonato | null>(null);

  const loadCampeonatos = useCallback(async () => {
    setLoading(true);
    try {
      const headers: Record<string, string> = token
        ? { Authorization: `Bearer ${token}` } : {};

      // Busca torneios e confrontos em paralelo
      const [tourRes, koRes] = await Promise.all([
        fetch(`${API_URL}/tournament`,         { headers }),
        fetch(`${API_URL}/tournament-knockout`, { headers }),
      ]);

      const tourData: Tournament[]    = tourRes.ok ? await tourRes.json() : [];
      const koData:   KnockoutEntry[] = koRes.ok  ? await koRes.json()   : [];

      const tournaments = Array.isArray(tourData) ? tourData : [];
      const knockouts   = Array.isArray(koData)   ? koData   : [];

      // Cruza cada torneio com seus confrontos pelo tournamentId
      const mapped: Campeonato[] = tournaments.map((t) => {
        const entries      = knockouts.filter((e) => e.tournamentId === t.id);
        const finalizadas  = entries.filter((e) => e.isDecided).length;
        const total        = entries.length;
        const status       = total > 0 && finalizadas === total
          ? "Finalizado" : "Em Andamento";

        return {
          id:            t.id,
          nome:          t.name,
          ano:           new Date(t.createdAt).getFullYear().toString(),
          status,
          formato:       "Mata-Mata",
          totalPartidas: total,
        };
      });

      setCampeonatos(mapped);
    } catch (err) {
      console.error("Erro ao carregar campeonatos:", err);
      setCampeonatos([]);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => { loadCampeonatos(); }, [loadCampeonatos]);

  const filtrados = campeonatos.filter((c) =>
    c.nome?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false
  );

  const handleOpenExcluir = (camp: Campeonato) => {
    if (camp.status === "Em Andamento") {
      setIsErroModalOpen(true);
    } else {
      setCampeonatoParaExcluir(camp);
      setIsExcluirModalOpen(true);
    }
  };

  const handleConfirmExcluir = async () => {
    if (!campeonatoParaExcluir) return;
    try {
      await fetch(`${API_URL}/tournament/${campeonatoParaExcluir.id}`, {
        method: "DELETE",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      await loadCampeonatos();
    } catch (err) {
      console.error("Erro ao excluir campeonato:", err);
    } finally {
      setIsExcluirModalOpen(false);
      setCampeonatoParaExcluir(null);
    }
  };

  return (
    <>
      <div className="min-h-screen bg-white flex flex-col font-bold" data-testid="page-campeonatos">
        <div className="w-full max-w-6xl mx-auto px-6 pt-4 pb-20 text-gray-900" data-testid="container-campeonatos">

          <div className="mb-2 pb-1 text-gray-950">
            <h1 className="text-3xl font-bold tracking-tight">Campeonatos Ativos</h1>
            <p className="text-sm text-gray-500 font-medium">Visualize os campeonatos criados</p>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
            <div className="relative flex-grow w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" size={20} />
              <input
                type="text"
                placeholder="Buscar campeonato..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-600 rounded-lg focus:ring-2 focus:ring-[#007a33] outline-none font-bold shadow-sm"
              />
            </div>
            {isAdmin && (
              <button
                onClick={() => setIsModalOpen(true)}
                data-testid="btn-criar-campeonato"
                className="min-w-[40vh] flex justify-center bg-[#007a33] hover:bg-[#005f27] text-white font-bold py-2.5 px-6 rounded-lg shadow-sm transition-all items-center gap-2 whitespace-nowrap cursor-pointer active:scale-95"
              >
                Criar Novo Campeonato
              </button>
            )}
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 size={32} className="animate-spin text-[#007a33]" />
            </div>
          ) : filtrados.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-gray-400">
              <p className="font-bold text-lg">Nenhum campeonato encontrado</p>
              <p className="text-sm font-medium mt-1">
                {searchTerm ? "Tente outro termo de busca." : "Nenhum campeonato cadastrado ainda."}
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-4" data-testid="lista-campeonatos">
              {filtrados.map((camp) => (
                <CampeonatoCard
                  key={camp.id}
                  nome={camp.nome}
                  ano={camp.ano}
                  status={camp.status}
                  formato={camp.formato}
                  totalPartidas={camp.totalPartidas}
                  isAdmin={isAdmin}
                  onEdit={() => { setCampeonatoParaEditar(camp); setIsEditarModalOpen(true); }}
                  onDelete={() => handleOpenExcluir(camp)}
                  onGerenciar={() => router.push(`/${encodeURIComponent(camp.nome)}?id=${camp.id}`)}
                />
              ))}
            </div>
          )}

          <div className="mt-16 flex justify-center">
            <button
              data-testid="btn-voltar-campeonatos"
              onClick={() => window.history.back()}
              className="bg-[#007a33] hover:bg-[#005f27] text-white px-12 py-2.5 rounded-lg font-bold shadow-md transition-all active:scale-95 cursor-pointer"
            >
              Voltar
            </button>
          </div>
        </div>
      </div>

      <ModalCriarCampeonato
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); loadCampeonatos(); }}
      />
      <ModalExcluirCampeonato
        isOpen={isExcluirModalOpen}
        onClose={() => setIsExcluirModalOpen(false)}
        onConfirm={handleConfirmExcluir}
      />
      <ModalEditarCampeonato
        isOpen={isEditarModalOpen}
        onClose={() => { setIsEditarModalOpen(false); loadCampeonatos(); }}
        campeonato={campeonatoParaEditar}
      />
      <ModalErroExcluirCampeonato
        isOpen={isErroModalOpen}
        onClose={() => setIsErroModalOpen(false)}
      />
    </>
  );
}