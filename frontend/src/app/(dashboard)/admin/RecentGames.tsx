type RecentGame = {
    id: string;
    home: string;
    away: string;
    homeScore: number;
    awayScore: number;
};

type Props = {
    games: RecentGame[];
};

function ScorePill({ homeScore, awayScore }: { homeScore: number; awayScore: number }) {
    return (
        <span className="inline-flex items-center justify-center rounded-full bg-emerald-100 px-3 py-1 text-sm font-semibold text-gray-900">
      {homeScore} - {awayScore}
    </span>
    );
}

export default function RecentGames({ games }: Props) {
    return (
        <div className="text-center">
            <h2 className="text-sm font-semibold text-gray-900">Últimos Jogos</h2>

            <div className="mx-auto mt-3 w-full max-w-3xl rounded-full border border-gray-200 bg-white px-4 py-3 shadow-sm">
                <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10">
                    {games.map((g) => (
                        <div key={g.id} className="flex items-center gap-3">
                            <span className="text-sm font-semibold text-gray-900">{g.home}</span>
                            <ScorePill homeScore={g.homeScore} awayScore={g.awayScore} />
                            <span className="text-sm font-semibold text-gray-900">{g.away}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
