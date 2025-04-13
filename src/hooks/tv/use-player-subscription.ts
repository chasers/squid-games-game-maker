
import { useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { Player } from "@/types/game";
import { transformPlayerData } from "@/utils/player-utils";

export const usePlayerSubscription = (
  gameId: string | undefined,
  onPlayerAdded: (player: Player) => void,
  onPlayerUpdated: (player: Player) => void,
  onPlayerDeleted: (playerId: string) => void
) => {
  // Set up real-time subscription to player changes
  useEffect(() => {
    if (!gameId) return;

    // Subscribe to changes in the players table for this game
    const channel = supabase
      .channel('players-changes')
      .on(
        'postgres_changes',
        {
          event: '*', // Listen to all events (INSERT, UPDATE, DELETE)
          schema: 'public',
          table: 'players',
          filter: `game_id=eq.${gameId}`
        },
        (payload) => {
          console.log('Real-time update received:', payload);
          
          // Handle different types of changes
          if (payload.eventType === 'INSERT') {
            const newPlayer = transformPlayerData(payload.new);
            onPlayerAdded(newPlayer);
          } 
          else if (payload.eventType === 'UPDATE') {
            const updatedPlayer = transformPlayerData(payload.new);
            onPlayerUpdated(updatedPlayer);
          } 
          else if (payload.eventType === 'DELETE') {
            const deletedPlayerId = payload.old.id;
            onPlayerDeleted(deletedPlayerId);
          }
        }
      )
      .subscribe();

    // Clean up subscription when component unmounts
    return () => {
      supabase.removeChannel(channel);
    };
  }, [gameId, onPlayerAdded, onPlayerUpdated, onPlayerDeleted]);
};
