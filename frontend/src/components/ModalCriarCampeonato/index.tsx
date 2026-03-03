"use client";
import React, { useState } from "react";
import { X } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000";

interface ModalCriarCampeonatoProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ModalCriarCampeonato({ isOpen, onClose }: ModalCriarCampeonatoProps) {
  const { token } = useAuth();

  const [nome,       setNome]       = useState("");
  const [ano,        setAno]        = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error,      setError]      = useState<string | null>(null);

  if (!isOpen) return null;

  const handleAnoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) setAno(value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const res = await fetch(`${API_URL}/tournament`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ name: nome.trim() }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        const msg  = Array.isArray(body?.message)
          ? body.message.join(", ")
          : (body?.message ?? `Erro ${res.status}`);
        throw new Error(msg);
      }

      setNome(""); setAno(""); setError(null);
      onClose();
    } catch (err: any) {
      setError(err.message ?? "Erro ao criar campeonato.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <form 
        onSubmit={handleSubmit}
        onClick={(e) => e.stopPropagation()}
        data-testid="modal-criar-campeonato"
        className="bg-white w-full max-w-lg rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in duration-300"
      >
        {/* Header do Modal */}
        <div className="p-6 border-b border-gray-100 flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold text-gray-950">Criar Novo Campeonato</h2>
            <p className="text-sm text-gray-500 font-medium">Crie e configure as informações do campeonato</p>
          </div>
          <button 
            type="button"
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
          >
            <X size={20} className="text-gray-400" />
          </button>
        </div>

        {/* Erro */}
        {error && (
          <div className="mx-6 mt-4 px-4 py-2.5 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600 font-medium">
            {error}
          </div>
        )}

        {/* Formulário */}
        <div className="p-6 space-y-5 text-gray-900">
          <div className="space-y-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-bold">Nome do Campeonato</label>
              <input 
                required
                data-testid="input-nome-campeonato"
                type="text"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Escreva o nome do campeonato"
                className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#007a33] outline-none font-medium"
              />
            </div>
            
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-bold">Ano</label>
              <input 
                required
                data-testid="input-ano-campeonato"
                type="text" 
                value={ano}
                onChange={handleAnoChange}
                placeholder="Ex: 2025"
                className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#007a33] outline-none font-medium"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-bold">Formato do Campeonato</label>
              <select required className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#007a33] outline-none font-medium cursor-pointer">
                <option value="">Selecione...</option>
                <option value="mata-mata">Mata Mata</option>
                <option value="pontos-corridos">Pontos Corridos</option>
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-bold">Nº Equipes por Grupo</label>
              <input 
                required
                type="number" 
                min="1"
                className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#007a33] outline-none font-medium"
              />
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-sm font-bold block">Critérios de Pontuação</label>
            <div className="flex gap-3">
              {['Vitória', 'Empate', 'Derrota'].map((label, idx) => (
                <div key={label} className="flex-1 flex flex-col gap-1">
                  <span className="text-[10px] uppercase tracking-wider font-bold text-gray-500 text-center">{label}</span>
                  <input 
                    required
                    type="number" 
                    min="0"
                    defaultValue={idx === 0 ? 3 : idx === 1 ? 1 : 0}
                    className="w-full px-2 py-2 bg-white border border-gray-300 rounded-lg text-center font-bold text-gray-800"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer com Ações */}
        <div className="p-6 bg-gray-50 flex justify-end gap-3 border-t border-gray-100">
          <button 
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 border border-gray-300 rounded-lg font-bold text-gray-700 hover:bg-white transition-colors cursor-pointer text-sm"
          >
            Cancelar
          </button>
          <button 
            type="submit"
            disabled={submitting}
            data-testid="btn-confirmar-criacao"
            className="px-8 py-2.5 bg-[#007a33] hover:bg-[#005f27] text-white rounded-lg font-bold shadow-sm transition-all active:scale-95 cursor-pointer text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? "Criando..." : "Criar"}
          </button>
        </div>
      </form>
    </div>
  );
}