"use client";
import React, { useState, useEffect, useCallback, useMemo, ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Trash2, Pencil, Plus, Check, X, ClipboardList } from 'lucide-react';
import { SuccessModal, ErrorModal, DeleteModal } from '@/components/ModalCadastroTime';

// ── Constantes estáticas fora do componente (evita recriação a cada render) ──
const TEAM_ID = 1;
const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000";

const POSITION_MAP: Record<string, string> = {
  Goleiro: 'goleiro',
  Fixo: 'fixo',
  Ala: 'ala',
  Pivo: 'pivô',
};

const REVERSE_POSITION_MAP: Record<string, string> = {
  goleiro: 'Goleiro',
  fixo: 'Fixo',
  ala: 'Ala',
  'pivô': 'Pivo',
};

const EMPTY_PLAYER = { number: '', name: '', position: '' };

interface Player {
  id: string;
  number: string;
  name: string;
  position: string;
}

// ── Sub-componente de linha (evita re-render de linhas não editadas) ──────────
interface PlayerRowProps {
  player: Player;
  isEditing: boolean;
  tempData: Player | null;
  onEdit: (p: Player) => void;
  onSave: () => void;
  onCancel: () => void;
  onDelete: (id: string) => void;
  onTempChange: (field: keyof Player, value: string) => void;
}

const PlayerRow = React.memo<PlayerRowProps>(({
  player, isEditing, tempData, onEdit, onSave, onCancel, onDelete, onTempChange,
}) => (
  <tr className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50">
    {isEditing && tempData ? (
      <>
        <td className="p-2">
          <input
            data-testid="form-elenco-edit-numero"
            type="text"
            className="w-full border rounded p-1"
            value={tempData.number}
            onChange={(e) => onTempChange('number', e.target.value)}
          />
        </td>
        <td className="p-2">
          <input
            data-testid="form-elenco-edit-nome"
            type="text"
            className="w-full border rounded p-1"
            value={tempData.name}
            onChange={(e) => onTempChange('name', e.target.value)}
          />
        </td>
        <td className="p-2">
          <select
            data-testid="form-elenco-edit-posicao"
            className="w-full border rounded p-1 cursor-pointer"
            value={tempData.position}
            onChange={(e) => onTempChange('position', e.target.value)}
          >
            <option value="Fixo">Fixo</option>
            <option value="Ala">Ala</option>
            <option value="Pivo">Pivo</option>
            <option value="Goleiro">Goleiro</option>
          </select>
        </td>
        <td className="p-2 flex justify-center gap-2">
          <button onClick={onSave} data-testid="form-elenco-save-button" className="text-green-600 hover:bg-green-50 p-1 rounded cursor-pointer"><Check size={18} /></button>
          <button onClick={onCancel} data-testid="form-elenco-cancel-button" className="text-red-600 hover:bg-red-50 p-1 rounded cursor-pointer"><X size={18} /></button>
        </td>
      </>
    ) : (
      <>
        <td className="p-3 text-gray-800">{player.number}</td>
        <td className="p-3 text-gray-800">{player.name}</td>
        <td className="p-3 text-center text-gray-800">{player.position}</td>
        <td className="p-3 flex justify-center gap-4">
          <button onClick={() => onEdit(player)} data-testid="form-elenco-edit-button" className="text-gray-400 hover:text-black cursor-pointer"><Pencil size={16} /></button>
          <button onClick={() => onDelete(player.id)} data-testid="form-elenco-delete-button" className="text-gray-400 hover:text-red-600 cursor-pointer"><Trash2 size={16} /></button>
        </td>
      </>
    )}
  </tr>
));

PlayerRow.displayName = 'PlayerRow';

