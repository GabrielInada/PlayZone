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

// ── Tipos ─────────────────────────────────────────────────────────────────────
interface KnockoutEntry {
  id: number;
  tournamentName: string;
  stage: string;
  matchId: number;
  isDecided: boolean;
  createdAt: string;
  match?: { status: string };
}

interface Campeonato {
  nome: string;
  ano: string;
  status: string;
  formato: string;
  totalPartidas: number;
  entries: KnockoutEntry[];
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function deriveStatus(entries: KnockoutEntry[]): string {
  const allDecided = entries.every((e) => e.isDecided);
  return allDecided ? "Finalizado" : "Em Andamento";
}

function deriveAno(entries: KnockoutEntry[]): string {
  if (entries.length === 0) return "—";
  const date = new Date(entries[0].createdAt);
  return date.getFullYear().toString();
}

// Agrupa os confrontos por tournamentName para montar a lista de campeonatos
function groupByCampeonato(entries: KnockoutEntry[]): Campeonato[] {
  const map = new Map<string, KnockoutEntry[]>();
  entries.forEach((e) => {
    if (!map.has(e.tournamentName)) map.set(e.tournamentName, []);
    map.get(e.tournamentName)!.push(e);
  });

  return Array.from(map.entries()).map(([nome, items]) => ({
    nome,
    ano:           deriveAno(items),
    status:        deriveStatus(items),
    formato:       "Mata-Mata",
    totalPartidas: items.length,
    entries:       items,
  }));
}

// ── Página ────────────────────────────────────────────────────────────────────
export default function CampeonatosPage() {
  const router      = useRouter();
  const { user, token } = useAuth();
  const isAdmin     = user?.type === "admin";

  const [campeonatos,    setCampeonatos]    = useState<Campeonato[]>([]);
  const [loading,        setLoading]        = useState(true);
  const [searchTerm,     setSearchTerm]     = useState("");

  const [isModalOpen,        setIsModalOpen]        = useState(false);
  const [isExcluirModalOpen, setIsExcluirModalOpen] = useState(false);
  const [isErroModalOpen,    setIsErroModalOpen]    = useState(false);
  const [isEditarModalOpen,  setIsEditarModalOpen]  = useState(false);

  const [campeonatoParaExcluir, setCampeonatoParaExcluir] = useState<string | null>(null);
  const [campeonatoParaEditar,  setCampeonatoParaEditar]  = useState<Campeonato | null>(null);

  // ── Carrega confrontos e agrupa por campeonato ────────────────────────────
  const loadCampeonatos = useCallback(async () => {
    setLoading(true);
    try {
      const headers: Record<string, string> = token
        ? { Authorization: `Bearer ${token}` }
        : {};
      const res  = await fetch(`${API_URL}/tournament-knockout`, { headers });
      if (!res.ok) throw new Error(`Erro ${res.status}`);
      const data: KnockoutEntry[] = await res.json();
      setCampeonatos(groupByCampeonato(Array.isArray(data) ? data : []));
    } catch (err) {
      console.error("Erro ao carregar campeonatos:", err);
      setCampeonatos([]);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => { loadCampeonatos(); }, [loadCampeonatos]);

  const filtrados = campeonatos.filter((c) =>
    c.nome.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenExcluir = (camp: Campeonato) => {
    if (camp.status === "Em Andamento") {
      setIsErroModalOpen(true);
    } else {
      setCampeonatoParaExcluir(camp.nome);
      setIsExcluirModalOpen(true);
    }
  };

  const handleConfirmExcluir = async () => {
    // Deleta todos os confrontos do campeonato pelo tournamentName
    if (!campeonatoParaExcluir) return;
    const camp = campeonatos.find((c) => c.nome === campeonatoParaExcluir);
    if (!camp) return;
    try {
      const headers: Record<string, string> = {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      };
      await Promise.all(
        camp.entries.map((e) =>
          fetch(`${API_URL}/tournament-knockout/${e.id}`, { method: "DELETE", headers })
        )
      );
      await loadCampeonatos();
    } catch (err) {
      console.error("Erro ao excluir campeonato:", err);
    } finally {
      setIsExcluirModalOpen(false);
      setCampeonatoParaExcluir(null);
    }
  };

  const handleOpenEditar = (camp: Campeonato) => {
    setCampeonatoParaEditar(camp);
    setIsEditarModalOpen(true);
  };

  const handleGerenciar = (nome: string) => {
    router.push(`/${encodeURIComponent(nome)}`);
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

            {/* Criar campeonato — apenas admin */}
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

          {/* Lista */}
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
                  key={camp.nome}
                  nome={camp.nome}
                  ano={camp.ano}
                  status={camp.status}
                  formato={camp.formato}
                  totalPartidas={camp.totalPartidas}
                  isAdmin={isAdmin}
                  onEdit={() => handleOpenEditar(camp)}
                  onDelete={() => handleOpenExcluir(camp)}
                  onGerenciar={() => handleGerenciar(camp.nome)}
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