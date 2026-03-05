"use client";
import React, { useEffect, useState, useCallback } from "react";
import { Trophy, Trash2, Pencil, Loader2 } from "lucide-react";
import ModalExcluirPartida from "@/components/ModalExcluirPartida";
import ModalAgendarPartida from "@/components/ModalAgendarPartida";
import { useAuth } from "@/context/AuthContext";
import { useParams, useSearchParams } from "next/navigation";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000";

interface MatchReport {
  id: number;
  status: string;
  homeScore: number;
  awayScore: number;
}

interface Team {
  id: number;
  name: string;
  club?: { id: number; name: string };
}

interface MatchNested {
  id: number;
  date: string;
  status: "scheduled" | "finished" | "cancelled" | string;
  locationId: number;
  homeTeam: Team;
  awayTeam: Team;
  location?: { id: number; name: string };
  delegate?: { id: number; name: string };
  report?: MatchReport;
}

interface KnockoutEntry {
  id: number;
  tournamentId: number;
  stage: string;
  roundOrder: number;
  slot: number;
  matchId: number;
  winnerTeamId: number | null;
  isDecided: boolean;
  notes: string | null;
  createdAt: string;
  match: MatchNested;
  winnerTeam: Team | null;
}

interface Match {
  id: number;
  date: string;
  status: string;
  locationId: number;
  homeTeam: Team;
  awayTeam: Team;
  location?: { id: number; name: string };
  delegate?: { id: number; name: string };
  report?: MatchReport;
}

const STAGE_LABELS: Record<string, string> = {
  GROUP:         "Fase de Grupos",
  QUARTER_FINAL: "Quartas de Final",
  SEMI_FINAL:    "Semifinal",
  FINAL:         "Final",
};

function teamDisplay(team: Team): string {
  return team.club ? `${team.club.name}` : team.name;
}

function teamLabel(team: Team): string {
  return team.club ? `${team.club.name} — ${team.name}` : team.name;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("pt-BR");
}
function formatHour(iso: string) {
  return new Date(iso).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
}

