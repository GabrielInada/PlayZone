"use client";
import React, { useState, useEffect, useCallback, useMemo, ChangeEvent } from 'react';
import { Trash2, Pencil, Plus, Check, X, PlusCircle, ShieldCheck, Loader2 } from 'lucide-react';
import { SuccessModal, ErrorModal, DeleteModal } from '@/components/ModalCadastroTime';

// ── Constantes ────────────────────────────────────────────────────────────────
const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "https://play-zone-omega.vercel.app";

// TODO: em produção, substituir pelo clubId vindo da sessão do usuário logado.
// O clube só pode ser criado por usuários com type: "clube" no banco de dados.
// Use a página /dev/setup para criar um clube de teste e obter o ID.
const CLUB_ID = 1;

const POSITION_MAP: Record<string, string> = {
  Goleiro: 'goleiro', Fixo: 'fixo', Ala: 'ala', Pivo: 'pivô',
};
const REVERSE_POSITION_MAP: Record<string, string> = {
  goleiro: 'Goleiro', fixo: 'Fixo', ala: 'Ala', 'pivô': 'Pivo',
};

const EMPTY_PLAYER = { number: '', name: '', position: '' };

// ── Tipos ─────────────────────────────────────────────────────────────────────
interface Club {
  id: number;
  name: string;
  badgeImage: string;
}

interface Team {
  id: number;
  name: string;
  coachName: string;
  isPrimary: boolean;
}

interface Player {
  id: string;
  number: string;
  name: string;
  position: string;
}

const isTempId = (id: string) => isNaN(Number(id));

// ── Sub-componente: linha da tabela ───────────────────────────────────────────
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
          <input data-testid="form-elenco-edit-numero" type="text"
            className="w-full border rounded p-1 text-xs" value={tempData.number}
            onChange={(e) => onTempChange('number', e.target.value)} />
        </td>
        <td className="p-2">
          <input data-testid="form-elenco-edit-nome" type="text"
            className="w-full border rounded p-1 text-xs" value={tempData.name}
            onChange={(e) => onTempChange('name', e.target.value)} />
        </td>
        <td className="p-2">
          <select data-testid="form-elenco-edit-posicao"
            className="w-full border rounded p-1 text-xs cursor-pointer"
            value={tempData.position} onChange={(e) => onTempChange('position', e.target.value)}>
            <option value="Fixo">Fixo</option>
            <option value="Ala">Ala</option>
            <option value="Pivo">Pivo</option>
            <option value="Goleiro">Goleiro</option>
          </select>
        </td>
        <td className="p-2">
          <div className="flex justify-center gap-2">
            <button onClick={onSave} data-testid="form-elenco-save-button"
              className="text-green-600 hover:bg-green-50 p-1 rounded cursor-pointer"><Check size={16} /></button>
            <button onClick={onCancel} data-testid="form-elenco-cancel-button"
              className="text-red-500 hover:bg-red-50 p-1 rounded cursor-pointer"><X size={16} /></button>
          </div>
        </td>
      </>
    ) : (
      <>
        <td className="p-3 text-gray-800 text-xs">{player.number}</td>
        <td className="p-3 text-gray-800 text-xs">{player.name}</td>
        <td className="p-3 text-center text-gray-800 text-xs">{player.position}</td>
        <td className="p-3">
          <div className="flex justify-center gap-4">
            <button onClick={() => onEdit(player)} data-testid="form-elenco-edit-button"
              className="text-gray-400 hover:text-black cursor-pointer"><Pencil size={14} /></button>
            <button onClick={() => onDelete(player.id)} data-testid="form-elenco-delete-button"
              className="text-gray-400 hover:text-red-600 cursor-pointer"><Trash2 size={14} /></button>
          </div>
        </td>
      </>
    )}
  </tr>
));
PlayerRow.displayName = 'PlayerRow';

