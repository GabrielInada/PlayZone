"use client";

import React, { useState } from "react";
import { Search, MapPin, Users, Calendar, Trophy, CalendarDays } from "lucide-react";
import { ContainerHeader } from "@/components/ContainerHeader";

// ── Tipos ──────────────────────────────────────────────────────────────────────
type Convocacao = {
  id: number;
  stadiumName: string;
  address: string;
  capacity: string;
  match: string;
  date: string;
  imageUrl: string;
};

// ── Mock ───────────────────────────────────────────────────────────────────────
const MOCK_CONVOCACOES: Convocacao[] = [
  {
    id: 1,
    stadiumName: "Mangueirinho",
    address: "Rod. Augusto Montenegro, 524 - Castanheira, Belém",
    capacity: "11.970 Pessoas",
    match: "Remo x Paysandu",
    date: "Dia 10/12 as 20h",
    imageUrl: "https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 2,
    stadiumName: "IFPA Arena Sport",
    address: "Rod. Augusto Montenegro, 524 - Castanheira, Belém",
    capacity: "11.970 Pessoas",
    match: "Remo x Paysandu",
    date: "Dia 10/12 as 20h",
    imageUrl: "https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 3,
    stadiumName: "Estádio da UFPA",
    address: "Rod. Augusto Montenegro, 524 - Castanheira, Belém",
    capacity: "11.970 Pessoas",
    match: "Remo x Paysandu",
    date: "Dia 10/12 as 20h",
    imageUrl: "https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 4,
    stadiumName: "Ginásio Prof. Nagib C. Matni",
    address: "Av. João Paulo II, 817 - Marco, Belém",
    capacity: "3.000 Pessoas",
    match: "UEPA x UFRA",
    date: "Dia 05/03 as 17h",
    imageUrl: "https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 5,
    stadiumName: "Ginásio Poliesportivo da UEPA",
    address: "Tv. Perebebuí, 2623 - Marco, Belém",
    capacity: "5.000 Pessoas",
    match: "UFPA x UFRA",
    date: "Dia 26/02 as 17h",
    imageUrl: "https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 6,
    stadiumName: "Ginásio Dr. Almir Gabriel",
    address: "Av. Arterial 5B, 181 - Cidade Nova, Ananindeua",
    capacity: "5.000 Pessoas",
    match: "UFPA x UEPA",
    date: "Dia 01/03 as 18h",
    imageUrl: "https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=800&q=80",
  },
];

// ── Sub-componente: Card de Convocação ─────────────────────────────────────────
function ConvocacaoCard({
  stadiumName,
  address,
  capacity,
  match,
  date,
  imageUrl,
}: Omit<Convocacao, "id">) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-300 flex flex-col transition-all duration-300 hover:scale-[1.02] hover:shadow-xl group">
      {/* Imagem */}
      <div className="relative h-48 bg-gray-200">
        <img src={imageUrl} alt={stadiumName} className="w-full h-full object-cover" />

        {/* Badge Convocado */}
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-md shadow-sm border border-green-100">
          <div className="flex items-center gap-1.5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            <span className="text-[10px] font-bold text-green-800 uppercase tracking-wide">Convocado</span>
          </div>
        </div>
      </div>

      {/* Conteúdo */}
      <div className="p-5 flex flex-col flex-1 text-gray-900 font-bold">
        <h3 className="text-xl font-bold mb-1">{stadiumName}</h3>

        <div className="flex items-start gap-2 text-[14px] text-gray-800 mb-3 mt-2 font-medium leading-tight">
          <MapPin className="h-4 w-4 text-[#007a33] mt-0.5 shrink-0" />
          <span className="line-clamp-2">{address}</span>
        </div>

        <div className="flex items-center gap-2 text-[14px] text-gray-800 mb-4 font-medium">
          <Users className="h-4 w-4 text-[#007a33]" />
          <span>{capacity}</span>
        </div>

        <div className="flex items-center gap-2 text-sm font-medium text-gray-800 mb-5">
          <Trophy className="h-4 w-4 text-[#007a33]" />
          <span>{match}</span>
        </div>

        {/* Data — largura total, sem botões de ação */}
        <div className="mt-auto flex items-center justify-center gap-2 border border-[#007a33] rounded-md py-2 px-3 text-xs text-[#007a33] bg-white font-bold">
          <Calendar className="h-4 w-4" />
          <span>{date}</span>
        </div>
      </div>
    </div>
  );
}

// ── Página ─────────────────────────────────────────────────────────────────────
export default function ConvocacoesPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const filtradas = MOCK_CONVOCACOES.filter(
    (c) =>
      c.stadiumName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.match.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-white flex flex-col font-bold">
      <ContainerHeader>
        <div className="w-full pt-4 pb-20 text-gray-900">

          {/* Cabeçalho */}
          <div className="mb-2 pb-1">
            <h1 className="text-3xl font-bold tracking-tight">Minhas Convocações</h1>
            <p className="text-sm text-gray-500 font-medium">Veja os jogos que participará</p>
          </div>

          {/* Busca */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
            <div className="relative flex-grow w-full max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" size={20} />
              <input
                type="text"
                placeholder="Buscar ginásio ou partida..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-600 rounded-lg focus:ring-2 focus:ring-[#007a33] outline-none font-bold"
              />
            </div>
          </div>

          {/* Grid de cards */}
          {filtradas.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filtradas.map((convocacao) => (
                <ConvocacaoCard
                  key={convocacao.id}
                  stadiumName={convocacao.stadiumName}
                  address={convocacao.address}
                  capacity={convocacao.capacity}
                  match={convocacao.match}
                  date={convocacao.date}
                  imageUrl={convocacao.imageUrl}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-gray-400">
              <CalendarDays size={48} className="mb-3 opacity-40" />
              <p className="text-base font-medium">Nenhuma convocação encontrada</p>
              <p className="text-sm mt-1">Tente buscar por outro ginásio ou partida</p>
            </div>
          )}

          {/* Botão voltar */}
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