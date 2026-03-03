"use client";
import React from "react";
import { MapPin, Users, Star, Calendar, Pencil, Trash2, Trophy } from "lucide-react";

interface NextMatch {
  label: string;
  date: string;
}

interface StadiumCardProps {
  name: string;
  address: string;
  capacity: number | null;
  imageUrl: string;
  nextMatch: NextMatch | null;
  onEdit: () => void;
  onDelete: () => void;
}

export function StadiumCard({
  name, address, capacity, imageUrl, nextMatch, onEdit, onDelete,
}: StadiumCardProps) {
  const dateLabel = nextMatch
    ? "Dia " +
      new Date(nextMatch.date).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" }) +
      " às " +
      new Date(nextMatch.date).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }) + "h"
    : "Sem partidas agendadas";

  return (
    <div
      className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-300 flex flex-col transition-all duration-300 hover:scale-102 hover:shadow-xl group"
      data-testid="card-estadio-item"
    >
      {/* Imagem */}
      <div className="h-44 bg-[#f0fdf4] overflow-hidden">
        {imageUrl ? (
          <img src={imageUrl} alt={name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <MapPin size={48} className="text-[#007a33] opacity-20" />
          </div>
        )}
      </div>

      {/* Conteúdo */}
      <div className="p-5 flex flex-col flex-1 gap-3">
        <h3 className="text-lg font-bold text-gray-900 leading-tight">{name}</h3>

        {/* Endereço */}
        {address && (
          <div className="flex items-start gap-2">
            <MapPin className="h-4 w-4 text-[#007a33] mt-0.5 shrink-0" />
            <span className="text-sm text-gray-600 font-medium leading-snug line-clamp-2">
              {address}
            </span>
          </div>
        )}

        {/* Capacidade */}
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 text-[#007a33] shrink-0" />
          <span className="text-sm text-gray-600 font-medium">
            {capacity != null
              ? capacity.toLocaleString() + " Pessoas"
              : "Capacidade não informada"}
          </span>
        </div>

        {/* Próxima partida */}
        <div className="flex items-center gap-2">
          <Trophy className="h-4 w-4 text-[#007a33]" />
          <span className="text-sm text-gray-600 font-medium truncate">
            {nextMatch ? nextMatch.label : "Sem partidas agendadas"}
          </span>
        </div>

        {/* Rodapé — data + ações */}
        <div className="mt-auto pt-2 flex items-center gap-2">
          <button
            disabled
            className="flex-1 flex items-center justify-center gap-2 border border-gray-200 rounded-xl py-2.5 px-3 text-sm text-gray-700 font-bold bg-white cursor-default"
          >
            <Calendar className="h-4 w-4 text-[#007a33] shrink-0" />
            <span className="truncate">{dateLabel}</span>
          </button>

          <button
            onClick={onEdit}
            className="p-2.5 rounded-xl border border-gray-200 text-gray-500 hover:text-[#007a33] hover:border-[#007a33] hover:bg-[#f0fdf4] transition-all cursor-pointer"
            title="Editar"
          >
            <Pencil size={16} />
          </button>

          <button
            onClick={onDelete}
            className="p-2.5 rounded-xl border border-gray-200 text-gray-500 hover:text-red-600 hover:border-red-300 hover:bg-red-50 transition-all cursor-pointer"
            title="Excluir"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}