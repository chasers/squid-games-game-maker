
import { Player } from "@/types/game";
import { useAddPlayer } from "./player/use-add-player";
import { useEditPlayer } from "./player/use-edit-player";
import { useDeletePlayer } from "./player/use-delete-player";
import { usePlayerPhoto } from "./player/use-player-photo";

export const usePlayerManagement = (gameId: string, onPlayerUpdate: (updatedPlayer: Player) => void) => {
  const addPlayerHook = useAddPlayer(gameId, onPlayerUpdate);
  const editPlayerHook = useEditPlayer(onPlayerUpdate);
  const playerPhotoHook = usePlayerPhoto(onPlayerUpdate);

  // Configure delete player hook with necessary dependencies
  const deletePlayerHook = useDeletePlayer(
    editPlayerHook.selectedPlayer, 
    onPlayerUpdate, 
    () => {
      editPlayerHook.setSelectedPlayer(null);
      editPlayerHook.setIsEditOpen(false);
    }
  );

  return {
    // Add player functionality
    newPlayerName: addPlayerHook.newPlayerName,
    setNewPlayerName: addPlayerHook.setNewPlayerName,
    isAddOpen: addPlayerHook.isAddOpen,
    setIsAddOpen: addPlayerHook.setIsAddOpen,
    handleAddPlayer: addPlayerHook.handleAddPlayer,
    
    // Edit player functionality
    isEditOpen: editPlayerHook.isEditOpen,
    setIsEditOpen: editPlayerHook.setIsEditOpen,
    selectedPlayer: editPlayerHook.selectedPlayer,
    setSelectedPlayer: editPlayerHook.setSelectedPlayer,
    editName: editPlayerHook.editName,
    setEditName: editPlayerHook.setEditName,
    editStatus: editPlayerHook.editStatus,
    setEditStatus: editPlayerHook.setEditStatus,
    editNumber: editPlayerHook.editNumber,
    setEditNumber: editPlayerHook.setEditNumber,
    handleEditPlayer: editPlayerHook.handleEditPlayer,
    
    // Delete player functionality
    handleDeletePlayer: deletePlayerHook.handleDeletePlayer,
    
    // Photo upload functionality
    handlePhotoUpload: playerPhotoHook.handlePhotoUpload,
  };
};
