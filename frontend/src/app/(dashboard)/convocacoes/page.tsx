"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Search, MapPin, Users, Calendar, Trophy, CalendarDays, Loader2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000";

// ── Tipos ──────────────────────────────────────────────────────────────────────
interface Match {
  id: number;
  date: string;
  status: string;
  homeTeam:  { id: number; name: string };
  awayTeam:  { id: number; name: string };
  location?: { id: number; name: string; address?: string; capacity?: number; imageUrl?: string };
  delegate?: { id: number; name: string };
  report?:   { id: number; status: string } | null;
}

interface KnockoutEntry {
  id: number;
  tournamentId: number;
  matchId: number;
  stage: string;
}

interface Tournament {
  id: number;
  name: string;
}

interface Convocacao {
  matchId:      number;
  stadiumName:  string;
  address:      string;
  capacity:     string;
  match:        string;
  date:         string;
  imageUrl:     string;
  campeonato:   string;
  status:       string;
}

// ── Helpers ────────────────────────────────────────────────────────────────────
function formatDate(iso: string): string {
  const d = new Date(iso);
  const dia = String(d.getDate()).padStart(2, "0");
  const mes = String(d.getMonth() + 1).padStart(2, "0");
  const hh  = String(d.getHours()).padStart(2, "0");
  const min = String(d.getMinutes()).padStart(2, "0");
  return `Dia ${dia}/${mes} às ${hh}h${min !== "00" ? min : ""}`;
}

const STATUS_LABEL: Record<string, { label: string; color: string }> = {
  scheduled: { label: "Agendada",   color: "text-blue-700 bg-blue-50 border-blue-200" },
  finished:  { label: "Finalizada", color: "text-gray-600 bg-gray-50 border-gray-200" },
  cancelled: { label: "Cancelada",  color: "text-red-600  bg-red-50  border-red-200"  },
};

// ── Card ───────────────────────────────────────────────────────────────────────
function ConvocacaoCard({ c }: { c: Convocacao }) {
  const st = STATUS_LABEL[c.status] ?? STATUS_LABEL.scheduled;

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-300 flex flex-col transition-all duration-300 hover:scale-[1.02] hover:shadow-xl group">
      {/* Imagem */}
      <div className="relative h-48 bg-gray-200">
        {c.imageUrl ? (
          <img src={c.imageUrl} alt={c.stadiumName} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-100">
            <CalendarDays size={40} className="text-gray-300" />
          </div>
        )}
        {/* Badge status */}
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-md shadow-sm border border-green-100">
          <div className="flex items-center gap-1.5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            <span className="text-[10px] font-bold text-green-800 uppercase tracking-wide">Convocado</span>
          </div>
        </div>
      </div>

      {/* Conteúdo */}
      <div className="p-5 flex flex-col flex-1 text-gray-900 font-bold">
        <h3 className="text-xl font-bold mb-1">{c.stadiumName}</h3>

        {c.address && (
          <div className="flex items-start gap-2 text-[14px] text-gray-800 mb-3 mt-2 font-medium leading-tight">
            <MapPin className="h-4 w-4 text-[#007a33] mt-0.5 shrink-0" />
            <span className="line-clamp-2">{c.address}</span>
          </div>
        )}

        {c.capacity && (
          <div className="flex items-center gap-2 text-[14px] text-gray-800 mb-4 font-medium">
            <Users className="h-4 w-4 text-[#007a33]" />
            <span>{c.capacity}</span>
          </div>
        )}

        <div className="flex items-center gap-2 text-sm font-medium text-gray-800 mb-2">
          <Trophy className="h-4 w-4 text-[#007a33]" />
          <span>{c.match}</span>
        </div>

        {c.campeonato && (
          <p className="text-xs text-gray-400 font-medium mb-4 ml-6">{c.campeonato}</p>
        )}

        <div className="mt-auto flex flex-col gap-2">
          <div className="flex items-center justify-center gap-2 border border-[#007a33] rounded-md py-2 px-3 text-xs text-[#007a33] bg-white font-bold">
            <Calendar className="h-4 w-4" />
            <span>{c.date}</span>
          </div>
          <span className={`text-center text-[10px] font-bold px-2 py-1 rounded border ${st.color}`}>
            {st.label}
          </span>
        </div>
      </div>
    </div>
  );
}

