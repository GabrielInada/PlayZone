"use client";

import React, { useState } from "react";
import { ContainerHeader } from "@/components/ContainerHeader";

// ── Tipos ──────────────────────────────────────────────────────────────────────
type TimeClassificacao = {
  pos: number;
  clube: string;
  pts: number;
  j: number;
  v: number;
  e: number;
  d: number;
  gp: number;
  gc: number;
  sg: number;
  pct: string;
};

type Artilheiro = {
  pos: number;
  nome: string;
  gols: number;
};

type Punicao = {
  id: number;
  jogador: string;
  clube: string;
  tipo: "Amarelo" | "Vermelho" | "Expulsão";
  motivo: string;
  partida: string;
  data: string;
};

// ── Mock ───────────────────────────────────────────────────────────────────────
const MOCK_CLASSIFICACAO: TimeClassificacao[] = [
  { pos: 1, clube: "Flamenguinho",   pts: 25, j: 18, v: 14, e: 3, d: 1, gp: 48, gc: 12, sg: 38, pct: "83%" },
  { pos: 2, clube: "PSzinho",        pts: 20, j: 18, v: 13, e: 3, d: 2, gp: 44, gc: 15, sg: 38, pct: "83%" },
  { pos: 3, clube: "Vasquinho",      pts: 19, j: 18, v: 11, e: 5, d: 3, gp: 35, gc: 18, sg: 38, pct: "83%" },
  { pos: 4, clube: "Paysanduzinho",  pts: 15, j: 18, v: 9,  e: 5, d: 3, gp: 32, gc: 20, sg: 38, pct: "83%" },
  { pos: 5, clube: "Reminho",        pts: 10, j: 18, v: 8,  e: 3, d: 3, gp: 28, gc: 22, sg: 38, pct: "83%" },
];

const MOCK_ARTILHEIROS: Artilheiro[] = [
  { pos: 1, nome: "Josias J. Marques", gols: 18 },
  { pos: 2, nome: "Marcio Aurélio",    gols: 13 },
  { pos: 3, nome: "Vini Jr",           gols: 10 },
];

const MOCK_PUNICOES: Punicao[] = [
  { id: 1, jogador: "Carlos Silva",  clube: "Flamenguinho",  tipo: "Amarelo",  motivo: "Falta violenta",        partida: "Flamenguinho x PSzinho",    data: "12/02/2025" },
  { id: 2, jogador: "André Lima",    clube: "PSzinho",       tipo: "Vermelho", motivo: "Conduta antidesportiva", partida: "PSzinho x Vasquinho",       data: "19/02/2025" },
  { id: 3, jogador: "Marcos Vieira", clube: "Vasquinho",     tipo: "Expulsão", motivo: "Agressão a adversário", partida: "Vasquinho x Paysanduzinho", data: "26/02/2025" },
  { id: 4, jogador: "Lucas Pinto",   clube: "Paysanduzinho", tipo: "Amarelo",  motivo: "Reclamação excessiva",  partida: "Paysanduzinho x Reminho",   data: "05/03/2025" },
  { id: 5, jogador: "Felipe Souza",  clube: "Reminho",       tipo: "Vermelho", motivo: "Entrada perigosa",      partida: "Reminho x Flamenguinho",    data: "12/03/2025" },
];

const BADGE_COLORS: Record<Punicao["tipo"], string> = {
  Amarelo:  "bg-yellow-100 text-yellow-800 border border-yellow-300",
  Vermelho: "bg-red-100 text-red-700 border border-red-300",
  Expulsão: "bg-gray-100 text-gray-700 border border-gray-300",
};

