"use client";

import React, { useEffect, useState } from "react";
import { StadiumCard } from "./StadiumCard/StadiumCard";
import { Plus, Search } from "lucide-react";
import { ContainerHeader } from "@/components/ContainerHeader";
import { ModalEstadio } from "@/components/ModalEstadio";
import { ModalEditarEstadio } from "@/components/ModalEditarEstadio";
import { ModalExcluirEstadio } from "@/components/ModalExcluirEstadio";

const API_URL = (
  process.env.NEXT_PUBLIC_API_URL ||
  "https://play-zone-omega.vercel.app"
).replace(/\/$/, "");

interface Location {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  imageUrl: string;
}

export default function EstadiosHome() {
  const [searchTerm, setSearchTerm] = useState("");
  const [stadiums, setStadiums] = useState<Location[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedStadium, setSelectedStadium] = useState<Location | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  //  Buscar dados
  const fetchLocations = async () => {
    setIsLoading(true);

    try {
      const response = await fetch(`${API_URL}/location`);
      if (!response.ok) throw new Error("Erro ao buscar locais");

      const data = await response.json();
      setStadiums(data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLocations();
  }, []);

  const filtrados = stadiums.filter((stadium) =>
    stadium.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-white flex flex-col font-bold">
      <ContainerHeader>
        <div className="w-full pt-4 pb-20 text-gray-900">

          <div className="mb-2 pb-1">
            <h1 className="text-3xl font-bold tracking-tight">
              Ginásios e Arenas
            </h1>
            <p className="text-sm text-gray-500 font-medium">
              Adicione ou gerencie os locais cadastrados
            </p>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
            <div className="relative flex-grow md:min-w-3xl w-full">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600"
                size={20}
              />
              <input
                type="text"
                placeholder="Buscar ginásio..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-600 rounded-lg focus:ring-2 focus:ring-[#007a33] outline-none font-bold"
              />
            </div>

            <button
              onClick={() => setIsAddModalOpen(true)}
              className="min-w-[40vh] flex justify-center bg-[#007a33] hover:bg-[#005f27] text-white font-bold py-2.5 px-6 rounded-lg shadow-sm transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer"
            >
              <Plus className="h-5 w-5" />
              Adicionar Ginásio
            </button>
          </div>

          {/*  LOADING STATE */}
          {isLoading ? (
            <div className="flex justify-center items-center mt-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#007a33]" />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filtrados.map((stadium) => (
                <StadiumCard
                  key={stadium.id}
                  name={stadium.name}
                  address={`${stadium.address} - ${stadium.city}/${stadium.state}`}
                  capacity={"—"}
                  match={"—"}
                  date={"—"}
                  imageUrl={stadium.imageUrl}
                  onEdit={() => {
                    setSelectedStadium(stadium);
                    setIsEditModalOpen(true);
                  }}
                  onDelete={() => {
                    setSelectedStadium(stadium);
                    setIsDeleteModalOpen(true);
                  }}
                />
              ))}
            </div>
          )}

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

      {/* Modal Criar */}
      {isAddModalOpen && (
        <ModalEstadio
          isOpen={isAddModalOpen}
          onClose={() => {
            setIsAddModalOpen(false);
            window.location.reload(); 
          }}
        />
      )}

      {/* Modal Editar */}
      {isEditModalOpen && selectedStadium && (
        <ModalEditarEstadio
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
          }}
          stadiumData={selectedStadium}
          onSuccess={fetchLocations}
        />
      )}

      {/* Modal Excluir */}
      {isDeleteModalOpen && selectedStadium && (
        <ModalExcluirEstadio
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          locationId={selectedStadium.id}
          locationName={selectedStadium.name}
          onSuccess={fetchLocations}
        />
      )}
    </div>
  );
}