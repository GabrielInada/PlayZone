"use client";
import React, { useState, useEffect } from "react";
import { X, ChevronDown } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000";

interface MatchToEdit {
  id: number;
  date: string;
  locationId: number;
  homeTeam: { id: number; name: string };
  awayTeam: { id: number; name: string };
  delegate?: { id: number; name: string };
}

interface ModalAgendarPartidaProps {
  isOpen: boolean;
  onClose: () => void;
  nomeCampeonato: string;
  matchToEdit?: MatchToEdit | null; // se fornecido → modo edição
}

interface Team     { id: number; name: string; club?: { id: number; name: string }; }
interface User     { id: number; name: string; type: string; }
interface Location { id: number; name: string; }

export default function ModalAgendarPartida({
  isOpen, onClose, nomeCampeonato, matchToEdit,
}: ModalAgendarPartidaProps) {
  const router    = useRouter();
  const { token } = useAuth();
  const isEditing = !!matchToEdit;

  const [data,       setData]       = useState("");
  const [hora,       setHora]       = useState("");
  const [locationId, setLocationId] = useState<number | null>(null);
  const [homeTeamId, setHomeTeamId] = useState<number | null>(null);
  const [awayTeamId, setAwayTeamId] = useState<number | null>(null);
  const [delegateId, setDelegateId] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error,      setError]      = useState<string | null>(null);

  const [locations, setLocations] = useState<Location[]>([]);
  const [teams,     setTeams]     = useState<Team[]>([]);
  const [delegados, setDelegados] = useState<User[]>([]);
  const [loading,   setLoading]   = useState(false);

  // Pré-preenche campos no modo edição
  useEffect(() => {
    if (!matchToEdit) return;
    const d = new Date(matchToEdit.date);
    const dd   = String(d.getDate()).padStart(2, "0");
    const mm   = String(d.getMonth() + 1).padStart(2, "0");
    const yyyy = d.getFullYear();
    const hh   = String(d.getHours()).padStart(2, "0");
    const min  = String(d.getMinutes()).padStart(2, "0");
    setData(`${dd}/${mm}/${yyyy}`);
    setHora(`${hh}:${min}`);
    setLocationId(matchToEdit.locationId);
    setHomeTeamId(matchToEdit.homeTeam.id);
    setAwayTeamId(matchToEdit.awayTeam.id);
    setDelegateId(matchToEdit.delegate?.id ?? null);
  }, [matchToEdit]);

  useEffect(() => {
    if (!isOpen) return;

    const headers: Record<string, string> = {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };

    // Busca simples — suporta array e resposta paginada { data, meta }
    const safeFetch = async (url: string): Promise<any[]> => {
      try {
        const res = await fetch(url, { headers });
        if (!res.ok) { console.error(`Erro ${res.status} em GET ${url}`); return []; }
        const json = await res.json();
        if (Array.isArray(json)) return json;
        if (json?.data && Array.isArray(json.data)) return json.data;
        return [];
      } catch (err) {
        console.error(`Falha ao buscar ${url}:`, err);
        return [];
      }
    };

    // Busca todas as páginas de endpoints paginados
    const fetchAllPages = async (url: string): Promise<any[]> => {
      try {
        const first = await fetch(`${url}?page=1&size=100`, { headers });
        if (!first.ok) return [];
        const json = await first.json();
        if (Array.isArray(json)) return json;
        const { data = [], meta } = json;
        if (!meta || meta.lastPage <= 1) return data;
        // Busca páginas restantes em paralelo
        const pages = Array.from({ length: meta.lastPage - 1 }, (_, i) =>
          fetch(`${url}?page=${i + 2}&size=100`, { headers })
            .then(r => r.json())
            .then(j => j?.data ?? [])
            .catch(() => [])
        );
        const rest = await Promise.all(pages);
        return [...data, ...rest.flat()];
      } catch (err) {
        console.error(`Falha ao buscar ${url}:`, err);
        return [];
      }
    };

    const load = async () => {
      setLoading(true);
      try {
        const [locationsData, teamsData, usersData] = await Promise.all([
          safeFetch(`${API_URL}/location`),
          safeFetch(`${API_URL}/team`),
          fetchAllPages(`${API_URL}/user`),  // paginado — busca tudo
        ]);
        setLocations(locationsData);
        setTeams(teamsData);
        setDelegados(usersData.filter((u: User) => u.type === "delegado"));
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [isOpen, token]);

  const handleClose = () => {
    setData(""); setHora("");
    setLocationId(null); setHomeTeamId(null);
    setAwayTeamId(null); setDelegateId(null);
    setError(null);
    onClose();
  };

  const handleDataChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let v = e.target.value.replace(/\D/g, "").slice(0, 8);
    v = v.replace(/(\d{2})(\d)/, "$1/$2");
    v = v.replace(/(\d{2})\/(\d{2})(\d)/, "$1/$2/$3");
    setData(v);
  };

  const handleHoraChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let v = e.target.value.replace(/\D/g, "").slice(0, 4);
    v = v.replace(/(\d{2})(\d)/, "$1:$2");
    setHora(v);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!data || !hora || !locationId || !homeTeamId || !awayTeamId || !delegateId) {
      setError("Preencha todos os campos obrigatórios.");
      return;
    }
    if (homeTeamId === awayTeamId) {
      setError("O time mandante e visitante não podem ser o mesmo.");
      return;
    }

    const [dia, mes, ano] = data.split("/");
    const isoDate = new Date(`${ano}-${mes}-${dia}T${hora}:00`).toISOString();

    setSubmitting(true);
    try {
      const url    = isEditing ? `${API_URL}/match/${matchToEdit!.id}` : `${API_URL}/match`;
      const method = isEditing ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          date: isoDate, locationId, homeTeamId,
          awayTeamId, delegateId,
          ...(!isEditing && { status: "scheduled" }),
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.message ?? `Erro ${res.status}`);
      }

      handleClose();
      router.refresh();
    } catch (err: any) {
      setError(err.message ?? "Erro ao salvar partida. Tente novamente.");
    } finally {
      setSubmitting(false);
    }
  };

  const teamLabel = (t: Team) => t.club?.name ?? t.name;

  if (!isOpen) return null;

  const selectClass =
    "text-sm w-full pl-4 pr-10 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#007a33] outline-none font-medium cursor-pointer appearance-none disabled:opacity-50 disabled:cursor-not-allowed";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" onClick={handleClose}>
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl overflow-hidden font-bold text-gray-900" onClick={(e) => e.stopPropagation()}>

        <div className="p-6 mt-3 flex justify-between items-start">
          <div>
            <h2 className="text-xl font-bold text-gray-950">
              {isEditing ? "Editar Partida" : "Agendar Partida"} — {nomeCampeonato}
            </h2>
            <p className="text-sm text-gray-500 font-medium mt-1">
              {isEditing ? "Atualize as informações da partida" : "Adicione as informações da partida"}
            </p>
          </div>
          <button onClick={handleClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors cursor-pointer">
            <X size={20} className="text-gray-400" />
          </button>
        </div>

        {loading && (
          <div className="px-6 pb-2 text-sm text-gray-400 font-medium animate-pulse">
            Carregando dados...
          </div>
        )}

        {error && (
          <div className="mx-6 mb-2 px-4 py-2.5 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600 font-medium">
            {error}
          </div>
        )}

        <form className="p-6 pt-0 py-8 space-y-5 text-sm" onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-bold text-gray-900">Data *</label>
              <input type="text" value={data} onChange={handleDataChange} placeholder="DD/MM/AAAA" maxLength={10}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#007a33] outline-none font-medium" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-bold text-gray-900">Hora *</label>
              <input type="text" value={hora} onChange={handleHoraChange} placeholder="00:00" maxLength={5}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#007a33] outline-none font-medium" />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-bold text-gray-900">Local *</label>
            <div className="relative">
              <select value={locationId ?? ""} onChange={(e) => setLocationId(Number(e.target.value))} className={selectClass} disabled={loading}>
                <option value="">Escolha o local</option>
                {locations.map((l) => <option key={l.id} value={l.id}>{l.name}</option>)}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-bold text-gray-900">Mandante *</label>
              <div className="relative">
                <select value={homeTeamId ?? ""} onChange={(e) => setHomeTeamId(Number(e.target.value))} className={selectClass} disabled={loading}>
                  <option value="">Escolha o time</option>
                  {teams.map((t) => <option key={t.id} value={t.id}>{teamLabel(t)}</option>)}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-bold text-gray-900">Visitante *</label>
              <div className="relative">
                <select value={awayTeamId ?? ""} onChange={(e) => setAwayTeamId(Number(e.target.value))} className={selectClass} disabled={loading}>
                  <option value="">Escolha o time</option>
                  {teams.filter((t) => t.id !== homeTeamId).map((t) => (
                    <option key={t.id} value={t.id}>{teamLabel(t)}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-1.5 pb-2">
            <label className="text-sm font-bold text-gray-900 flex items-center gap-2">
              Delegado *
              {!loading && delegados.length === 0 && (
                <span className="text-red-400 font-medium text-xs">nenhum delegado cadastrado</span>
              )}
              {!loading && delegados.length > 0 && (
                <span className="text-gray-400 font-normal text-xs">{delegados.length} disponível{delegados.length > 1 ? "is" : ""}</span>
              )}
            </label>
            <div className="relative">
              <select value={delegateId ?? ""} onChange={(e) => setDelegateId(Number(e.target.value))} className={selectClass} disabled={loading}>
                <option value="">Escolha o delegado</option>
                {delegados.map((u) => <option key={u.id} value={u.id}>{u.name}</option>)}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
            </div>
          </div>

          <div className="pt-6 flex justify-end gap-3">
            <button type="button" onClick={handleClose}
              className="px-6 py-2 border border-gray-300 rounded-md font-bold text-gray-700 hover:bg-gray-100 transition-colors text-sm cursor-pointer">
              Cancelar
            </button>
            <button type="submit" disabled={submitting || loading}
              className="px-8 py-2 bg-[#007a33] hover:bg-[#005f27] text-white rounded-md font-bold shadow-sm transition-all text-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed">
              {submitting ? (isEditing ? "Salvando..." : "Agendando...") : (isEditing ? "Salvar" : "Agendar")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}