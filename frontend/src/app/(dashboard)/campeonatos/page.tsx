"use client";

import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { CampeonatoCard } from './CampeonatoCard/CampeonatoCard';
import ModalCriarCampeonato from '@/components/ModalCriarCampeonato';
import ModalExcluirCampeonato from '@/components/ModalExcluirCampeonato';
import ModalEditarCampeonato from '@/components/ModalEditarCampeonato';
import ModalErroExcluirCampeonato from '@/components/ModalErroExcluirCampeonato';

const MOCK_CAMPEONATOS = [
  { id: 1, nome: "Copa UFRA 2025", ano: "2025", status: "Em Andamento", formato: "Mata Mata - 16 Times" },
  { id: 2, nome: "Libertadores BSI 2025", ano: "2025", status: "Em Andamento", formato: "Mata Mata - 16 Times" },
  { id: 3, nome: "Brasileirão Série A 2025", ano: "2025", status: "Em Andamento", formato: "Mata Mata - 16 Times" },
  { id: 4, nome: "UFRA Regional 2025", ano: "2025", status: "Em Andamento", formato: "Mata Mata - 16 Times" },
  { id: 5, nome: "UEPA Cup 2025", ano: "2025", status: "Finalizado", formato: "Mata Mata - 16 Times" },
];

export default function CampeonatosPage() {
  const [searchTerm, setSearchTerm] = useState("");
  
  // Estados para Modais
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isExcluirModalOpen, setIsExcluirModalOpen] = useState(false);
  const [isErroModalOpen, setIsErroModalOpen] = useState(false); 
  const [isEditarModalOpen, setIsEditarModalOpen] = useState(false);
  
  const [campeonatoParaExcluir, setCampeonatoParaExcluir] = useState<number | null>(null);
  const [campeonatoParaEditar, setCampeonatoParaEditar] = useState<any>(null);

  const filtrados = MOCK_CAMPEONATOS.filter(c => 
    c.nome.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenExcluir = (camp: any) => {
    if (camp.status === "Em Andamento") {
      setIsErroModalOpen(true); 
    } else {
      setCampeonatoParaExcluir(camp.id);
      setIsExcluirModalOpen(true); 
    }
  };

  const handleConfirmExcluir = () => {
    console.log(`Campeonato ${campeonatoParaExcluir} excluído com sucesso!`);
    setIsExcluirModalOpen(false);
    setCampeonatoParaExcluir(null);
  };

  const handleOpenEditar = (camp: any) => {
    setCampeonatoParaEditar(camp);
    setIsEditarModalOpen(true);
  };

  return (
    <>
      <div className="min-h-screen bg-white flex flex-col font-bold" data-testid="page-campeonatos">
        <div className="w-full max-w-6xl mx-auto px-6 pt-4 pb-20 text-gray-900" data-testid="container-campeonatos">
          
          <div className="mb-2 pb-1 text-gray-950">
            <h1 className="text-3xl font-bold tracking-tight">Campeonatos Ativos</h1>
            <p className="text-sm text-gray-500 font-medium">Visualize os campeonatos criados</p>
          </div>

           <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
            <div className="relative flex-grow w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" size={20} />
            <input 
              type="text" 
              placeholder="Buscar ginásio..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-600 rounded-lg focus:ring-2 focus:ring-[#007a33] outline-none  font-bold" 
            />
          </div>

            <button 
              onClick={() => setIsModalOpen(true)}
              data-testid="btn-criar-campeonato" 
              className="min-w-[40vh] flex justify-center bg-[#007a33] hover:bg-[#005f27] text-white font-bold py-2.5 px-6 rounded-lg shadow-sm transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer text-20px"
            >
              Criar Novo Campeonato
            </button>
          </div>

          <div className="flex flex-col gap-4" data-testid="lista-campeonatos">
            {filtrados.map((camp) => (
              <CampeonatoCard
                key={camp.id}
                nome={camp.nome}
                ano={camp.ano}
                status={camp.status}
                formato={camp.formato}
                onEdit={() => handleOpenEditar(camp)}
                onDelete={() => handleOpenExcluir(camp)} 
              />
            ))}
          </div>

          <div className="mt-16 flex justify-center">
            <button data-testid="btn-voltar-campeonatos" onClick={() => window.history.back()} className="bg-[#007a33] hover:bg-[#005f27] text-white px-12 py-2.5 rounded-lg font-bold shadow-md transition-all active:scale-95 cursor-pointer">
              Voltar
            </button>
          </div>
        </div>
      </div>

      <ModalCriarCampeonato 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />

      <ModalExcluirCampeonato 
        isOpen={isExcluirModalOpen}
        onClose={() => setIsExcluirModalOpen(false)}
        onConfirm={handleConfirmExcluir}
      />

      <ModalEditarCampeonato 
        isOpen={isEditarModalOpen}
        onClose={() => setIsEditarModalOpen(false)}
        campeonato={campeonatoParaEditar}
      />

      <ModalErroExcluirCampeonato 
        isOpen={isErroModalOpen}
        onClose={() => setIsErroModalOpen(false)}
      />
    </>
  );
}