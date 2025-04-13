
import { useState } from "react";
import { useParams } from "react-router-dom";
import { Player } from "@/types/game";
import { useGameManagement } from "@/hooks/use-game-management";
import { GameHeader } from "@/components/game/GameHeader";
import { PlayerGrid } from "@/components/game/PlayerGrid";
import { AddPlayerDialog } from "@/components/game/AddPlayerDialog";
import { EditPlayerDialog } from "@/components/game/EditPlayerDialog";
import { SetPasswordDialog } from "@/components/game/SetPasswordDialog";

const GameManagement = () => {
  const { gameId } = useParams();
  const { game, loading, ...playerManagement } = useGameManagement(gameId || '');
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);

  // Handle opening the player edit dialog with proper cleanup
  const handleEditPlayer = (player: Player) => {
    // Close any open dialogs first to ensure clean state
    playerManagement.setIsEditOpen(false);
    
    // Reset the state with the new player data after a microtask delay
    setTimeout(() => {
      playerManagement.setSelectedPlayer(player);
      playerManagement.setEditName(player.name);
      playerManagement.setEditStatus(player.status);
      playerManagement.setEditNumber(player.number);
      
      // Finally open the dialog in a clean state
      playerManagement.setIsEditOpen(true);
    }, 10);
  };

  // Delete handler with clean state approach
  const handleDeletePlayer = () => {
    // Store a reference to the player being deleted
    const playerToDelete = playerManagement.selectedPlayer;
    
    // 1. Reset all dialog state FIRST
    playerManagement.setSelectedPlayer(null);
    playerManagement.setEditName("");
    playerManagement.setEditStatus("alive");
    playerManagement.setEditNumber(1);
    
    // 2. Then schedule the deletion to happen after state updates are processed
    if (playerToDelete) {
      setTimeout(() => {
        playerManagement.handleDeletePlayer();
      }, 100);
    }
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
      <GameHeader 
        gameName={game.name}
        gameId={game.id}
        onSetPasswordClick={() => setIsPasswordDialogOpen(true)}
        onAddPlayerClick={() => playerManagement.setIsAddOpen(true)}
      />

      <PlayerGrid 
        players={game.players}
        onEditPlayer={handleEditPlayer}
        onPhotoUpload={playerManagement.handlePhotoUpload}
      />

      <AddPlayerDialog 
        isOpen={playerManagement.isAddOpen}
        onOpenChange={playerManagement.setIsAddOpen}
        newPlayerName={playerManagement.newPlayerName}
        onNameChange={playerManagement.setNewPlayerName}
        onAdd={playerManagement.handleAddPlayer}
      />

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
        onDelete={handleDeletePlayer} // Use our local handler with improved cleanup
      />

      <SetPasswordDialog 
        gameId={game.id}
        isOpen={isPasswordDialogOpen}
        onOpenChange={setIsPasswordDialogOpen}
      />
    </div>
  );
};

export default GameManagement;
