'use client';

import React, { useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/Input';
import { estadioSchema, EstadioFormData } from '@/lib/validations';
import { formatarMilhar } from '@/utils/formatters'; 

interface ModalEstadioProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ModalEstadio = ({ isOpen, onClose }: ModalEstadioProps) => {
  // Referência para detectar o clique fora do modal
  const modalRef = useRef<HTMLDivElement>(null);

  const { register, handleSubmit, formState: { errors }, reset } = useForm<EstadioFormData>({
    resolver: zodResolver(estadioSchema),
  });

  // Fecha o modal se o clique for no fundo (overlay), não no conteúdo
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      onClose();
    }
  };

  const onSubmit = async (data: EstadioFormData) => {
    console.log("Dados prontos para o backend:", data);
    alert("Estádio Adicionado!");
    reset();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={handleOverlayClick}
    >
      {/* Ajuste de Width: max-w-sm para um modal mais compacto */}
      <div 
        ref={modalRef}
        className="bg-white rounded-xl shadow-2xl w-full max-w-lg p-8 animate-in fade-in zoom-in duration-200"
      > 
        {/* X Removido conforme solicitado */}

        <div className="mb-6">
          {/* Tamanho da fonte ajustado para text-xl */}
          <h2 className="text-xl font-bold text-gray-800">Adicionar Estádio</h2>
          <p className="text-[12px] text-gray-500">Crie e configure as informações do estádio</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
          {/* Input sem fundo escuro: o componente Input precisa lidar com o bg-white */}
          <Input 
            {...register("nome")} 
            label="Nome do Estádio" 
            placeholder="Nome do local" 
            className="bg-white border-gray-300" 
          />
          
          <Input 
            {...register("capacidade")}
            label="Capacidade"
            placeholder="00.000"
            type="text" // Mudamos para text para aceitar a máscara
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

          <div className="flex justify-end gap-2 mt-6">
            {/* Botões reduzidos: px-3 py-1.5 e texto menor */}
            <button 
              type="button" 
              onClick={onClose} 
              className="px-3 py-1.5 border rounded-md text-xs font-bold text-gray-600 hover:bg-gray-50 transition-all"
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              className="px-4 py-1.5 bg-[#004a1b] text-white rounded-md text-xs font-bold hover:bg-green-800 transition-all shadow-md"
            >
              Adicionar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};