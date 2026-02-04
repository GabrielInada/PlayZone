'use client';

import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/Input';
import { estadioSchema, EstadioFormData } from '@/lib/validations';

interface ModalEstadioProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ModalEstadio = ({ isOpen, onClose }: ModalEstadioProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, formState: { errors }, reset } = useForm<EstadioFormData>({
    resolver: zodResolver(estadioSchema),
  });

  const onSubmit = async (data: EstadioFormData) => {
    setIsLoading(true);
    
    // MOCK DE INTEGRAÇÃO COM BACKEND
    console.log("Enviando para o backend:", data);
    
    setTimeout(() => {
      setIsLoading(false);
      alert("Estádio cadastrado com sucesso no banco de dados!");
      reset(); // Limpa o formulário
      onClose();
    }, 1500);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 relative">
        <button onClick={onClose} className="absolute right-4 top-4 text-gray-400 hover:text-gray-600">
          <X size={20} />
        </button>

        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Adicionar Estádio</h2>
          <p className="text-sm text-gray-500">Configure as informações oficiais do local.</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Input {...register("nome")} label="Nome do Estádio" placeholder="Ex: Mangueirão" />
            {errors.nome && <span className="text-red-500 text-xs font-bold">{errors.nome.message}</span>}
          </div>

          <div>
            <Input {...register("capacidade")} label="Capacidade" type="number" placeholder="Ex: 45000" />
            {errors.capacidade && <span className="text-red-500 text-xs font-bold">{errors.capacidade.message}</span>}
          </div>

          <div>
            <Input {...register("localizacao")} label="Localização" placeholder="Endereço completo" />
            {errors.localizacao && <span className="text-red-500 text-xs font-bold">{errors.localizacao.message}</span>}
          </div>

          <div className="flex justify-end gap-3 mt-8">
            <button type="button" onClick={onClose} className="px-5 py-2 border rounded-lg text-gray-600 font-semibold hover:bg-gray-50">
              Cancelar
            </button>
            <button 
              type="submit" 
              disabled={isLoading}
              className="px-5 py-2 bg-[#004a1b] text-white rounded-lg font-semibold hover:bg-green-800 disabled:bg-gray-400"
            >
              {isLoading ? "Salvando..." : "Adicionar Estádio"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};