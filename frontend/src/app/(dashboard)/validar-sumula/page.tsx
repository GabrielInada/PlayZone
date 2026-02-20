"use client";
import { useState } from "react";
import { CheckCircle2, XCircle, ChevronDown, ChevronUp, AlertTriangle } from "lucide-react";

// ── Tipos ─────────────────────────────────────────────────────────────────────
type Status = "pendente" | "validado" | "rejeitado";

interface PlayerSumula {
  camisa: string;
  nome: string;
  gols: number;
  time: "casa" | "fora";
}

interface Sumula {
  id: string;
  partida: string;
  placar: string;
  delegado: string;
  data: string;
  players: PlayerSumula[];
  status: Status;
}

// ── Mock ──────────────────────────────────────────────────────────────────────
const MOCK_SUMULAS: Sumula[] = [
  {
    id: "s1", partida: "Flamenguinho x PSzinho", placar: "3 x 1",
    delegado: "Carlos Menezes", data: "18/02/2025 • 18:00",
    players: [
      { camisa: "10", nome: "Felipe",  gols: 2, time: "casa" },
      { camisa: "07", nome: "Lucas",   gols: 1, time: "casa" },
      { camisa: "11", nome: "Matheus", gols: 1, time: "fora" },
    ],
    status: "pendente",
  },
  {
    id: "s2", partida: "Vasquinho x Reminho", placar: "2 x 2",
    delegado: "Ana Souza", data: "16/02/2025 • 15:00",
    players: [
      { camisa: "08", nome: "Rafael",  gols: 2, time: "casa" },
      { camisa: "16", nome: "Gabriel", gols: 2, time: "fora" },
    ],
    status: "pendente",
  },
  {
    id: "s3", partida: "Paysanduzinho x Reminho", placar: "1 x 0",
    delegado: "João Figueira", data: "14/02/2025 • 20:00",
    players: [
      { camisa: "16", nome: "Gabriel", gols: 1, time: "casa" },
    ],
    status: "validado",
  },
];

// ── Constantes ────────────────────────────────────────────────────────────────
const STATUS_CONFIG: Record<Status, { label: string; className: string }> = {
  pendente:  { label: "Pendente",  className: "bg-yellow-100 text-yellow-700 border border-yellow-200" },
  validado:  { label: "Validado",  className: "bg-emerald-100 text-emerald-700 border border-emerald-200" },
  rejeitado: { label: "Rejeitado", className: "bg-red-100 text-red-600 border border-red-200" },
};

const FILTROS: { value: Status | "todas"; label: string }[] = [
  { value: "todas",     label: "Todas" },
  { value: "pendente",  label: "Pendentes" },
  { value: "validado",  label: "Validadas" },
  { value: "rejeitado", label: "Rejeitadas" },
];

// ── Sub-componentes ───────────────────────────────────────────────────────────
function StatusBadge({ status }: { status: Status }) {
  const { label, className } = STATUS_CONFIG[status];
  return <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${className}`}>{label}</span>;
}

function OcorrenciaBadge({ children, color }: { children: React.ReactNode; color: string }) {
  return <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-md border ${color}`}>{children}</span>;
}

function ActionButtons({ id, onValidar, onRejeitar }: { id: string; onValidar: (id: string) => void; onRejeitar: (id: string) => void }) {
  return (
    <div className="flex border-t border-gray-100">
      <button onClick={() => onRejeitar(id)} className="flex-1 flex items-center justify-center gap-1.5 py-3 text-xs md:text-sm font-bold text-red-500 hover:bg-red-50 transition-colors cursor-pointer">
        <XCircle size={15} /> Rejeitar
      </button>
      <div className="w-px bg-gray-100" />
      <button onClick={() => onValidar(id)} className="flex-1 flex items-center justify-center gap-1.5 py-3 text-xs md:text-sm font-bold text-[#1b6928] hover:bg-emerald-50 transition-colors cursor-pointer">
        <CheckCircle2 size={15} /> Validar
      </button>
    </div>
  );
}

