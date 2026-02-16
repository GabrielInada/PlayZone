"use client";
import { Trophy, Edit3, Trash2 } from "lucide-react";

interface CampeonatoCardProps {
  nome: string;
  ano: string;
  status: string;
  formato: string;
}

export function CampeonatoCard({ nome, ano, status, formato }: CampeonatoCardProps) {
  return (
    <div 
      data-testid="campeonato-card"
      className="w-full bg-white rounded-2xl p-6 
                 border border-gray-200 
                 shadow-md 
                 flex flex-col md:flex-row items-center justify-between gap-6 
                 hover:shadow-lg 
                 hover:-translate-y-1
                 transition-all duration-300"
    >
      
      {/* Informações Principais */}
      <div className="flex items-center gap-3 flex-grow min-w-0">
        <div className="text-[#007a33] bg-[#f0fdf4] p-2 rounded-2xl shrink-0 border border-[#bbf7d0]">
          <Trophy size={32} />
        </div>
        <div className="min-w-0">
          <h3 data-testid="campeonato-nome" className="max-w-[20vh] text-lg font-bold text-gray-800 leading-tight truncate">{nome}</h3>
          <p className="text-sm text-gray-800 font-bold mt-1">
            Ano: <span data-testid="campeonato-ano" className="font-semibold text-gray-600">{ano}</span>
          </p>
        </div>
      </div>

      {/* Seção de Dados e Ações */}
      <div className="flex flex-wrap items-center justify-center md:justify-end gap-8 lg:gap-16 w-full md:w-auto">
        
        <span data-testid="campeonato-status" className="bg-[#dcfce7] text-[#166534] px-5 py-2 rounded-full text-xs font-bold whitespace-nowrap uppercase tracking-widest border border-[#bbf7d0]">
          {status}
        </span>
        
        <p className="text-sm text-gray-800 font-bold whitespace-nowrap">
          Formato: <span data-testid="campeonato-formato" className="font-semibold text-gray-600 ml-1">{formato}</span>
        </p>

        {/* Grupo de Ações */}
        <div className="flex items-center gap-4 shrink-0">
          <button data-testid="btn-gerenciar-campeonato" className="bg-[#007a33] hover:bg-[#005f27] text-white px-8 py-2.5 rounded-xl text-sm font-bold transition-all active:scale-95 shadow-md cursor-pointer">
            Gerenciar
          </button>
          
          <div className="flex items-center border-l border-gray-200 ml-2 pl-4 gap-2">
            <button data-testid="btn-editar-campeonato" className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all cursor-pointer">
              <Edit3 size={20} />
            </button>
            <button data-testid="btn-excluir-campeonato" className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all cursor-pointer">
              <Trash2 size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}