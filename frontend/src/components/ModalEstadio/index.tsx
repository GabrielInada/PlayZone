'use client';

import React, { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/Input';
import { estadioSchema, EstadioFormData } from '@/lib/validations';
import { formatarMilhar } from '@/utils/formatters'; 
import { Upload, X } from 'lucide-react';
import toast from 'react-hot-toast';

interface ModalEstadioProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ModalEstadio = ({ isOpen, onClose }: ModalEstadioProps) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors }, reset } = useForm<EstadioFormData>({
    resolver: zodResolver(estadioSchema),
  });

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
  
    setTimeout(() => {
      setIsLoading(false);
      toast.success('Estádio salvo com sucesso!', {
        position: 'bottom-right',
        style: {
          background: '#004a1b',
          color: '#fff',
          fontFamily: 'Roboto, sans-serif',
        },
      });
      setImagePreview(null);
      reset();
      onClose();
    }, 1500);
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={handleOverlayClick}
      style={{ fontFamily: 'Arial, sans-serif' }}
    >
      <div 
        ref={modalRef}
        className="bg-white rounded-xl shadow-2xl w-full max-w-lg p-8 px-8 flex flex-col items-start text-left animate-in fade-in zoom-in duration-200"
      > 
        <div className="mb-6 w-full text-left">
          <h2 className="text-xl font-bold text-black-800">Adicionar</h2>
          <p className="text-[12px] text-gray-500">Crie e configure as informações do estádio</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 w-full max-w-md">
          {/* 1. Campos de Texto Primeiro */}
          <Input 
            {...register("nome")} 
            label="Nome do Estádio" 
            placeholder="Nome do local" 
            className="bg-white border-gray-300" 
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
            className="bg-white border-gray-300"
          />

          <Input 
            {...register("localizacao")} 
            label="Localização" 
            placeholder="Cidade, Estado" 
            className="bg-white border-gray-300"
          />

          {/* 2. Foto do Ginásio agora na Parte de Baixo */}
          <div className="w-full">
            <label className="block text-sm font-bold mb-2 text-left">
            Foto do Ginásio
            </label>
            <div className="relative w-full h-32 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center bg-white hover:bg-gray-100 transition-colors overflow-hidden group">
              {imagePreview ? (
                <>
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                  <button 
                    type="button"
                    onClick={() => setImagePreview(null)}
                    className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X size={14} />
                  </button>
                </>
              ) : (
                <label className="flex flex-col items-center cursor-pointer w-full h-full justify-center">
                  <Upload className="h-8 w-8 text-gray-400 mb-2" />
                  <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Selecionar Imagem</span>
                  <input 
                    type="file" 
                    accept="image/*" 
                    className="hidden" 
                    onChange={handleImageChange}
                  />
                </label>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-8 w-full">
            <button 
              type="button" 
              onClick={onClose} 
              className="px-3 py-1.5 border rounded-md text-xs font-bold text-gray-600 hover:bg-gray-50 transition-all"
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              disabled={isLoading}
              className="px-4 py-1.5 bg-[#004a1b] text-white rounded-md text-xs font-bold hover:bg-green-800 transition-all disabled:opacity-50"
            >
              {isLoading ? 'Salvando...' : 'Adicionar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};