// ── Página ─────────────────────────────────────────────────────────────────────
export default function TabelasPage() {
  const [activeTab, setActiveTab] = useState<"classificacao" | "punicoes">("classificacao");

  return (
    <div className="bg-white min-h-screen">
      <ContainerHeader>
        {/* Container centralizado com max-w-6xl */}
        <div className="max-w-6xl mx-auto w-full px-4 md:px-6 pt-4 pb-20 text-gray-900">

          {/* Título */}
          <h1 className="text-xl md:text-3xl font-bold tracking-tight mb-4">Copa UFRA 2025</h1>

          {/* Tabs — scroll horizontal em mobile */}
          <div className="mb-6 overflow-x-auto">
            <div className="flex gap-0 border border-gray-300 rounded-lg overflow-hidden w-fit min-w-max">
              <button
                onClick={() => setActiveTab("classificacao")}
                className={`px-4 md:px-5 py-2 text-xs md:text-sm font-bold transition-colors cursor-pointer whitespace-nowrap ${
                  activeTab === "classificacao"
                    ? "bg-gray-100 text-gray-900"
                    : "bg-white text-gray-500 hover:bg-gray-50"
                }`}
              >
                Classificação e Estatística
              </button>
              <button
                onClick={() => setActiveTab("punicoes")}
                className={`px-4 md:px-5 py-2 text-xs md:text-sm font-bold transition-colors cursor-pointer border-l border-gray-300 whitespace-nowrap ${
                  activeTab === "punicoes"
                    ? "bg-gray-100 text-gray-900"
                    : "bg-white text-gray-500 hover:bg-gray-50"
                }`}
              >
                Consulta de Punições
              </button>
            </div>
          </div>

          {/* ── ABA: Classificação ── */}
          {activeTab === "classificacao" && (
            <div className="space-y-6">

              {/* Tabela de classificação */}
              <div className="border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                <div className="p-4 pb-2">
                  <h2 className="text-sm md:text-base font-bold text-gray-900">Classificação - Top 5</h2>
                  <p className="text-xs text-gray-400 font-medium mt-0.5">Atualizado em 25/11/2025 às 16:00</p>
                </div>

                {/* Scroll horizontal apenas em mobile */}
                <div className="overflow-x-auto">
                  <table className="w-full text-xs md:text-sm min-w-[480px]">
                    <thead>
                      <tr className="border-t border-gray-200">
                        <th className="text-left px-3 md:px-4 py-2 text-[9px] md:text-[10px] font-bold uppercase text-gray-500 w-10">POS</th>
                        <th className="text-left px-2 py-2 text-[9px] md:text-[10px] font-bold uppercase text-gray-500">CLUBE</th>
                        <th className="text-center px-2 py-2 text-[9px] md:text-[10px] font-bold uppercase text-gray-500">PTS</th>
                        <th className="text-center px-2 py-2 text-[9px] md:text-[10px] font-bold uppercase text-gray-500">J</th>
                        <th className="text-center px-2 py-2 text-[9px] md:text-[10px] font-bold uppercase text-gray-500">V</th>
                        <th className="text-center px-2 py-2 text-[9px] md:text-[10px] font-bold uppercase text-gray-500">E</th>
                        <th className="text-center px-2 py-2 text-[9px] md:text-[10px] font-bold uppercase text-gray-500">D</th>
                        {/* Colunas extras ocultas em telas muito pequenas */}
                        <th className="text-center px-2 py-2 text-[9px] md:text-[10px] font-bold uppercase text-gray-500 hidden sm:table-cell">GP</th>
                        <th className="text-center px-2 py-2 text-[9px] md:text-[10px] font-bold uppercase text-gray-500 hidden sm:table-cell">GC</th>
                        <th className="text-center px-2 py-2 text-[9px] md:text-[10px] font-bold uppercase text-gray-500">SG</th>
                        <th className="text-center px-2 py-2 text-[9px] md:text-[10px] font-bold uppercase text-gray-500 hidden sm:table-cell">%</th>
                      </tr>
                    </thead>
                    <tbody>
                      {MOCK_CLASSIFICACAO.map((time, i) => (
                        <tr
                          key={time.pos}
                          className={`border-t border-gray-100 ${i % 2 === 0 ? "bg-white" : "bg-gray-50/50"}`}
                        >
                          <td className="px-3 md:px-4 py-2.5 md:py-3 font-bold text-gray-700">{time.pos}º</td>
                          <td className="px-2 py-2.5 md:py-3 font-medium text-gray-900 whitespace-nowrap">{time.clube}</td>
                          <td className="px-2 py-2.5 md:py-3 text-center">
                            <span className="inline-flex items-center justify-center w-7 md:w-8 h-5 md:h-6 bg-[#007a33] text-white text-[10px] md:text-xs font-bold rounded-md">
                              {time.pts}
                            </span>
                          </td>
                          <td className="px-2 py-2.5 md:py-3 text-center font-medium text-gray-700">{time.j}</td>
                          <td className="px-2 py-2.5 md:py-3 text-center font-bold text-[#007a33]">{time.v}</td>
                          <td className="px-2 py-2.5 md:py-3 text-center font-medium text-gray-700">{time.e}</td>
                          <td className="px-2 py-2.5 md:py-3 text-center font-bold text-red-500">{time.d}</td>
                          <td className="px-2 py-2.5 md:py-3 text-center font-medium text-gray-700 hidden sm:table-cell">{time.gp}</td>
                          <td className="px-2 py-2.5 md:py-3 text-center font-medium text-gray-700 hidden sm:table-cell">{time.gc}</td>
                          <td className="px-2 py-2.5 md:py-3 text-center font-bold text-[#007a33]">+{time.sg}</td>
                          <td className="px-2 py-2.5 md:py-3 text-center font-medium text-gray-700 hidden sm:table-cell">{time.pct}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Artilharia */}
              <div>
                <h2 className="text-sm md:text-base font-bold text-gray-900 mb-3">Artilharia</h2>
                <div className="space-y-2">
                  {MOCK_ARTILHEIROS.map((artilheiro) => (
                    <div
                      key={artilheiro.pos}
                      className="flex items-center justify-between bg-gray-100 rounded-lg px-4 py-3"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-xs md:text-sm font-bold text-gray-500">{artilheiro.pos}°</span>
                        <span className="text-xs md:text-sm font-medium text-gray-800">{artilheiro.nome}</span>
                      </div>
                      <span className="text-xs md:text-sm font-bold text-gray-900">{artilheiro.gols} gols</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* ── ABA: Punições ── */}
          {activeTab === "punicoes" && (
            <div className="space-y-3">
              <h2 className="text-sm md:text-base font-bold text-gray-900">Consulta de Punições</h2>

              {/* Mobile: cards empilhados */}
              <div className="flex flex-col gap-3 md:hidden">
                {MOCK_PUNICOES.map((p) => (
                  <div key={p.id} className="border border-gray-200 rounded-xl p-4 shadow-sm space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-gray-900">{p.jogador}</span>
                      <span className={`inline-block px-2 py-0.5 rounded-md text-[11px] font-bold ${BADGE_COLORS[p.tipo]}`}>
                        {p.tipo}
                      </span>
                    </div>
                    <p className="text-xs font-medium text-gray-500">{p.clube}</p>
                    <p className="text-xs font-medium text-gray-600">{p.motivo}</p>
                    <div className="flex items-center justify-between pt-1 border-t border-gray-100">
                      <span className="text-xs text-gray-500 font-medium">{p.partida}</span>
                      <span className="text-xs text-gray-500 font-medium">{p.data}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Desktop: tabela */}
              <div className="hidden md:block border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="text-left px-4 py-3 text-[10px] font-bold uppercase text-gray-500">Jogador</th>
                      <th className="text-left px-4 py-3 text-[10px] font-bold uppercase text-gray-500">Clube</th>
                      <th className="text-center px-4 py-3 text-[10px] font-bold uppercase text-gray-500">Tipo</th>
                      <th className="text-left px-4 py-3 text-[10px] font-bold uppercase text-gray-500">Motivo</th>
                      <th className="text-left px-4 py-3 text-[10px] font-bold uppercase text-gray-500 hidden lg:table-cell">Partida</th>
                      <th className="text-center px-4 py-3 text-[10px] font-bold uppercase text-gray-500">Data</th>
                    </tr>
                  </thead>
                  <tbody>
                    {MOCK_PUNICOES.map((p, i) => (
                      <tr
                        key={p.id}
                        className={`border-t border-gray-100 ${i % 2 === 0 ? "bg-white" : "bg-gray-50/50"}`}
                      >
                        <td className="px-4 py-3 font-medium text-gray-900">{p.jogador}</td>
                        <td className="px-4 py-3 font-medium text-gray-600">{p.clube}</td>
                        <td className="px-4 py-3 text-center">
                          <span className={`inline-block px-2 py-0.5 rounded-md text-[11px] font-bold ${BADGE_COLORS[p.tipo]}`}>
                            {p.tipo}
                          </span>
                        </td>
                        <td className="px-4 py-3 font-medium text-gray-600">{p.motivo}</td>
                        <td className="px-4 py-3 font-medium text-gray-600 hidden lg:table-cell">{p.partida}</td>
                        <td className="px-4 py-3 text-center font-medium text-gray-600">{p.data}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
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