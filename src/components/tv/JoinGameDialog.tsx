
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface JoinGameDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onJoin: (name: string, password: string, photo: File | null) => Promise<void>;
}

export const JoinGameDialog: React.FC<JoinGameDialogProps> = ({
  isOpen,
  onOpenChange,
  onJoin,
}) => {
  const [playerName, setPlayerName] = useState("");
  const [joinPassword, setJoinPassword] = useState("");
  const [selectedPhoto, setSelectedPhoto] = useState<File | null>(null);

  const handleJoin = async () => {
    await onJoin(playerName, joinPassword, selectedPhoto);
    // Reset form fields after join attempt (successful or not)
    setPlayerName("");
    setJoinPassword("");
    setSelectedPhoto(null);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Join Game</DialogTitle>
          <DialogDescription>
            Enter your name and the game password to join.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input
              id="name"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              className="col-span-3"
              placeholder="Enter your name"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="joinPassword" className="text-right">
              Password
            </Label>
            <Input
              id="joinPassword"
              type="password"
              value={joinPassword}
              onChange={(e) => setJoinPassword(e.target.value)}
              className="col-span-3"
              placeholder="Enter game password"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="photo" className="text-right">
              Photo
            </Label>
            <Input
              id="photo"
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  setSelectedPhoto(file);
                }
              }}
              className="col-span-3"
            />
          </div>
        </div>
        <Button onClick={handleJoin}>
          Join Game
        </Button>
      </DialogContent>
    </Dialog>
  );
};
