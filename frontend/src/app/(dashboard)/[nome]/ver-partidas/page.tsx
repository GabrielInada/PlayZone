"use client";

import React from "react";
import { useParams } from "next/navigation";
import { Trophy, Trash2 } from "lucide-react";

const MOCK_PARTIDAS = [
  {
    id: 1,
    mandante: "UFRA",
    visitante: "UFPA",
    placar: "2 - 1",
    local: "Ginásio Mangueirinho",
    fase: "Fase de Grupos",
    data: "05/12/2025",
    hora: "16h",
    status: "finalizada",
  },
  {
    id: 2,
    mandante: "UFRA",
    visitante: "UEPA",
    placar: "3 - 0",
    local: "Ginásio Mangueirinho",
    fase: "Fase de Grupos",
    data: "07/12/2025",
    hora: "18h",
    status: "finalizada",
  },
  {
    id: 3,
    mandante: "UFPA",
    visitante: "UEPA",
    placar: "Em breve",
    local: "Ginásio Mangueirinho",
    fase: "Semifinal",
    data: "10/12/2025",
    hora: "20h",
    status: "agendada",
  },
  {
    id: 4,
    mandante: "UFRA",
    visitante: "UNAMA",
    placar: "Em breve",
    local: "Ginásio Mangueirinho",
    fase: "Final",
    data: "15/12/2025",
    hora: "19h",
    status: "agendada",
  },
];

export default function VerPartidasPage() {
  const params = useParams();
  const nomeCampeonato = params.nome
    ? decodeURIComponent(params.nome as string)
    : "Campeonato";

  return (
    <div className="min-h-screen bg-white flex flex-col font-bold">
      <div className="w-full max-w-5xl mx-auto px-6 pt-10 pb-20 text-gray-900">
        
        <div className="mb-10">
          <h1 className="text-3xl font-bold tracking-tight">
            {nomeCampeonato}
          </h1>
          <p className="text-base text-gray-500 font-medium mt-1">
            Gerencie seu campeonato
          </p>
        </div>

        <div className="flex flex-col gap-6 mb-12">
          {MOCK_PARTIDAS.map((partida) => (
            <div
              key={partida.id}
              className="w-full bg-gray-100 rounded-2xl px-6 py-4 border border-gray-200 shadow-sm"
            >
              <div className="flex items-center justify-between">

                <div className="flex items-center gap-6">
                  <div className="text-[#007a33] bg-[#e6f4ea] p-3 rounded-full">
                    <Trophy size={22} />
                  </div>

                  <div className="flex items-center gap-6">
                    <span className="text-xl font-bold w-[80px] text-right">
                      {partida.mandante}
                    </span>

                    <div className="w-[140px] py-2 rounded-full text-xl font-bold text-center bg-[#c6decb] text-gray-900">
                      {partida.placar}
                    </div>

                    <span className="text-xl font-bold w-[80px]">
                      {partida.visitante}
                    </span>
                  </div>
                </div>

                <div className="hidden lg:flex flex-col items-center text-sm text-gray-700 font-medium leading-tight text-center">
                  <span>
                    {partida.local} • {partida.fase}
                  </span>
                  <span>
                    {partida.data} • {partida.hora}
                  </span>
                </div>

                <div className="flex items-center gap-4">
                  <button className="bg-[#007a33] hover:bg-[#005f27] text-white px-5 py-2 rounded-full text-sm font-bold transition cursor-pointer">
                    Gerenciar
                  </button>

                  <button className="p-1 text-gray-800 hover:text-red-600 transition cursor-pointer">
                    <Trash2 size={18} />
                  </button>
                </div>

              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-center">
          <button
            onClick={() => window.history.back()}
            className="bg-[#007a33] hover:bg-[#005f27] text-white px-12 py-2.5 rounded-lg font-bold shadow-md transition active:scale-95 cursor-pointer text-base"
          >
            Voltar
          </button>
        </div>
      </div>
    </div>
  );
}
