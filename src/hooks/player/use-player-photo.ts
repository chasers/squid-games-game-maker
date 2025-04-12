
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Player } from "@/types/game";
import { transformPlayerData } from "@/utils/player-utils";

export const usePlayerPhoto = (onPlayerUpdate: (updatedPlayer: Player) => void) => {
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

      const { data: updatedPlayerData, error: updateError } = await supabase
        .from('players')
        .update({ photo_url: publicUrl })
        .eq('id', playerId)
        .select()
        .single();

      if (updateError) throw updateError;

      if (updatedPlayerData) {
        onPlayerUpdate(transformPlayerData(updatedPlayerData));
        toast({
          title: "Success",
          description: "Photo uploaded successfully",
        });
      }
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
    handlePhotoUpload,
  };
};
