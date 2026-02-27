"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import DelegateHeader from "@/components/delegado/DelegateHeader";
import ResponsibilityBanner from "@/components/delegado/ResponsibilityBanner";
import StatCard from "@/components/delegado/StatCard";
import CurrentMatchCard from "@/components/delegado/CurrentMatchCard";
import { CalendarDays, X } from "lucide-react";
import {
  DELEGADO_ROUTE,
  SUMULA_ROUTE,
  CANCELAR_PARTIDA_ROUTE,
} from "@/constants/routes";

// ── Tipos ─────────────────────────────────────────────────────────────────────
type DelegateStats = {
  assignedMatches: number;
  approvedReports: number;
  upcomingMatches: number;
};

type CurrentMatch = {
  id: string;
  stadiumName: string;
  address: string;
  city: string;
  spectators: number;
  teams: string;
  imageUrl: string;
};

// ── Mock ──────────────────────────────────────────────────────────────────────
const mockStats: DelegateStats = {
  assignedMatches: 3,
  approvedReports: 5,
  upcomingMatches: 3,
};

const mockCurrentMatch: CurrentMatch = {
  id:          "match-001",
  stadiumName: "Estádio da UFPA",
  address:     "Rod. Augusto Montenegro, 524",
  city:        "Castanheira, Belém",
  spectators:  11970,
  teams:       "Remo x Paysandu",
  imageUrl:    "https://images.unsplash.com/photo-1521412644187-c49fa049e84d?auto=format&fit=crop&w=1200&q=80",
};

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

// ── Página ────────────────────────────────────────────────────────────────────
export default function DelegatePage() {
  const router = useRouter();
  const [cancelModalOpen, setCancelModalOpen] = useState(false);

  return (
    <main className="bg-white">
      <div className="max-w-6xl mx-auto w-full space-y-3 p-3 sm:px-6 lg:px-4">

        <DelegateHeader title="Painel do Delegado" />

        <div className="mt-3 shadow-md">
          <ResponsibilityBanner
            eyebrow="SUAS RESPONSABILIDADES"
            highlight={`${mockStats.assignedMatches} Partidas Designadas`}
            description="Gerencie suas partidas e relatórios"
            icon={<CalendarDays className="h-5 w-5" />}
            href={DELEGADO_ROUTE}
          />
        </div>

        <section className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <StatCard title="Relatórios Aprovados" value={mockStats.approvedReports} icon={IconCalendar} iconTone="success" />
          <StatCard title="Próximas Partidas"    value={mockStats.upcomingMatches}  icon={IconTrophy}   iconTone="success" />
        </section>

        <section className="mt-5">
          <h2 className="text-center text-lg font-semibold text-gray-900">Partida Atual</h2>

          <div className="mt-2">
            <CurrentMatchCard
              matchId={mockCurrentMatch.id}
              stadiumName={mockCurrentMatch.stadiumName}
              address={`${mockCurrentMatch.address}, ${mockCurrentMatch.city}`}
              spectators={mockCurrentMatch.spectators}
              teams={mockCurrentMatch.teams}
              imageUrl={mockCurrentMatch.imageUrl}
              registerHref={`${SUMULA_ROUTE}?match=${mockCurrentMatch.id}`}
              onCancel={() => setCancelModalOpen(true)}
            />
          </div>
        </section>

      </div>

      {/* Modal de cancelamento — placeholder */}
      {cancelModalOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setCancelModalOpen(false)}
        >
          <div
            className="bg-white rounded-xl shadow-xl max-w-sm w-full p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-gray-800">Cancelar Partida</h2>
              <button
                onClick={() => setCancelModalOpen(false)}
                className="text-gray-400 hover:text-gray-700 cursor-pointer transition-colors"
              >
                <X size={18} />
              </button>
            </div>
            <p className="text-sm text-gray-500">Funcionalidade em desenvolvimento.</p>
            <button
              onClick={() => router.push(`${CANCELAR_PARTIDA_ROUTE}?match=${mockCurrentMatch.id}`)}
              className="mt-6 w-full py-2 text-sm font-bold bg-red-500 text-white rounded-lg hover:bg-red-600 cursor-pointer transition-colors"
            >
              Ir para Cancelamento
            </button>
          </div>
        </div>
      )}

    </main>
  );
}