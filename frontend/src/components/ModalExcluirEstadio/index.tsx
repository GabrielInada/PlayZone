'use client';

import React, { useRef } from 'react';
import toast from 'react-hot-toast';

interface ModalExcluirProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  nomeEstadio?: string; 
}

export const ModalExcluirEstadio = ({ isOpen, onClose, onConfirm, nomeEstadio }: ModalExcluirProps) => {
  const modalRef = useRef<HTMLDivElement>(null);

  // Fechar ao clicar fora, como no modal de adicionar
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      onClose();
    }
  };

  const handleConfirm = () => {
    onConfirm();
    toast.error(`Estádio ${nomeEstadio || ''} removido com sucesso!`, {
      position: 'bottom-right',
      style: {
        borderRadius: '8px',
        background: '#333',
        color: '#fff',
        fontFamily: 'Arial, sans-serif',
      },
      icon: '🗑️',
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[60] p-4"
      onClick={handleOverlayClick}
    >
      <div 
        ref={modalRef}
        className="bg-white rounded-xl shadow-2xl w-full max-w-sm p-6 animate-in fade-in zoom-in duration-200 font-roboto"
      >
        <h2 className="text-xl font-bold text-gray-900 mb-2">Excluir</h2>
        
        <p className="text-[14px] text-gray-600 mb-6">
        Tem a certeza de que deseja excluir este ginásio?
        Esta ação não pode ser desfeita.
        </p>

        <div className="flex justify-end gap-3 font-bold">
          <button 
            onClick={onClose}
            className="px-4 py-1.5 border border-gray-300 rounded-md text-xs text-gray-700 hover:bg-gray-50 transition-all"
          >
            Cancelar
          </button>
          
          <button 
            onClick={handleConfirm}
            className="px-4 py-1.5 bg-red-600 text-white rounded-md text-xs hover:bg-red-700 transition-all shadow-md"
          >
            Excluir
          </button>
        </div>
      </div>
    </div>
  );
};