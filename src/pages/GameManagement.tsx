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

  const handleEditPlayer = (player: Player) => {
    playerManagement.setEditLosses(player.losses || 0);
    playerManagement.setIsEditOpen(false);
    setTimeout(() => {
      playerManagement.setSelectedPlayer(player);
      playerManagement.setEditName(player.name);
      playerManagement.setEditStatus(player.status);
      playerManagement.setEditNumber(player.number);
      playerManagement.setEditLosses(player.losses || 0);
      playerManagement.setIsEditOpen(true);
    }, 10);
  };

  const handleDeletePlayer = () => {
    const playerToDelete = playerManagement.selectedPlayer;
    playerManagement.setSelectedPlayer(null);
    playerManagement.setEditName("");
    playerManagement.setEditStatus("alive");
    playerManagement.setEditNumber(1);
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
        editLosses={playerManagement.editLosses}
        onLossesChange={playerManagement.setEditLosses}
        onSave={playerManagement.handleEditPlayer}
        onDelete={handleDeletePlayer}
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
