"use client";
import React, { useState, useEffect } from "react";
import { X, ChevronDown } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

// ── Constantes ────────────────────────────────────────────────────────────────
const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000";

// ── Tipos ─────────────────────────────────────────────────────────────────────
interface ModalAgendarPartidaProps {
  isOpen: boolean;
  onClose: () => void;
  nomeCampeonato: string;
}

interface Team     { id: number; name: string; club?: { id: number; name: string; }; }
interface User     { id: number; name: string; type: string; }
interface Location { id: number; name: string; }

// ── Componente ────────────────────────────────────────────────────────────────
export default function ModalAgendarPartida({ isOpen, onClose, nomeCampeonato }: ModalAgendarPartidaProps) {
  const router   = useRouter();
  const { token } = useAuth();

  const [data,       setData]       = useState("");
  const [hora,       setHora]       = useState("");
  const [locationId, setLocationId] = useState<number | null>(null);
  const [homeTeamId, setHomeTeamId] = useState<number | null>(null);
  const [awayTeamId, setAwayTeamId] = useState<number | null>(null);
  const [delegateId, setDelegateId] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error,      setError]      = useState<string | null>(null);

  const [locations,  setLocations]  = useState<Location[]>([]);
  const [teams,      setTeams]      = useState<Team[]>([]);
  const [delegados,  setDelegados]  = useState<User[]>([]);
  const [loading,    setLoading]    = useState(false);

  // ── Carrega dados ao abrir ─────────────────────────────────────────────────
  useEffect(() => {
    if (!isOpen) return;

    const headers: Record<string, string> = token
      ? { Authorization: `Bearer ${token}` }
      : {};

    setLoading(true);
    Promise.all([
      fetch(`${API_URL}/location`, { headers }).then((r) => r.json()),
      fetch(`${API_URL}/team`,     { headers }).then((r) => r.json()),
      fetch(`${API_URL}/user`,     { headers }).then((r) => r.json()),
    ])
      .then(([locationsData, teamsData, usersData]) => {
        setLocations(Array.isArray(locationsData) ? locationsData : []);
        setTeams(Array.isArray(teamsData) ? teamsData : []);
        setDelegados(
          Array.isArray(usersData)
            ? usersData.filter((u: User) => u.type === "delegado")
            : []
        );
      })
      .catch((err) => {
        console.error("Erro ao carregar dados:", err);
        setError("Erro ao carregar dados. Tente novamente.");
      })
      .finally(() => setLoading(false));
  }, [isOpen, token]);

  // ── Reset ao fechar ────────────────────────────────────────────────────────
  const handleClose = () => {
    setData(""); setHora("");
    setLocationId(null); setHomeTeamId(null);
    setAwayTeamId(null); setDelegateId(null);
    setError(null);
    onClose();
  };

  // ── Máscaras ───────────────────────────────────────────────────────────────
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

  // ── Submit ─────────────────────────────────────────────────────────────────
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
      const res = await fetch(`${API_URL}/match`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          date:       isoDate,
          locationId,
          homeTeamId,
          awayTeamId,
          delegateId,
          status:     "scheduled",
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.message ?? `Erro ${res.status}`);
      }

      handleClose();
      router.refresh();
    } catch (err: any) {
      console.error("Erro ao agendar partida:", err);
      setError(err.message ?? "Erro ao agendar partida. Tente novamente.");
    } finally {
      setSubmitting(false);
    }
  };

  const teamLabel = (t: Team) => t.club?.name ?? t.name;

  if (!isOpen) return null;

  const selectClass =
    "text-sm w-full pl-4 pr-10 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#007a33] outline-none font-medium cursor-pointer appearance-none";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      onClick={handleClose}
    >
      <div
        className="bg-white w-full max-w-lg rounded-2xl shadow-xl overflow-hidden font-bold text-gray-900"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 mt-3 flex justify-between items-start">
          <div>
            <h2 className="text-xl font-bold text-gray-950">
              Agendar Partida — {nomeCampeonato}
            </h2>
            <p className="text-sm text-gray-500 font-medium mt-1">
              Adicione as informações da partida
            </p>
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
          >
            <X size={20} className="text-gray-400" />
          </button>
        </div>

        {/* Loading */}
        {loading}

        {/* Erro global */}
        {error && (
          <div className="mx-6 mb-2 px-4 py-2.5 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600 font-medium">
            {error}
          </div>
        )}

        <form className="p-6 pt-0 py-8 space-y-5 text-sm" onSubmit={handleSubmit}>

          {/* Data e Hora */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-bold text-gray-900">Data *</label>
              <input
                type="text" value={data} onChange={handleDataChange}
                placeholder="DD/MM/AAAA" maxLength={10}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#007a33] outline-none font-medium"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-bold text-gray-900">Hora *</label>
              <input
                type="text" value={hora} onChange={handleHoraChange}
                placeholder="00:00" maxLength={5}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#007a33] outline-none font-medium"
              />
            </div>
          </div>

          {/* Local */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-bold text-gray-900">Local *</label>
            <div className="relative">
              <select value={locationId ?? ""} onChange={(e) => setLocationId(Number(e.target.value))} className={selectClass}>
                <option value="">Escolha o local</option>
                {locations.map((l) => (
                  <option key={l.id} value={l.id}>{l.name}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
            </div>
          </div>

          {/* Times */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-bold text-gray-900">Mandante *</label>
              <div className="relative">
                <select value={homeTeamId ?? ""} onChange={(e) => setHomeTeamId(Number(e.target.value))} className={selectClass}>
                  <option value="">Escolha o time</option>
                  {teams.map((t) => (
                    <option key={t.id} value={t.id}>{teamLabel(t)}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-bold text-gray-900">Visitante *</label>
              <div className="relative">
                <select value={awayTeamId ?? ""} onChange={(e) => setAwayTeamId(Number(e.target.value))} className={selectClass}>
                  <option value="">Escolha o time</option>
                  {teams
                    .filter((t) => t.id !== homeTeamId)
                    .map((t) => (
                      <option key={t.id} value={t.id}>{teamLabel(t)}</option>
                    ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
              </div>
            </div>
          </div>

          {/* Delegado */}
          <div className="flex flex-col gap-1.5 pb-2">
            <label className="text-sm font-bold text-gray-900">Delegado *</label>
            <div className="relative">
              <select value={delegateId ?? ""} onChange={(e) => setDelegateId(Number(e.target.value))} className={selectClass}>
                <option value="">Escolha o delegado</option>
                {delegados.map((u) => (
                  <option key={u.id} value={u.id}>{u.name}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
            </div>
          </div>

          {/* Ações */}
          <div className="pt-6 flex justify-end gap-3 border-t border-gray-100">
            <button
              type="button" onClick={handleClose}
              className="px-6 py-2 border border-gray-300 rounded-md font-bold text-gray-700 hover:bg-gray-100 transition-colors text-sm cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit" disabled={submitting || loading}
              className="px-8 py-2 bg-[#007a33] hover:bg-[#005f27] text-white rounded-md font-bold shadow-sm transition-all text-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? "Agendando..." : "Agendar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}