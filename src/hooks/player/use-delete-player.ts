
import { Player } from "@/types/game";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export const useDeletePlayer = (
  selectedPlayer: Player | null,
  onPlayerUpdate: (updatedPlayer: Player) => void,
  onComplete: () => void
) => {
  const handleDeletePlayer = async () => {
    if (!selectedPlayer) {
      toast({
        title: "Error",
        description: "No player selected",
        variant: "destructive",
      });
      return;
    }

    try {
      // Call the completion callback FIRST to ensure UI cleanup happens
      // before any async operations that might cause problems
      onComplete();
      
      const { error } = await supabase
        .from('players')
        .delete()
        .eq('id', selectedPlayer.id);

      if (error) throw error;

      // Create a deleted player with the removed flag to update the UI
      const deletedPlayer: Player = {
        ...selectedPlayer,
        removed: true, // This is a virtual property to signal removal
      };
      
      // Update player state in parent components
      onPlayerUpdate(deletedPlayer);
      
      toast({
        title: "Success",
        description: "Player deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting player:', error);
      toast({
        title: "Error",
        description: "Failed to delete player",
        variant: "destructive",
      });
    }
  };

  return {
    handleDeletePlayer,
  };
};
