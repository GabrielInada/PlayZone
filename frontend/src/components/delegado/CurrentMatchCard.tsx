import Image from "next/image";
import Link from "next/link";
import { MapPin, Users, Swords } from "lucide-react";

type Props = {
    matchId: string;
    stadiumName: string;
    address: string;
    spectators: number;
    teams: string;
    imageUrl: string;

    registerHref: string;
    cancelHref: string;
};

export default function CurrentMatchCard({
                                             stadiumName,
                                             address,
                                             spectators,
                                             teams,
                                             imageUrl,
                                             registerHref,
                                             cancelHref,
                                         }: Props) {
    return (
        <div className="rounded-xl border border-gray-100 bg-white shadow-md">
            <div className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-[280px_1fr] sm:items-stretch">
                {/* Imagem */}
                <div className="relative h-40 w-full overflow-hidden rounded-xl sm:h-full">
                    <Image
                        src={imageUrl}
                        alt="Imagem do estádio"
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 100vw, 280px"
                        priority={false}
                    />
                </div>

                {/* Conteúdo */}
                <div className="flex flex-col justify-between gap-4">
                    <div>
                        <h3 className="text-base font-semibold text-gray-900">{stadiumName}</h3>

                        <ul className="mt-2 space-y-2 text-sm text-gray-600">
                            <li className="flex items-start gap-2">
                                <MapPin className="mt-0.5 h-4 w-4 text-gray-500" />
                                <span>{address}</span>
                            </li>

                            <li className="flex items-center gap-2">
                                <Users className="h-4 w-4 text-gray-500" />
                                <span>{spectators.toLocaleString("pt-BR")} Pessoas</span>
                            </li>

                            <li className="flex items-center gap-2">
                                <Swords className="h-4 w-4 text-gray-500" />
                                <span>{teams}</span>
                            </li>
                        </ul>
                    </div>

                    {/* Ações */}
                    <div className="flex flex-col p-2 gap-2 sm:items-end">
                        <Link
                            href= "#"//{registerHref}
                            className="inline-flex w-full items-center justify-center rounded-full bg-[#136B19] px-4 py-3 text-sm font-semibold text-white hover:bg-emerald-800 transition sm:w-auto"
                        >
                            Registrar Súmula
                        </Link>

                        <Link
                            href="#"//{cancelHref}
                            className="inline-flex w-full items-center justify-center rounded-sm bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 transition sm:w-auto"
                        >
                            Cancelar Partida
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
