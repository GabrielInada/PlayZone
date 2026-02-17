'use client';

import { Calendar } from "lucide-react";

export default function HomeClubePage() {
  const classificacao = [ 
    { pos: "1°", name: "Flamenguinho", active: false },
    { pos: "2°", name: "PSzinho", active: false },
    { pos: "3°", name: "Vasquinho", active: true },
    { pos: "4°", name: "Paysanduzinho", active: false },
    { pos: "5°", name: "Reminho", active: false },
  ];

  return (
    <div className="max-w-6xl mx-auto w-full space-y-3 p-4">

      <h1 className="text-lg md:text-xl font-bold text-gray-800">
        Painel do Clube
      </h1>

      <div className="bg-white border border-gray-100 rounded-md p-4 md:p-5 shadow-md">
        <p className="text-[9px] md:text-[10px] font-bold text-gray-500 uppercase tracking-widest">
          Classificação Atual
        </p>

        <h2 className="text-xl md:text-2xl font-black text-gray-800 mt-1">
          3° LUGAR - 24 PONTOS
        </h2>

        <p className="text-[10px] md:text-xs text-gray-500 mt-0.5">
          Gerencie suas partidas e relatórios
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

        <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-md flex justify-between items-center group hover:border-emerald-200 transition-colors">
          <div className="flex-1">
            <p className="text-[9px] font-bold text-gray-500 uppercase">
              Próxima Partida
            </p>

            <div className="text-lg md:text-xl font-bold text-gray-800 mt-0.5">
              Domingo, 18:00
            </div>

            <p className="text-[10px] md:text-xs text-gray-500">
              vs PSzinho - PA (Casa)
            </p>
          </div>

          <div className="ml-3 shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg"
              className="w-8 h-8 md:w-9 md:h-9"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#10b981"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round">
              <rect width="18" height="18" x="3" y="4" rx="2" ry="2"/>
              <line x1="16" x2="16" y1="2" y2="6"/>
              <line x1="8" x2="8" y1="2" y2="6"/>
              <line x1="3" x2="21" y1="10" y2="10"/>
              <path d="m9 16 2 2 4-4"/>
            </svg>
          </div>
        </div>

        <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-md flex justify-between items-center group hover:border-emerald-200 transition-colors">
          <div className="flex-1">
            <p className="text-[9px] font-bold text-gray-500 uppercase">
              Vitórias na Temporada
            </p>

            <div className="text-2xl md:text-3xl font-bold text-gray-800 mt-0.5">
              9
            </div>
          </div>

          <div className="ml-3 shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg"
              className="w-8 h-8 md:w-9 md:h-9"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#10b981"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round">
              <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/>
              <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/>
              <path d="M4 22h16"/>
              <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/>
              <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/>
              <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/>
            </svg>
          </div>
        </div>
      </div>

      <div className="bg-white border border-gray-100 rounded-lg p-4 shadow-md">
        <h3 className="text-xs font-bold text-gray-700 mb-2">
          Classificação - Top 5
        </h3>

        <div className="space-y-1.5">
          {classificacao.map((item) => (
            <div
              key={item.pos}
              className={`mt-3 shadow-sm flex items-center p-2.5 rounded-lg text-xs font-medium transition-all ${
                item.active 
                  ? "bg-[#009650] text-white shadow-md"
                  : "bg-gray-100 text-gray-600 border border-gray-200 hover:bg-gray-200"
              }`}
            >
              <div className="w-8 font-bold">
                {item.pos}
              </div>

              <div className="flex-1">
                {item.name}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}