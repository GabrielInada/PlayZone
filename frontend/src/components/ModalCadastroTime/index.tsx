"use client";
import React from 'react';
import { CheckCircle2, AlertTriangle } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SuccessModal: React.FC<ModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-xl max-w-sm w-full p-8 text-center" onClick={(e) => e.stopPropagation()}>
        <CheckCircle2 size={48} className="text-green-600 mx-auto mb-4" />
        <h2 className="text-lg font-bold text-gray-900 mb-1">Sucesso!</h2>
        <p className="text-xs text-gray-500 mb-8" data-testid="form-feedback-sucesso">Time cadastrado com sucesso! Redirecionando...</p>
        <div className="w-full bg-gray-100 h-1 rounded-full overflow-hidden">
          <div className="bg-green-600 h-full animate-progress" style={{ animation: 'progress 2s linear forwards' }}></div>
        </div>
      </div>
      <style jsx>{` @keyframes progress { from { width: 0%; } to { width: 100%; } } `}</style>
    </div>
  );
};

export const ErrorModal: React.FC<ModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-xl max-w-sm w-full p-8 text-center" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-lg font-bold text-gray-900 mb-2">Erro ao Cadastrar Time</h2>
        <p className="text-xs text-gray-500 mb-8" data-testid="form-feedback-erro">É necessário adicionar no mínimo 6 jogadores.</p>
        <button onClick={onClose} data-testid="form-actions-voltar" className="w-full border border-gray-200 py-2 rounded-md text-sm font-bold text-gray-700">Voltar</button>
      </div>
    </div>
  );
};

interface DeleteModalProps extends ModalProps {
  onConfirm: () => void;
}

export const DeleteModal: React.FC<DeleteModalProps> = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-xl max-w-sm w-full p-6 text-center" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-center mb-4 text-orange-500"><AlertTriangle size={40} /></div>
        <h2 className="text-lg font-bold text-gray-900 mb-2">Remover Jogador</h2>
        <p className="text-sm text-gray-500 mb-8">Tem certeza que quer remover o jogador?</p>
        <div className="flex gap-3">
          <button onClick={onClose} data-testid="form-actions-cancelar-exclusao" className="flex-1 py-2 border border-gray-200 rounded-md text-sm font-bold text-gray-700">Cancelar</button>
          <button onClick={onConfirm} data-testid="form-actions-confirmar-exclusao" className="flex-1 py-2 bg-red-600 text-white rounded-md text-sm font-bold">Sim, remover</button>
        </div>
      </div>
    </div>
  );
};