"use client";
import { useState } from "react";
import { CheckCircle2, XCircle, ChevronDown, ChevronUp, AlertTriangle } from "lucide-react";

// ── Tipos ─────────────────────────────────────────────────────────────────────
type Status = "pendente" | "validado" | "rejeitado";
type Tab = "punicoes" | "cancelamentos";

interface PlayerOcorrencia {
  camisa: string;
  nome: string;
  expulsao: boolean;
  cartaoAmarelo: boolean;
  cartaoVermelho: boolean;
  substituicao: boolean;
  gols: number;
}

interface Punicao {
  id: string;
  partida: string;
  delegado: string;
  data: string;
  motivo: string;
  players: PlayerOcorrencia[];
  status: Status;
}

interface Cancelamento {
  id: string;
  partida: string;
  delegado: string;
  data: string;
  motivos: string[];
  detalhe: string;
  status: Status;
}

// ── Mocks ─────────────────────────────────────────────────────────────────────
const MOCK_PUNICOES: Punicao[] = [
  {
    id: "p1", partida: "Flamenguinho x PSzinho", delegado: "Carlos Menezes", data: "18/02/2025 • 18:00",
    motivo: "Confusão generalizada ao fim do segundo tempo envolvendo jogadores dos dois times e membros da comissão técnica.",
    players: [
      { camisa: "10", nome: "Felipe",  expulsao: true,  cartaoAmarelo: false, cartaoVermelho: true,  substituicao: false, gols: 1 },
      { camisa: "07", nome: "Lucas",   expulsao: false, cartaoAmarelo: true,  cartaoVermelho: false, substituicao: true,  gols: 0 },
      { camisa: "11", nome: "Matheus", expulsao: true,  cartaoAmarelo: false, cartaoVermelho: true,  substituicao: false, gols: 2 },
    ],
    status: "pendente",
  },
  {
    id: "p2", partida: "Vasquinho x Reminho", delegado: "Ana Souza", data: "16/02/2025 • 15:00",
    motivo: "Campo alagado impossibilitou a continuidade da partida aos 32 minutos do segundo tempo.",
    players: [
      { camisa: "08", nome: "Rafael", expulsao: false, cartaoAmarelo: true,  cartaoVermelho: false, substituicao: false, gols: 3 },
      { camisa: "09", nome: "Thiago", expulsao: false, cartaoAmarelo: false, cartaoVermelho: false, substituicao: true,  gols: 1 },
    ],
    status: "pendente",
  },
  {
    id: "p3", partida: "Paysanduzinho x Reminho", delegado: "João Figueira", data: "14/02/2025 • 20:00",
    motivo: "Temperatura de 41°C. Time visitante recusou continuar após intervalo.",
    players: [
      { camisa: "16", nome: "Gabriel", expulsao: false, cartaoAmarelo: true,  cartaoVermelho: false, substituicao: false, gols: 0 },
      { camisa: "09", nome: "Thiago",  expulsao: true,  cartaoAmarelo: false, cartaoVermelho: true,  substituicao: false, gols: 1 },
    ],
    status: "validado",
  },
];

