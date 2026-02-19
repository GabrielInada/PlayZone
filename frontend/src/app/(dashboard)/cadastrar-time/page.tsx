"use client";
import React, { useState, useEffect, ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Trash2, Pencil, Plus, Check, X, ClipboardList } from 'lucide-react';

import { SuccessModal, ErrorModal, DeleteModal } from '@/components/ModalCadastroTime';

interface Player {
  id: string;
  number: string;
  name: string;
  position: string;
}

const CadastroTime: React.FC = () => {
  const router = useRouter();
  const TEAM_ID = 1; // ⚠️ ID fixo do time do clube logado - ajustar conforme autenticação

  const [players, setPlayers] = useState<Player[]>([]);
  const [coachName, setCoachName] = useState('');
  const [newPlayer, setNewPlayer] = useState({ number: '', name: '', position: '' });
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);

  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [tempEditData, setTempEditData] = useState<Player | null>(null);
  const [playerToDeleteId, setPlayerToDeleteId] = useState<string | null>(null);

  const positionMap: Record<string, string> = {
    'Goleiro': 'goleiro',
    'Fixo': 'fixo',
    'Ala': 'ala',
    'Pivo': 'pivô',
  };

  const reversePositionMap: Record<string, string> = {
    'goleiro': 'Goleiro',
    'fixo': 'Fixo',
    'ala': 'Ala',
    'pivô': 'Pivo',
  };

  // Carregar dados do backend ao montar o componente
  useEffect(() => {
    loadTeamData();
  }, []);

  const loadTeamData = async () => {
    try {
      setLoadingData(true);
      const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000";

      // 1. Buscar dados do time
      const teamResponse = await fetch(`${API_URL}/team/${TEAM_ID}`);
      if (teamResponse.ok) {
        const team = await teamResponse.json();
        setCoachName(team.coachName || '');
      }

      // 2. Buscar jogadores do time
      const playersResponse = await fetch(`${API_URL}/player`);
      if (playersResponse.ok) {
        const allPlayers = await playersResponse.json();
        
        // Filtrar apenas jogadores deste time
        const teamPlayers = allPlayers.filter((p: any) => p.teamId === TEAM_ID);
        
        // Converter para formato da interface
        const formattedPlayers: Player[] = teamPlayers.map((p: any) => ({
          id: p.id.toString(),
          number: p.shirtNumber.toString(),
          name: p.name,
          position: reversePositionMap[p.position] || p.position,
        }));

        setPlayers(formattedPlayers);
      }
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
    } finally {
      setLoadingData(false);
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewPlayer(prev => ({ ...prev, [name]: value }));
  };

  const addPlayer = () => {
    if (!newPlayer.name || !newPlayer.number || !newPlayer.position || newPlayer.position === "") return;
    const playerToAdd: Player = {
      id: Math.random().toString(36).substr(2, 9),
      ...newPlayer
    };
    setPlayers([...players, playerToAdd]);
    setNewPlayer({ number: '', name: '', position: '' });
  };

  const startEditing = (player: Player) => {
    setEditingId(player.id);
    setTempEditData({ ...player });
  };

  const saveEdit = () => {
    if (tempEditData && editingId) {
      setPlayers(players.map(p => (p.id === editingId ? tempEditData : p)));
      setEditingId(null);
      setTempEditData(null);
    }
  };

  const openDeleteModal = (id: string) => {
    setPlayerToDeleteId(id);
    setIsDeleteOpen(true);
  };

  const confirmDeletion = () => {
    if (playerToDeleteId) {
      setPlayers(players.filter(p => p.id !== playerToDeleteId));
      setIsDeleteOpen(false);
      setPlayerToDeleteId(null);
    }
  };

  const handleFinalizeSelection = async () => {
    if (players.length < 6 || !coachName.trim()) {
      setIsErrorOpen(true);
      return;
    }

    setLoading(true);

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000";

      // 1. Atualizar dados do time (técnico)
      const teamUpdateResponse = await fetch(`${API_URL}/team/${TEAM_ID}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          coachName: coachName.trim(),
          updatedAt: new Date().toISOString(),
        }),
      });

      if (!teamUpdateResponse.ok) {
        console.error("Erro ao atualizar time");
      }

      // 2. Criar apenas jogadores novos (que não têm ID numérico do backend)
      for (const player of players) {
        // Se o ID não é numérico, é um jogador novo
        if (isNaN(Number(player.id))) {
          const playerPayload = {
            name: player.name.trim(),
            shirtNumber: parseInt(player.number, 10),
            position: positionMap[player.position],
            teamId: TEAM_ID,
            createdAt: new Date().toISOString(),
          };

          console.log("📤 Criando novo jogador:", playerPayload);

          const playerResponse = await fetch(`${API_URL}/player`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(playerPayload),
          });

          if (!playerResponse.ok) {
            const errorText = await playerResponse.text();
            console.error(`❌ Erro ao criar jogador ${player.name}:`, errorText);
            throw new Error(errorText || `Erro ao criar jogador ${player.name}`);
          }

          const createdPlayer = await playerResponse.json();
          console.log(`✅ Jogador criado:`, createdPlayer);
        }
      }

      // 3. Recarregar dados do backend
      await loadTeamData();

      setIsSuccessOpen(true);

    } catch (error) {
      console.error("💥 ERRO GERAL:", error);
      setIsErrorOpen(true);
    } finally {
      setLoading(false);
    }
  };

  if (loadingData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
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
            {players.length}/10 Jogadores Cadastrados
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
              <select name="position" data-testid="form-jogador-posicao-select" value={newPlayer.position} onChange={handleInputChange} className="w-full border border-gray-400 rounded-md p-2 text-xs bg-white">
                <option value="">Posição do jogador</option>
                <option value="Fixo">Fixo</option>
                <option value="Ala">Ala</option>
                <option value="Pivo">Pivo</option>
                <option value="Goleiro">Goleiro</option>
              </select>
            </div>
            <button onClick={addPlayer} data-testid="form-jogador-adicionar-button" className="bg-[#1b6928] hover:bg-green-800 text-white font-bold py-2 px-4 rounded-md flex items-center gap-2 text-xs transition-all">
              <Plus size={14} /> Adicionar
            </button>
          </div>
        </div>

        <div className="border-t border-gray-200 my-6"></div>

        <div className="space-y-4">
          <button className="bg-[#1b6928] text-white font-bold py-1.5 px-4 rounded-md text-[10px] uppercase">
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
                    <td colSpan={4} className="p-8 text-center text-gray-500">
                      Nenhum jogador cadastrado
                    </td>
                  </tr>
                ) : (
                  players.map((player) => (
                    <tr key={player.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50">
                      {editingId === player.id ? (
                        <>
                          <td className="p-2"><input data-testid="form-elenco-edit-numero" type="text" className="w-full border rounded p-1" value={tempEditData?.number} onChange={(e) => setTempEditData(prev => prev ? { ...prev, number: e.target.value } : null)} /></td>
                          <td className="p-2"><input data-testid="form-elenco-edit-nome" type="text" className="w-full border rounded p-1" value={tempEditData?.name} onChange={(e) => setTempEditData(prev => prev ? { ...prev, name: e.target.value } : null)} /></td>
                          <td className="p-2">
                            <select data-testid="form-elenco-edit-posicao" className="w-full border rounded p-1" value={tempEditData?.position} onChange={(e) => setTempEditData(prev => prev ? { ...prev, position: e.target.value } : null)}>
                              <option value="Fixo">Fixo</option><option value="Ala">Ala</option><option value="Pivo">Pivo</option><option value="Goleiro">Goleiro</option>
                            </select>
                          </td>
                          <td className="p-2 flex justify-center gap-2">
                            <button onClick={saveEdit} data-testid="form-elenco-save-button" className="text-green-600 hover:bg-green-50 p-1 rounded"><Check size={18} /></button>
                            <button onClick={() => setEditingId(null)} data-testid="form-elenco-cancel-button" className="text-red-600 hover:bg-red-50 p-1 rounded"><X size={18} /></button>
                          </td>
                        </>
                      ) : (
                        <>
                          <td className="p-3 text-gray-800">{player.number}</td>
                          <td className="p-3 text-gray-800">{player.name}</td>
                          <td className="p-3 text-center text-gray-800">{player.position}</td>
                          <td className="p-3 flex justify-center gap-4">
                            <button onClick={() => startEditing(player)} data-testid="form-elenco-edit-button" className="text-gray-400 hover:text-black"><Pencil size={16} /></button>
                            <button onClick={() => openDeleteModal(player.id)} data-testid="form-elenco-delete-button" className="text-gray-400 hover:text-red-600"><Trash2 size={16} /></button>
                          </td>
                        </>
                      )}
                    </tr>
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
        className="mt-6 bg-[#1b6928] hover:bg-green-800 text-white font-bold py-3 px-12 rounded-lg text-sm shadow transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Salvando...' : 'Salvar Alterações'}
      </button>

      <SuccessModal isOpen={isSuccessOpen} onClose={() => setIsSuccessOpen(false)} />
      <ErrorModal isOpen={isErrorOpen} onClose={() => setIsErrorOpen(false)} />
      <DeleteModal
        isOpen={isDeleteOpen}
        onClose={() => {
          setIsDeleteOpen(false);
          setPlayerToDeleteId(null);
        }}
        onConfirm={confirmDeletion}
      />
    </div>
  );
};

export default CadastroTime;