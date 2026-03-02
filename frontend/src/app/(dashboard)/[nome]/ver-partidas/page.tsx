"use client";

import React, { useEffect, useState } from "react";
import { Trophy, Trash2 } from "lucide-react";
import ModalExcluirPartida from "@/components/ModalExcluirPartida";

export default function VerPartidasPage() {
  const [partidas, setPartidas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [partidaParaExcluir, setPartidaParaExcluir] = useState<number | null>(null);

  const API_URL =
    process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

  const fetchMatches = async () => {
    try {
      const response = await fetch(`${API_URL}/match`);
      const data = await response.json();
      setPartidas(data);
    } catch (error) {
      console.error("Erro ao buscar partidas:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMatches();
  }, []);

  const handleOpenExcluir = (id: number) => {
    setPartidaParaExcluir(id);
    setIsModalOpen(true);
  };

  const handleConfirmExcluir = async () => {
    if (!partidaParaExcluir) return;

    try {
      await fetch(`${API_URL}/match/${partidaParaExcluir}`, {
        method: "DELETE",
      });

      fetchMatches();
    } catch (error) {
      console.error("Erro ao excluir partida:", error);
    } finally {
      setIsModalOpen(false);
      setPartidaParaExcluir(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-lg font-bold">Carregando partidas...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-10">
        Lista de Partidas
      </h1>

      <div className="space-y-6">
        {partidas.map((partida) => {
          const dateObj = new Date(partida.date);

          return (
            <div
              key={partida.id}
              className="rounded-xl border p-6 shadow flex justify-between items-center"
            >
              <div className="flex items-center gap-6">
                <Trophy size={22} />

                <div>
                  <p className="font-bold">
                    Time {partida.homeTeamId} x Time {partida.awayTeamId}
                  </p>
                  <p className="text-sm text-gray-500">
                    {dateObj.toLocaleDateString()} •{" "}
                    {dateObj.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                  <p className="text-sm">Status: {partida.status}</p>
                </div>
              </div>

              <button
                onClick={() => handleOpenExcluir(partida.id)}
                className="text-red-600"
              >
                <Trash2 size={18} />
              </button>
            </div>
          );
        })}
      </div>

      <ModalExcluirPartida
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirmExcluir}
      />
    </div>
  );
}