const MOCK_CANCELAMENTOS: Cancelamento[] = [
  {
    id: "c1", partida: "Flamenguinho x PSzinho", delegado: "Carlos Menezes", data: "18/02/2025 • 18:00",
    motivos: ["Briga Generalizada", "W.O."],
    detalhe: "Confusão generalizada ao fim do segundo tempo. Time visitante se recusou a continuar a partida após briga entre jogadores.",
    status: "pendente",
  },
  {
    id: "c2", partida: "Vasquinho x Reminho", delegado: "Ana Souza", data: "16/02/2025 • 15:00",
    motivos: ["Chuva Forte"],
    detalhe: "Campo alagado impossibilitou a continuidade da partida aos 32 minutos do segundo tempo.",
    status: "pendente",
  },
  {
    id: "c3", partida: "PSzinho x Paysanduzinho", delegado: "Ricardo Lima", data: "12/02/2025 • 19:00",
    motivos: ["Calor Excessivo", "W.O."],
    detalhe: "Temperatura de 41°C. Time visitante recusou continuar após o intervalo alegando risco à saúde dos jogadores.",
    status: "rejeitado",
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

// ── Sub-componentes compartilhados ────────────────────────────────────────────
function StatusBadge({ status }: { status: Status }) {
  const { label, className } = STATUS_CONFIG[status];
  return <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${className}`}>{label}</span>;
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

function OcorrenciaBadge({ children, color }: { children: React.ReactNode; color: string }) {
  return <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-md border ${color}`}>{children}</span>;
}

// ── Card Punição ──────────────────────────────────────────────────────────────
function PunicaoCard({ p, onValidar, onRejeitar }: { p: Punicao; onValidar: (id: string) => void; onRejeitar: (id: string) => void }) {
  const [expanded, setExpanded] = useState(false);

  const totalAmarelos  = p.players.filter((pl) => pl.cartaoAmarelo).length;
  const totalVermelhos = p.players.filter((pl) => pl.cartaoVermelho).length;
  const totalExpulsoes = p.players.filter((pl) => pl.expulsao).length;

  return (
    <div className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">
      <div className="flex items-start justify-between gap-3 p-4 md:p-5">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="text-sm md:text-base font-bold text-gray-800">{p.partida}</p>
            <StatusBadge status={p.status} />
          </div>
          <p className="text-[11px] md:text-xs text-gray-500 mt-0.5">
            Delegado: <span className="font-semibold">{p.delegado}</span> • {p.data}
          </p>
          <div className="flex flex-wrap gap-1.5 mt-2.5">
            {totalAmarelos > 0  && <span className="text-[10px] md:text-xs font-semibold bg-amber-50 border border-amber-200 text-amber-700 px-2 py-0.5 rounded-md">🟨 {totalAmarelos} amarelo{totalAmarelos > 1 ? "s" : ""}</span>}
            {totalVermelhos > 0 && <span className="text-[10px] md:text-xs font-semibold bg-red-50 border border-red-200 text-red-600 px-2 py-0.5 rounded-md">🟥 {totalVermelhos} vermelho{totalVermelhos > 1 ? "s" : ""}</span>}
            {totalExpulsoes > 0 && <span className="text-[10px] md:text-xs font-semibold bg-gray-100 border border-gray-300 text-gray-700 px-2 py-0.5 rounded-md">🚫 {totalExpulsoes} expulsão{totalExpulsoes > 1 ? "s" : ""}</span>}
          </div>
        </div>
        <button onClick={() => setExpanded((v) => !v)} className="shrink-0 mt-0.5 text-gray-400 hover:text-gray-700 cursor-pointer transition-colors">
          {expanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </button>
      </div>

      {expanded && (
        <div className="border-t border-gray-50">
          <div className="overflow-x-auto">
            <table className="w-full text-xs border-collapse">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="text-left px-3 py-2 text-[10px] font-bold text-gray-500 uppercase">Jogador</th>
                  <th className="text-left px-3 py-2 text-[10px] font-bold text-gray-500 uppercase">Ocorrências</th>
                </tr>
              </thead>
              <tbody>
                {p.players.map((pl) => {
                  const tags: React.ReactNode[] = [];
                  if (pl.expulsao)       tags.push(<OcorrenciaBadge key="e"  color="bg-gray-100 border-gray-300 text-gray-700">Expulsão</OcorrenciaBadge>);
                  if (pl.cartaoAmarelo)  tags.push(<OcorrenciaBadge key="ca" color="bg-amber-50 border-amber-300 text-amber-700">C. Amarelo</OcorrenciaBadge>);
                  if (pl.cartaoVermelho) tags.push(<OcorrenciaBadge key="cv" color="bg-red-50 border-red-300 text-red-600">C. Vermelho</OcorrenciaBadge>);
                  if (pl.substituicao)   tags.push(<OcorrenciaBadge key="s"  color="bg-blue-50 border-blue-200 text-blue-600">Substituição</OcorrenciaBadge>);
                  return (
                    <tr key={pl.camisa} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50">
                      <td className="px-3 py-2">
                        <span className="font-bold text-gray-700">Camisa {pl.camisa}</span>
                        <p className="text-[10px] text-gray-400">{pl.nome}</p>
                      </td>
                      <td className="px-3 py-2">
                        <div className="flex flex-wrap gap-1">{tags.length ? tags : <span className="text-[10px] text-gray-300">—</span>}</div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="px-4 md:px-5 py-3 border-t border-gray-50">
            <p className="text-[10px] md:text-xs font-bold text-gray-500 uppercase mb-1">Motivo da Punição</p>
            <p className="text-xs md:text-sm text-gray-600 leading-relaxed">{p.motivo}</p>
          </div>
        </div>
      )}

      {p.status === "pendente" && <ActionButtons id={p.id} onValidar={onValidar} onRejeitar={onRejeitar} />}
    </div>
  );
}

// ── Card Cancelamento ─────────────────────────────────────────────────────────
function CancelamentoCard({ c, onValidar, onRejeitar }: { c: Cancelamento; onValidar: (id: string) => void; onRejeitar: (id: string) => void }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">
      <div className="flex items-start justify-between gap-3 p-4 md:p-5">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="text-sm md:text-base font-bold text-gray-800">{c.partida}</p>
            <StatusBadge status={c.status} />
          </div>
          <p className="text-[11px] md:text-xs text-gray-500 mt-0.5">
            Delegado: <span className="font-semibold">{c.delegado}</span> • {c.data}
          </p>
          <div className="flex flex-wrap gap-1.5 mt-2">
            {c.motivos.map((m) => (
              <span key={m} className="text-[10px] md:text-xs font-semibold bg-gray-100 border border-gray-200 text-gray-600 px-2 py-0.5 rounded-md">{m}</span>
            ))}
          </div>
        </div>
        <button onClick={() => setExpanded((v) => !v)} className="shrink-0 mt-0.5 text-gray-400 hover:text-gray-700 cursor-pointer transition-colors">
          {expanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </button>
      </div>

      {expanded && (
        <div className="px-4 md:px-5 py-3 border-t border-gray-50">
          <p className="text-[10px] md:text-xs font-bold text-gray-500 uppercase mb-1">Detalhe</p>
          <p className="text-xs md:text-sm text-gray-600 leading-relaxed">{c.detalhe}</p>
        </div>
      )}

      {c.status === "pendente" && <ActionButtons id={c.id} onValidar={onValidar} onRejeitar={onRejeitar} />}
    </div>
  );
}

// ── Página principal ──────────────────────────────────────────────────────────
export default function ValidarOcorrenciasPage() {
  const [activeTab, setActiveTab] = useState<Tab>("punicoes");
  const [punicoes, setPunicoes] = useState<Punicao[]>(MOCK_PUNICOES);
  const [cancelamentos, setCancelamentos] = useState<Cancelamento[]>(MOCK_CANCELAMENTOS);
  const [filtroPunicoes, setFiltroPunicoes] = useState<Status | "todas">("todas");
  const [filtroCancelamentos, setFiltroCancelamentos] = useState<Status | "todas">("todas");

  const updatePunicao = (id: string, status: Status) =>
    setPunicoes((prev) => prev.map((p) => p.id === id ? { ...p, status } : p));

  const updateCancelamento = (id: string, status: Status) =>
    setCancelamentos((prev) => prev.map((c) => c.id === id ? { ...c, status } : c));

  const pendentePunicoes      = punicoes.filter((p) => p.status === "pendente").length;
  const pendenteCancelamentos = cancelamentos.filter((c) => c.status === "pendente").length;
  const totalPendentes        = pendentePunicoes + pendenteCancelamentos;

  const filteredPunicoes      = punicoes.filter((p) => filtroPunicoes === "todas" || p.status === filtroPunicoes);
  const filteredCancelamentos = cancelamentos.filter((c) => filtroCancelamentos === "todas" || c.status === filtroCancelamentos);

  const filtroAtivo    = activeTab === "punicoes" ? filtroPunicoes : filtroCancelamentos;
  const setFiltroAtivo = activeTab === "punicoes" ? setFiltroPunicoes : setFiltroCancelamentos;

  return (
    <div className="max-w-6xl mx-auto w-full space-y-5 p-4 md:p-6 font-sans">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-gray-800">Validar Ocorrências</h1>
          <p className="text-xs md:text-sm text-gray-500 mt-0.5">Solicitações enviadas pelos delegados</p>
        </div>
        {totalPendentes > 0 && (
          <div className="flex items-center gap-1.5 bg-yellow-50 border border-yellow-200 rounded-lg px-3 py-2">
            <AlertTriangle size={14} className="text-yellow-500" />
            <span className="text-xs md:text-sm font-bold text-yellow-700">{totalPendentes} pendente{totalPendentes > 1 ? "s" : ""}</span>
          </div>
        )}
      </div>

      {/* Tabs + Filtros — lado a lado */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex gap-1 bg-gray-100 p-1 rounded-xl w-fit">
          {([
            { value: "punicoes",      label: "Punições",      count: pendentePunicoes },
            { value: "cancelamentos", label: "Cancelamentos", count: pendenteCancelamentos },
          ] as { value: Tab; label: string; count: number }[]).map(({ value, label, count }) => (
            <button
              key={value}
              onClick={() => setActiveTab(value)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs md:text-sm font-bold transition-all cursor-pointer ${
                activeTab === value ? "bg-white text-gray-800 shadow-sm" : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {label}
              {count > 0 && (
                <span className="bg-yellow-400 text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full">{count}</span>
              )}
            </button>
          ))}
        </div>

        <div className="flex gap-2 flex-wrap">
          {FILTROS.map(({ value, label }) => (
            <button
              key={value}
              onClick={() => setFiltroAtivo(value)}
              className={`text-xs md:text-sm font-bold px-4 py-2 rounded-lg border transition-colors cursor-pointer ${
                filtroAtivo === value
                  ? "bg-[#1b6928] text-white border-[#1b6928]"
                  : "bg-white text-gray-600 border-gray-200 hover:border-emerald-300"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Listas */}
      <div className="flex flex-col gap-4">
        {activeTab === "punicoes" ? (
          filteredPunicoes.length === 0 ? (
            <div className="text-center py-16 text-sm text-gray-400">Nenhuma punição encontrada.</div>
          ) : (
            filteredPunicoes.map((p) => (
              <PunicaoCard key={p.id} p={p} onValidar={(id) => updatePunicao(id, "validado")} onRejeitar={(id) => updatePunicao(id, "rejeitado")} />
            ))
          )
        ) : (
          filteredCancelamentos.length === 0 ? (
            <div className="text-center py-16 text-sm text-gray-400">Nenhum cancelamento encontrado.</div>
          ) : (
            filteredCancelamentos.map((c) => (
              <CancelamentoCard key={c.id} c={c} onValidar={(id) => updateCancelamento(id, "validado")} onRejeitar={(id) => updateCancelamento(id, "rejeitado")} />
            ))
          )
        )}
      </div>

    </div>
  );
}