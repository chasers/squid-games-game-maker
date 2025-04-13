
import { useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Game, Player } from "@/types/game";
import { generateRandomNumber, transformPlayerData } from "@/utils/player-utils";

export const useJoinGame = (
  game: Game | null, 
  gameId: string, 
  onPlayerAdded: (player: Player) => void
) => {
  const [isJoinDialogOpen, setIsJoinDialogOpen] = useState(false);

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

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('player-photos')
        .getPublicUrl(filePath);

      const { data: updatedPlayer, error: updateError } = await supabase
        .from('players')
        .update({ photo_url: publicUrl })
        .eq('id', playerId)
        .select()
        .single();

      if (updateError) throw updateError;
      
      if (updatedPlayer) {
        return transformPlayerData(updatedPlayer);
      }
    } catch (error) {
      console.error('Photo upload error:', error);
      throw error;
    }
  };

  const handleJoinGame = async (
    playerName: string, 
    password: string, 
    photo: File | null
  ) => {
    if (!game || !gameId) return;

    if (game.joinPassword !== password) {
      toast({
        title: "Error",
        description: "Incorrect password",
        variant: "destructive",
      });
      return;
    }

    try {
      const { data: newPlayer, error } = await supabase
        .from('players')
        .insert([{
          name: playerName,
          game_id: gameId,
          number: generateRandomNumber(),
          status: 'alive'
        }])
        .select()
        .single();

      if (error) throw error;

      if (newPlayer) {
        let updatedPlayer = transformPlayerData(newPlayer);
        
        if (photo) {
          try {
            updatedPlayer = await handlePhotoUpload(newPlayer.id, photo);
          } catch (uploadError) {
            toast({
              title: "Warning",
              description: "Joined game but failed to upload photo",
              variant: "destructive",
            });
          }
        }

        onPlayerAdded(updatedPlayer);
        setIsJoinDialogOpen(false);
        toast({
          title: "Success",
          description: "Successfully joined the game!",
        });
      }
    } catch (error) {
      console.error('Error joining game:', error);
      toast({
        title: "Error",
        description: "Failed to join the game",
        variant: "destructive",
      });
    }
  };

  return {
    isJoinDialogOpen,
    setIsJoinDialogOpen,
    handleJoinGame
  };
};
