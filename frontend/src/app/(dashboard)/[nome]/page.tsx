"use client";
import React, { useState, useEffect } from 'react';
import { CalendarPlus, Users, Clock, Loader2, Trophy } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import ModalAgendarPartida from '@/components/ModalAgendarPartida';
import { useAuth } from '@/context/AuthContext';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000";

interface KnockoutEntry {
  id: number;
  tournamentName: string;
  stage: string;
  isDecided: boolean;
  createdAt: string;
  match?: { status: string };
}

interface TournamentInfo {
  nome: string;
  totalPartidas: number;
  partidasFinalizadas: number;
  status: string;
  ano: string;
}

export default function GerenciarCampeonatoPage() {
  const params  = useParams();
  const router  = useRouter();
  const { token } = useAuth();

  const [isAgendarModalOpen, setIsAgendarModalOpen] = useState(false);
  const [tournament, setTournament] = useState<TournamentInfo | null>(null);
  const [loading,    setLoading]    = useState(true);
  const [notFound,   setNotFound]   = useState(false);

  const nomeParam = params.nome
    ? decodeURIComponent(params.nome as string)
    : null;

  useEffect(() => {
    if (!nomeParam) { setNotFound(true); setLoading(false); return; }

    const load = async () => {
      setLoading(true);
      try {
        const headers: Record<string, string> = token
          ? { Authorization: `Bearer ${token}` } : {};
        const res  = await fetch(`${API_URL}/tournament-knockout`, { headers });
        if (!res.ok) throw new Error();
        const all: KnockoutEntry[] = await res.json();

        const entries = all.filter(
          (e) => e.tournamentName.toLowerCase() === nomeParam.toLowerCase()
        );

        if (entries.length === 0) { setNotFound(true); return; }

        const finalizadas = entries.filter((e) => e.isDecided).length;
        const allDecided  = finalizadas === entries.length;

        setTournament({
          nome:               entries[0].tournamentName,
          totalPartidas:      entries.length,
          partidasFinalizadas: finalizadas,
          status:             allDecided ? "Finalizado" : "Em Andamento",
          ano:                new Date(entries[0].createdAt).getFullYear().toString(),
        });
      } catch {
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [nomeParam, token]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <Loader2 size={32} className="animate-spin text-[#007a33]" />
      </div>
    );
  }

  if (notFound || !tournament) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[40vh] gap-3 text-gray-400">
        <Trophy size={40} className="opacity-30" />
        <p className="font-bold text-lg text-gray-600">Campeonato não encontrado</p>
        <button
          onClick={() => router.push("/campeonatos")}
          className="text-sm text-[#007a33] font-bold hover:underline cursor-pointer"
        >
          Voltar para campeonatos
        </button>
      </div>
    );
  }

  const isFinished = tournament.status === "Finalizado";

  return (
    <div className="flex flex-col font-bold" data-testid="page-gerenciar-campeonato">
      <div className="w-full max-w-6xl mx-auto px-6 pt-10 pb-20 text-gray-900">

        {/* Cabeçalho com dados reais */}
        <div className="mb-10 text-left">
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
              {tournament.nome}
            </h1>
            <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
              isFinished
                ? "bg-gray-100 text-gray-500 border-gray-200"
                : "bg-[#dcfce7] text-[#166534] border-[#bbf7d0]"
            }`}>
              {tournament.status}
            </span>
          </div>
          <p className="text-base text-gray-500 font-medium">
            {tournament.ano} • Mata-Mata •{" "}
            {tournament.partidasFinalizadas}/{tournament.totalPartidas} partidas finalizadas
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">

          {/* Agendar nova partida — desabilitado se finalizado */}
          <button
            onClick={() => !isFinished && setIsAgendarModalOpen(true)}
            disabled={isFinished}
            className={`flex items-center gap-5 p-6 bg-white border-2 rounded-xl shadow-md text-left group transition-all ${
              isFinished
                ? "border-gray-100 opacity-50 cursor-not-allowed"
                : "border-gray-100 hover:border-emerald-200 hover:shadow-md cursor-pointer"
            }`}
          >
            <div className={`p-4 rounded-xl transition-colors ${isFinished ? "bg-gray-100" : "bg-gray-100 group-hover:bg-green-50"}`}>
              <CalendarPlus size={36} className={isFinished ? "text-gray-300" : "text-gray-700 group-hover:text-[#007a33]"} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 leading-tight">Agendar nova partida</h3>
              <p className="text-sm text-gray-500 font-medium">
                {isFinished ? "Campeonato encerrado" : "Agende uma partida no campeonato"}
              </p>
            </div>
          </button>

          {/* Importar Times — em desenvolvimento */}
          <button disabled className="flex items-center gap-5 p-6 bg-white border-2 border-gray-100 rounded-xl text-left opacity-50 cursor-not-allowed">
            <div className="p-4 bg-gray-100 rounded-xl">
              <Users size={36} className="text-gray-300" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-400 leading-tight">Importar Times</h3>
              <p className="text-sm text-gray-300 font-medium">Em breve</p>
            </div>
          </button>
        </div>

        {/* Ver Partidas */}
        <button
          onClick={() => router.push(`/${encodeURIComponent(tournament.nome)}/ver-partidas`)}
          className="w-full mb-12 flex items-center gap-5 p-6 bg-white border-2 border-gray-100 rounded-xl shadow-md hover:border-emerald-200 hover:shadow-md transition-all text-left group cursor-pointer"
        >
          <div className="p-4 bg-gray-100 rounded-xl group-hover:bg-green-50 transition-colors">
            <Clock size={36} className="text-gray-700 group-hover:text-[#007a33]" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900 leading-tight">Ver Partidas do Campeonato</h3>
            <p className="text-sm text-gray-500 font-medium">Visualize a agenda de jogos</p>
          </div>
        </button>

        <div className="flex justify-center">
          <button
            onClick={() => router.push("/campeonatos")}
            className="bg-[#007a33] hover:bg-[#005f27] text-white px-12 py-2.5 rounded-lg font-bold shadow-md transition-all active:scale-95 cursor-pointer text-base"
          >
            Voltar
          </button>
        </div>
      </div>

      <ModalAgendarPartida
        isOpen={isAgendarModalOpen}
        onClose={() => setIsAgendarModalOpen(false)}
        nomeCampeonato={tournament.nome}
      />
    </div>
  );
}