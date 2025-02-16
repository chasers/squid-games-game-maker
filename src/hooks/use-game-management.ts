import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Game, Player } from "@/types/game";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";

export const useGameManagement = (gameId: string) => {
  const navigate = useNavigate();
  const { session } = useAuth();
  const [game, setGame] = useState<Game | null>(null);
  const [newPlayerName, setNewPlayerName] = useState("");
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [editName, setEditName] = useState("");
  const [editStatus, setEditStatus] = useState<'alive' | 'eliminated'>('alive');
  const [editNumber, setEditNumber] = useState<number>(0);
  const [loading, setLoading] = useState(true);

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
        players: gameData.players.map((p: any) => ({
          id: p.id,
          name: p.name,
          status: p.status as 'alive' | 'eliminated',
          gameId: p.game_id,
          number: p.number,
          photoUrl: p.photo_url
        }))
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

  const generateRandomNumber = () => {
    return Math.floor(Math.random() * 455) + 1;
  };

  const handleAddPlayer = async () => {
    if (!session) {
      console.error('No session available for adding player');
      toast({
        title: "Error",
        description: "You must be logged in to add players",
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
      console.log('Attempting to add player:', {
        name: newPlayerName,
        game_id: gameId,
        number: generateRandomNumber(),
      });

      const { data: newPlayer, error } = await supabase
        .from('players')
        .insert([{
          name: newPlayerName.trim(),
          game_id: gameId,
          number: generateRandomNumber(),
          status: 'alive' as const,
        }])
        .select()
        .single();

      if (error) {
        console.error('Detailed error adding player:', error);
        throw error;
      }

      if (newPlayer) {
        setGame((prevGame) => {
          if (!prevGame) return null;
          return {
            ...prevGame,
            players: [...prevGame.players, {
              id: newPlayer.id,
              name: newPlayer.name,
              status: newPlayer.status as 'alive' | 'eliminated',
              gameId: newPlayer.game_id,
              number: newPlayer.number,
              photoUrl: newPlayer.photo_url
            }]
          };
        });

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
        setGame((prevGame) => {
          if (!prevGame) return null;
          return {
            ...prevGame,
            players: prevGame.players.map((p) =>
              p.id === selectedPlayer.id ? {
                id: updatedPlayer.id,
                name: updatedPlayer.name,
                status: updatedPlayer.status as 'alive' | 'eliminated',
                gameId: updatedPlayer.game_id,
                number: updatedPlayer.number,
                photoUrl: updatedPlayer.photo_url
              } : p
            )
          };
        });

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

      setGame((prevGame) => {
        if (!prevGame) return null;
        return {
          ...prevGame,
          players: prevGame.players.map((p) =>
            p.id === playerId ? { ...p, photoUrl: publicUrl } : p
          )
        };
      });

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
    game,
    loading,
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
