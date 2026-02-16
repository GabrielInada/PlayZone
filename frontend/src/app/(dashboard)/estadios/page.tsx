'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import { ContainerHeader } from "@/components/ContainerHeader";
import StadiumCard from "@/components/StadiumCard/index";
import { ModalCadastro } from "@/components/ModalCadastro";
import { ModalEditar } from "@/components/ModalEditar";
import { ModalExcluir } from "@/components/ModalExcluir";

export default function Home() {
  // Estados para controle de visibilidade dos Modais
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalEditOpen, setIsModalEditOpen] = useState(false);
  const [isModalDeleteOpen, setIsModalDeleteOpen] = useState(false);

  // Estado para armazenar qual estádio está sendo manipulado (Editado ou Excluído)
  const [estadioSelecionado, setEstadioSelecionado] = useState<any>(null);

  // Lista principal de estádios
  const [estadios, setEstadios] = useState([
    { id: '1', nome: "Campo de Futebol da UFRA", endereco: "Av. Perimetral, 2501 - Terra Firme, Belém", capacidade: "300", proximoJogo: "UFRA x UFPA", dataHora: "12/02 às 16h", imagem: "/estadio-padrao.jpg" },
    { id: '2', nome: "Ginásio Poliesportivo da UFRA", endereco: "Av. Perimetral, 2501 - Terra Firme, Belém", capacidade: "1.000", proximoJogo: "UFRA x IFPA", dataHora: "19/02 às 18h", imagem: "/estadio-padrao.jpg" },
    { id: '3', nome: "Ginásio Poliesportivo da UFPA", endereco: "Rua Igarapé Tucunduba, 978 - Guamá, Belém", capacidade: "1.500", proximoJogo: "UFPA x UFRA", dataHora: "26/02 às 17h", imagem: "/estadio-padrao.jpg" },
    { id: '4', nome: "Mangueirinho", endereco: "Rod. Augusto Montenegro, S/N - Castanheira, Belém", capacidade: "20.000", proximoJogo: "UFRA X UEPA", dataHora: "01/03 às 16h", imagem: "/estadio-padrao.jpg" },
    { id: '5', nome: "Ginásio Poliesportivo Prof. Nagib C. Matni", endereco: "Av. João Paulo II, S/N - Marco, Belém", capacidade: "5.000", proximoJogo: "UEPA X IFPA", dataHora: "05/03 às 20h", imagem: "/estadio-padrao.jpg" },
    { id: '6', nome: "Ginásio Poliesportivo da UEPA", endereco: "Av. Almirante Barroso, 654 - Marco, Belém", capacidade: "5.000", proximoJogo: "UFRA X IFPA", dataHora: "08/03 às 17h", imagem: "/estadio-padrao.jpg" },
  ]);

  // --- Lógica de Cadastro ---
  const handleAddEstadio = (novoEstadio: any) => {
    setEstadios([novoEstadio, ...estadios]);
  };

  // --- Lógica de Edição ---
  const handleEditClick = (id: string) => {
    const estadio = estadios.find(e => e.id === id);
    setEstadioSelecionado(estadio);
    setIsModalEditOpen(true);
  };

  const handleUpdateEstadio = (estadioAtualizado: any) => {
    setEstadios(estadios.map(e => e.id === estadioAtualizado.id ? estadioAtualizado : e));
  };

  // --- Lógica de Exclusão ---
  const handleDeleteClick = (id: string) => {
    const estadio = estadios.find(e => e.id === id);
    setEstadioSelecionado(estadio);
    setIsModalDeleteOpen(true);
  };

  const handleConfirmDelete = () => {
    if (estadioSelecionado) {
      setEstadios(estadios.filter(e => e.id !== estadioSelecionado.id));
      setIsModalDeleteOpen(false);
      setEstadioSelecionado(null);
    }
  };

  return (
    <div className="bg-white flex flex-col">
      
      <ContainerHeader>
        <main className="max-w-[92rem] mx-auto px-6 py-6 grow w-full">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 tracking-tight">Ginásios e Arenas</h1>
              <p className="text-sm text-gray-600 font-medium mt-1">Cadastre ou gerencie os ginásios e arenas</p>
            </div>
            
            <button 
              onClick={() => setIsModalOpen(true)}
              data-testid="add-stadium-button"
              className="bg-[#007a33] hover:bg-[#005f27] text-white px-5 py-2.5 rounded-lg font-bold flex items-center gap-2 transition-all shadow-sm active:scale-95 text-sm cursor-pointer"
            >
              <Plus size={18} /> Adicionar Ginásio
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {estadios.map((estadio) => (
              <StadiumCard 
                key={estadio.id} 
                {...estadio} 
                onDelete={() => handleDeleteClick(estadio.id)}
                onEdit={() => handleEditClick(estadio.id)}
              />
            ))}
          </div>

          <div className="mt-12 flex justify-center">
            <button 
              onClick={() => window.history.back()}
              className="bg-[#007a33] hover:bg-[#005f27] text-white px-10 py-2.5 rounded-lg font-bold transition-all shadow-md active:scale-95 text-sm cursor-pointer"
              data-testid="back-button"
            >
              Voltar
            </button>
          </div>
        </main>
      </ContainerHeader>

      <ModalCadastro 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onAdd={handleAddEstadio} 
      />
      
      <ModalEditar 
        isOpen={isModalEditOpen} 
        onClose={() => setIsModalEditOpen(false)} 
        onUpdate={handleUpdateEstadio} 
        estadioParaEditar={estadioSelecionado} 
      />

      <ModalExcluir 
        isOpen={isModalDeleteOpen}
        onClose={() => setIsModalDeleteOpen(false)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}