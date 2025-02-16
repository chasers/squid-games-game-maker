import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Game } from "@/types/game";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { CreateGameDialog } from "@/components/dashboard/CreateGameDialog";
import { GameCard } from "@/components/dashboard/GameCard";
import { Dialog } from "@/components/ui/dialog";

const Dashboard = () => {
  const navigate = useNavigate();
  const { session } = useAuth();
  const [games, setGames] = useState<Game[]>([]);
  const [newGameName, setNewGameName] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (session) {
      fetchGames();
    }
  }, [session]);

  const fetchGames = async () => {
    try {
      const { data: gamesData, error } = await supabase
        .from('games')
        .select(`
          *,
          players (*)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (gamesData) {
        const transformedGames: Game[] = gamesData.map(game => ({
          id: game.id,
          name: game.name,
          createdAt: game.created_at,
          ownerId: game.owner_id,
          status: game.status as 'pending' | 'in-progress' | 'completed',
          players: game.players.map((p: any) => ({
            id: p.id,
            name: p.name,
            status: p.status as 'alive' | 'eliminated',
            gameId: p.game_id,
            number: p.number,
            photoUrl: p.photo_url
          }))
        }));
        setGames(transformedGames);
      }
    } catch (error) {
      console.error('Error fetching games:', error);
      toast({
        title: "Error",
        description: "Failed to load games",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        title: "Error",
        description: "Failed to log out",
        variant: "destructive",
      });
    } else {
      navigate("/");
    }
  };

  const createGame = async () => {
    if (!newGameName.trim() || !session?.user.id) {
      toast({
        title: "Error",
        description: "Please enter a game name",
        variant: "destructive",
      });
      return;
    }

    try {
      const { data: newGame, error } = await supabase
        .from('games')
        .insert([{
          name: newGameName,
          owner_id: session.user.id,
        }])
        .select(`
          *,
          players (*)
        `)
        .single();

      if (error) throw error;

      if (newGame) {
        const transformedGame: Game = {
          id: newGame.id,
          name: newGame.name,
          createdAt: newGame.created_at,
          ownerId: newGame.owner_id,
          status: newGame.status as 'pending' | 'in-progress' | 'completed',
          players: []
        };
        
        setGames((prevGames) => [...prevGames, transformedGame]);
        setNewGameName("");
        setIsOpen(false);
        toast({
          title: "Success",
          description: "Game created successfully",
        });
      }
    } catch (error) {
      console.error('Error creating game:', error);
      toast({
        title: "Error",
        description: "Failed to create game",
        variant: "destructive",
      });
    }
  };

  const handleManageGame = (gameId: string) => {
    navigate(`/game/${gameId}`);
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        <DashboardHeader
          onOpenCreateGame={() => setIsOpen(true)}
          onLogout={handleLogout}
          isCreateGameOpen={isOpen}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {games.map((game) => (
            <GameCard
              key={game.id}
              game={game}
              onManage={handleManageGame}
            />
          ))}
        </div>

        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <CreateGameDialog
            newGameName={newGameName}
            onNameChange={setNewGameName}
            onCreateGame={createGame}
          />
        </Dialog>
      </div>
    </div>
  );
};

export default Dashboard;
