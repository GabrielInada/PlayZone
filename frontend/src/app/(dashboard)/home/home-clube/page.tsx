'use client';

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Calendar } from "lucide-react";

export default function HomeClubePage() {
  const classificacao = [ 
// Substituir por chamada de serviço quando a API de classificação estiver disponível. - Verificar com o Pedro o código da HOME ADMIN para que os códigos fiquem padronizados
// Atualmente utilizando dados fixos apenas para simulação da interface.
    { pos: "1°", name: "Flamenguinho", active: false },
    { pos: "2°", name: "PSzinho", active: false },
    { pos: "3°", name: "Vasquinho", active: true },
    { pos: "4°", name: "Paysanduzinho", active: false },
    { pos: "5°", name: "Reminho", active: false },
  ];

  return (
    <div className="max-w-6xl mx-auto w-full space-y-6">

      <h1 className="text-xl md:text-2xl font-bold text-gray-800">
        Painel do Clube
      </h1>

      <div className="bg-white border border-gray-100 rounded-xl p-5 md:p-8 shadow-sm">
        <p className="text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-widest">
          Classificação Atual
        </p>

        <h2 className="text-2xl md:text-4xl font-black text-gray-800 mt-2">
          3° LUGAR - 24 PONTOS
        </h2>

        <p className="text-xs md:text-sm text-gray-400 mt-1">
          Gerencie suas partidas e relatórios
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm flex justify-between items-center group hover:border-emerald-200 transition-colors">
          <div className="flex-1">
            <p className="text-[10px] font-bold text-gray-400 uppercase">
              Próxima Partida
            </p>

            <div className="text-xl md:text-2xl font-bold text-gray-800 mt-1">
              Domingo, 18:00
            </div>

            <p className="text-xs md:text-sm text-gray-500">
              vs PSzinho - PA (Casa)
            </p>
          </div>

          <div className="ml-4 shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg"
              className="w-10 h-10 md:w-12 md:h-12"
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

        <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm flex justify-between items-center group hover:border-emerald-200 transition-colors">
          <div className="flex-1">
            <p className="text-[10px] font-bold text-gray-400 uppercase">
              Vitórias na Temporada
            </p>

            <div className="text-3xl md:text-4xl font-bold text-gray-800 mt-1">
              9
            </div>
          </div>

          <div className="ml-4 shrink-0">
            {/* SVG mantido */}
          </div>
        </div>
      </div>

      <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm">
        <h3 className="text-sm font-bold text-gray-700 mb-4">
          Classificação - Top 5
        </h3>

        <div className="space-y-2">
          {classificacao.map((item) => (
            <div
              key={item.pos}
              className={`flex items-center p-3 md:p-4 rounded-lg text-sm font-medium transition-all ${
                item.active 
                  ? "bg-[#009650] text-white shadow-md"
                  : "bg-gray-50 text-gray-600 border border-gray-100 hover:bg-gray-100"
              }`}
            >
              <div className="w-10 font-bold">
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