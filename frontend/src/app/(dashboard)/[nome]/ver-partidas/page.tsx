"use client";
import React, { useEffect, useState, useCallback } from "react";
import { Trophy, Trash2, Pencil, Loader2 } from "lucide-react";
import ModalExcluirPartida from "@/components/ModalExcluirPartida";
import ModalAgendarPartida from "@/components/ModalAgendarPartida";
import { useAuth } from "@/context/AuthContext";
import { useParams } from "next/navigation";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000";

interface Match {
  id: number;
  date: string;
  status: "scheduled" | "finished" | "cancelled" | string;
  locationId: number;
  homeTeam:  { id: number; name: string };
  awayTeam:  { id: number; name: string };
  location:  { id: number; name: string };
  delegate?: { id: number; name: string };
  report?:   { homeScore: number; awayScore: number; status: string };
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("pt-BR");
}

function formatHour(iso: string) {
  return new Date(iso).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
}

function ScoreBadge({ match }: { match: Match }) {
  if (match.report && match.status === "finished") {
    return (
      <span className="bg-[#dcfce7] text-[#166534] border border-[#bbf7d0] font-bold px-4 py-1.5 rounded-full text-base whitespace-nowrap">
        {match.report.homeScore} - {match.report.awayScore}
      </span>
    );
  }
  return (
    <span className="bg-gray-100 text-gray-500 border border-gray-200 font-bold px-4 py-1.5 rounded-full text-sm whitespace-nowrap">
      Em breve
    </span>
  );
}

export default function VerPartidasPage() {
  const { user, token } = useAuth();
  const params          = useParams();
  const nomeCampeonato  = params?.nome
    ? decodeURIComponent(params.nome as string)
    : "Campeonato";

  const [partidas,           setPartidas]           = useState<Match[]>([]);
  const [loading,            setLoading]            = useState(true);
  const [isExcluirOpen,      setIsExcluirOpen]      = useState(false);
  const [isEditarOpen,       setIsEditarOpen]       = useState(false);
  const [partidaParaExcluir, setPartidaParaExcluir] = useState<number | null>(null);
  const [partidaParaEditar,  setPartidaParaEditar]  = useState<Match | null>(null);

  const fetchMatches = useCallback(async () => {
    setLoading(true);
    try {
      const headers: Record<string, string> = token
        ? { Authorization: `Bearer ${token}` } : {};
      const res  = await fetch(`${API_URL}/match`, { headers });
      const data = await res.json();
      setPartidas(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Erro ao buscar partidas:", err);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => { fetchMatches(); }, [fetchMatches]);

  const handleConfirmExcluir = async () => {
    if (!partidaParaExcluir) return;
    try {
      await fetch(`${API_URL}/match/${partidaParaExcluir}`, {
        method: "DELETE",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      await fetchMatches();
    } catch (err) {
      console.error("Erro ao excluir partida:", err);
    } finally {
      setIsExcluirOpen(false);
      setPartidaParaExcluir(null);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Lista de Partidas</h1>
        <p className="text-sm text-gray-500 font-medium mt-1">
          {loading ? "Carregando..." : `${partidas.length} partida${partidas.length !== 1 ? "s" : ""} encontrada${partidas.length !== 1 ? "s" : ""}`}
        </p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 size={32} className="animate-spin text-[#007a33]" />
        </div>
      ) : partidas.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-gray-400">
          <Trophy size={40} className="mb-3 opacity-30" />
          <p className="font-bold text-lg">Nenhuma partida cadastrada</p>
        </div>
      ) : (
        <div className="space-y-3">
          {partidas.map((partida) => {
            const isFinished = partida.status === "finished";
            return (
              <div
                key={partida.id}
                className="bg-white rounded-xl border border-gray-200 mb-4 shadow-sm px-5 py-5 flex flex-col sm:flex-row items-center gap-4 hover:shadow-md hover:border-gray-300 transition-all"
              >
                {/* Ícone */}
                <div className="text-[#007a33] bg-[#f0fdf4] p-2.5 rounded-xl border border-[#bbf7d0] shrink-0">
                  <Trophy size={22} />
                </div>

                {/* Times + placar */}
                <div className="flex items-center gap-4 flex-1 min-w-0 justify-center sm:justify-start">
                  <span className="font-bold text-gray-900 truncate max-w-[100px] sm:max-w-none">
                    {partida.homeTeam.name}
                  </span>
                  <ScoreBadge match={partida} />
                  <span className="font-bold text-gray-900 truncate max-w-[100px] sm:max-w-none">
                    {partida.awayTeam.name}
                  </span>
                </div>

                {/* Infos */}
                <div className="text-sm text-gray-500 font-medium text-center sm:text-right whitespace-nowrap">
                  <p className="font-semibold text-gray-700">{partida.location.name}</p>
                  <p>{formatDate(partida.date)} • {formatHour(partida.date)}</p>
                </div>

                {/* Ações */}
                <div className="flex items-center gap-2 shrink-0">
                  {/* Editar — abre modal de agendamento pré-preenchido */}
                  <button
                    onClick={() => { setPartidaParaEditar(partida); setIsEditarOpen(true); }}
                    className="bg-[#007a33] hover:bg-[#005f27] text-white px-5 py-2 rounded-xl text-sm font-bold transition-all active:scale-95 cursor-pointer flex items-center gap-1.5"
                  >
                    <Pencil size={14} /> Editar
                  </button>

                  {/* Excluir — apenas se a partida NÃO estiver finalizada */}
                  {!isFinished && (
                    <button
                      onClick={() => { setPartidaParaExcluir(partida.id); setIsExcluirOpen(true); }}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all cursor-pointer"
                      title="Excluir partida"
                    >
                      <Trash2 size={18} />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <ModalExcluirPartida
        isOpen={isExcluirOpen}
        onClose={() => setIsExcluirOpen(false)}
        onConfirm={handleConfirmExcluir}
      />

      <ModalAgendarPartida
        isOpen={isEditarOpen}
        onClose={() => { setIsEditarOpen(false); setPartidaParaEditar(null); fetchMatches(); }}
        nomeCampeonato={nomeCampeonato}
        matchToEdit={partidaParaEditar}
      />
    </div>
  );
}