"use client";

import React, { useRef, useState } from "react";
import toast from "react-hot-toast";

interface ModalExcluirEstadioProps {
  isOpen: boolean;
  onClose: () => void;
  locationId: string;
  locationName: string;
  onSuccess?: () => void;
}

export const ModalExcluirEstadio = ({
  isOpen,
  onClose,
  locationId,
  locationName,
  onSuccess,
}: ModalExcluirEstadioProps) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(false);

  const API_URL = (
    process.env.NEXT_PUBLIC_API_URL ||
    "https://play-zone-omega.vercel.app"
  ).replace(/\/$/, "");

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      if (!isLoading) onClose();
    }
  };

  const handleDelete = async () => {
    if (!locationId) {
      toast.error("ID do estádio não encontrado");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(
        `${API_URL}/location/${locationId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Erro backend:", errorText);
        throw new Error("Erro ao excluir estádio");
      }

      toast.success("Estádio excluído com sucesso!", {
        position: "bottom-right",
      });

      onSuccess?.(); // 🔥 Atualiza lista na página pai
      onClose();

    } catch (error) {
      console.error(error);
      toast.error("Erro ao excluir estádio", {
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
    >
      <div
        ref={modalRef}
        className="bg-white rounded-xl shadow-2xl w-full max-w-md p-8 flex flex-col animate-in fade-in zoom-in duration-200"
      >
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-800">
            Confirmar Exclusão
          </h2>

          <p className="text-sm text-gray-500 mt-2">
            Tem certeza que deseja excluir o estádio:
          </p>

          <p className="text-sm font-bold mt-2 text-red-600">
            {locationName}
          </p>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2 border rounded-md text-sm font-medium text-gray-600 hover:bg-gray-50 transition-all"
          >
            Cancelar
          </button>

          <button
            type="button"
            onClick={handleDelete}
            disabled={isLoading}
            className="px-4 py-2 bg-red-600 text-white rounded-md text-sm font-semibold hover:bg-red-700 transition-all disabled:opacity-50"
          >
            {isLoading ? "Excluindo..." : "Excluir"}
          </button>
        </div>
      </div>
    </div>
  );
};