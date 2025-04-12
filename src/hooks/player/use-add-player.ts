
import { useState } from "react";
import { Player } from "@/types/game";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { generateRandomNumber, transformPlayerData } from "@/utils/player-utils";

export const useAddPlayer = (gameId: string, onPlayerUpdate: (updatedPlayer: Player) => void) => {
  const [newPlayerName, setNewPlayerName] = useState("");
  const [isAddOpen, setIsAddOpen] = useState(false);

  const handleAddPlayer = async () => {
    if (!gameId) {
      console.error('No game ID provided');
      toast({
        title: "Error",
        description: "Invalid game ID",
        variant: "destructive",
      });
      return;
    }

    if (!newPlayerName.trim()) {
      toast({
        title: "Error",
        description: "Please enter a player name",
        variant: "destructive",
      });
      return;
    }

    try {
      const playerData = {
        name: newPlayerName.trim(),
        game_id: gameId,
        number: generateRandomNumber(),
        status: 'alive' as const,
      };

      console.log('Attempting to add player:', playerData);

      const { data: newPlayer, error } = await supabase
        .from('players')
        .insert([playerData])
        .select()
        .single();

      if (error) {
        console.error('Detailed error adding player:', error);
        throw error;
      }

      if (newPlayer) {
        onPlayerUpdate(transformPlayerData(newPlayer));
        setNewPlayerName("");
        setIsAddOpen(false);
        toast({
          title: "Success",
          description: "Player added successfully",
        });
      }
    } catch (error) {
      console.error('Error adding player:', error);
      toast({
        title: "Error",
        description: "Failed to add player",
        variant: "destructive",
      });
    }
  };

  return {
    newPlayerName,
    setNewPlayerName,
    isAddOpen,
    setIsAddOpen,
    handleAddPlayer,
  };
};
