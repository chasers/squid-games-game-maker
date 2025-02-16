import { useState } from "react";
import { useParams } from "react-router-dom";
import { Player } from "@/types/game";
import { toast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useGameManagement } from "@/hooks/use-game-management";
import { PlayerCard } from "@/components/game/PlayerCard";
import { Link } from "react-router-dom";
import { FaTv } from "react-icons/fa";

const GameManagement = () => {
  const { gameId } = useParams();
  const { game, loading, ...playerManagement } = useGameManagement(gameId || '');
  const tvViewUrl = `/tv/game/${gameId}`;

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
        <h1 className="text-4xl font-bold">{game.name}</h1>
        <div className="flex gap-4">
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
        {game.players.map((player) => (
          <PlayerCard
            key={player.id}
            player={player}
            onEdit={(player) => {
              playerManagement.setSelectedPlayer(player);
              playerManagement.setEditName(player.name);
              playerManagement.setEditStatus(player.status);
              playerManagement.setEditNumber(player.number);
              playerManagement.setIsEditOpen(true);
            }}
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

      <Dialog open={playerManagement.isEditOpen} onOpenChange={playerManagement.setIsEditOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Player</DialogTitle>
            <DialogDescription>
              Edit the selected player.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                value={playerManagement.editName}
                onChange={(e) => playerManagement.setEditName(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="number" className="text-right">
                Number
              </Label>
              <Input
                id="number"
                type="number"
                value={playerManagement.editNumber}
                onChange={(e) => playerManagement.setEditNumber(Number(e.target.value))}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="status" className="text-right">
                Status
              </Label>
              <Select onValueChange={playerManagement.setEditStatus}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Status" defaultValue={playerManagement.editStatus} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="alive">Alive</SelectItem>
                  <SelectItem value="eliminated">Eliminated</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button onClick={playerManagement.handleEditPlayer}>
            Update
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default GameManagement;