// ── Página ─────────────────────────────────────────────────────────────────────
export default function ConvocacoesPage() {
  const { user, token } = useAuth();
  const [convocacoes, setConvocacoes] = useState<Convocacao[]>([]);
  const [loading,     setLoading]     = useState(true);
  const [searchTerm,  setSearchTerm]  = useState("");

  const load = useCallback(async () => {
    if (!user || !token) return;
    setLoading(true);
    try {
      const headers = { Authorization: `Bearer ${token}` };

      // Busca partidas, knockouts e torneios em paralelo
      const [matchRes, koRes, tourRes] = await Promise.all([
        fetch(`${API_URL}/match`,                { headers }),
        fetch(`${API_URL}/tournament-knockout`,  { headers }),
        fetch(`${API_URL}/tournament`,           { headers }),
      ]);

      const allMatches:     Match[]         = matchRes.ok  ? await matchRes.json()  : [];
      const allKnockouts:   KnockoutEntry[] = koRes.ok     ? await koRes.json()     : [];
      const allTournaments: Tournament[]    = tourRes.ok   ? await tourRes.json()   : [];

      // Filtra apenas partidas do delegado logado
      const myMatches = (Array.isArray(allMatches) ? allMatches : [])
        .filter((m) => m.delegate?.id === user.id);

      // Monta o mapa de matchId → tournamentName
      const tournamentMap = new Map(
        (Array.isArray(allTournaments) ? allTournaments : []).map((t) => [t.id, t.name])
      );
      const koByMatchId = new Map(
        (Array.isArray(allKnockouts) ? allKnockouts : []).map((e) => [
          e.matchId,
          tournamentMap.get(e.tournamentId) ?? "",
        ])
      );

      // Converte cada partida em Convocacao
      const mapped: Convocacao[] = myMatches.map((m) => ({
        matchId:     m.id,
        stadiumName: m.location?.name    ?? "Local não informado",
        address:     m.location?.address ?? "",
        capacity:    m.location?.capacity
          ? `${m.location.capacity.toLocaleString("pt-BR")} pessoas`
          : "",
        match:       `${m.homeTeam.name} x ${m.awayTeam.name}`,
        date:        formatDate(m.date),
        imageUrl:    m.location?.imageUrl ?? "",
        campeonato:  koByMatchId.get(m.id) ?? "",
        status:      m.status,
      }));

      setConvocacoes(mapped);
    } catch {
      setConvocacoes([]);
    } finally {
      setLoading(false);
    }
  }, [user, token]);

  useEffect(() => { load(); }, [load]);

  const filtradas = convocacoes.filter(
    (c) =>
      c.stadiumName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.match.toLowerCase().includes(searchTerm.toLowerCase())       ||
      c.campeonato.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-white flex flex-col font-bold min-h-screen">
      <div className="w-full max-w-6xl mx-auto px-6 pt-4 pb-20 text-gray-900">

        <div className="mb-2 pb-1">
          <h1 className="text-3xl font-bold tracking-tight">Minhas Convocações</h1>
          <p className="text-sm text-gray-500 font-medium">
            {loading ? "Carregando..." : `${convocacoes.length} convocação${convocacoes.length !== 1 ? "ões" : ""} encontrada${convocacoes.length !== 1 ? "s" : ""}`}
          </p>
        </div>

        {/* Busca */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
          <div className="relative flex-grow w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" size={20} />
            <input
              type="text"
              placeholder="Buscar ginásio, partida ou campeonato..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-600 rounded-lg focus:ring-2 focus:ring-[#007a33] outline-none font-bold"
            />
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 size={32} className="animate-spin text-[#007a33]" />
          </div>
        ) : filtradas.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtradas.map((c) => <ConvocacaoCard key={c.matchId} c={c} />)}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <CalendarDays size={48} className="mb-3 opacity-40" />
            <p className="text-base font-medium">Nenhuma convocação encontrada</p>
            <p className="text-sm mt-1">
              {searchTerm ? "Tente buscar por outro termo" : "Você não possui convocações no momento"}
            </p>
          </div>
        )}

        <div className="mt-12 flex justify-center">
          <button
            onClick={() => window.history.back()}
            className="bg-[#007a33] hover:bg-[#005f27] text-white px-12 py-2.5 rounded-lg font-bold shadow-md transition-all active:scale-95 cursor-pointer"
          >
            Voltar
          </button>
        </div>
      </div>
    </div>
  );
}