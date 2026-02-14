 'use client';

import React, { useRef, useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import { Input } from '@/components/Input';
import { estadioSchema, EstadioFormData } from '@/lib/validations';
import { formatarMilhar } from '@/utils/formatters';

interface ModalEditarProps {
  isOpen: boolean;
  onClose: () => void;
  estadioData?: EstadioFormData;
}

export const ModalEditarEstadio = ({ isOpen, onClose, estadioData }: ModalEditarProps) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm<EstadioFormData>({
    resolver: zodResolver(estadioSchema),
  });

  
  useEffect(() => {
    if (estadioData) {
      setValue('nome', estadioData.nome);
      setValue('capacidade', formatarMilhar(estadioData.capacidade.toString()) as any);
      setValue('localizacao', estadioData.localizacao);
    }
  }, [estadioData, setValue]);

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
        style: { background: '#004a1b', color: '#fff', fontFamily: 'Roboto' }
      });
      onClose();
    }, 1500);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={handleOverlayClick}>
      
      <div ref={modalRef} className="bg-white rounded-xl shadow-2xl w-full max-w-lg p-8 animate-in fade-in zoom-in duration-200 font-roboto">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-800">Editar Estádio</h2>
          <p className="text-[12px] text-gray-500 italic">Edite as configurações e informações do estádio</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input {...register("nome")} label="Nome do Estádio" placeholder="Ex: Mangueirinho" className="bg-white" />
          
          <Input 
            {...register("capacidade")} 
            label="Capacidade" 
            placeholder="00.000" 
            className="bg-white"
            onChange={(e) => {
              e.target.value = formatarMilhar(e.target.value);
            }} 
          />

          <Input {...register("localizacao")} label="Localização" placeholder="Endereço completo" className="bg-white" />

          <div className="flex justify-end gap-3 mt-8">
            <button type="button" onClick={onClose} className="px-6 py-2 border rounded-md text-sm font-bold text-gray-600 hover:bg-gray-50 transition-all">
              Cancelar
            </button>
            <button type="submit" disabled={isLoading} className="px-6 py-2 bg-[#004a1b] text-white rounded-md text-sm font-bold hover:bg-green-800 transition-all shadow-md disabled:opacity-50">
              {isLoading ? 'Salvando...' : 'Atualizar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};