"use client";
import { Trophy, Edit3, Trash2 } from "lucide-react";

interface CampeonatoCardProps {
  nome: string;
  ano: string;
  status: string;
  formato: string;
  onDelete: () => void;
  onEdit: () => void;
  onGerenciar: () => void; 
}

export function CampeonatoCard({ 
  nome, 
  ano, 
  status, 
  formato, 
  onDelete, 
  onEdit, 
  onGerenciar 
}: CampeonatoCardProps) {
  return (
    <div 
      data-testid="campeonato-card"
      className="w-full bg-white rounded-2xl p-5 md:p-6 border border-gray-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4 hover:shadow-md hover:border-gray-300 hover:scale-[1.01] transition-all duration-300 cursor-default"
    >
      <div className="flex items-start gap-4 flex-1 min-w-0 w-full">
        <div className="text-[#007a33] bg-[#f0fdf4] p-3 rounded-2xl shrink-0 border border-[#bbf7d0]">
          <Trophy size={28} />
        </div>
        
        <div className="flex flex-col min-w-0 w-full">
          <h3 data-testid="campeonato-nome" className="text-lg font-bold leading-tight text-gray-900 truncate" title={nome}>
            {nome}
          </h3>
          
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1">
            <p className="text-sm font-bold text-gray-900">
              Ano: <span data-testid="campeonato-ano" className="font-medium text-gray-800">{ano}</span>
            </p>

            <p className="text-sm font-bold text-gray-900 md:hidden">
              Formato: <span data-testid="campeonato-formato" className="font-medium text-gray-800 ml-1">{formato}</span>
            </p>
          </div>

          <div className="mt-2 md:hidden">
            <span data-testid="campeonato-status-mobile" className="bg-[#dcfce7] text-[#166534] px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border border-[#bbf7d0]">
              {status}
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between md:justify-end gap-4 w-full md:w-auto shrink-0 border-t md:border-t-0 pt-4 md:pt-0 border-gray-100">
        
        <div className="hidden md:flex flex-row items-center gap-6 lg:gap-12 mr-4">
          <span data-testid="campeonato-status" className="bg-[#dcfce7] text-[#166534] px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest border border-[#bbf7d0]">
            {status}
          </span>
          <p className="text-sm font-bold text-gray-900 whitespace-nowrap">
            Formato: <span data-testid="campeonato-formato" className="font-medium text-gray-800 ml-1">{formato}</span>
          </p>
        </div>

        <div className="flex items-center justify-between w-full md:w-auto gap-3">
          <button 
            data-testid="btn-gerenciar" 
            onClick={onGerenciar}
            className="flex-1 md:flex-none bg-[#007a33] hover:bg-[#005f27] text-white px-6 py-2 rounded-xl text-sm font-bold transition-all active:scale-95 shadow-sm cursor-pointer whitespace-nowrap"
          >
            Gerenciar
          </button>
          
          <div className="flex items-center border-l border-gray-200 ml-1 pl-3 gap-2">
            <button 
              data-testid="btn-editar" 
              onClick={onEdit} 
              className="p-2 text-[#007a33] border border-[#007a33] hover:text-blue-700 hover:bg-blue-50 hover:border-blue-700 rounded-lg transition-all cursor-pointer"
              title="Editar"
            >
              <Edit3 size={18} />
            </button>
            
            <button 
              data-testid="btn-excluir" 
              onClick={onDelete} 
              className="p-2 text-[#007a33] border border-[#007a33] hover:text-red-700 hover:bg-red-50 hover:border-red-700 rounded-lg transition-all cursor-pointer"
              title="Excluir"
            >
              <Trash2 size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}