// ── Componente principal ───────────────────────────────────────────────────────
const CadastroTime: React.FC = () => {
  const router = useRouter();

  const [players, setPlayers] = useState<Player[]>([]);
  const [coachName, setCoachName] = useState('');
  const [newPlayer, setNewPlayer] = useState(EMPTY_PLAYER);
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);

  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [tempEditData, setTempEditData] = useState<Player | null>(null);
  const [playerToDeleteId, setPlayerToDeleteId] = useState<string | null>(null);

  // ── Contador memoizado ───────────────────────────────────────────────────────
  const playerCount = useMemo(() => players.length, [players]);

  // ── Fetch ────────────────────────────────────────────────────────────────────
  const loadTeamData = useCallback(async (silent = false) => {
    try {
      if (!silent) setLoadingData(true);
      const [teamRes, playersRes] = await Promise.all([
        fetch(`${API_URL}/team/${TEAM_ID}`),
        fetch(`${API_URL}/player`),
      ]);

      if (teamRes.ok) {
        const team = await teamRes.json();
        setCoachName(team.coachName || '');
      }

      if (playersRes.ok) {
        const allPlayers: any[] = await playersRes.json();
        const formatted: Player[] = allPlayers
          .filter((p) => p.teamId === TEAM_ID)
          .map((p) => ({
            id: p.id.toString(),
            number: p.shirtNumber.toString(),
            name: p.name,
            position: REVERSE_POSITION_MAP[p.position] || p.position,
          }));
        setPlayers(formatted);
      }
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
    } finally {
      setLoadingData(false);
    }
  }, []);

  useEffect(() => { loadTeamData(); }, [loadTeamData]);

  // ── Handlers memoizados ──────────────────────────────────────────────────────
  const handleInputChange = useCallback((e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewPlayer((prev) => ({ ...prev, [name]: value }));
  }, []);

  const addPlayer = useCallback(() => {
    const { name, number, position } = newPlayer;
    if (!name || !number || !position || players.length >= 10) return;
    setPlayers((prev) => [...prev, { id: Math.random().toString(36).slice(2, 11), ...newPlayer }]);
    setNewPlayer(EMPTY_PLAYER);
  }, [newPlayer, players.length]);

  const startEditing = useCallback((player: Player) => {
    setEditingId(player.id);
    setTempEditData({ ...player });
  }, []);

  const handleTempChange = useCallback((field: keyof Player, value: string) => {
    setTempEditData((prev) => prev ? { ...prev, [field]: value } : null);
  }, []);

  const cancelEdit = useCallback(() => {
    setEditingId(null);
    setTempEditData(null);
  }, []);

  const saveEdit = useCallback(async () => {
    if (!tempEditData || !editingId) return;

    if (!isNaN(Number(editingId))) {
      try {
        const res = await fetch(`${API_URL}/player/${editingId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: tempEditData.name.trim(),
            shirtNumber: parseInt(tempEditData.number, 10),
            position: POSITION_MAP[tempEditData.position],
            updatedAt: new Date().toISOString(),
          }),
        });
        if (!res.ok) throw new Error(await res.text());
      } catch (error) {
        console.error("Erro ao salvar edição:", error);
        cancelEdit();
        return;
      }
    }

    setPlayers((prev) => prev.map((p) => (p.id === editingId ? tempEditData : p)));
    cancelEdit();
  }, [tempEditData, editingId, cancelEdit]);

  const openDeleteModal = useCallback((id: string) => {
    setPlayerToDeleteId(id);
    setIsDeleteOpen(true);
  }, []);

  const confirmDeletion = useCallback(async () => {
    if (!playerToDeleteId) return;

    if (!isNaN(Number(playerToDeleteId))) {
      try {
        const res = await fetch(`${API_URL}/player/${playerToDeleteId}`, { method: "DELETE" });
        if (!res.ok) throw new Error(await res.text());
      } catch (error) {
        console.error("Erro ao deletar:", error);
        setIsDeleteOpen(false);
        setPlayerToDeleteId(null);
        return;
      }
    }

    setPlayers((prev) => prev.filter((p) => p.id !== playerToDeleteId));
    setIsDeleteOpen(false);
    setPlayerToDeleteId(null);
  }, [playerToDeleteId]);

  const handleFinalizeSelection = useCallback(async () => {
    if (playerCount < 6 || !coachName.trim()) {
      setIsErrorOpen(true);
      return;
    }

    setLoading(true);
    try {
      const teamRes = await fetch(`${API_URL}/team/${TEAM_ID}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ coachName: coachName.trim(), updatedAt: new Date().toISOString() }),
      });
      if (!teamRes.ok) console.error("Erro ao atualizar time");

      const newPlayers = players.filter((p) => isNaN(Number(p.id)));
      await Promise.all(
        newPlayers.map((player) =>
          fetch(`${API_URL}/player`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              name: player.name.trim(),
              shirtNumber: parseInt(player.number, 10),
              position: POSITION_MAP[player.position],
              teamId: TEAM_ID,
              createdAt: new Date().toISOString(),
            }),
          }).then((res) => { if (!res.ok) throw new Error(`Erro ao criar ${player.name}`); })
        )
      );

      await loadTeamData(true);
      setIsSuccessOpen(true);
    } catch (error) {
      console.error("Erro ao salvar:", error);
      setIsErrorOpen(true);
    } finally {
      setLoading(false);
    }
  }, [playerCount, coachName, players, loadTeamData]);

  // ── Render ───────────────────────────────────────────────────────────────────
  if (loadingData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Carregando dados do time...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen font-sans flex flex-col items-center p-4 md:p-6">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-md border border-gray-100 p-6 md:p-8">

        <div className="flex justify-between items-center border-b border-gray-800 pb-2 mb-6">
          <h1 className="text-lg font-bold text-black uppercase tracking-tight">Gestão de Elenco • Computação FC</h1>
          <span className="bg-gray-500 text-white px-3 py-1 rounded-md text-sm font-bold" data-testid="form-elenco-contador">
            {playerCount}/10 Jogadores Cadastrados
          </span>
        </div>

        <div className="mb-6">
          <label className="block text-xs font-bold text-gray-900 mb-1.5">
            Nome do Técnico <span className="text-red-600">*</span>
          </label>
          <input
            type="text"
            data-testid="form-tecnico-nome"
            value={coachName}
            onChange={(e) => setCoachName(e.target.value)}
            placeholder="Digite o nome do treinador..."
            className="w-full md:w-64 border border-gray-400 rounded-md p-2 text-sm outline-none focus:border-green-600"
          />
        </div>

        <div className="mb-6">
          <h2 className="text-sm font-bold text-gray-900 mb-4">Adicionar Jogadores</h2>
          <div className="flex flex-wrap items-end gap-3">
            <div className="w-16">
              <label className="block text-[10px] font-bold text-gray-700 mb-1">Nº *</label>
              <input name="number" data-testid="form-jogador-numero-input" value={newPlayer.number} onChange={handleInputChange} type="text" placeholder="Nº" className="w-full border border-gray-400 rounded-md p-2 text-xs" />
            </div>
            <div className="flex-1 min-w-[200px]">
              <label className="block text-[10px] font-bold text-gray-700 mb-1">Nome do Jogador *</label>
              <input name="name" data-testid="form-jogador-nome-input" value={newPlayer.name} onChange={handleInputChange} type="text" placeholder="Digite o nome do jogador" className="w-full border border-gray-400 rounded-md p-2 text-xs" />
            </div>
            <div className="w-40">
              <label className="block text-[10px] font-bold text-gray-700 mb-1">Posição *</label>
              <select name="position" data-testid="form-jogador-posicao-select" value={newPlayer.position} onChange={handleInputChange} className="w-full border border-gray-400 rounded-md p-2 text-xs bg-white cursor-pointer">
                <option value="">Posição do jogador</option>
                <option value="Fixo">Fixo</option>
                <option value="Ala">Ala</option>
                <option value="Pivo">Pivo</option>
                <option value="Goleiro">Goleiro</option>
              </select>
            </div>
            <div className="flex flex-col items-start gap-1">
              <button
                onClick={addPlayer}
                disabled={playerCount >= 10}
                data-testid="form-jogador-adicionar-button"
                className="bg-[#1b6928] cursor-pointer hover:bg-green-800 text-white font-bold py-2 px-5 rounded-md flex items-center gap-2 text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Plus size={14} /> Adicionar
              </button>
              {playerCount >= 10 && (
                <span className="text-[10px] text-red-500 font-medium">Limite de 10 jogadores atingido</span>
              )}
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 my-6" />

        <div className="space-y-4">
          <button className="bg-[#1b6928] text-white font-bold py-1.5 px-4 rounded-md text-[10px] uppercase cursor-pointer">
            Resumo da Equipe
          </button>
          <div className="flex items-center gap-2 bg-gray-100 w-fit p-2 rounded border border-gray-200">
            <ClipboardList size={16} className="text-gray-500" />
            <span className="text-[11px] font-medium text-gray-700" data-testid="form-resumo-tecnico">
              Técnico: <span className="font-bold">{coachName || "Não definido"}</span>
            </span>
          </div>

          <div className="overflow-hidden rounded-lg border border-gray-200">
            <table className="w-full text-left text-xs border-collapse" data-testid="form-elenco-tabela">
              <thead className="bg-gray-100 text-gray-700 font-bold border-b border-gray-200">
                <tr>
                  <th className="p-3 w-16">Nº</th>
                  <th className="p-3">Nome do Jogador</th>
                  <th className="p-3 w-32 text-center">Posição</th>
                  <th className="p-3 w-28 text-center">Ações</th>
                </tr>
              </thead>
              <tbody>
                {players.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="p-8 text-center text-gray-500">Nenhum jogador cadastrado</td>
                  </tr>
                ) : (
                  players.map((player) => (
                    <PlayerRow
                      key={player.id}
                      player={player}
                      isEditing={editingId === player.id}
                      tempData={tempEditData}
                      onEdit={startEditing}
                      onSave={saveEdit}
                      onCancel={cancelEdit}
                      onDelete={openDeleteModal}
                      onTempChange={handleTempChange}
                    />
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <button
        onClick={handleFinalizeSelection}
        disabled={loading}
        data-testid="form-actions-cadastrar"
        className="mt-6 bg-[#1b6928] hover:bg-green-800 text-white font-bold py-3 px-12 rounded-lg text-sm shadow transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
      >
        {loading ? 'Salvando...' : 'Salvar Alterações'}
      </button>

      {playerCount < 6 && (
        <p className="mt-2 text-xs text-red-500 font-medium">
          Mínimo de 6 jogadores necessários ({6 - playerCount} restante{6 - playerCount > 1 ? 's' : ''})
        </p>
      )}

      <DeleteModal
        isOpen={isDeleteOpen}
        onClose={() => { setIsDeleteOpen(false); setPlayerToDeleteId(null); }}
        onConfirm={confirmDeletion}
      />
      <SuccessModal isOpen={isSuccessOpen} onClose={() => setIsSuccessOpen(false)} />
      <ErrorModal isOpen={isErrorOpen} onClose={() => setIsErrorOpen(false)} />
    </div>
  );
};

export default CadastroTime;