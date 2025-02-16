
import { useState } from "react";
import { Player } from "@/types/game";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { generateRandomNumber, transformPlayerData } from "@/utils/player-utils";

export const usePlayerManagement = (gameId: string, onPlayerUpdate: (updatedPlayer: Player) => void) => {
  const [newPlayerName, setNewPlayerName] = useState("");
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [editName, setEditName] = useState("");
  const [editStatus, setEditStatus] = useState<'alive' | 'eliminated'>('alive');
  const [editNumber, setEditNumber] = useState<number>(0);

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

  const handleEditPlayer = async () => {
    if (!selectedPlayer || !editName.trim()) {
      toast({
        title: "Error",
        description: "Please enter a player name",
        variant: "destructive",
      });
      return;
    }

    if (editNumber < 1 || editNumber > 455) {
      toast({
        title: "Error",
        description: "Number must be between 1 and 455",
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
          number: editNumber
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

  const handlePhotoUpload = async (playerId: string, file: File) => {
    try {
      const fileExt = file.name.split('.').pop();
      const filePath = `${playerId}-${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('player-photos')
        .upload(filePath, file, {
          upsert: true,
          cacheControl: '3600'
        });

      if (uploadError) {
        console.error('Upload error:', uploadError);
        throw uploadError;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('player-photos')
        .getPublicUrl(filePath);

      const { error: updateError } = await supabase
        .from('players')
        .update({ photo_url: publicUrl })
        .eq('id', playerId);

      if (updateError) throw updateError;

      onPlayerUpdate({ ...selectedPlayer!, photoUrl: publicUrl } as Player);

      toast({
        title: "Success",
        description: "Photo uploaded successfully",
      });
    } catch (error) {
      console.error('Photo upload error:', error);
      toast({
        title: "Error",
        description: "Failed to upload photo",
        variant: "destructive",
      });
    }
  };

  return {
    newPlayerName,
    setNewPlayerName,
    isAddOpen,
    setIsAddOpen,
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
    handleAddPlayer,
    handleEditPlayer,
    handlePhotoUpload,
  };
};
