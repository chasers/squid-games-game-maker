import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Game, Player } from "@/types/game";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const useGameManagement = (gameId: string) => {
  const navigate = useNavigate();
  const [game, setGame] = useState<Game | null>(null);
  const [newPlayerName, setNewPlayerName] = useState("");
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [editName, setEditName] = useState("");
  const [editStatus, setEditStatus] = useState<'alive' | 'eliminated'>('alive');
  const [editNumber, setEditNumber] = useState<number>(0);

  useEffect(() => {
    const gamesData = localStorage.getItem('games');
    if (gamesData) {
      const games = JSON.parse(gamesData);
      const currentGame = games.find((g: Game) => g.id === gameId);
      if (currentGame) {
        setGame(currentGame);
      } else {
        toast({
          title: "Error",
          description: "Game not found",
          variant: "destructive",
        });
        navigate("/dashboard");
      }
    }
  }, [gameId, navigate]);

  const generateRandomNumber = () => {
    return Math.floor(Math.random() * 455) + 1;
  };

  const handleAddPlayer = () => {
    if (!newPlayerName.trim()) {
      toast({
        title: "Error",
        description: "Please enter a player name",
        variant: "destructive",
      });
      return;
    }

    const newPlayer: Player = {
      id: Date.now().toString(),
      name: newPlayerName,
      status: "alive",
      gameId: gameId,
      number: generateRandomNumber(),
    };

    setGame((prevGame) => {
      if (!prevGame) return null;
      const updatedGame = {
        ...prevGame,
        players: [...prevGame.players, newPlayer],
      };

      const gamesData = localStorage.getItem('games');
      if (gamesData) {
        const games = JSON.parse(gamesData);
        const updatedGames = games.map((g: Game) => 
          g.id === gameId ? updatedGame : g
        );
        localStorage.setItem('games', JSON.stringify(updatedGames));
      }

      return updatedGame;
    });

    setNewPlayerName("");
    setIsAddOpen(false);
    toast({
      title: "Success",
      description: "Player added successfully",
    });
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

    setGame((prevGame) => {
      if (!prevGame) return null;
      const updatedPlayers = prevGame.players.map((p) =>
        p.id === selectedPlayer.id 
          ? { ...p, name: editName, status: editStatus, number: editNumber }
          : p
      );
      const updatedGame = {
        ...prevGame,
        players: updatedPlayers,
      };

      const gamesData = localStorage.getItem('games');
      if (gamesData) {
        const games = JSON.parse(gamesData);
        const updatedGames = games.map((g: Game) => 
          g.id === gameId ? updatedGame : g
        );
        localStorage.setItem('games', JSON.stringify(updatedGames));
      }

      return updatedGame;
    });

    setIsEditOpen(false);
    toast({
      title: "Success",
      description: "Player updated successfully",
    });
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

      setGame((prevGame) => {
        if (!prevGame) return null;
        const updatedPlayers = prevGame.players.map((p) =>
          p.id === playerId ? { ...p, photoUrl: publicUrl } : p
        );
        const updatedGame = {
          ...prevGame,
          players: updatedPlayers,
        };

        const gamesData = localStorage.getItem('games');
        if (gamesData) {
          const games = JSON.parse(gamesData);
          const updatedGames = games.map((g: Game) => 
            g.id === gameId ? updatedGame : g
          );
          localStorage.setItem('games', JSON.stringify(updatedGames));
        }

        return updatedGame;
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
