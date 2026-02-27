'use client';

import React, { useRef, useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/Input';
import { estadioSchema, EstadioFormData } from '@/lib/validations';
import { formatarMilhar } from '@/utils/formatters'; 
import { Upload, X } from 'lucide-react';
import toast from 'react-hot-toast';

// Atualize a interface para receber os dados do estádio selecionado
interface ModalEditarEstadioProps {
  isOpen: boolean;
  onClose: () => void;
  stadiumData: any; // Recebe o objeto do estádio selecionado na página pai
}

export const ModalEditarEstadio = ({ isOpen, onClose, stadiumData }: ModalEditarEstadioProps) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm<EstadioFormData>({
    resolver: zodResolver(estadioSchema),
  });

  // Efeito para preencher o formulário quando o modal abrir com dados existentes
  useEffect(() => {
    if (isOpen && stadiumData) {
      setValue("nome", stadiumData.name);
      // Remove " Pessoas" para formatar apenas o número
      const capacidadeApenasNumeros = stadiumData.capacity.replace(" Pessoas", "");
      setValue("capacidade", formatarMilhar(capacidadeApenasNumeros));
      setValue("localizacao", stadiumData.address);
      setImagePreview(stadiumData.imageUrl); // Carrega a imagem atual como preview
    }
  }, [isOpen, stadiumData, setValue]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      onClose();
    }
  };

  const onSubmit = async (data: EstadioFormData) => {
    setIsLoading(true);
    // Simulação de salvamento
    setTimeout(() => {
      setIsLoading(false);
      toast.success('Alterações salvas com sucesso!', {
        position: 'bottom-right',
        style: {
          background: '#004a1b',
          color: '#fff',
          fontFamily: 'Arial, sans-serif',
        },
      });
      onClose();
    }, 1500);
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={handleOverlayClick}
      // 1. FONTE ARIAL: Aplicada globalmente no modal
      style={{ fontFamily: 'Arial, sans-serif' }} 
    >
      <div 
        ref={modalRef}
        className="bg-white rounded-xl shadow-2xl w-full max-w-lg p-8 px-8 flex flex-col items-start text-left animate-in fade-in zoom-in duration-200"
      > 
        <div className="mb-6 w-full text-left">
          <h2 className="text-xl font-bold text-black-800">Editar</h2>
          <p className="text-[12px] text-gray-500">Edite as configurações e informações do ginásio</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 w-full max-w-md">
          {/* 1. Campos de Texto Primeiro */}
          <Input 
            {...register("nome")} 
            label="Nome do Ginásio" 
            placeholder="Nome do local" 
            className="bg-white border-gray-300 font-normal text-gray-900" // font-normal limpa o bold herdado
          />
          
          <Input 
            {...register("capacidade")}
            label="Capacidade"
            placeholder="Quantidade de Pessoas"
            type="text" 
            onChange={(e) => {
              const valorFormatado = formatarMilhar(e.target.value);
              e.target.value = valorFormatado;
            }}
            className="bg-white border-gray-300 font-normal text-gray-900"
          />

          <Input 
            {...register("localizacao")} 
            label="Localização" 
            placeholder="Cidade, Estado" 
            className="bg-white border-gray-300 font-normal text-gray-900"
          />

          {/* 2. Upload de Imagem no Padrão (Embaixo, Fundo Branco e Label Cinza) */}
          <div className="w-full">
            {/* Label cinza 'text-gray-700' combinando com as outras */}
            <label className="block text-sm font-bold mb-2 text-left">Foto do Ginásio</label>
            <div 
              className="relative w-full h-32 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center bg-white hover:bg-gray-100 transition-colors overflow-hidden group cursor-pointer"
              onClick={() => imagePreview ? null : fileInputRef.current?.click()} // Abre se não houver imagem
            >
              {imagePreview ? (
                <>
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                  <button 
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation(); // Impede de abrir o seletor ao clicar no X
                      setImagePreview(null);
                    }}
                    className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X size={14} />
                  </button>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center h-full w-full">
                  <Upload className="h-8 w-8 text-gray-400 mb-2" />
                  {/* Texto do upload em Arial e fonte menor */}
                  <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest Arial">Alterar Imagem</span>
                </div>
              )}
              <input 
                ref={fileInputRef}
                type="file" 
                accept="image/*" 
                className="hidden" 
                onChange={handleImageChange}
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-8 w-full pr-0">
            <button 
              type="button" 
              onClick={onClose} 
              className="px-3 py-1.5 border rounded-md text-xs font-bold text-gray-600 hover:bg-gray-50 transition-all Arial"
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              disabled={isLoading}
              className="px-4 py-1.5 bg-[#004a1b] text-white rounded-md text-xs font-bold hover:bg-green-800 transition-all disabled:opacity-50 Arial"
            >
              {isLoading ? 'Salvando...' : 'Atualizar'} {/* Texto mudou para Atualizar */}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};