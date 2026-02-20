"use client";
import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { DELEGADO_ROUTE } from "@/constants/routes";

// ── Tipos ─────────────────────────────────────────────────────────────────────
interface PlayerEntry {
  id: string;
  camisa: string;
  nome: string;
  expulsao: boolean;
  cartaoAmarelo: boolean;
  cartaoVermelho: boolean;
  substituicao: boolean;
  gols: number;
}

// ── Constantes ────────────────────────────────────────────────────────────────
const GOL_OPTIONS = [0, 1, 2, 3, 4, 5];

const MOCK_PLAYERS: PlayerEntry[] = [
  { id: "1", camisa: "07", nome: "Lucas",   expulsao: false, cartaoAmarelo: false, cartaoVermelho: false, substituicao: false, gols: 0 },
  { id: "2", camisa: "08", nome: "Rafael",  expulsao: false, cartaoAmarelo: false, cartaoVermelho: false, substituicao: false, gols: 0 },
  { id: "3", camisa: "09", nome: "Thiago",  expulsao: false, cartaoAmarelo: false, cartaoVermelho: false, substituicao: false, gols: 0 },
  { id: "4", camisa: "10", nome: "Felipe",  expulsao: false, cartaoAmarelo: false, cartaoVermelho: false, substituicao: false, gols: 0 },
  { id: "5", camisa: "11", nome: "Matheus", expulsao: false, cartaoAmarelo: false, cartaoVermelho: false, substituicao: false, gols: 0 },
  { id: "6", camisa: "16", nome: "Gabriel", expulsao: false, cartaoAmarelo: false, cartaoVermelho: false, substituicao: false, gols: 0 },
];

// ── Checkbox estilizado ───────────────────────────────────────────────────────
interface StyledCheckboxProps {
  checked: boolean;
  onChange: () => void;
  color?: string;
}

