"use client";
import React from "react";
import { AlertTriangle } from "lucide-react";

interface ModalExcluirCampeonatoProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function ModalExcluirCampeonato({
  isOpen,
  onClose,
  onConfirm,
}: ModalExcluirCampeonatoProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        data-testid="modal-excluir-campeonato"
        className="bg-white w-full max-w-xl rounded-2xl shadow-xl p-6 animate-in fade-in zoom-in duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start gap-4 mb-5">
          <div className="p-2.5 bg-red-50 rounded-xl shrink-0">
            <AlertTriangle size={22} className="text-red-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Excluir Campeonato</h2>
            <p className="text-sm text-gray-500 font-medium mt-0.5">Esta ação não pode ser desfeita</p>
          </div>
        </div>

        <p className="text-sm text-gray-600 font-medium mb-6 leading-relaxed">
          Tem certeza de que deseja excluir esse campeonato? Todos os dados e confrontos vinculados serão permanentemente removidos.
        </p>

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-6 py-2 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition-colors text-sm cursor-pointer"
          >
            Cancelar
          </button>
          <button
            data-testid="btn-confirmar-exclusao"
            onClick={onConfirm}
            className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold shadow-sm transition-all active:scale-95 text-sm cursor-pointer"
          >
            Excluir
          </button>
        </div>
      </div>
    </div>
  );
}