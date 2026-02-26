"use client";
import React, { useState } from "react";
import { X, ChevronDown } from "lucide-react";

interface ModalAgendarPartidaProps {
  isOpen: boolean;
  onClose: () => void;
  nomeCampeonato: string;
}

export default function ModalAgendarPartida({ isOpen, onClose, nomeCampeonato }: ModalAgendarPartidaProps) {
  const [data, setData] = useState("");
  const [hora, setHora] = useState("");

  if (!isOpen) return null;

  const handleDataChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "");

    if (value.length <= 8) {
      value = value.replace(/(\d{2})(\d)/, "$1/$2");
      value = value.replace(/(\d{2})\/(\d{2})(\d)/, "$1/$2/$3");
      setData(value);
    }
  };

  const handleHoraChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "");

    if (value.length <= 4) {
      value = value.replace(/(\d{2})(\d)/, "$1:$2");
      setHora(value);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" onClick={onClose}>
      <div
        className="bg-white w-full max-w-lg rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in duration-300 font-bold text-gray-900"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 mt-3 flex justify-between items-start">
          <div>
            <h2 className="text-xl font-bold text-gray-950">Agendar Partida - {nomeCampeonato}</h2>
            <p className="text-sm text-gray-500 font-medium mt-1">Adicione as informações da partida</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors cursor-pointer">
            <X size={20} className="text-gray-400" />
          </button>
        </div>

        <form className="p-6 pt-0 py-8 space-y-5 text-sm" onSubmit={(e) => e.preventDefault()}>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-bold text-gray-900">Data da Partida <span className="text-red-500">*</span></label>
              <input
                type="text"
                value={data}
                onChange={handleDataChange}
                placeholder="DD/MM/AAAA"
                maxLength={10}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#007a33] outline-none font-medium placeholder:text-gray-400"
              />
            </div>
            <div className="flex flex-col gap-1.5 text-sm">
              <label className="text-sm font-bold text-gray-900">Hora da Partida <span className="text-red-500">*</span></label>
              <input
                type="text"
                value={hora}
                onChange={handleHoraChange}
                placeholder="00:00"
                maxLength={5}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#007a33] outline-none font-medium placeholder:text-gray-400"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-bold text-gray-900">Local da Partida <span className="text-red-500">*</span></label>
            <div className="relative">
              <select className="text-sm w-full pl-4 pr-10 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#007a33] outline-none font-medium cursor-pointer text-gray-500 appearance-none">
                <option>Escolha o Local</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-bold text-gray-900">Mandante <span className="text-red-500">*</span></label>
              <div className="relative">
                <select className="text-sm w-full pl-4 pr-10 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#007a33] outline-none font-medium cursor-pointer text-gray-500 appearance-none">
                  <option>Escolha o time mandante</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-bold text-gray-900">Visitante <span className="text-red-500">*</span></label>
              <div className="relative">
                <select className="text-sm w-full pl-4 pr-10 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#007a33] outline-none font-medium cursor-pointer text-gray-500 appearance-none">
                  <option>Escolha o time visitando</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-1.5 pb-2">
            <label className="text-sm font-bold text-gray-900">Árbitro da Partida <span className="text-red-500">*</span></label>
            <div className="relative">
              <select className="text-sm w-full pl-4 pr-10 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#007a33] outline-none font-medium cursor-pointer text-gray-500 appearance-none">
                <option>Escolha o Àrbitro</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
            </div>
          </div>

          <div className="pt-6 flex justify-end gap-3 border-t border-gray-50">
            <button type="button" onClick={onClose} className="px-6 py-2 border border-gray-300 rounded-md font-bold text-gray-700 hover:bg-gray-100 transition-colors text-sm cursor-pointer">
              Cancelar
            </button>
            <button type="submit" className="px-8 py-2 bg-[#007a33] hover:bg-[#005f27] text-white rounded-md font-bold shadow-sm transition-all text-sm cursor-pointer">
              Agendar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}