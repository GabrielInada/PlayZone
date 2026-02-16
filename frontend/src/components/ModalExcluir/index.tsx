"use client";
import { X } from "lucide-react";

interface ModalExcluirProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function ModalExcluir({ isOpen, onClose, onConfirm }: ModalExcluirProps) {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-[999] p-4 backdrop-blur-sm" 
      data-testid="modal-delete-container"
    >
      <div className="bg-white rounded-2xl w-full max-w-xl shadow-2xl border border-gray-100 p-7 flex flex-col h-fit relative">
        
        <div className="flex justify-between items-start mb-3">
          <h2 className="text-xl font-bold text-black" data-testid="modal-delete-title">
            Excluir Ginásio
          </h2>
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-black cursor-pointer absolute top-5 right-5"
          >
            <X size={20} />
          </button>
        </div>

        <div className="mb-8">
          <p className="text-sm text-gray-700 font-semibold leading-relaxed">
            Tem certeza de que deseja excluir esse ginásio?
          </p>
          <p className="text-sm text-gray-700 font-semibold leading-relaxed">
            Esta ação não pode ser desfeita e cancelará todos os jogos associados.
          </p>
        </div>

        <div className="flex justify-end gap-3">
          <button 
            onClick={onClose}
            className="px-6 py-2 rounded-lg border border-gray-400 text-sm font-bold text-black hover:bg-gray-50 transition-all cursor-pointer"
          >
            Cancelar
          </button>
          <button 
            onClick={onConfirm}
            data-testid="modal-confirm-delete-button"
            className="px-8 py-2 rounded-lg bg-[#e11d48] text-white text-sm font-bold hover:bg-[#be123c] transition-all shadow-sm cursor-pointer"
          >
            Excluir
          </button>
        </div>
      </div>
    </div>
  );
}