function ScoreBadge({ match }: { match: MatchNested }) {
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
  const { token, user } = useAuth();
  const isAdmin         = user?.type === "admin";
  const params         = useParams();
  const searchParams   = useSearchParams();

  // ID vem da query string — ?id=1
  const tournamentId   = searchParams.get("id") ? Number(searchParams.get("id")) : null;
  const nomeCampeonato = params?.nome
    ? decodeURIComponent(params.nome as string)
    : "Campeonato";

  const [entries,            setEntries]            = useState<KnockoutEntry[]>([]);
  const [loading,            setLoading]            = useState(true);
  const [notFound,           setNotFound]           = useState(false);
  const [isExcluirOpen,      setIsExcluirOpen]      = useState(false);
  const [isEditarOpen,       setIsEditarOpen]       = useState(false);
  const [partidaParaExcluir, setPartidaParaExcluir] = useState<number | null>(null);
  const [partidaParaEditar,  setPartidaParaEditar]  = useState<Match | null>(null);

  const fetchMatches = useCallback(async () => {
    setLoading(true);
    setNotFound(false);
    try {
      const headers: Record<string, string> = token
        ? { Authorization: `Bearer ${token}` } : {};

      let resolvedId = tournamentId;

      // Se não veio ID na URL, busca pelo nome como fallback
      if (!resolvedId) {
        const tourRes  = await fetch(`${API_URL}/tournament`, { headers });
        const tourData = await tourRes.json();
        const found    = (Array.isArray(tourData) ? tourData : [])
          .find((t: any) => t.name?.toLowerCase() === nomeCampeonato.toLowerCase());
        resolvedId = found?.id ?? null;
      }

      if (!resolvedId) { setNotFound(true); return; }

      // GET /tournament/{id} — valida que o torneio existe
      const tourRes = await fetch(`${API_URL}/tournament/${resolvedId}`, { headers });
      if (!tourRes.ok) { setNotFound(true); return; }

      // GET /tournament-knockout — filtra pelo tournamentId
      const koRes  = await fetch(`${API_URL}/tournament-knockout`, { headers });
      const koData = await koRes.json();
      const filtered: KnockoutEntry[] = (Array.isArray(koData) ? koData : [])
        .filter((e: any) => e.tournamentId === resolvedId);

      setEntries(filtered);
    } catch (err) {
      console.error("Erro ao buscar partidas:", err);
    } finally {
      setLoading(false);
    }
  }, [token, tournamentId, nomeCampeonato]);

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
          {loading
            ? "Carregando..."
            : `${entries.length} partida${entries.length !== 1 ? "s" : ""} encontrada${entries.length !== 1 ? "s" : ""}`}
        </p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 size={32} className="animate-spin text-[#007a33]" />
        </div>
      ) : notFound ? (
        <div className="flex flex-col items-center justify-center py-20 text-gray-400">
          <Trophy size={40} className="mb-3 opacity-30" />
          <p className="font-bold text-lg">Campeonato não encontrado</p>
        </div>
      ) : entries.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-gray-400">
          <Trophy size={40} className="mb-3 opacity-30" />
          <p className="font-bold text-lg">Nenhuma partida cadastrada</p>
        </div>
      ) : (
        <div className="space-y-3">
          {entries.map((entry) => {
            const { match } = entry;
            const isFinished = match.status === "finished";
            return (
              <div
                key={entry.id}
                className="bg-white rounded-xl border border-gray-200 shadow-sm px-5 py-5 flex flex-col sm:flex-row items-center gap-4 hover:shadow-md hover:border-gray-300 transition-all"
              >
                <div className="flex flex-col items-center shrink-0">
                  <div className="text-[#007a33] bg-[#f0fdf4] p-2.5 rounded-xl border border-[#bbf7d0]">
                    <Trophy size={22} />
                  </div>
                  <span className="text-[10px] text-gray-400 font-bold mt-1 whitespace-nowrap">
                    {STAGE_LABELS[entry.stage] ?? entry.stage}
                  </span>
                </div>

                <div className="flex items-center gap-4 flex-1 min-w-0 justify-center sm:justify-start">
                  <div className="flex flex-col items-end min-w-0">
                    <span className="font-bold text-gray-900 truncate max-w-[100px] sm:max-w-[160px]">
                      {teamDisplay(match.homeTeam)}
                    </span>
                    {match.homeTeam.club && (
                      <span className="text-[10px] text-gray-400 font-medium truncate max-w-[100px] sm:max-w-[160px]">
                        {match.homeTeam.name}
                      </span>
                    )}
                  </div>
                  <ScoreBadge match={match} />
                  <div className="flex flex-col items-start min-w-0">
                    <span className="font-bold text-gray-900 truncate max-w-[100px] sm:max-w-[160px]">
                      {teamDisplay(match.awayTeam)}
                    </span>
                    {match.awayTeam.club && (
                      <span className="text-[10px] text-gray-400 font-medium truncate max-w-[100px] sm:max-w-[160px]">
                        {match.awayTeam.name}
                      </span>
                    )}
                  </div>
                </div>

                <div className="text-sm text-gray-500 font-medium text-center sm:text-right whitespace-nowrap">
                  {match.location && <p className="font-semibold text-gray-700">{match.location.name}</p>}
                  {match.date && <p>{formatDate(match.date)} • {formatHour(match.date)}</p>}
                  {match.delegate && <p className="text-xs text-gray-400 mt-0.5">Delegado: {match.delegate.name}</p>}
                  {entry.winnerTeam && (
                    <p className="text-xs text-[#007a33] font-bold mt-0.5">✓ {entry.winnerTeam.name}</p>
                  )}
                </div>

                {/* Editar e excluir — apenas admin, apenas partidas scheduled sem resultado */}
                {isAdmin && match.status === "scheduled" && !match.report && (
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => { setPartidaParaEditar(match as Match); setIsEditarOpen(true); }}
                      className="bg-[#007a33] hover:bg-[#005f27] text-white px-5 py-2 rounded-xl text-sm font-bold transition-all active:scale-95 cursor-pointer flex items-center gap-1.5"
                    >
                      <Pencil size={14} /> Editar
                    </button>
                    <button
                      onClick={() => { setPartidaParaExcluir(match.id); setIsExcluirOpen(true); }}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all cursor-pointer"
                      title="Excluir partida"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                )}
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