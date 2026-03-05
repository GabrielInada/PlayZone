"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import DelegateHeader from "@/components/delegado/DelegateHeader";
import ResponsibilityBanner from "@/components/delegado/ResponsibilityBanner";
import StatCard from "@/components/delegado/StatCard";
import CurrentMatchCard from "@/components/delegado/CurrentMatchCard";
import { CalendarDays, Loader2, ChevronRight } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import {
  DELEGADO_ROUTE,
  SUMULA_ROUTE,
  CONVOCACOES_ROUTE,
} from "@/constants/routes";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000";

// ── Tipos ─────────────────────────────────────────────────────────────────────
interface Match {
  id: number;
  date: string;
  status: string;
  homeTeam:  { id: number; name: string };
  awayTeam:  { id: number; name: string };
  location?: { id: number; name: string; address?: string; capacity?: number; imageUrl?: string };
  delegate?: { id: number; name: string };
  report?:   { id: number; status: string; homeScore: number; awayScore: number } | null;
}

// ── Ícones SVG ────────────────────────────────────────────────────────────────
const IconCalendar = (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 md:w-9 md:h-9" viewBox="0 0 24 24"
    fill="none" stroke="#10b981" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
    <line x1="16" x2="16" y1="2" y2="6" />
    <line x1="8"  x2="8"  y1="2" y2="6" />
    <line x1="3"  x2="21" y1="10" y2="10" />
    <path d="m9 16 2 2 4-4" />
  </svg>
);

const IconTrophy = (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 md:w-9 md:h-9" viewBox="0 0 24 24"
    fill="none" stroke="#10b981" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
    <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
    <path d="M4 22h16" />
    <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
    <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
    <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
  </svg>
);

const MOTIVOS_CANCELAMENTO = [
  { id: "chuva",  label: "Chuva Forte" },
  { id: "calor",  label: "Calor Excessivo" },
  { id: "briga",  label: "Briga Generalizada" },
  { id: "wo",     label: "W.O." },
];

