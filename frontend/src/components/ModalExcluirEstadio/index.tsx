'use client';

import React from 'react';

interface ModalExcluirProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void; // Função que realmente deletará o dado no backend futuramente
}

export const ModalExcluirEstadio = ({ isOpen, onClose, onConfirm }: ModalExcluirProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
      {/* Container do Modal de Exclusão */}
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg p-8 animate-in fade-in zoom-in duration-200">
        
        <h2 className="text-xl font-bold text-gray-900 mb-2">Excluir Estádio</h2>
        
        <p className="text-sm text-gray-600 mb-6">
          Tem certeza de que deseja excluir esse estádio? 
          Esta ação não pode ser desfeita e cancelará todos os jogos associados.
        </p>

        {/* Botões de Ação conforme layout */}
        <div className="flex justify-end gap-3">
          <button 
            onClick={onClose}
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 font-semibold hover:bg-gray-50 transition-all"
          >
            Cancelar
          </button>
          
          <button 
            onClick={onConfirm}
            className="px-6 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-all shadow-md"
          >
            Excluir
          </button>
        </div>
      </div>
    </div>
  );
};