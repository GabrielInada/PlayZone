"use client";
import React from 'react';

interface ModalExcluirPartidaProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function ModalExcluirPartida({ isOpen, onClose, onConfirm }: ModalExcluirPartidaProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4" onClick={onClose}>
      <div 
        className="bg-white w-full max-w-[420px] rounded-[24px] shadow-2xl p-7 animate-in fade-in zoom-in duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Título */}
        <h2 className="text-xl font-black text-[#0f172a] mb-3 tracking-tight">
          Excluir Partida
        </h2>
        
        {/* Texto com a frase de aviso na linha de baixo */}
        <p className="text-[#475569] font-bold text-sm leading-snug mb-8">
          Tem certeza de que deseja excluir essa partida? <br />
          Esta ação não pode ser desfeita e todos os dados serão perdidos.
        </p>

        {/* Botões */}
        <div className="flex justify-end gap-3">
          <button 
            onClick={onClose}
            className="px-6 py-2 border-2 border-[#cbd5e1] rounded-xl font-black text-[#475569] hover:bg-gray-50 transition-all cursor-pointer text-xs"
          >
            Cancelar
          </button>
          <button 
            onClick={onConfirm}
            className="px-8 py-2 bg-[#e31c1c] hover:bg-[#c11818] text-white rounded-xl font-black transition-all active:scale-95 cursor-pointer shadow-md text-xs"
          >
            Excluir
          </button>
        </div>
      </div>
    </div>
  );
}