
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Game, Player } from "@/types/game";
import { toast } from "@/hooks/use-toast";
import { UserPlus, Pencil } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const GameManagement = () => {
  const { gameId } = useParams();
  const navigate = useNavigate();
  const [game, setGame] = useState<Game | null>(null);
  const [newPlayerName, setNewPlayerName] = useState("");
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [editName, setEditName] = useState("");

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
      gameId: gameId!,
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

    setGame((prevGame) => {
      if (!prevGame) return null;
      const updatedPlayers = prevGame.players.map((p) =>
        p.id === selectedPlayer.id ? { ...p, name: editName } : p
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
      const filePath = `${playerId}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('player-photos')
        .upload(filePath, file, {
          upsert: true
        });

      if (uploadError) {
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
      toast({
        title: "Error",
        description: "Failed to upload photo",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex justify-between items-center">
          <div className="space-y-1">
            <Button
              variant="ghost"
              className="text-muted-foreground mb-2"
              onClick={() => navigate("/dashboard")}
            >
              ← Back to Games
            </Button>
            <h1 className="text-3xl font-bold text-squid-pink">{game?.name || "Game"}</h1>
          </div>
          <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
            <DialogTrigger asChild>
              <Button className="bg-squid-pink hover:bg-squid-pink/90 button-hover">
                <UserPlus className="mr-2 h-4 w-4" />
                Add Player
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Player</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <Input
                  placeholder="Player Name"
                  value={newPlayerName}
                  onChange={(e) => setNewPlayerName(e.target.value)}
                  className="input-focus"
                />
                <Button
                  onClick={handleAddPlayer}
                  className="w-full bg-squid-pink hover:bg-squid-pink/90 button-hover"
                >
                  Add Player
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {game?.players.map((player) => (
            <Card
              key={player.id}
              className="p-6 card-hover"
            >
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-semibold">{player.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      Status: {player.status}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setSelectedPlayer(player);
                      setEditName(player.name);
                      setIsEditOpen(true);
                    }}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-col items-center space-y-2">
                  {player.photoUrl && (
                    <img
                      src={player.photoUrl}
                      alt={player.name}
                      className="w-20 h-20 rounded-full object-cover"
                    />
                  )}
                  <Input
                    type="file"
                    accept="image/*"
                    className="max-w-[200px]"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        handlePhotoUpload(player.id, file);
                      }
                    }}
                  />
                </div>
              </div>
            </Card>
          ))}
        </div>

        <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Player</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <Input
                placeholder="Player Name"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="input-focus"
              />
              <Button
                onClick={handleEditPlayer}
                className="w-full bg-squid-pink hover:bg-squid-pink/90 button-hover"
              >
                Save Changes
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default GameManagement;
