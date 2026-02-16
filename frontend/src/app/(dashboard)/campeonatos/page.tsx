'use client';

import { useState } from 'react';
import { Search } from 'lucide-react';
import { ContainerHeader } from "@/components/ContainerHeader";
import { CampeonatoCard } from "@/components/CampeonatoCard";
import { ModalCadastroCampeonato } from "@/components/ModalCadastroCampeonato";

export default function CampeonatosAtivos() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [campeonatos] = useState([
    { id: '1', nome: "Copa UFRA 2025", ano: "2025", status: "Em Andamento", formato: "Mata Mata • 16 Times" },
    { id: '2', nome: "Libertadores BSI 2025", ano: "2025", status: "Em Andamento", formato: "Mata Mata • 16 Times" },
    { id: '3', nome: "Brasileirão Série A 2025", ano: "2025", status: "Em Andamento", formato: "Mata Mata • 16 Times" },
    { id: '4', nome: "UFPA Regional 2025", ano: "2025", status: "Em Andamento", formato: "Mata Mata • 16 Times" },
    { id: '5', nome: "UEPA Cup 2025", ano: "2025", status: "Em Andamento", formato: "Mata Mata • 16 Times" },
  ]);

  return (
    <div data-testid="page-campeonatos-ativos" className=" bg-white flex flex-col transition-colors duration-300">
      <ContainerHeader>
        <div className="w-full pt-2 pb-8">
          
          <div className="mb-4">
            <h1 data-testid="titulo-pagina" className="text-3xl font-bold text-gray-800 tracking-tight">Campeonatos Ativos</h1>
            <p className="text-sm text-gray-600 font-medium mt-1">Visualize os campeonatos criados</p>
          </div>

          <div className="flex flex-col md:flex-row gap-4 mb-10">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input 
                data-testid="input-busca"
                type="text" 
                placeholder="Encontre campeonatos" 
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-500 rounded-lg focus:ring-2 focus:ring-[#007a33] outline-none transition-all "
              />
            </div>
            
            <button 
              data-testid="btn-abrir-modal"
              onClick={() => setIsModalOpen(true)}
              className="bg-[#007a33] hover:bg-[#005f27] min-w-[40vh] text-white px-8 py-2.5 rounded-lg font-bold flex items-center justify-center gap-2 transition-all whitespace-nowrap active:scale-95 cursor-pointer"
            >
              Criar Novo Campeonato
            </button>
          </div>

          <div data-testid="container-cards" className="space-y-6">
            {campeonatos.map((camp) => (
              <CampeonatoCard 
                key={camp.id}
                nome={camp.nome}
                ano={camp.ano}
                status={camp.status}
                formato={camp.formato}
              />
            ))}
          </div>

          <div className="mt-16 flex justify-center">
            <button 
              data-testid="btn-voltar"
              onClick={() => window.history.back()} 
              className="bg-[#007a33] hover:bg-[#005f27] text-white px-12 py-2.5 rounded-lg font-bold shadow-md transition-all active:scale-95 cursor-pointer"
            >
              Voltar
            </button>
          </div>
        </div>
      </ContainerHeader>

      <ModalCadastroCampeonato 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  );
}