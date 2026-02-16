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
            <div className="mx-auto w-full max-w-4xl px-4 py-2 sm:px-6 lg:px-8">
                <AdminHeader title="Painel Administrativo" />

                <div className="mt-4">
                    <AlertBanner
                        title="ATENÇÃO NECESSÁRIA"
                        highlight={`${mockStats.pendingSummaries} Súmulas Pendentes`}
                        description="Clique para revisar e aprovar"
                        href="/admin/sumulas" // rota mock
                    />
                </div>

                <section className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <StatCard title="Partidas de Hoje" value={mockStats.matchesToday} icon={<CalendarDays className="h-6 w-6" />} />
                    <StatCard title="Campeonatos Ativos" value={mockStats.activeChampionships} icon={<Trophy className="h-6 w-6" />} />
                </section>

                <section className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <ActionCard
                        title="Estádios Cadastrados"
                        description="Gerencie estádios, adicione, edite ou exclua"
                        href="/admin/estadios"
                    />
                    <ActionCard
                        title="Cadastrar Novo Usuário"
                        description="Crie novos perfis de usuários"
                        href="/admin/usuarios/novo"
                    />
                    <ActionCard
                        title="Validar Cadastro"
                        description="Valide novos usuários do sistema"
                        href="/admin/usuarios/validar"
                    />
                    <ActionCard
                        title="Validar Punições"
                        description="Valide possíveis punições enviadas"
                        href="/admin/punicoes/validar"
                    />
                </section>

                <section className="mt-8">
                    <RecentGames games={mockRecentGames} />
                </section>
            </div>
        </main>
    );
}
