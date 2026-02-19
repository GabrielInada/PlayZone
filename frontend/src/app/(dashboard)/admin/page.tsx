import { CalendarDays, Trophy } from "lucide-react";
import AdminHeader from "@/app/(dashboard)/admin/AdminHeader";
import AlertBanner from "@/app/(dashboard)/admin/AlertBanner";
import StatCard from "@/app/(dashboard)/admin/StatCard";
import ActionCard from "@/app/(dashboard)/admin/ActionCard";
import RecentGames from "@/app/(dashboard)/admin/RecentGames";

const mockStats = { matchesToday: 5, activeChampionships: 23, pendingSummaries: 12 };

const mockRecentGames = [
    { id: "1", home: "UFRA", away: "UFPA", homeScore: 2, awayScore: 1 },
    { id: "2", home: "UFRA", away: "UFPA", homeScore: 4, awayScore: 3 },
];

export default function AdminPage() {
    return (
        <main className="bg-white">
            <div className="max-w-6xl mx-auto w-full space-y-3 p-1 sm:px-6 lg:px-3">
                <AdminHeader title="Painel Administrativo" />

                <div className="mt-4 shadow-md">
                    <AlertBanner
                        title="ATENÇÃO NECESSÁRIA"
                        highlight={`${mockStats.pendingSummaries} Súmulas Pendentes`}
                        description="Clique para revisar e aprovar"
                        href="#" // rota mock
                    />
                </div>

                <section className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <StatCard title="Partidas de Hoje"
                        value={mockStats.matchesToday}
                        icon={<svg xmlns="http://www.w3.org/2000/svg"
                            className="w-8 h-8 md:w-9 md:h-9"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="#10b981"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round">
                            <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
                            <line x1="16" x2="16" y1="2" y2="6" />
                            <line x1="8" x2="8" y1="2" y2="6" />
                            <line x1="3" x2="21" y1="10" y2="10" />
                            <path d="m9 16 2 2 4-4" />
                        </svg>} />

                    <StatCard title="Campeonatos Ativos"
                        value={mockStats.activeChampionships}
                        icon={< svg xmlns="http://www.w3.org/2000/svg"
                            className="w-8 h-8 md:w-9 md:h-9"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="#10b981"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round">
                            <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
                            <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
                            <path d="M4 22h16" />
                            <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
                            <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
                            <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
                        </svg>} />
                </section>

                <section className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 ">
                    <ActionCard
                        title="Estádios Cadastrados"
                        description="Gerencie estádios, adicione, edite ou exclua"
                        href="/estadios"
                    />
                    <ActionCard
                        title="Cadastrar Novo Usuário"
                        description="Crie novos perfis de usuários"
                        href="/cadastro"
                    />
                    <ActionCard
                        title="Validar Cadastro"
                        description="Valide novos usuários do sistema"
                        href="#"
                    />
                    <ActionCard
                        title="Validar Punições"
                        description="Valide possíveis punições enviadas"
                        href="#"
                    />
                </section>

                <section className="mt-8">
                    <RecentGames games={mockRecentGames} />
                </section>
            </div>
        </main>
    );
}
