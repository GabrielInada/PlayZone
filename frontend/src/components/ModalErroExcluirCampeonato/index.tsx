"use client";
import React from "react";

interface ModalErroExcluirCampeonatoProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ModalErroExcluirCampeonato({
  isOpen,
  onClose,
}: ModalErroExcluirCampeonatoProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        data-testid="modal-erro-excluir-campeonato"
        className="bg-white w-full max-w-xl rounded-2xl shadow-xl p-6 animate-in fade-in zoom-in duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          Erro ao Excluir Campeonato
        </h2>

        <div className="text-gray-600 mb-6">
          <p className="text-base">
            Este campeonato está em andamento e não pode ser excluído.
          </p>
          <p className="text-base mt-1">
            Tente novamente após o campeonato ser finalizado.
          </p>
        </div>

        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition-colors text-sm cursor-pointer"
          >
            Voltar
          </button>
        </div>
      </div>
    </div>
  );
}
