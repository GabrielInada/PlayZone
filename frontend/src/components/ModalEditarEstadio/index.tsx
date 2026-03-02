"use client";

import React, { useRef, useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/Input";
import { estadioSchema, EstadioFormData } from "@/lib/validations";
import { formatarMilhar } from "@/utils/formatters";
import { Upload, X } from "lucide-react";
import toast from "react-hot-toast";

interface ModalEditarEstadioProps {
  isOpen: boolean;
  onClose: () => void;
  stadiumData: any;
  onSuccess?: () => void; // opcional para recarregar lista
}

export const ModalEditarEstadio = ({
  isOpen,
  onClose,
  stadiumData,
  onSuccess,
}: ModalEditarEstadioProps) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const API_URL = (
    process.env.NEXT_PUBLIC_API_URL ||
    "https://play-zone-omega.vercel.app"
  ).replace(/\/$/, "");

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm<EstadioFormData>({
    resolver: zodResolver(estadioSchema),
  });

  // Preenche formulário quando abrir
  useEffect(() => {
    if (isOpen && stadiumData) {
      setValue("nome", stadiumData.name || "");
      setValue("localizacao", stadiumData.address || "");
      setValue(
        "capacidade",
        stadiumData.capacity
          ? formatarMilhar(
              stadiumData.capacity.replace?.(" Pessoas", "") || ""
            )
          : ""
      );
      setImagePreview(stadiumData.imageUrl || null);
    }
  }, [isOpen, stadiumData, setValue]);

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      onClose();
    }
  };

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

  const onSubmit = async (data: EstadioFormData) => {
    if (!stadiumData?.id) {
      toast.error("ID do estádio não encontrado");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(
        `${API_URL}/location/${stadiumData.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: data.nome,
            address: data.localizacao,
            imageUrl: imagePreview || stadiumData.imageUrl,
          }),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Erro backend:", errorText);
        throw new Error("Erro ao atualizar estádio");
      }

      toast.success("Estádio atualizado com sucesso!", {
        position: "bottom-right",
      });

      onSuccess?.();
      onClose();
      reset();

    } catch (error) {
      console.error(error);
      toast.error("Erro ao atualizar estádio", {
        position: "bottom-right",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={handleOverlayClick}
      style={{ fontFamily: "Arial, sans-serif" }}
    >
      <div
        ref={modalRef}
        className="bg-white rounded-xl shadow-2xl w-full max-w-lg p-8 flex flex-col animate-in fade-in zoom-in duration-200"
      >
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-800">
            Editar Estádio
          </h2>
          <p className="text-sm text-gray-500">
            Atualize as informações do estádio
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 w-full">
          <Input
            {...register("nome")}
            label="Nome do Estádio"
            placeholder="Nome do local"
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
          />

          <Input
            {...register("localizacao")}
            label="Localização"
            placeholder="Cidade, Estado"
          />

          {/* Upload de imagem */}
          <div>
            <label className="block text-sm font-bold mb-2">
              Foto do Estádio
            </label>

            <div
              className="relative w-full h-32 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-white hover:bg-gray-50 transition overflow-hidden cursor-pointer group"
              onClick={() =>
                imagePreview ? null : fileInputRef.current?.click()
              }
            >
              {imagePreview ? (
                <>
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setImagePreview(null);
                    }}
                    className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition"
                  >
                    <X size={14} />
                  </button>
                </>
              ) : (
                <div className="flex flex-col items-center">
                  <Upload className="h-8 w-8 text-gray-400 mb-2" />
                  <span className="text-xs text-gray-500 font-semibold uppercase">
                    Alterar Imagem
                  </span>
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

          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded-md text-sm text-gray-600 hover:bg-gray-50"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 bg-[#004a1b] text-white rounded-md text-sm font-semibold hover:bg-green-800 disabled:opacity-50"
            >
              {isLoading ? "Salvando..." : "Atualizar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};