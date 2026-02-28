"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck, CheckCircle, AlertCircle, Loader2, Trash2 } from "lucide-react";

// ── ATENÇÃO: página apenas para desenvolvimento/testes ────────────────────────
// Salve em: app/dev/setup/page.tsx
// Delete ou proteja antes de ir para produção.

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000";

type Status = "idle" | "loading" | "success" | "error";

interface LogEntry {
  type: "info" | "success" | "error";
  message: string;
}

export default function DevSetupPage() {
  const router = useRouter();
  const [status, setStatus] = useState<Status>("idle");
  const [log, setLog] = useState<LogEntry[]>([]);
  const [createdClub, setCreatedClub] = useState<any>(null);
  const [ownerUserId, setOwnerUserId] = useState("2"); // ID de um usuário com type: "clube"

  const addLog = (type: LogEntry["type"], message: string) =>
    setLog((prev) => [...prev, { type, message }]);

  const handleSetup = async () => {
    setStatus("loading");
    setLog([]);
    setCreatedClub(null);

    try {
      // 1. Cria o clube — POST /club só precisa de name e badgeImage
      addLog("info", 'Criando clube "Computação FC"...');
      const createRes = await fetch(`${API_URL}/club`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "Computação FC",
          badgeImage: "https://placehold.co/100x100/1b6928/white?text=CF",
          ownerUserId: parseInt(ownerUserId, 10),
        }),
      });

      if (!createRes.ok) {
        const err = await createRes.text();
        throw new Error(`POST /club falhou (${createRes.status}): ${err}`);
      }

      const club = await createRes.json();
      addLog("success", `Clube criado! ID: ${club.id} | Nome: "${club.name}"`);
      addLog("info", `⚠ Anote o ID ${club.id} e coloque em CLUB_ID no cadastrar-time-page.tsx`);
      setCreatedClub(club);

      // 2. Verifica times vinculados
      addLog("info", "Verificando times do clube...");
      const teamsRes = await fetch(`${API_URL}/team`);
      if (teamsRes.ok) {
        const allTeams = await teamsRes.json();
        const existing = allTeams.find((t: any) => t.clubId === club.id);
        if (existing) {
          addLog("success", `Time encontrado: "${existing.name}" (ID: ${existing.id})`);
        } else {
          addLog("info", 'Sem times — a página de elenco criará o "Elenco Principal" automaticamente.');
        }
      }

      setStatus("success");
    } catch (err: any) {
      addLog("error", err.message ?? "Erro desconhecido");
      setStatus("error");
    }
  };

  const handleCleanup = async () => {
    if (!createdClub) return;
    setStatus("loading");
    try {
      addLog("info", `Deletando clube ID: ${createdClub.id}...`);
      const res = await fetch(`${API_URL}/club/${createdClub.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error(`DELETE /club/${createdClub.id} falhou (${res.status})`);
      addLog("success", "Clube deletado.");
      setCreatedClub(null);
      setStatus("idle");
    } catch (err: any) {
      addLog("error", err.message);
      setStatus("error");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-md border border-gray-200 p-8">

        {/* Header */}
        <div className="flex items-center gap-3 mb-2">
          <div className="w-9 h-9 rounded-full bg-amber-500 flex items-center justify-center shrink-0">
            <ShieldCheck size={18} className="text-white" />
          </div>
          <div>
            <h1 className="text-base font-bold text-gray-900">Setup de Testes</h1>
            <p className="text-xs text-amber-600 font-medium">⚠ Apenas para desenvolvimento</p>
          </div>
        </div>

        <p className="text-sm text-gray-500 mb-4 mt-3">
          Cria um clube de teste via <code className="bg-gray-100 px-1.5 py-0.5 rounded text-xs font-mono">POST /club</code>.
          Após criar, copie o <strong>ID</strong> retornado e coloque na constante{" "}
          <code className="bg-gray-100 px-1.5 py-0.5 rounded text-xs font-mono">CLUB_ID</code> da página de elenco.
        </p>

        {/* ownerUserId */}
        <div className="mb-5">
          <label className="block text-xs font-bold text-gray-700 mb-1">
            ownerUserId <span className="text-red-500">*</span>
            <span className="text-gray-400 font-normal ml-1">(ID do usuário dono do clube)</span>
          </label>
          <input
            type="number"
            min={1}
            value={ownerUserId}
            onChange={(e) => setOwnerUserId(e.target.value)}
            className="w-32 border border-gray-300 rounded-md p-2 text-sm outline-none focus:border-[#1b6928] transition-colors"
            placeholder="Ex: 1"
          />
          <p className="text-[10px] text-gray-400 mt-1">
            ⚠ O usuário deve ter <code className="font-mono">type: "clube"</code> no banco — caso contrário o POST retorna 400.
          </p>
        </div>

        {/* Ações */}
        <div className="flex gap-3 mb-6">
          <button
            onClick={handleSetup}
            disabled={status === "loading"}
            className="flex-1 bg-[#1b6928] hover:bg-green-800 text-white font-bold py-2.5 px-4 rounded-lg text-sm flex items-center justify-center gap-2 cursor-pointer transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {status === "loading" ? (
              <><Loader2 size={15} className="animate-spin" /> Configurando...</>
            ) : (
              <><ShieldCheck size={15} /> Criar Clube de Teste</>
            )}
          </button>

          {createdClub && (
            <button
              onClick={handleCleanup}
              disabled={status === "loading"}
              className="flex items-center gap-1.5 border border-red-200 text-red-500 hover:bg-red-50 font-bold py-2.5 px-4 rounded-lg text-sm cursor-pointer transition-colors disabled:opacity-50"
            >
              <Trash2 size={14} /> Limpar
            </button>
          )}
        </div>

        {/* Log */}
        {log.length > 0 && (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-5 space-y-1.5 max-h-48 overflow-y-auto">
            {log.map((entry, i) => (
              <p key={i} className={`text-xs font-mono flex items-start gap-1.5 ${
                entry.type === "success" ? "text-green-700" :
                entry.type === "error"   ? "text-red-600"   : "text-gray-500"
              }`}>
                <span className="mt-0.5 shrink-0">
                  {entry.type === "success" ? "✓" : entry.type === "error" ? "✗" : "›"}
                </span>
                {entry.message}
              </p>
            ))}
          </div>
        )}

        {/* Resultado com o ID em destaque */}
        {status === "success" && createdClub && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-5">
            <div className="flex items-center gap-2 mb-3">
              <CheckCircle size={16} className="text-green-600" />
              <span className="text-sm font-bold text-green-700">Clube criado com sucesso!</span>
            </div>
            <div className="space-y-1 text-xs text-green-800 font-mono mb-3">
              <p>ID:   <strong className="text-lg text-green-900">{createdClub.id}</strong></p>
              <p>Nome: {createdClub.name}</p>
            </div>
            <div className="bg-green-100 rounded-md p-3 text-xs text-green-900 font-mono border border-green-200">
              {`// cadastrar-time-page.tsx`}<br />
              {`const CLUB_ID = ${createdClub.id};`}
            </div>
          </div>
        )}

        {status === "error" && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-5 flex items-center gap-2">
            <AlertCircle size={16} className="text-red-500 shrink-0" />
            <p className="text-sm text-red-600 font-medium">Algo deu errado. Veja o log acima.</p>
          </div>
        )}

        {/* Navegação */}
        <div className="pt-4 border-t border-gray-100">
          <button
            onClick={() => router.push("/time")}
            disabled={status !== "success"}
            className="w-full border border-[#1b6928] text-[#1b6928] hover:bg-green-50 font-bold py-2.5 px-4 rounded-lg text-sm cursor-pointer transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Ir para Gestão de Elenco →
          </button>
        </div>
      </div>

      <p className="mt-4 text-xs text-gray-400 text-center">
        Delete este arquivo antes de subir para produção:<br />
        <code className="font-mono">app/dev/setup/page.tsx</code>
      </p>
    </div>
  );
}