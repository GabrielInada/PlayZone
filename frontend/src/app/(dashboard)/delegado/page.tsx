import DelegateHeader from "@/components/delegado/DelegateHeader";
import ResponsibilityBanner from "@/components/delegado/ResponsibilityBanner";
import StatCard from "@/components/delegado/StatCard";
import CurrentMatchCard from "@/components/delegado/CurrentMatchCard";

import { CalendarDays, Trophy, ClipboardCheck } from "lucide-react";

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

const mockStats: DelegateStats = {
    assignedMatches: 3,
    approvedReports: 5,
    upcomingMatches: 3,
};

const mockCurrentMatch: CurrentMatch = {
    id: "match-001",
    stadiumName: "Estádio da UFPA",
    address: "Rod. Augusto Montenegro, 524",
    city: "Castanheira, Belém",
    spectators: 11970,
    teams: "Remo x Paysandu",
    imageUrl:
        "https://images.unsplash.com/photo-1521412644187-c49fa049e84d?auto=format&fit=crop&w=1200&q=80",
};

export default function DelegatePage() {
    return (
        <main className="bg-white">
            <div className="mx-auto w-full max-w-5xl px-4 py-3 sm:px-6 lg:px-8">
                <DelegateHeader title="Painel do Delegado" />

                <div className="mt-3">
                    <ResponsibilityBanner
                        eyebrow="SUAS RESPONSABILIDADES"
                        highlight={`${mockStats.assignedMatches} Partidas Designadas`}
                        description="Gerencie suas partidas e relatórios"
                        icon={<CalendarDays className="h-5 w-5" />}
                        href="/delegado/partidas"
                    />
                </div>

                <section className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <StatCard
                        title="Relatórios Aprovados"
                        value={mockStats.approvedReports}
                        icon={<ClipboardCheck className="h-5 w-5" />}
                        iconTone="success"
                    />
                    <StatCard
                        title="Próximas Partidas"
                        value={mockStats.upcomingMatches}
                        icon={<Trophy className="h-5 w-5" />}
                        iconTone="success"
                    />
                </section>

                <section className="mt-3">
                    <h2 className="text-center text-xs font-semibold text-gray-900">
                        Partida Atual
                    </h2>

                    <div className="mt-2">
                        <CurrentMatchCard
                            matchId={mockCurrentMatch.id}
                            stadiumName={mockCurrentMatch.stadiumName}
                            address={`${mockCurrentMatch.address}, ${mockCurrentMatch.city}`}
                            spectators={mockCurrentMatch.spectators}
                            teams={mockCurrentMatch.teams}
                            imageUrl={mockCurrentMatch.imageUrl}
                            registerHref={`/delegado/sumula/registrar?match=${mockCurrentMatch.id}`}
                            cancelHref={`/delegado/partida/cancelar?match=${mockCurrentMatch.id}`}
                        />
                    </div>
                </section>
            </div>
        </main>
    );
}