function StyledCheckbox({ checked, onChange, color = "bg-[#1b6928]" }: StyledCheckboxProps) {
  return (
    <button
      type="button"
      onClick={onChange}
      className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors cursor-pointer ${
        checked ? `${color} border-transparent` : "border-gray-300 bg-white hover:border-gray-400"
      }`}
    >
      {checked && (
        <svg viewBox="0 0 10 8" className="w-3 h-3" fill="none">
          <path d="M1 4l3 3 5-6" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )}
    </button>
  );
}

// ── Componente principal ──────────────────────────────────────────────────────
export default function FormularioSumulaPage() {
  const router = useRouter();

  const [players, setPlayers] = useState<PlayerEntry[]>(MOCK_PLAYERS);
  const [motivoPunicao, setMotivoPunicao] = useState("");
  const [loadingSumula, setLoadingSumula] = useState(false);
  const [loadingPunicao, setLoadingPunicao] = useState(false);

  const toggleField = useCallback((id: string, field: keyof Omit<PlayerEntry, "id" | "camisa" | "nome" | "gols">) => {
    setPlayers((prev) => prev.map((p) => p.id === id ? { ...p, [field]: !p[field] } : p));
  }, []);

  const setGols = useCallback((id: string, gols: number) => {
    setPlayers((prev) => prev.map((p) => p.id === id ? { ...p, gols } : p));
  }, []);

  const handleEnviarSumula = useCallback(async () => {
    setLoadingSumula(true);
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000";
      console.log("Enviando súmula:", players);
      await new Promise((r) => setTimeout(r, 800));
      router.push(DELEGADO_ROUTE);
    } catch (err) {
      console.error("Erro ao enviar súmula:", err);
    } finally {
      setLoadingSumula(false);
    }
  }, [players, router]);

  const handleEnviarPunicao = useCallback(async () => {
    if (!motivoPunicao.trim()) return;
    setLoadingPunicao(true);
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000";
      console.log("Enviando punição:", { motivo: motivoPunicao, players });
      await new Promise((r) => setTimeout(r, 800));
      setMotivoPunicao("");
    } catch (err) {
      console.error("Erro ao enviar punição:", err);
    } finally {
      setLoadingPunicao(false);
    }
  }, [motivoPunicao, players]);

  return (
    <div className="max-w-6xl mx-auto w-full p-4 md:p-6 font-sans space-y-6">

      {/* Header */}
      <div>
        <h1 className="text-xl md:text-3xl font-bold text-gray-800">Formulário de envio de súmula</h1>
        <p className="text-xs md:text-sm text-gray-500 mt-0.5">Registre tudo que ocorreu no jogo</p>
      </div>

      {/* Tabela */}
      <div className="bg-white overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-separate border-spacing-y-2">
            <thead>
              <tr>
                <th className="text-left px-4 py-2 text-xs md:text-sm font-bold text-gray-600 w-40">Nº / Jogador</th>
                <th className="text-center px-4 py-2 text-xs md:text-sm font-bold text-gray-600">Expulsão</th>
                <th className="text-center px-4 py-2 text-xs md:text-sm font-bold text-amber-600">Cartão Amarelo</th>
                <th className="text-center px-4 py-2 text-xs md:text-sm font-bold text-red-600">Cartão Vermelho</th>
                <th className="text-center px-4 py-2 text-xs md:text-sm font-bold text-gray-600">Substituição</th>
                <th className="text-center px-4 py-2 text-xs md:text-sm font-bold text-[#1b6928] w-44">GOL</th>
              </tr>
            </thead>
            <tbody>
              {players.map((player) => (
                <tr key={player.id} className="bg-gray-200">
                  {/* primeira td — arredondamento esquerdo */}
                  <td className="px-4 py-3 rounded-l-xl">
                    <span className="font-bold text-gray-700 text-xs md:text-sm">Camisa {player.camisa}</span>
                    <p className="text-[10px] md:text-xs text-gray-400">{player.nome}</p>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex justify-center">
                      <StyledCheckbox checked={player.expulsao} onChange={() => toggleField(player.id, "expulsao")} color="bg-gray-700" />
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex justify-center">
                      <StyledCheckbox checked={player.cartaoAmarelo} onChange={() => toggleField(player.id, "cartaoAmarelo")} color="bg-amber-400" />
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex justify-center">
                      <StyledCheckbox checked={player.cartaoVermelho} onChange={() => toggleField(player.id, "cartaoVermelho")} color="bg-red-500" />
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex justify-center">
                      <StyledCheckbox checked={player.substituicao} onChange={() => toggleField(player.id, "substituicao")} />
                    </div>
                  </td>
                  {/* última td — arredondamento direito */}
                  <td className="px-4 py-3 rounded-r-xl">
                    <select
                      value={player.gols}
                      onChange={(e) => setGols(player.id, Number(e.target.value))}
                      className="w-full border border-gray-300 rounded-md p-1.5 text-xs md:text-sm bg-white cursor-pointer focus:border-[#1b6928] outline-none"
                    >
                      {GOL_OPTIONS.map((n) => (
                        <option key={n} value={n}>{n === 0 ? "Número de gols" : `${n} gol${n > 1 ? "s" : ""}`}</option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Ações súmula */}
        <div className="flex justify-end gap-3 p-4">
          <button
            onClick={() => router.push(DELEGADO_ROUTE)}
            className="px-5 py-2 text-sm font-bold border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 cursor-pointer transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleEnviarSumula}
            disabled={loadingSumula}
            className="px-6 py-2 text-sm font-bold bg-[#1b6928] text-white rounded-lg hover:bg-green-800 cursor-pointer transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loadingSumula ? "Enviando..." : "Enviar"}
          </button>
        </div>
      </div>

      {/* Formulário de Punição */}
      <div className="bg-white md:space-y-3">
        <div>
          <h2 className="text-sm md:text-base font-bold text-gray-800">Formulário de Punição</h2>
          <p className="text-xs text-gray-500 mt-0.5">Opcional — preencha apenas se houver ocorrência a ser punida</p>
        </div>

        <textarea
          value={motivoPunicao}
          onChange={(e) => setMotivoPunicao(e.target.value)}
          placeholder="Descreva o ocorrido em detalhes para aplicação das punições"
          rows={5}
          className="w-full border border-gray-300 rounded-lg p-3 text-xs md:text-sm text-gray-700 placeholder:text-gray-400 outline-none focus:border-[#1b6928] resize-none transition-colors"
        />

        <div className="flex justify-end">
          <button
            onClick={handleEnviarPunicao}
            disabled={loadingPunicao || !motivoPunicao.trim()}
            className="px-6 py-2.5 text-sm font-bold bg-[#1b6928] text-white rounded-lg hover:bg-green-800 cursor-pointer transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loadingPunicao ? "Enviando..." : "Enviar Punição"}
          </button>
        </div>
      </div>

    </div>
  );
}