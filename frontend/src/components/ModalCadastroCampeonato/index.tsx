"use client";
import { X } from "lucide-react";

interface ModalCadastroProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ModalCadastroCampeonato({ isOpen, onClose }: ModalCadastroProps) {
  if (!isOpen) return null;

  return (
    <div data-testid="modal-cadastro-campeonato" className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        
        {/* Header do Modal */}
        <div className="flex justify-between items-start p-6 border-b border-gray-100">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Criar Novo Campeonato</h2>
            <p className="text-sm text-gray-500 mt-1 font-medium">Crie e configure as informações do campeonato</p>
          </div>
    
          <button data-testid="btn-fechar-modal" onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors cursor-pointer">
            <X size={24} className="text-gray-400" />
          </button>
        </div>

        {/* Formulário */}
        <form data-testid="form-cadastro-campeonato" className="p-6 space-y-6">
          <div className="space-y-4">
            {/* Nome do Campeonato */}
            <div className="flex flex-col gap-2">
              <label className="text-[15px] font-bold text-gray-900">Nome do Campeonato</label>
              <input 
                data-testid="input-nome"
                type="text" 
                placeholder="Escreva o nome do campeonato"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#007a33] focus:border-transparent outline-none transition-all text-gray-900 font-bold placeholder:font-normal"
              />
            </div>

            {/* Ano */}
            <div className="flex flex-col gap-2">
              <label className="text-[15px] font-bold text-gray-900">Ano</label>
              <input 
                data-testid="input-ano"
                type="number" 
                step="1"
                placeholder="Ex: 2025"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#007a33] focus:border-transparent outline-none transition-all text-gray-900 font-bold placeholder:font-normal"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Formato */}
              <div className="flex flex-col gap-2">
                <label className="text-[15px] font-bold text-gray-900">Formato do Campeonato</label>
                <select data-testid="select-formato" className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#007a33] outline-none transition-all bg-white cursor-pointer text-gray-900 font-bold">
                  <option value="mata-mata" className="font-bold">Mata Mata</option>
                  <option value="grupos" className="font-bold">Grupos</option>
                  <option value="pontos-corridos" className="font-bold">Pontos Corridos</option>
                </select>
              </div>

              {/* Equipes por Grupo */}
              <div className="flex flex-col gap-2">
                <label className="text-[15px] font-bold text-gray-900">Nº Equipes por Grupo</label>
                <input 
                  data-testid="input-equipes"
                  type="number" 
                  step="1"
                  defaultValue={4}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#007a33] outline-none transition-all text-gray-900 font-bold"
                />
              </div>
            </div>

            {/* Critérios de Pontuação */}
            <div className="pt-2">
              <label className="text-[15px] font-bold text-gray-900 block mb-6">Critérios de Pontuação</label>
              
              <div className="grid grid-cols-3 gap-4">
                <div className="flex flex-col gap-3 text-center">
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Vitória</span>
                  <input 
                    data-testid="input-pontos-vitoria"
                    type="number" 
                    step="1"
                    defaultValue={3} 
                    className="w-full px-3 py-3 text-center border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#007a33] outline-none transition-all shadow-sm text-gray-900 font-bold" 
                  />
                </div>
                <div className="flex flex-col gap-3 text-center">
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Empate</span>
                  <input 
                    data-testid="input-pontos-empate"
                    type="number" 
                    step="1"
                    defaultValue={1} 
                    className="w-full px-3 py-3 text-center border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#007a33] outline-none transition-all shadow-sm text-gray-900 font-bold" 
                  />
                </div>
                <div className="flex flex-col gap-3 text-center">
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Derrota</span>
                  <input 
                    data-testid="input-pontos-derrota"
                    type="number" 
                    step="1"
                    defaultValue={0} 
                    className="w-full px-3 py-3 text-center border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#007a33] outline-none transition-all shadow-sm text-gray-900 font-bold" 
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Rodapé de Ações */}
          <div className="flex gap-4 pt-4">
            <button 
              data-testid="btn-cancelar"
              type="button"
              onClick={onClose}
              className="flex-1 py-3.5 px-6 border border-gray-300 rounded-xl font-bold text-gray-900 hover:bg-gray-50 transition-all active:scale-95 shadow-sm cursor-pointer"
            >
              Cancelar
            </button>
            <button 
              data-testid="btn-criar"
              type="submit"
              className="flex-1 py-3.5 px-6 bg-[#007a33] text-white rounded-xl font-bold hover:bg-[#005f27] transition-all active:scale-95 shadow-md shadow-[#007a33]/20 cursor-pointer"
            >
              Criar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}