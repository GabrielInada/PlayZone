"use client";
import { X } from "lucide-react";
import { useState, useEffect } from "react";

interface ModalEditarProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (estadio: any) => void;
  estadioParaEditar: any;
}

export function ModalEditar({ isOpen, onClose, onUpdate, estadioParaEditar }: ModalEditarProps) {
  const [nome, setNome] = useState("");
  const [capacidade, setCapacidade] = useState("");
  const [localizacao, setLocalizacao] = useState("");
  const [imagem, setImagem] = useState("");

  useEffect(() => {
    if (estadioParaEditar && isOpen) {
      setNome(estadioParaEditar.nome);
      setCapacidade(estadioParaEditar.capacidade);
      setLocalizacao(estadioParaEditar.endereco);
      setImagem(estadioParaEditar.imagem);
    }
  }, [estadioParaEditar, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate({
      ...estadioParaEditar,
      nome,
      endereco: localizacao,
      capacidade,
      imagem
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[999] p-4 backdrop-blur-sm" data-testid="modal-edit-container">
      <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-xl font-bold text-black" data-testid="modal-edit-title">Editar Ginásio/Arena</h2>
              <p className="text-sm text-gray-600 font-medium mt-1">Edite as configurações e informações do ginásio/arena</p>
            </div>
            <button onClick={onClose} className="text-gray-500 hover:text-black transition-colors cursor-pointer" data-testid="modal-edit-close">
              <X size={22} />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6" data-testid="modal-edit-form">
          <div className="space-y-1.5">
            <label className="text-sm font-bold text-black">Nome do Ginásio/Arena</label>
            <input required data-testid="edit-input-stadium-name" className="w-full border border-gray-300 p-3 rounded-lg text-sm text-black font-semibold outline-[#007a33]" value={nome} onChange={(e) => setNome(e.target.value)} />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-bold text-black">Capacidade</label>
            <input required data-testid="edit-input-stadium-capacity" type="number" className="w-full border border-gray-300 p-3 rounded-lg text-sm text-black font-semibold outline-[#007a33]" value={capacidade} onChange={(e) => setCapacidade(e.target.value)} />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-bold text-black">Localização</label>
            <input required data-testid="edit-input-stadium-location" className="w-full border border-gray-300 p-3 rounded-lg text-sm text-black font-semibold outline-[#007a33]" value={localizacao} onChange={(e) => setLocalizacao(e.target.value)} />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-bold text-black">Link da Imagem (URL)</label>
            <input required data-testid="edit-input-stadium-image" className="w-full border border-gray-300 p-3 rounded-lg text-sm text-black font-semibold outline-[#007a33]" value={imagem} onChange={(e) => setImagem(e.target.value)} />
          </div>

          <div className="flex gap-4 pt-4">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-3 rounded-lg border border-gray-300 text-sm font-bold text-black hover:bg-gray-50 cursor-pointer">Cancelar</button>
            <button type="submit" className="flex-1 px-4 py-3 rounded-lg bg-[#007a33] text-white text-sm font-bold hover:bg-[#005f27] cursor-pointer shadow-sm" data-testid="modal-edit-submit-button">Atualizar</button>
          </div>
        </form>
      </div>
    </div>
  );
}