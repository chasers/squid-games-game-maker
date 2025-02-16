
import { useNavigate, useParams, useEffect } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";
import { useGameManagement } from "@/hooks/use-game-management";
import { PlayerCard } from "@/components/game/PlayerCard";
import { EditPlayerDialog } from "@/components/game/EditPlayerDialog";
import { AddPlayerDialog } from "@/components/game/AddPlayerDialog";

const GameManagement = () => {
  const { gameId } = useParams<{ gameId: string }>();
  const navigate = useNavigate();

  useEffect(() => {
    if (!gameId) {
      navigate("/dashboard");
    }
  }, [gameId, navigate]);

  if (!gameId) return null;

  const {
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
  } = useGameManagement(gameId);

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
          <Button 
            className="bg-squid-pink hover:bg-squid-pink/90 button-hover"
            onClick={() => setIsAddOpen(true)}
          >
            <UserPlus className="mr-2 h-4 w-4" />
            Add Player
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {game?.players.map((player) => (
            <PlayerCard
              key={player.id}
              player={player}
              onEdit={(player) => {
                setSelectedPlayer(player);
                setEditName(player.name);
                setEditStatus(player.status);
                setEditNumber(player.number);
                setIsEditOpen(true);
              }}
              onPhotoUpload={handlePhotoUpload}
            />
          ))}
        </div>

        <AddPlayerDialog
          isOpen={isAddOpen}
          onOpenChange={setIsAddOpen}
          newPlayerName={newPlayerName}
          onNameChange={setNewPlayerName}
          onAdd={handleAddPlayer}
        />

        <EditPlayerDialog
          isOpen={isEditOpen}
          onOpenChange={setIsEditOpen}
          editName={editName}
          onNameChange={setEditName}
          editStatus={editStatus}
          onStatusChange={setEditStatus}
          editNumber={editNumber}
          onNumberChange={setEditNumber}
          onSave={handleEditPlayer}
        />
      </div>
    </div>
  );
};

export default GameManagement;
