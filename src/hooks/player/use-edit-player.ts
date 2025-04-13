import { useState } from "react";
import { Player } from "@/types/game";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { transformPlayerData } from "@/utils/player-utils";

export const useEditPlayer = (onPlayerUpdate: (updatedPlayer: Player) => void) => {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [editName, setEditName] = useState("");
  const [editStatus, setEditStatus] = useState<'alive' | 'eliminated'>('alive');
  const [editNumber, setEditNumber] = useState<number>(0);
  const [editLosses, setEditLosses] = useState(0);

  const handleEditPlayer = async () => {
    if (!selectedPlayer || !editName.trim()) {
      toast({
        title: "Error",
        description: "Please enter a player name",
        variant: "destructive",
      });
      return;
    }

    if (editNumber < 1 || editNumber > 456) {
      toast({
        title: "Error",
        description: "Number must be between 1 and 456",
        variant: "destructive",
      });
      return;
    }

    try {
      const { data: updatedPlayer, error } = await supabase
        .from('players')
        .update({
          name: editName,
          status: editStatus,
          number: editNumber,
          losses: editLosses
        })
        .eq('id', selectedPlayer.id)
        .select()
        .single();

      if (error) throw error;

      if (updatedPlayer) {
        onPlayerUpdate(transformPlayerData(updatedPlayer));
        setIsEditOpen(false);
        toast({
          title: "Success",
          description: "Player updated successfully",
        });
      }
    } catch (error) {
      console.error('Error updating player:', error);
      toast({
        title: "Error",
        description: "Failed to update player",
        variant: "destructive",
      });
    }
  };

  return {
    isEditOpen, 
    setIsEditOpen,
    selectedPlayer, 
    setSelectedPlayer,
    editName, 
    setEditName,
    editStatus, 
    setEditStatus,
    editNumber, 
    setEditNumber,
    editLosses,
    setEditLosses,
    handleEditPlayer,
  };
};
