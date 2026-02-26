"use client";
import { X } from "lucide-react";
import { useState } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (estadio: any) => void;
}

export function ModalCadastro({ isOpen, onClose, onAdd }: ModalProps) {
  const [nome, setNome] = useState("");
  const [capacidade, setCapacidade] = useState("");
  const [localizacao, setLocalizacao] = useState("");
  const [imagem, setImagem] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd({
      id: Math.random().toString(),
      nome,
      endereco: localizacao,
      capacidade,
      proximoJogo: "A DEFINIR",
      dataHora: "Data a definir",
      imagem: imagem,
    });
    setNome("");
    setCapacidade("");
    setLocalizacao("");
    setImagem("");
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-[999] p-4 backdrop-blur-sm"
      data-testid="modal-container"
    >
      <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-xl font-bold text-black" data-testid="modal-title">
                Adicionar Ginásio/Arena
              </h2>
              <p className="text-sm text-gray-600 font-medium mt-1">
                Crie e configure as informações do ginásio/arena
              </p>
            </div>
            <button 
              onClick={onClose} 
              className="text-gray-500 hover:text-black transition-colors cursor-pointer"
              data-testid="modal-close-button"
            >
              <X size={22} />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6" data-testid="modal-form">
          <div className="space-y-1.5">
            <label className="text-sm font-bold text-black">Nome do Ginásio/Arena</label>
            <input 
              required
              data-testid="input-stadium-name"
              placeholder="Escreva o nome do Ginásio/Arena" 
              className="w-full border border-gray-300 p-3 rounded-lg text-sm outline-[#007a33] placeholder:text-gray-400 text-black font-semibold"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-bold text-black">Capacidade</label>
            <input 
              required
              data-testid="input-stadium-capacity"
              type="number"
              placeholder="Digite a capacidade" 
              className="w-full border border-gray-300 p-3 rounded-lg text-sm outline-[#007a33] placeholder:text-gray-400 text-black font-semibold"
              value={capacidade}
              onChange={(e) => setCapacidade(e.target.value)}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-bold text-black">Localização</label>
            <input 
              required
              data-testid="input-stadium-location"
              placeholder="Escreva a localização do Estádio" 
              className="w-full border border-gray-300 p-3 rounded-lg text-sm outline-[#007a33] placeholder:text-gray-400 text-black font-semibold"
              value={localizacao}
              onChange={(e) => setLocalizacao(e.target.value)}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-bold text-black">Link da Imagem (URL)</label>
            <input 
              required
              data-testid="input-stadium-image"
              placeholder="Ex: /ufra-campo.png" 
              className="w-full border border-gray-300 p-3 rounded-lg text-sm outline-[#007a33] placeholder:text-gray-400 text-black font-semibold"
              value={imagem}
              onChange={(e) => setImagem(e.target.value)}
            />
            <p className="text-xs text-gray-500 italic">
              Usar um link ou arquivo da pasta public.
            </p>
          </div>

          <div className="flex gap-4 pt-4">
            <button 
              type="button"
              onClick={onClose}
              data-testid="modal-cancel-button"
              className="flex-1 px-4 py-3 rounded-lg border border-gray-300 text-sm font-bold text-black hover:bg-gray-50 transition-all cursor-pointer"
            >
              Cancelar
            </button>
            <button 
              type="submit"
              data-testid="modal-submit-button"
              className="flex-1 px-4 py-3 rounded-lg bg-[#007a33] text-white text-sm font-bold hover:bg-[#005f27] transition-all cursor-pointer shadow-sm"
            >
              Adicionar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}