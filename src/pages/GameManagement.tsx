
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Game, Player } from "@/types/game";
import { toast } from "@/hooks/use-toast";
import { UserPlus } from "lucide-react";

const GameManagement = () => {
  const { gameId } = useParams();
  const navigate = useNavigate();
  const [game, setGame] = useState<Game | null>(null);
  const [newPlayerName, setNewPlayerName] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Get games from localStorage
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

    // Update local state
    setGame((prevGame) => {
      if (!prevGame) return null;
      const updatedGame = {
        ...prevGame,
        players: [...prevGame.players, newPlayer],
      };

      // Update localStorage
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
    setIsOpen(false);
    toast({
      title: "Success",
      description: "Player added successfully",
    });
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
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
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
                <div>
                  <h3 className="text-xl font-semibold">{player.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    Status: {player.status}
                  </p>
                </div>
                {player.photoUrl && (
                  <img
                    src={player.photoUrl}
                    alt={player.name}
                    className="w-20 h-20 rounded-full object-cover mx-auto"
                  />
                )}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GameManagement;
