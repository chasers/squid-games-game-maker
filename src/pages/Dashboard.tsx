
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Game } from "@/types/game";
import { toast } from "@/hooks/use-toast";

const Dashboard = () => {
  const navigate = useNavigate();
  const [games, setGames] = useState<Game[]>([]);
  const [newGameName, setNewGameName] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const gamesData = localStorage.getItem('games');
    if (gamesData) {
      setGames(JSON.parse(gamesData));
    }
  }, []);

  const createGame = () => {
    if (!newGameName.trim()) {
      toast({
        title: "Error",
        description: "Please enter a game name",
        variant: "destructive",
      });
      return;
    }

    const newGame: Game = {
      id: Date.now().toString(),
      name: newGameName,
      createdAt: new Date().toISOString(),
      ownerId: "user123", // TODO: Replace with actual user ID
      status: "pending",
      players: [],
    };

    const updatedGames = [...games, newGame];
    setGames(updatedGames);
    localStorage.setItem('games', JSON.stringify(updatedGames));
    setNewGameName("");
    setIsOpen(false);
    toast({
      title: "Success",
      description: "Game created successfully",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-squid-pink">My Games</h1>
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button className="bg-squid-pink hover:bg-squid-pink/90 button-hover">
                <Plus className="mr-2 h-4 w-4" />
                New Game
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Game</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <Input
                  placeholder="Game Name"
                  value={newGameName}
                  onChange={(e) => setNewGameName(e.target.value)}
                  className="input-focus"
                />
                <Button
                  onClick={createGame}
                  className="w-full bg-squid-pink hover:bg-squid-pink/90 button-hover"
                >
                  Create Game
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {games.map((game) => (
            <Card
              key={game.id}
              className="p-6 card-hover"
            >
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-semibold">{game.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    Created {new Date(game.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">
                    {game.players.length} Players
                  </span>
                  <Button
                    variant="outline"
                    className="button-hover"
                    onClick={() => navigate(`/game/${game.id}`)}
                  >
                    Manage
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