// ── Componente principal ──────────────────────────────────────────────────────
const CadastroTime: React.FC = () => {
  const [club, setClub] = useState<Club | null>(null);
  const [teams, setTeams] = useState<Team[]>([]);
  const [activeTeamId, setActiveTeamId] = useState<number | null>(null);
  const [novoTimeInput, setNovoTimeInput] = useState(false);
  const [novoTimeName, setNovoTimeName] = useState('');
  const [creatingTeam, setCreatingTeam] = useState(false);
  const [deletingTeamId, setDeletingTeamId] = useState<number | null>(null);
  const [players, setPlayers] = useState<Player[]>([]);
  const [coachName, setCoachName] = useState('');
  const [newPlayer, setNewPlayer] = useState(EMPTY_PLAYER);
  const [loadingData, setLoadingData] = useState(true);
  const [loading, setLoading] = useState(false);
  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [tempEditData, setTempEditData] = useState<Player | null>(null);
  const [playerToDeleteId, setPlayerToDeleteId] = useState<string | null>(null);

  const playerCount = useMemo(() => players.length, [players]);
  const activeTeam  = useMemo(() => teams.find((t) => t.id === activeTeamId) ?? null, [teams, activeTeamId]);

  // ── 1. GET /club/{id} — busca o clube pelo ID fixo (virá da sessão futuramente) ──
  const loadClub = useCallback(async (): Promise<Club | null> => {
    try {
      const res = await fetch(`${API_URL}/club/${CLUB_ID}`);
      if (!res.ok) return null;
      const club: Club = await res.json();
      setClub(club);
      return club;
    } catch (err) {
      console.error("Erro ao carregar clube:", err);
      return null;
    }
  }, []);

  // ── 2. GET /team — filtra por clubId ─────────────────────────────────────
  // Retorna os times do clube sem criar nada automaticamente.
  // O "Elenco Principal" só é criado quando o usuário clica em
  // "Novo Time" pela primeira vez (ver handleCreateTeam).
  const loadTeams = useCallback(async (clubId: number): Promise<Team[]> => {
    try {
      const res = await fetch(`${API_URL}/team`);
      if (!res.ok) return [];
      const all: any[] = await res.json();

      const myTeams: Team[] = all
        .filter((t) => t.clubId === clubId)
        .map((t, index) => ({
          id: t.id,
          name: t.name,
          coachName: t.coachName ?? '',
          isPrimary: index === 0,
        }));

      return myTeams;
    } catch (err) {
      console.error("Erro ao carregar times:", err);
      return [];
    }
  }, []);

  // ── 3. GET /player — filtra por teamId ────────────────────────────────────
  const loadPlayers = useCallback(async (teamId: number, silent = false) => {
    try {
      if (!silent) setLoadingData(true);
      const res = await fetch(`${API_URL}/player`);
      if (!res.ok) return;
      const all: any[] = await res.json();
      setPlayers(
        all.filter((p) => p.teamId === teamId).map((p) => ({
          id: p.id.toString(),
          number: p.shirtNumber.toString(),
          name: p.name,
          position: REVERSE_POSITION_MAP[p.position] || p.position,
        }))
      );
    } catch (err) {
      console.error("Erro ao carregar jogadores:", err);
    } finally {
      if (!silent) setLoadingData(false);
    }
  }, []);

  // ── Inicialização: clube → times → jogadores ──────────────────────────────
  useEffect(() => {
    (async () => {
      setLoadingData(true);
      const myClub = await loadClub();
      if (!myClub) { setLoadingData(false); return; }

      const myTeams = await loadTeams(myClub.id);
      setTeams(myTeams);

      if (myTeams.length > 0) {
        const first = myTeams[0];
        setActiveTeamId(first.id);
        setCoachName(first.coachName);
        await loadPlayers(first.id, true);
      }
      setLoadingData(false);
    })();
  }, []);

  const handleTabChange = useCallback((teamId: number) => {
    if (teamId === activeTeamId) return;
    const team = teams.find((t) => t.id === teamId);
    setActiveTeamId(teamId);
    setCoachName(team?.coachName ?? '');
    setPlayers([]);
    setEditingId(null);
    setTempEditData(null);
    loadPlayers(teamId);
  }, [activeTeamId, teams, loadPlayers]);

  const handleCreateTeam = useCallback(async (name: string) => {
    if (!club || creatingTeam) return;
    setCreatingTeam(true);
    try {
      // Se ainda não existe nenhum time no clube, o primeiro criado
      // é sempre o "Elenco Principal" — independente do nome digitado.
      const isFirst  = teams.length === 0;
      const teamName = isFirst ? "Elenco Principal" : name;

      const res = await fetch(`${API_URL}/team`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: teamName, clubId: club.id, coachName: "",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }),
      });
      if (!res.ok) throw new Error(await res.text());
      const created = await res.json();

      const newTeam = { id: created.id, name: created.name, coachName: '', isPrimary: isFirst };
      setTeams((prev) => [...prev, newTeam]);
      setActiveTeamId(created.id);
      setCoachName('');
      setPlayers([]);
    } catch (err) {
      console.error("Erro ao criar time:", err);
    } finally {
      setCreatingTeam(false);
    }
  }, [club, teams.length, creatingTeam]);

  const handleDeleteTeam = useCallback(async (teamId: number) => {
    // Regra de negócio: o Elenco Principal nunca pode ser excluído
    const target = teams.find((t) => t.id === teamId);
    if (!target || target.isPrimary || deletingTeamId) return;

    setDeletingTeamId(teamId);
    try {
      const res = await fetch(`${API_URL}/team/${teamId}`, { method: "DELETE" });
      if (!res.ok) throw new Error(await res.text());
      const primaryId = teams.find((t) => t.isPrimary)?.id ?? null;
      setTeams((prev) => prev.filter((t) => t.id !== teamId));
      if (activeTeamId === teamId) {
        setActiveTeamId(primaryId);
        const primary = teams.find((t) => t.isPrimary);
        setCoachName(primary?.coachName ?? '');
        if (primaryId) loadPlayers(primaryId);
      }
    } catch (err) {
      console.error("Erro ao excluir time:", err);
    } finally {
      setDeletingTeamId(null);
    }
  }, [teams, activeTeamId, loadPlayers, deletingTeamId]);

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

  const startEditing     = useCallback((p: Player) => { setEditingId(p.id); setTempEditData({ ...p }); }, []);
  const cancelEdit       = useCallback(() => { setEditingId(null); setTempEditData(null); }, []);
  const handleTempChange = useCallback((field: keyof Player, value: string) => {
    setTempEditData((prev) => prev ? { ...prev, [field]: value } : null);
  }, []);

  const saveEdit = useCallback(async () => {
    if (!tempEditData || !editingId) return;
    if (!isTempId(editingId)) {
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
      } catch (err) {
        console.error("Erro ao salvar edição:", err);
        cancelEdit();
        return;
      }
    }
    setPlayers((prev) => prev.map((p) => (p.id === editingId ? tempEditData : p)));
    cancelEdit();
  }, [tempEditData, editingId, cancelEdit]);

  const openDeleteModal = useCallback((id: string) => { setPlayerToDeleteId(id); setIsDeleteOpen(true); }, []);

  const confirmDeletion = useCallback(async () => {
    if (!playerToDeleteId) return;
    if (!isTempId(playerToDeleteId)) {
      try {
        const res = await fetch(`${API_URL}/player/${playerToDeleteId}`, { method: "DELETE" });
        if (!res.ok) throw new Error(await res.text());
      } catch (err) {
        console.error("Erro ao deletar jogador:", err);
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
    if (!activeTeamId || playerCount < 6 || !coachName.trim()) {
      setIsErrorOpen(true);
      return;
    }
    setLoading(true);
    try {
      const updateRes = await fetch(`${API_URL}/team/${activeTeamId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ coachName: coachName.trim(), updatedAt: new Date().toISOString() }),
      });
      if (!updateRes.ok) throw new Error(await updateRes.text());
      setTeams((prev) => prev.map((t) => t.id === activeTeamId ? { ...t, coachName: coachName.trim() } : t));

      const newPlayers = players.filter((p) => isTempId(p.id));
      await Promise.all(
        newPlayers.map((player) =>
          fetch(`${API_URL}/player`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              name: player.name.trim(),
              shirtNumber: parseInt(player.number, 10),
              position: POSITION_MAP[player.position],
              teamId: activeTeamId,
              createdAt: new Date().toISOString(),
            }),
          }).then(async (res) => {
            if (!res.ok) throw new Error(`Erro ao criar ${player.name}: ${await res.text()}`);
          })
        )
      );

      await loadPlayers(activeTeamId, true);
      setIsSuccessOpen(true);
    } catch (err) {
      console.error("Erro ao salvar:", err);
      setIsErrorOpen(true);
    } finally {
      setLoading(false);
    }
  }, [activeTeamId, playerCount, coachName, players, loadPlayers]);

  // ── Loading ───────────────────────────────────────────────────────────────
  if (loadingData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1b6928] mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Carregando...</p>
        </div>
      </div>
    );
  }

  // ── Clube não encontrado ───────────────────────────────────────────────────
  if (!club) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="text-center max-w-sm">
          <ShieldCheck size={48} className="mx-auto mb-4 text-gray-300" />
          <h2 className="text-lg font-bold text-gray-700 mb-1">Clube não encontrado</h2>
          <p className="text-sm text-gray-400">
            Verifique se o <code className="font-mono bg-gray-100 px-1 rounded">CLUB_ID</code> está correto
            ou acesse <code className="font-mono bg-gray-100 px-1 rounded">/dev/setup</code> para criar um clube de teste.
          </p>
        </div>
      </div>
    );
  }

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen font-sans flex flex-col items-center p-4 md:p-6">
      <div className="w-full max-w-4xl">

        {/* Cabeçalho */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2.5">
            {club.badgeImage ? (
              <img src={club.badgeImage} alt={club.name}
                className="w-8 h-8 rounded-full object-cover border border-gray-200" />
            ) : (
              <div className="w-8 h-8 rounded-full bg-[#1b6928] flex items-center justify-center shrink-0">
                <ShieldCheck size={16} className="text-white" />
              </div>
            )}
            <h1 className="text-lg font-bold text-black uppercase tracking-tight">
              Gestão de Elenco • {club.name}
            </h1>
          </div>
          <span className="bg-gray-100 border border-gray-200 text-gray-700 px-3 py-1 rounded-md text-xs font-bold">
            {playerCount}/10 Jogadores
          </span>
        </div>

        {/* Tabs */}
        <div className="flex items-end gap-1 flex-wrap">
          {teams.map((team) => {
            const isActive = team.id === activeTeamId;
            const label    = team.isPrimary ? "Elenco Principal" : team.name;
            return (
              <button key={team.id} onClick={() => handleTabChange(team.id)}
                className={`relative px-4 py-2 text-xs font-bold rounded-t-lg border border-b-0 whitespace-nowrap transition-colors cursor-pointer shrink-0 ${
                  isActive
                    ? "bg-white border-gray-200 text-[#1b6928] shadow-sm z-10"
                    : "bg-gray-100 border-gray-200 text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                }`}>
                <span className="flex items-center gap-1.5">
                  {label}
                  {!team.isPrimary && (
                    <span role="button"
                      onClick={(e) => { e.stopPropagation(); handleDeleteTeam(team.id); }}
                      className={`rounded-full p-0.5 transition-colors ${
                        deletingTeamId === team.id
                          ? "opacity-50 cursor-not-allowed"
                          : "hover:bg-red-100 hover:text-red-600 cursor-pointer"
                      }`}>
                      {deletingTeamId === team.id
                        ? <Loader2 size={10} className="animate-spin" />
                        : <X size={10} />
                      }
                    </span>
                  )}
                </span>
                {isActive && <span className="absolute bottom-[-1px] left-0 right-0 h-[1px] bg-white" />}
              </button>
            );
          })}
          {novoTimeInput ? (
            <div className="flex items-center gap-1 px-2 py-1 rounded-t-lg border border-b-0 border-[#1b6928] bg-white shrink-0">
              <input
                type="text"
                autoFocus
                value={novoTimeName}
                onChange={(e) => setNovoTimeName(e.target.value)}
                disabled={creatingTeam}
                onKeyDown={async (e) => {
                  if (e.key === 'Enter' && novoTimeName.trim() && !creatingTeam) {
                    await handleCreateTeam(novoTimeName.trim());
                    setNovoTimeName('');
                    setNovoTimeInput(false);
                  }
                  if (e.key === 'Escape' && !creatingTeam) {
                    setNovoTimeName('');
                    setNovoTimeInput(false);
                  }
                }}
                placeholder="Nome do time..."
                className="text-xs outline-none w-32 text-gray-700 placeholder-gray-400 py-1 disabled:opacity-50"
              />
              <button
                onClick={async () => {
                  if (!novoTimeName.trim()) return;
                  await handleCreateTeam(novoTimeName.trim());
                  setNovoTimeName('');
                  setNovoTimeInput(false);
                }}
                disabled={!novoTimeName.trim() || creatingTeam}
                className="text-[#1b6928] hover:text-green-800 disabled:opacity-30 cursor-pointer p-0.5"
              >
                {creatingTeam ? <Loader2 size={13} className="animate-spin" /> : <Check size={13} />}
              </button>
              <button
                onClick={() => { setNovoTimeName(''); setNovoTimeInput(false); }}
                disabled={creatingTeam}
                className="text-gray-400 hover:text-red-500 cursor-pointer p-0.5 disabled:opacity-30"
              >
                <X size={13} />
              </button>
            </div>
          ) : (
            <button onClick={() => setNovoTimeInput(true)}
              className="px-3 py-2 text-xs font-bold rounded-t-lg border border-b-0 border-dashed border-gray-300 text-gray-400 hover:text-[#1b6928] hover:border-[#1b6928] bg-transparent transition-colors cursor-pointer shrink-0 flex items-center gap-1">
              <PlusCircle size={13} /> Novo Time
            </button>
          )}
        </div>

        {/* Card */}
        <div className={`bg-white shadow-md border border-gray-200 p-6 md:p-8 ${teams.length === 0 ? "rounded-2xl" : "rounded-b-2xl rounded-tr-2xl"}`}>
          {teams.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <ShieldCheck size={40} className="text-gray-200 mb-3" />
              <p className="text-sm font-bold text-gray-600 mb-1">Nenhum time cadastrado</p>
              <p className="text-xs text-gray-400 mb-5">
                Clique em <span className="font-bold text-[#1b6928]">+ Novo Time</span> para criar o Elenco Principal do seu clube.
              </p>
              <button
                onClick={() => handleCreateTeam("")}
                disabled={creatingTeam}
                className="bg-[#1b6928] hover:bg-green-800 text-white font-bold py-2 px-5 rounded-lg text-xs flex items-center gap-1.5 cursor-pointer transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {creatingTeam ? <><Loader2 size={13} className="animate-spin" /> Criando...</> : <><PlusCircle size={13} /> Criar Elenco Principal</>}
              </button>
            </div>
          ) : activeTeam && (
            <>
              <div className="mb-5">
                <label className="block text-xs font-bold text-gray-900 mb-1.5">
                  Nome do Técnico <span className="text-red-600">*</span>
                </label>
                <input type="text" data-testid="form-tecnico-nome" value={coachName}
                  onChange={(e) => setCoachName(e.target.value)}
                  placeholder="Digite o nome do treinador..."
                  className="w-full md:w-64 border border-gray-300 rounded-md p-2 text-sm outline-none focus:border-[#1b6928] transition-colors" />
              </div>

              <div className="mb-5">
                <h2 className="text-xs font-bold text-gray-700 uppercase tracking-wide mb-3">Adicionar Jogador</h2>
                <div className="flex flex-wrap items-end gap-3">
                  <div className="w-14">
                    <label className="block text-[10px] font-bold text-gray-600 mb-1">Nº *</label>
                    <input name="number" data-testid="form-jogador-numero-input"
                      value={newPlayer.number} onChange={handleInputChange} type="text" placeholder="Nº"
                      className="w-full border border-gray-300 rounded-md p-2 text-xs outline-none focus:border-[#1b6928]" />
                  </div>
                  <div className="flex-1 min-w-[180px]">
                    <label className="block text-[10px] font-bold text-gray-600 mb-1">Nome do Jogador *</label>
                    <input name="name" data-testid="form-jogador-nome-input"
                      value={newPlayer.name} onChange={handleInputChange} type="text" placeholder="Nome completo"
                      className="w-full border border-gray-300 rounded-md p-2 text-xs outline-none focus:border-[#1b6928]" />
                  </div>
                  <div className="w-36">
                    <label className="block text-[10px] font-bold text-gray-600 mb-1">Posição *</label>
                    <select name="position" data-testid="form-jogador-posicao-select"
                      value={newPlayer.position} onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-md p-2 text-xs bg-white cursor-pointer outline-none focus:border-[#1b6928]">
                      <option value="">Selecionar</option>
                      <option value="Fixo">Fixo</option>
                      <option value="Ala">Ala</option>
                      <option value="Pivo">Pivo</option>
                      <option value="Goleiro">Goleiro</option>
                    </select>
                  </div>
                  <div className="flex flex-col gap-1">
                    <button onClick={addPlayer} disabled={playerCount >= 10}
                      data-testid="form-jogador-adicionar-button"
                      className="bg-[#1b6928] hover:bg-green-800 text-white font-bold py-2 px-4 rounded-md flex items-center gap-1.5 text-xs transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer">
                      <Plus size={13} /> Adicionar
                    </button>
                    {playerCount >= 10 && <span className="text-[10px] text-red-500 font-medium">Limite atingido</span>}
                  </div>
                </div>
              </div>

              <div className="overflow-hidden rounded-lg border border-gray-200">
                <table className="w-full text-left border-collapse" data-testid="form-elenco-tabela">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="p-3 text-[10px] font-bold uppercase text-gray-500 w-14">Nº</th>
                      <th className="p-3 text-[10px] font-bold uppercase text-gray-500">Nome do Jogador</th>
                      <th className="p-3 text-[10px] font-bold uppercase text-gray-500 text-center w-28">Posição</th>
                      <th className="p-3 text-[10px] font-bold uppercase text-gray-500 text-center w-24">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {players.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="p-8 text-center text-sm text-gray-400">
                          Nenhum jogador cadastrado neste time
                        </td>
                      </tr>
                    ) : (
                      players.map((player) => (
                        <PlayerRow key={player.id} player={player}
                          isEditing={editingId === player.id} tempData={tempEditData}
                          onEdit={startEditing} onSave={saveEdit} onCancel={cancelEdit}
                          onDelete={openDeleteModal} onTempChange={handleTempChange} />
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>

        {/* Botão salvar */}
        {activeTeam && (
          <div className="mt-5 flex flex-col items-center gap-2">
            <button onClick={handleFinalizeSelection} disabled={loading}
              data-testid="form-actions-cadastrar"
              className="bg-[#1b6928] hover:bg-green-800 text-white font-bold py-3 px-14 rounded-lg text-sm shadow transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer">
              {loading ? 'Salvando...' : 'Salvar Alterações'}
            </button>
            {playerCount < 6 && (
              <p className="text-xs text-red-500 font-medium">
                Mínimo de 6 jogadores necessários ({6 - playerCount} restante{6 - playerCount !== 1 ? 's' : ''})
              </p>
            )}
          </div>
        )}
      </div>


      <DeleteModal isOpen={isDeleteOpen}
        onClose={() => { setIsDeleteOpen(false); setPlayerToDeleteId(null); }} onConfirm={confirmDeletion} />
      <SuccessModal isOpen={isSuccessOpen} onClose={() => setIsSuccessOpen(false)} />
      <ErrorModal   isOpen={isErrorOpen}   onClose={() => setIsErrorOpen(false)} />
    </div>
  );
};

export default CadastroTime;