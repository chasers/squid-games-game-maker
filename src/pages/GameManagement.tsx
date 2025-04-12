
import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Player } from "@/types/game";
import { toast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGameManagement } from "@/hooks/use-game-management";
import { PlayerCard } from "@/components/game/PlayerCard";
import { EditPlayerDialog } from "@/components/game/EditPlayerDialog";
import { FaTv, FaKey, FaArrowLeft } from "react-icons/fa";
import { supabase } from "@/integrations/supabase/client";

const GameManagement = () => {
  const { gameId } = useParams();
  const { game, loading, ...playerManagement } = useGameManagement(gameId || '');
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
  const [joinPassword, setJoinPassword] = useState("");
  const tvViewUrl = `/tv/game/${gameId}`;

  const handleUpdatePassword = async () => {
    if (!gameId) return;

    try {
      const { error } = await supabase
        .from('games')
        .update({ join_password: joinPassword })
        .eq('id', gameId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Game password updated successfully",
      });
      setIsPasswordDialogOpen(false);
    } catch (error) {
      console.error('Error updating password:', error);
      toast({
        title: "Error",
        description: "Failed to update game password",
        variant: "destructive",
      });
    }
  };

  // Handle opening the player edit dialog with proper cleanup
  const handleEditPlayer = (player: Player) => {
    // Reset any lingering state first
    playerManagement.setIsEditOpen(false);
    // Then set up the new player edit state
    playerManagement.setSelectedPlayer(player);
    playerManagement.setEditName(player.name);
    playerManagement.setEditStatus(player.status);
    playerManagement.setEditNumber(player.number);
    // Finally open the dialog
    setTimeout(() => {
      playerManagement.setIsEditOpen(true);
    }, 0);
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!game) {
    return <div className="min-h-screen flex items-center justify-center">
      No game found.
    </div>;
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Link to="/dashboard">
            <Button variant="outline" size="icon">
              <FaArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-4xl font-bold">{game.name}</h1>
        </div>
        <div className="flex gap-4">
          <Button onClick={() => setIsPasswordDialogOpen(true)} variant="outline">
            <FaKey className="mr-2 h-4 w-4" />
            Set Join Password
          </Button>
          <Link to={tvViewUrl} target="_blank">
            <Button variant="outline">
              <FaTv className="mr-2 h-4 w-4" />
              TV View
            </Button>
          </Link>
          <Button onClick={() => playerManagement.setIsAddOpen(true)}>
            Add Player
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {game.players
          .filter(player => !player.removed) // Filter out removed players
          .map((player) => (
            <PlayerCard
              key={player.id}
              player={player}
              onEdit={handleEditPlayer}
              onPhotoUpload={playerManagement.handlePhotoUpload}
            />
          ))}
      </div>

      <Dialog open={playerManagement.isAddOpen} onOpenChange={playerManagement.setIsAddOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add Player</DialogTitle>
            <DialogDescription>
              Add a new player to the game.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                value={playerManagement.newPlayerName}
                onChange={(e) => playerManagement.setNewPlayerName(e.target.value)}
                className="col-span-3"
              />
            </div>
          </div>
          <Button onClick={playerManagement.handleAddPlayer}>
            Add
          </Button>
        </DialogContent>
      </Dialog>

      <EditPlayerDialog 
        isOpen={playerManagement.isEditOpen}
        onOpenChange={playerManagement.setIsEditOpen}
        editName={playerManagement.editName}
        onNameChange={playerManagement.setEditName}
        editStatus={playerManagement.editStatus}
        onStatusChange={playerManagement.setEditStatus}
        editNumber={playerManagement.editNumber}
        onNumberChange={playerManagement.setEditNumber}
        onSave={playerManagement.handleEditPlayer}
        onDelete={playerManagement.handleDeletePlayer}
      />

      <Dialog open={isPasswordDialogOpen} onOpenChange={setIsPasswordDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Set Join Password</DialogTitle>
            <DialogDescription>
              Set a password that players will need to join the game from the TV view.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="password" className="text-right">
                Password
              </Label>
              <Input
                id="password"
                type="text"
                value={joinPassword}
                onChange={(e) => setJoinPassword(e.target.value)}
                className="col-span-3"
                placeholder="Enter join password"
              />
            </div>
          </div>
          <Button onClick={handleUpdatePassword}>
            Save Password
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default GameManagement;
