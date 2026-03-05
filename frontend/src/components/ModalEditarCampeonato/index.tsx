"use client";
import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import toast from "react-hot-toast";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000";

interface ModalEditarCampeonatoProps {
  isOpen: boolean;
  onClose: () => void;
  campeonato: {
    id: number;   // necessário para PATCH /tournament/{id}
    nome: string;
    ano: string;
    formato: string;
  } | null;
}

export default function ModalEditarCampeonato({ isOpen, onClose, campeonato }: ModalEditarCampeonatoProps) {
  const { token }    = useAuth();
  const [nome,       setNome]       = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (campeonato && isOpen) setNome(campeonato.nome);
  }, [campeonato, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!campeonato || !nome.trim()) return;

    setSubmitting(true);
    try {
      const res = await fetch(`${API_URL}/tournament/${campeonato.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ name: nome.trim() }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        const msg  = Array.isArray(body?.message) ? body.message.join(", ") : (body?.message ?? `Erro ${res.status}`);
        throw new Error(msg);
      }

      toast.success("Campeonato atualizado com sucesso!", {
        position: "bottom-right",
        style: { borderRadius: "8px", background: "#004a1b", color: "#fff", fontFamily: "Roboto, sans-serif" },
      });
      onClose();
    } catch (err: any) {
      toast.error(err.message ?? "Erro ao atualizar campeonato.", {
        position: "bottom-right",
        style: { borderRadius: "8px", fontFamily: "Roboto, sans-serif" },
      });
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
        className="bg-white w-full max-w-lg rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in duration-300 font-bold text-gray-900"
      >
        <div className="p-6 border-b border-gray-100 flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold text-gray-950">Editar Campeonato</h2>
            <p className="text-sm text-gray-500 font-medium">Atualize as informações do campeonato</p>
          </div>
          <button type="button" onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors cursor-pointer">
            <X size={20} className="text-gray-400" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Nome — único campo enviado ao backend */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-bold">Nome do Campeonato</label>
            <input
              required
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#007a33] outline-none font-medium"
            />
          </div>

          {/* Campos visuais — não enviados ao backend ainda */}
          <div className="border-t border-dashed border-gray-200 pt-4 opacity-50 pointer-events-none select-none">
            <p className="text-[10px] uppercase tracking-wider text-gray-400 font-bold mb-3">Informações adicionais (em breve)</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-bold">Formato</label>
                <select disabled defaultValue="Mata-Mata"
                  className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg outline-none font-medium cursor-not-allowed">
                  <option>Mata-Mata</option>
                  <option>Pontos Corridos</option>
                </select>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-bold">Nº Equipes por Grupo</label>
                <input disabled type="number" defaultValue={4}
                  className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg outline-none font-medium cursor-not-allowed" />
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-sm font-bold block">Critérios de Pontuação</label>
              <div className="flex gap-3">
                {["Vitória", "Empate", "Derrota"].map((label, idx) => (
                  <div key={label} className="flex-1 flex flex-col gap-1">
                    <span className="text-[10px] uppercase tracking-wider font-bold text-gray-400 text-center">{label}</span>
                    <input disabled type="number" defaultValue={idx === 0 ? 3 : idx === 1 ? 1 : 0}
                      className="w-full px-2 py-2 bg-white border border-gray-200 rounded-lg text-center font-bold text-gray-400 cursor-not-allowed" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 bg-gray-50 flex justify-end gap-3 border-t border-gray-100">
          <button type="button" onClick={onClose}
            className="px-6 py-2.5 border border-gray-300 rounded-lg font-bold text-gray-700 hover:bg-white transition-colors cursor-pointer text-sm">
            Cancelar
          </button>
          <button type="submit" disabled={submitting}
            className="px-8 py-2.5 bg-[#007a33] hover:bg-[#005f27] text-white rounded-lg font-bold shadow-sm transition-all active:scale-95 cursor-pointer text-sm disabled:opacity-50 disabled:cursor-not-allowed">
            {submitting ? "Salvando..." : "Salvar Alterações"}
          </button>
        </div>
      </form>
    </div>
  );
}