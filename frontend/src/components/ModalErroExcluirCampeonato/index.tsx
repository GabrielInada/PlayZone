"use client";
import React from "react";
import { AlertTriangle } from "lucide-react";

interface ModalErroExcluirCampeonatoProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ModalErroExcluirCampeonato({ isOpen, onClose }: ModalErroExcluirCampeonatoProps) {
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
        <div className="flex items-start gap-4 mb-5">
          <div className="p-2.5 bg-amber-50 rounded-xl shrink-0">
            <AlertTriangle size={22} className="text-amber-500" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Não é possível excluir</h2>
            <p className="text-sm text-gray-500 font-medium mt-0.5">Campeonato com partidas em andamento</p>
          </div>
        </div>

        <p className="text-sm text-gray-600 font-medium mb-6 leading-relaxed">
          Este campeonato possui partidas que ainda não foram finalizadas. Para excluí-lo, todas as partidas precisam estar com status <strong>Finalizado</strong> ou o campeonato não pode ter nenhuma partida vinculada.
        </p>

        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition-colors text-sm cursor-pointer"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
}