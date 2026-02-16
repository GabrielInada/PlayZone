"use client";
import React from "react";
import { MapPin, Users, Calendar, Trophy, Pencil, Trash2 } from "lucide-react";

interface StadiumCardProps {
  name: string;
  address: string;
  capacity: string;
  match: string;
  date: string;
  imageUrl: string;
  onEdit: () => void;
  onDelete: () => void;
}

export function StadiumCard({
  name,
  address,
  capacity,
  match,
  date,
  imageUrl,
  onEdit,
  onDelete,
}: StadiumCardProps) {
  return (
    <div
      className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-300 flex flex-col transition-all duration-300 hover:scale-105 hover:shadow-xl group"
      data-testid="card-estadio-item"
    >
      
      <div className="relative h-48 bg-gray-200">
        <img src={imageUrl} alt={name} className="w-full h-full object-cover" />
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-md shadow-sm border border-green-100">
          <div className="flex items-center gap-1.5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            <span className="text-[10px] font-bold text-green-800 uppercase tracking-wide">Ativo</span>
          </div>
        </div>
      </div>
 
      <div className="p-5 flex flex-col flex-1 text-gray-900 font-bold">
        <h3 className="text-xl font-bold mb-1">{name}</h3>

        <div className="flex items-start gap-2 text-[14px] text-gray-800 mb-3 mt-2 font-medium leading-tight">
          <MapPin className="h-4 w-4 text-[#007a33] mt-0.5 shrink-0" />
          <span className="line-clamp-2">{address}</span>
        </div>

        <div className="flex items-center gap-2 text-[14px] text-gray-800 mb-4 font-medium">
          <Users className="h-4 w-4 text-[#007a33]" />
          <span>{capacity}</span>
        </div>

        <div className="border-t border-dashed border-gray-300 my-3"></div>

        <div className="flex items-center gap-2 text-sm font-bold text-gray-800 mb-5">
          <Trophy className="h-4 w-4 text-gray-400" />
          <span>{match}</span>
        </div>

        <div className="mt-auto flex items-center gap-2">
          
          <div className="flex-1 flex items-center justify-center gap-2 border border-[#007a33] rounded-md py-2 px-3 text-xs text-[#007a33] bg-white font-bold transition-colors hover:bg-green-50 cursor-default">
            <Calendar className="h-4 w-4" />
            <span>{date}</span>
          </div>

          <button 
            onClick={onEdit} 
            className="p-2 text-[#007a33] rounded-md border border-[#007a33] transition-all hover:bg-blue-50 hover:text-blue-700 hover:border-blue-700 cursor-pointer"
            title="Editar"
          >
            <Pencil size={16} />
          </button>

          <button 
            onClick={onDelete} 
            className="p-2 text-[#007a33] rounded-md border border-[#007a33] transition-all hover:bg-red-50 hover:text-red-700 hover:border-red-700 cursor-pointer"
            title="Excluir"
          >
            <Trash2 size={16} />
          </button>

        </div>
      </div>
    </div>
  );
}