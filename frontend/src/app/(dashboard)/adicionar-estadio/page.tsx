'use client';

import { useState } from 'react';
import { ModalEstadio } from '@/components/ModalEstadio';
import { ModalExcluirEstadio } from '@/components/ModalExcluirEstadio';

export default function AdicionarEstadioPage() {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const handleConfirmDelete = () => {
    // Aqui entrará a integração com o backend futuramente
    alert("Estádio excluído com sucesso (Mock)!");
    setIsDeleteOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8 flex flex-col items-center justify-center gap-4">
      <h1 className="text-2xl font-bold mb-6">Testes de Modals - Gestão</h1>

      {/* Botão de Adicionar */}
      <button 
        onClick={() => setIsAddOpen(true)}
        className="w-64 bg-[#004a1b] text-white py-3 rounded-lg font-bold hover:bg-green-900 shadow-md transition-all"
      >
        + Adicionar Estádio
      </button>

      {/* Botão de Excluir */}
      <button 
        onClick={() => setIsDeleteOpen(true)}
        className="w-64 border-2 border-red-600 text-red-600 py-3 rounded-lg font-bold hover:bg-red-50 transition-all"
      >
        🗑️ Testar Exclusão
      </button>

      {/* Modals */}
      <ModalEstadio isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} />
      
      <ModalExcluirEstadio 
        isOpen={isDeleteOpen} 
        onClose={() => setIsDeleteOpen(false)} 
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}