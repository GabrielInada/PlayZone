'use client';

import React, { useRef, useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/Input';
import { estadioSchema, EstadioFormData } from '@/lib/validations';
import { formatarMilhar } from '@/utils/formatters'; 
import toast from 'react-hot-toast';

interface ModalEditarEstadioProps {
  isOpen: boolean;
  onClose: () => void;
  estadioData?: EstadioFormData; // Dados recebidos para edição
}

export const ModalEditarEstadio = ({ isOpen, onClose, estadioData }: ModalEditarEstadioProps) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm<EstadioFormData>({
    resolver: zodResolver(estadioSchema),
  });

  useEffect(() => {
    if (isOpen && estadioData) {
    setValue('nome', estadioData.nome);
    setValue('capacidade', formatarMilhar(estadioData.capacidade.toString()) as any);
    setValue('localizacao', estadioData.localizacao);
    }
    }, [isOpen, estadioData, setValue]);

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      onClose();
    }
  };

  const onSubmit = async (data: EstadioFormData) => {
    setIsLoading(true);
  
    setTimeout(() => {
      setIsLoading(false);
      toast.success('Informações atualizadas com sucesso!', {
        position: 'bottom-right',
        style: {
          background: '#004a1b',
          color: '#fff',
          fontFamily: 'Roboto, sans-serif',
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
    >
      <div 
        ref={modalRef}
        className="bg-white rounded-xl shadow-2xl w-full max-w-lg p-8 animate-in fade-in zoom-in duration-200 font-roboto"
      > 
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-800 text-[20px]">Editar Estádio</h2>
          <p className="text-[12px] text-gray-500 italic">Edite as configurações e informações do estádio</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
          <Input 
            {...register("nome")} 
            label="Nome do Estádio" 
            placeholder="Nome do local" 
            className="bg-white border-gray-300" 
          />
          
          <Input 
            {...register("capacidade")}
            label="Capacidade"
            placeholder="Quantidade"
            type="text" 
            onChange={(e) => {
              e.target.value = formatarMilhar(e.target.value);
            }}
            className="bg-white border-gray-300"
          />

          <Input 
            {...register("localizacao")} 
            label="Localização" 
            placeholder="Cidade, Estado" 
            className="bg-white border-gray-300"
          />

          <div className="flex justify-end gap-2 mt-6">
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
              className="px-4 py-1.5 bg-[#004a1b] text-white rounded-md text-xs font-bold hover:bg-green-800 transition-all shadow-md disabled:opacity-50"
            >
              {isLoading ? 'Salvando...' : 'Atualizar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};