// ── Card Súmula ───────────────────────────────────────────────────────────────
function SumulaCard({ s, onValidar, onRejeitar }: { s: Sumula; onValidar: (id: string) => void; onRejeitar: (id: string) => void }) {
  const [expanded, setExpanded] = useState(false);

  const [timeCasa, timeFora] = s.partida.split(" x ").map((t) => t.trim());
  const [placarCasa, placarFora] = s.placar.split(" x ").map((n) => n.trim());
  const golsCasa = s.players.filter((p) => p.time === "casa");
  const golsFora = s.players.filter((p) => p.time === "fora");

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">

      {/* Topo — delegado + status */}
      <div className="bg-gray-50 border-b border-gray-200 px-4 py-2 flex items-center justify-between gap-2">
        <span className="text-[10px] md:text-xs font-bold text-gray-500 uppercase tracking-wide">
          Delegado: {s.delegado}
        </span>
        <StatusBadge status={s.status} />
      </div>

      {/* Data */}
      <p className="text-center text-[11px] md:text-xs text-gray-400 font-medium pt-3">{s.data}</p>

      {/* Placar central */}
      <div className="flex items-center justify-between gap-2 px-6 md:px-10 py-4">
        <span className="flex-1 text-right text-sm md:text-base font-bold text-gray-800 leading-tight">{timeCasa}</span>
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-2xl md:text-3xl font-black text-gray-900">{placarCasa}</span>
          <span className="text-lg text-gray-400 font-light">×</span>
          <span className="text-2xl md:text-3xl font-black text-gray-900">{placarFora}</span>
        </div>
        <span className="flex-1 text-left text-sm md:text-base font-bold text-gray-800 leading-tight">{timeFora}</span>
      </div>

      {/* Ver gols */}
      <button
        onClick={() => setExpanded((v) => !v)}
        className="w-full flex items-center justify-center gap-1 py-2 text-[11px] md:text-xs font-bold text-[#1b6928] hover:bg-emerald-50 transition-colors cursor-pointer border-t border-gray-100"
      >
        {expanded ? <><ChevronUp size={13} /> OCULTAR GOLS</> : <><ChevronDown size={13} /> VER GOLS</>}
      </button>

      {/* Gols por time */}
      {expanded && (
        <div className="grid grid-cols-2 divide-x divide-gray-100 border-t border-gray-100">
          {[
            { label: timeCasa, scorers: golsCasa },
            { label: timeFora, scorers: golsFora },
          ].map(({ label, scorers }) => (
            <div key={label} className="p-4">
              <p className="text-[10px] font-bold text-gray-400 uppercase mb-2 tracking-wide">{label}</p>
              {scorers.length === 0 ? (
                <p className="text-xs text-gray-300 italic">Sem gols</p>
              ) : (
                <ul className="space-y-1.5">
                  {scorers.map((p) => (
                    <li key={p.camisa} className="flex items-center justify-between gap-2">
                      <div className="min-w-0">
                        <span className="text-xs font-semibold text-gray-700 truncate block">{p.nome}</span>
                        <span className="text-[10px] text-gray-400">#{p.camisa}</span>
                      </div>
                      <span className="text-xs font-bold text-[#1b6928] shrink-0">⚽ {p.gols}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}

      {s.status === "pendente" && <ActionButtons id={s.id} onValidar={onValidar} onRejeitar={onRejeitar} />}
    </div>
  );
}

// ── Página principal ──────────────────────────────────────────────────────────
export default function ValidarSumulasPage() {
  const [sumulas, setSumulas] = useState<Sumula[]>(MOCK_SUMULAS);
  const [filtro, setFiltro] = useState<Status | "todas">("todas");

  const updateStatus = (id: string, status: Status) =>
    setSumulas((prev) => prev.map((s) => s.id === id ? { ...s, status } : s));

  const pendentesCount = sumulas.filter((s) => s.status === "pendente").length;
  const filtered = sumulas.filter((s) => filtro === "todas" || s.status === filtro);

  return (
    <div className="max-w-6xl mx-auto w-full space-y-5 p-4 md: font-sans">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-gray-800">Validar Súmulas</h1>
          <p className="text-xs md:text-sm text-gray-500 mt-0.5">Súmulas enviadas pelos delegados</p>
        </div>
        {pendentesCount > 0 && (
          <div className="flex items-center gap-1.5 bg-yellow-50 border border-yellow-200 rounded-lg px-3 py-2">
            <AlertTriangle size={14} className="text-yellow-500" />
            <span className="text-xs md:text-sm font-bold text-yellow-700">
              {pendentesCount} pendente{pendentesCount > 1 ? "s" : ""}
            </span>
          </div>
        )}
      </div>

      {/* Filtros */}
      <div className="flex gap-2 flex-wrap">
        {FILTROS.map(({ value, label }) => (
          <button
            key={value}
            onClick={() => setFiltro(value)}
            className={`text-xs md:text-sm font-bold px-4 py-2 rounded-lg border transition-colors cursor-pointer ${
              filtro === value
                ? "bg-[#1b6928] text-white border-[#1b6928]"
                : "bg-white text-gray-600 border-gray-200 hover:border-emerald-300"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Lista */}
      <div className="flex flex-col gap-4">
        {filtered.length === 0 ? (
          <div className="text-center py-16 text-sm text-gray-400">Nenhuma súmula encontrada.</div>
        ) : (
          filtered.map((s) => (
            <SumulaCard
              key={s.id}
              s={s}
              onValidar={(id) => updateStatus(id, "validado")}
              onRejeitar={(id) => updateStatus(id, "rejeitado")}
            />
          ))
        )}
      </div>

    </div>
  );
}