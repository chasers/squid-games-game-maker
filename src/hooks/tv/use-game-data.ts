
import { useState, useEffect } from "react";
import { Game, Player } from "@/types/game";
import { supabase } from "@/integrations/supabase/client";
import { transformPlayerData } from "@/utils/player-utils";

type GameDataReturn = {
  game: Game | null;
  players: Player[];
  loading: boolean;
  setPlayers: React.Dispatch<React.SetStateAction<Player[]>>;
};

export const useGameData = (gameId: string | undefined): GameDataReturn => {
  const [game, setGame] = useState<Game | null>(null);
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);

  const transformGameData = (gameData: any): Game => {
    return {
      id: gameData.id,
      name: gameData.name,
      createdAt: gameData.created_at,
      ownerId: gameData.owner_id,
      status: gameData.status,
      joinPassword: gameData.join_password,
      players: [] // Players will be set separately
    };
  };

  useEffect(() => {
    const fetchGameAndPlayers = async () => {
      if (!gameId) {
        setLoading(false);
        return;
      }
      
      try {
        const [gameResponse, playersResponse] = await Promise.all([
          supabase
            .from('games')
            .select('*')
            .eq('id', gameId)
            .single(),
          supabase
            .from('players')
            .select('*')
            .eq('game_id', gameId)
            .order('number', { ascending: true })
        ]);

        if (gameResponse.error) throw gameResponse.error;
        if (playersResponse.error) throw playersResponse.error;

        if (gameResponse.data) {
          const transformedGame = transformGameData(gameResponse.data);
          setGame(transformedGame);
        }

        if (playersResponse.data) {
          setPlayers(playersResponse.data.map(transformPlayerData));
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchGameAndPlayers();
  }, [gameId]);

  return { game, players, loading, setPlayers };
};
