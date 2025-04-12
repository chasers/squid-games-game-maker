
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Game, Player } from "@/types/game";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { usePlayerManagement } from "@/hooks/use-player-management";
import { transformPlayerData } from "@/utils/player-utils";

export const useGameManagement = (gameId: string) => {
  const navigate = useNavigate();
  const { session } = useAuth();
  const [game, setGame] = useState<Game | null>(null);
  const [loading, setLoading] = useState(true);

  const handlePlayerUpdate = (updatedPlayer: Player) => {
    setGame((prevGame) => {
      if (!prevGame) return null;

      // If player is marked as removed, filter it out instead of just updating the flag
      if (updatedPlayer.removed) {
        return {
          ...prevGame,
          players: prevGame.players.filter(p => p.id !== updatedPlayer.id),
        };
      }

      // Check if the player already exists
      const playerExists = prevGame.players.some(p => p.id === updatedPlayer.id);

      if (playerExists) {
        // Update existing player
        return {
          ...prevGame,
          players: prevGame.players.map((p) =>
            p.id === updatedPlayer.id ? updatedPlayer : p
          ),
        };
      } else {
        // Add new player
        return {
          ...prevGame,
          players: [...prevGame.players, updatedPlayer],
        };
      }
    });
  };

  // Initialize hook with the gameId and updated handler
  const playerManagement = usePlayerManagement(gameId, handlePlayerUpdate);

  const fetchGame = async () => {
    if (!session) {
      console.error('No session available');
      navigate("/");
      return;
    }

    if (!gameId) {
      console.error('No game ID provided');
      toast({
        title: "Error",
        description: "Invalid game ID",
        variant: "destructive",
      });
      navigate("/dashboard");
      return;
    }

    try {
      setLoading(true);
      const { data: gameData, error } = await supabase
        .from('games')
        .select(`
          *,
          players (*)
        `)
        .eq('id', gameId)
        .maybeSingle();

      if (error) throw error;

      if (!gameData) {
        toast({
          title: "Error",
          description: "Game not found",
          variant: "destructive",
        });
        navigate("/dashboard");
        return;
      }

      const transformedGame: Game = {
        id: gameData.id,
        name: gameData.name,
        createdAt: gameData.created_at,
        ownerId: gameData.owner_id,
        status: gameData.status as 'pending' | 'in-progress' | 'completed',
        players: gameData.players.map(transformPlayerData)
      };
      setGame(transformedGame);
    } catch (error) {
      console.error('Error fetching game:', error);
      toast({
        title: "Error",
        description: "Failed to load game",
        variant: "destructive",
      });
      navigate("/dashboard");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (session && gameId) {
      fetchGame();
    }
  }, [gameId, session]);

  return {
    game,
    loading,
    ...playerManagement,
  };
};
