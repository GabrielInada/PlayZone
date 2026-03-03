"use client";
import { useState, useEffect } from "react";
import { X, ChevronDown } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000";

const STAGES = [
  { value: "GROUP",         label: "Fase de Grupos" },
  { value: "QUARTER_FINAL", label: "Quartas de Final" },
  { value: "SEMI_FINAL",    label: "Semifinal" },
  { value: "FINAL",         label: "Final" },
];

interface Match {
  id: number;
  homeTeam: { name: string };
  awayTeam: { name: string };
  date: string;
}

interface ModalCriarCampeonatoProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ModalCriarCampeonato({ isOpen, onClose }: ModalCriarCampeonatoProps) {
  const { token } = useAuth();

  const [tournamentName, setTournamentName] = useState("");
  const [stage,          setStage]          = useState("QUARTER_FINAL");
  const [roundOrder,     setRoundOrder]     = useState(1);
  const [slot,           setSlot]           = useState(1);
  const [matchId,        setMatchId]        = useState<number | null>(null);
  const [notes,          setNotes]          = useState("");

  const [matches,        setMatches]        = useState<Match[]>([]);
  const [loadingMatches, setLoadingMatches] = useState(false);
  const [submitting,     setSubmitting]     = useState(false);
  const [error,          setError]          = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    const load = async () => {
      setLoadingMatches(true);
      try {
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        const res  = await fetch(`${API_URL}/match`, { headers });
        const data = await res.json();
        setMatches(Array.isArray(data) ? data : []);
      } catch { setMatches([]); }
      finally  { setLoadingMatches(false); }
    };
    load();
  }, [isOpen, token]);

  const handleClose = () => {
    setTournamentName(""); setStage("QUARTER_FINAL");
    setRoundOrder(1); setSlot(1);
    setMatchId(null); setNotes(""); setError(null);
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!tournamentName.trim()) { setError("Informe o nome do campeonato."); return; }
    if (!matchId)               { setError("Selecione uma partida."); return; }

    setSubmitting(true);
    try {
      const res = await fetch(`${API_URL}/tournament-knockout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          tournamentName: tournamentName.trim(),
          stage,
          roundOrder,
          slot,
          matchId,
          ...(notes.trim() && { notes: notes.trim() }),
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.message ?? `Erro ${res.status}`);
      }

      handleClose();
    } catch (err: any) {
      setError(err.message ?? "Erro ao criar campeonato.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  const selectClass = "w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#007a33] outline-none transition-all bg-white cursor-pointer text-gray-900 font-bold appearance-none disabled:opacity-50";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" onClick={handleClose}>
      <div className="bg-white w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden" onClick={(e) => e.stopPropagation()}>

        {/* Header */}
        <div className="flex justify-between items-start p-6 border-b border-gray-100">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Criar Novo Campeonato</h2>
            <p className="text-sm text-gray-500 mt-1 font-medium">Configure as informações do confronto mata-mata</p>
          </div>
          <button onClick={handleClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors cursor-pointer">
            <X size={24} className="text-gray-400" />
          </button>
        </div>

        {error && (
          <div className="mx-6 mt-4 px-4 py-2.5 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600 font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-6 space-y-5">

          {/* Nome */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-gray-900">Nome do Campeonato *</label>
            <input
              type="text"
              value={tournamentName}
              onChange={(e) => setTournamentName(e.target.value)}
              placeholder="Ex: Copa PlayZone 2026"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#007a33] outline-none transition-all text-gray-900 font-bold placeholder:font-normal"
            />
          </div>

          {/* Fase */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-gray-900">Fase *</label>
            <div className="relative">
              <select value={stage} onChange={(e) => setStage(e.target.value)} className={selectClass}>
                {STAGES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
            </div>
          </div>

          {/* Rodada e Slot */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-gray-900">Rodada</label>
              <input
                type="number" min={1} value={roundOrder}
                onChange={(e) => setRoundOrder(Number(e.target.value))}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#007a33] outline-none transition-all text-gray-900 font-bold"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-gray-900">Slot</label>
              <input
                type="number" min={1} value={slot}
                onChange={(e) => setSlot(Number(e.target.value))}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#007a33] outline-none transition-all text-gray-900 font-bold"
              />
            </div>
          </div>

          {/* Partida */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-gray-900 flex items-center gap-2">
              Partida *
              {loadingMatches && <span className="text-gray-400 font-normal text-xs">carregando...</span>}
              {!loadingMatches && matches.length === 0 && <span className="text-red-400 font-normal text-xs">nenhuma partida cadastrada</span>}
            </label>
            <div className="relative">
              <select
                value={matchId ?? ""}
                onChange={(e) => setMatchId(Number(e.target.value))}
                className={selectClass}
                disabled={loadingMatches}
              >
                <option value="">Selecione uma partida</option>
                {matches.map((m) => (
                  <option key={m.id} value={m.id}>
                    #{m.id} — {m.homeTeam.name} x {m.awayTeam.name} ({new Date(m.date).toLocaleDateString("pt-BR")})
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
            </div>
          </div>

          {/* Observações */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-gray-900">
              Observações <span className="font-normal text-gray-400">(opcional)</span>
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ex: W.O. visitante"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#007a33] outline-none transition-all text-gray-900 font-medium placeholder:font-normal"
            />
          </div>

          {/* Ações */}
          <div className="flex gap-4 pt-2">
            <button type="button" onClick={handleClose}
              className="flex-1 py-3.5 px-6 border border-gray-300 rounded-xl font-bold text-gray-900 hover:bg-gray-50 transition-all active:scale-95 cursor-pointer">
              Cancelar
            </button>
            <button type="submit" disabled={submitting || loadingMatches}
              className="flex-1 py-3.5 px-6 bg-[#007a33] text-white rounded-xl font-bold hover:bg-[#005f27] transition-all active:scale-95 shadow-md cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed">
              {submitting ? "Criando..." : "Criar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}