// ── Página ────────────────────────────────────────────────────────────────────
export default function DelegatePage() {
  const router          = useRouter();
  const { user, token } = useAuth();

  const [matches,             setMatches]             = useState<Match[]>([]);
  const [loading,             setLoading]             = useState(true);
  const [cancelModalOpen,     setCancelModalOpen]     = useState(false);
  const [motivosSelecionados, setMotivosSelecionados] = useState<string[]>([]);
  const [detalheMotivo,       setDetalheMotivo]       = useState("");

  // Carrega partidas do delegado logado
  useEffect(() => {
    if (!user || !token) return;
    const load = async () => {
      setLoading(true);
      try {
        const res  = await fetch(`${API_URL}/match`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        const all: Match[] = Array.isArray(data) ? data : [];
        // Filtra apenas partidas onde delegate.id bate com o user logado
        setMatches(all.filter((m) => m.delegate?.id === user.id));
      } catch {
        setMatches([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [user, token]);

  // Stats derivados das partidas reais
  const approvedReports = matches.filter((m) => m.report?.status === "validated").length;
  const upcomingMatches = matches.filter(
    (m) => m.status === "scheduled" && new Date(m.date) > new Date()
  ).length;

  // Próxima partida agendada no futuro
  const currentMatch = matches
    .filter((m) => m.status === "scheduled" && new Date(m.date) > new Date())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())[0] ?? null;

  const toggleMotivo = (id: string) =>
    setMotivosSelecionados((prev) =>
      prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id]
    );

  const handleFinalizarCancelamento = async () => {
    if (motivosSelecionados.length === 0) return;
    console.log("Cancelando partida:", { motivos: motivosSelecionados, detalhe: detalheMotivo });
    setCancelModalOpen(false);
    setMotivosSelecionados([]);
    setDetalheMotivo("");
  };

  return (
    <main className="bg-white">
      <div className="max-w-6xl mx-auto w-full space-y-3 p-3 sm:px-6 lg:px-4">

        <DelegateHeader title="Painel do Delegado" />

        <div onClick={() => router.push(CONVOCACOES_ROUTE)} className="mt-3 shadow-md">
          <ResponsibilityBanner
            eyebrow="SUAS RESPONSABILIDADES"
            highlight={`${matches.length} Partidas Designadas`}
            description="Gerencie suas partidas e relatórios"
            icon={<CalendarDays className="h-5 w-5" />}
            href={DELEGADO_ROUTE}
          />
        </div>

        {/* Stats */}
        {loading ? (
          <div className="flex justify-center py-6">
            <Loader2 size={28} className="animate-spin text-[#007a33]" />
          </div>
        ) : (
          <section className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <StatCard title="Relatórios Aprovados" value={approvedReports} icon={IconCalendar} iconTone="success" />
            <StatCard title="Próximas Partidas"    value={upcomingMatches} icon={IconTrophy}   iconTone="success" />
          </section>
        )}

        {/* Partida atual */}
        <section className="mt-5">
          <h2 className="text-center text-lg font-semibold text-gray-900">Partida Atual</h2>
          <div className="mt-2">
            {loading ? (
              <div className="flex justify-center py-10">
                <Loader2 size={28} className="animate-spin text-[#007a33]" />
              </div>
            ) : currentMatch ? (
              <CurrentMatchCard
                matchId={String(currentMatch.id)}
                stadiumName={currentMatch.location?.name ?? "Local não informado"}
                address={currentMatch.location?.address ?? ""}
                spectators={currentMatch.location?.capacity ?? 0}
                teams={`${currentMatch.homeTeam.name} x ${currentMatch.awayTeam.name}`}
                imageUrl={currentMatch.location?.imageUrl ?? ""}
                registerHref={`${SUMULA_ROUTE}?match=${currentMatch.id}`}
                onCancel={() => setCancelModalOpen(true)}
              />
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-gray-400 border border-dashed border-gray-200 rounded-xl">
                <CalendarDays size={32} className="mb-2 opacity-30" />
                <p className="text-sm font-medium">Nenhuma partida agendada</p>
              </div>
            )}
          </div>
        </section>

      </div>

      {/* Modal de cancelamento */}
      {cancelModalOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setCancelModalOpen(false)}
        >
          <div
            className="bg-white rounded-xl shadow-xl max-w-lg w-full p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-lg font-bold text-gray-800">Cancelar Partida</h2>
            <p className="text-sm text-red-500 font-medium mt-0.5">
              Informe o motivo para o cancelamento da partida
            </p>

            <div className="grid grid-cols-4 gap-2 mt-5">
              {MOTIVOS_CANCELAMENTO.map(({ id, label }) => (
                <label key={id} className="flex flex-col items-center gap-2 cursor-pointer">
                  <span className="text-xs text-gray-700 text-center leading-tight">{label}</span>
                  <input
                    type="checkbox"
                    checked={motivosSelecionados.includes(id)}
                    onChange={() => toggleMotivo(id)}
                    className="w-4 h-4 accent-[#1b6928] cursor-pointer"
                  />
                </label>
              ))}
            </div>

            <div className="mt-5">
              <label className="text-sm font-semibold text-gray-700 block mb-1">Detalhar Motivo</label>
              <textarea
                value={detalheMotivo}
                onChange={(e) => setDetalheMotivo(e.target.value)}
                placeholder="Descreva o ocorrido em detalhes para aplicação do cancelamento"
                rows={5}
                className="w-full border border-gray-300 rounded-lg p-3 text-sm text-gray-700 placeholder:text-gray-400 outline-none focus:border-[#1b6928] resize-none transition-colors"
              />
            </div>

            <div className="flex justify-end gap-3 mt-5">
              <button
                onClick={() => setCancelModalOpen(false)}
                className="px-6 py-2 text-sm font-bold border border-gray-300 rounded-sm text-gray-700 hover:bg-gray-50 cursor-pointer transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleFinalizarCancelamento}
                disabled={motivosSelecionados.length === 0}
                className="px-6 py-2 text-sm font-bold bg-red-600 text-white rounded-sm hover:bg-red-700 cursor-pointer transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Finalizar Partida
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}