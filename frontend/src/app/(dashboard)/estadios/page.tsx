"use client";

import React, { useState } from 'react';
import { StadiumCard } from './StadiumCard/StadiumCard'; 
import { Plus, Search } from 'lucide-react';
import { ContainerHeader } from "@/components/ContainerHeader";

const MOCK_STADIUMS = [
  {
    id: 1,
    name: "Campo de Futebol da UFRA",
    address: "Av. Perimetral, 2501 - Terra Firme, Belém",
    capacity: "300 Pessoas",
    match: "UFRA x UFPA",
    date: "Dia 12/02 as 16h",
    imageUrl: "/estadios/campo.png", 
  },
  {
    id: 2,
    name: "Ginásio Poliesportivo da UFRA",
    address: "Av. Perimetral, 2501 - Terra Firme, Belém",
    capacity: "1.000 Pessoas",
    match: "UFRA x IFPA",
    date: "Dia 19/02 as 18h",
    imageUrl: "/estadios/ginasio-ufra.jpg",
  },
  {
    id: 3,
    name: "Ginásio Poliesportivo da UFPA",
    address: "Rua Igarapé Tucunduba, 976 - Guamá, Belém",
    capacity: "1.500 Pessoas",
    match: "UFPA x UFRA",
    date: "Dia 26/02 as 17h",
    imageUrl: "/estadios/ginasio-ufpa.jpg",
  },
  {
    id: 4,
    name: "Ginásio Prof. Nagib C. Matni",
    address: "Av. João Paulo II, 817 - Marco, Belém",
    capacity: "3.000 Pessoas",
    match: "UEPA x UFRA",
    date: "Dia 05/03 as 17h",
    imageUrl: "/estadios/ginasio-uepa1.png",
  },
  {
    id: 5,
    name: "Ginásio Poliesportivo da UEPA",
    address: "Tv. Perebebuí, 2623 - Marco, Belém",
    capacity: "5.000 Pessoas",
    match: "UFPA x UFRA",
    date: "Dia 26/02 as 17h",
    imageUrl: "/estadios/ginasio-uepa2.jpg",
  },
  {
    id: 6,
    name: "Ginásio Dr. Almir Gabriel",
    address: "Av. Arterial 5B, 181 - Cidade Nova, Ananindeua",
    capacity: "5.000 Pessoas",
    match: "UFPA x UEPA",
    date: "Dia 01/03 as 18h",
    imageUrl: "/estadios/abacatao.jpg",
  },
];

export default function EstadiosHome() {
  const [searchTerm, setSearchTerm] = useState("");

  const filtrados = MOCK_STADIUMS.filter(stadium => 
    stadium.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className=" bg-white flex flex-col font-bold">
      <ContainerHeader>
        <div className="w-full pt-4 pb-20 text-gray-900">
          
          <div className="mb-2 pb-1">
            <h1 className="text-3xl font-bold tracking-tight">Ginásios e Arenas</h1>
            <p className="text-sm text-gray-500 font-medium">Adicione ou gerencie os locais cadastrados</p>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
            <div className="relative flex-grow w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" size={20} />
              <input 
                type="text" 
                placeholder="Buscar ginásio..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-600 rounded-lg focus:ring-2 focus:ring-[#007a33] outline-none  font-bold" 
              />
            </div>

            <button className="min-w-[40vh] flex justify-center bg-[#007a33] hover:bg-[#005f27] text-white font-bold py-2.5 px-6 rounded-lg shadow-sm transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer">
              <Plus className="h-5 w-5" />
              Adicionar Ginásio
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtrados.map((stadium) => (
              <StadiumCard
                key={stadium.id}
                name={stadium.name}
                address={stadium.address}
                capacity={stadium.capacity}
                match={stadium.match}
                date={stadium.date}
                imageUrl={stadium.imageUrl}
                onEdit={() => console.log("Editar", stadium.id)}
                onDelete={() => console.log("Excluir", stadium.id)}
              />
            ))}
          </div>

          <div className="mt-12 flex justify-center">
            <button 
              onClick={() => window.history.back()} 
              className="bg-[#007a33] hover:bg-[#005f27] text-white px-12 py-2.5 rounded-lg font-bold shadow-md transition-all active:scale-95 cursor-pointer"
            >
              Voltar
            </button>
          </div>
        </div>
      </ContainerHeader>
    </div>
  );
}