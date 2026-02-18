"use client";

import React from 'react';
import { CalendarPlus, Users, Clock } from 'lucide-react';
import { useParams } from 'next/navigation';

export default function GerenciarCampeonatoPage() {
  const params = useParams();
  
  const nomeCampeonato = params.nome 
    ? decodeURIComponent(params.nome as string) 
    : "Campeonato";

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-bold" data-testid="page-gerenciar-campeonato">
      <div className="w-full max-w-6xl mx-auto px-6 pt-10 pb-20 text-gray-900">
        
        <div className="mb-10 text-left">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            {nomeCampeonato}
          </h1>
          <p className="text-base text-gray-500 font-medium mt-1">Gerencie seu campeonato</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          
          <button className="flex items-center gap-5 p-6 bg-white border-2 border-gray-300 rounded-2xl shadow-sm hover:border-[#007a33] hover:shadow-md transition-all text-left group cursor-pointer">
            <div className="p-4 bg-gray-100 rounded-xl group-hover:bg-green-50 transition-colors">
              <CalendarPlus size={36} className="text-gray-700 group-hover:text-[#007a33]" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 leading-tight">Agendar nova partida</h3>
              <p className="text-sm text-gray-500 font-medium">Agende uma partida no campeonato</p>
            </div>
          </button>

          <button className="flex items-center gap-5 p-6 bg-white border-2 border-gray-300 rounded-2xl shadow-sm hover:border-[#007a33] hover:shadow-md transition-all text-left group cursor-pointer">
            <div className="p-4 bg-gray-100 rounded-xl group-hover:bg-green-50 transition-colors">
              <Users size={36} className="text-gray-700 group-hover:text-[#007a33]" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 leading-tight">Importar Times</h3>
              <p className="text-sm text-gray-500 font-medium">Adicione os times participantes</p>
            </div>
          </button>

          <button className="flex items-center gap-5 p-6 bg-white border-2 border-gray-300 rounded-2xl shadow-sm hover:border-[#007a33] hover:shadow-md transition-all text-left group cursor-pointer">
            <div className="p-4 bg-gray-100 rounded-xl group-hover:bg-green-50 transition-colors">
              <Clock size={36} className="text-gray-700 group-hover:text-[#007a33]" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 leading-tight">Ver Partidas</h3>
              <p className="text-sm text-gray-500 font-medium">Visualize a agenda de jogos</p>
            </div>
          </button>

        </div>

        <div className="flex justify-center">
          <button 
            onClick={() => window.history.back()}
            className="bg-[#007a33] hover:bg-[#005f27] text-white px-12 py-2.5 rounded-lg font-bold shadow-md transition-all active:scale-95 cursor-pointer text-base"
          >
            Voltar
          </button>
        </div>
      </div>
    </div>
  );
}