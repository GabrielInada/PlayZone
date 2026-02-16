"use client";
import { Calendar, MapPin, Users, Trash2, Edit3 } from "lucide-react";

interface StadiumCardProps {
  id: string;
  nome: string;
  endereco: string;
  capacidade: string;
  proximoJogo: string;
  dataHora: string;
  imagem: string;
  onDelete: (id: string) => void;
  onEdit: () => void;
}

export default function StadiumCard({
  id,
  nome,
  endereco,
  capacidade,
  proximoJogo,
  dataHora,
  imagem,
  onDelete,
  onEdit 
}: StadiumCardProps) {
  return (
    <div 
      className="group bg-white rounded-xl overflow-hidden shadow-md border border-gray-200 transition-all duration-200 hover:scale-[1.02] hover:shadow-md flex flex-col h-full cursor-pointer"
      data-testid={`stadium-card-${id}`}
    >
      <div className="relative h-48 w-full">
        <img 
          src={imagem} 
          alt={nome} 
          className="w-full h-full object-cover" 
          data-testid="stadium-card-image"
        />
        <div className="absolute top-3 right-3 bg-white text-[#007a33] text-[10px] font-bold px-2 py-1 rounded flex items-center gap-1.5 shadow border border-gray-100">
          <span className="w-2 h-2 bg-[#007a33] rounded-full"></span>
          ATIVO
        </div>
      </div>

      <div className="p-5 flex flex-col grow">
        <h3 className="text-lg font-bold text-black mb-3 leading-tight" data-testid="stadium-card-name">
          {nome}
        </h3>
        
        <div className="space-y-3 mb-5">
          <div className="flex items-start gap-2 text-black">
            <MapPin size={16} className="shrink-0 mt-0.5" />
            <p className="text-sm font-medium leading-snug" data-testid="stadium-card-address">{endereco}</p>
          </div>
          <div className="flex items-center gap-2 text-black">
            <Users size={16} />
            <p className="text-sm font-semibold" data-testid="stadium-card-capacity">{capacidade} Pessoas</p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-auto pt-4 border-t border-gray-100">
           <div className="flex items-center justify-between">
             <span className="bg-[#f0f9f1] text-black px-3 py-2 rounded text-sm font-bold flex items-center gap-2 cursor-pointer hover:bg-[#e2f2e5] transition-colors">
               <Calendar size={18} className="text-[#007a33]" /> {dataHora}
             </span>
             
             <div className="flex gap-1">
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit();
                  }}
                  className="p-1.5 text-black hover:text-blue-600 transition-colors cursor-pointer"
                  data-testid="edit-stadium-button"
                >
                   <Edit3 size={18} />
                </button>

                <button 
                  onClick={(e) => {
                    e.stopPropagation(); 
                    onDelete(id);
                  }} 
                  className="p-1.5 text-black hover:text-red-600 transition-colors cursor-pointer"
                  data-testid="delete-stadium-button"
                >
                   <Trash2 size={18} />
                </button>
             </div>
           </div>
        </div>
      </div>
    </div>
  );
}