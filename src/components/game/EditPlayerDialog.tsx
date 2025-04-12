
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Toggle } from "@/components/ui/toggle";
import { Skull, Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useState } from "react";

interface EditPlayerDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  editName: string;
  onNameChange: (name: string) => void;
  editStatus: 'alive' | 'eliminated';
  onStatusChange: (status: 'alive' | 'eliminated') => void;
  editNumber: number;
  onNumberChange: (number: number) => void;
  onSave: () => void;
  onDelete: () => void;
}

export const EditPlayerDialog = ({
  isOpen,
  onOpenChange,
  editName,
  onNameChange,
  editStatus,
  onStatusChange,
  editNumber,
  onNumberChange,
  onSave,
  onDelete,
}: EditPlayerDialogProps) => {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Player</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <Input
              placeholder="Player Name"
              value={editName}
              onChange={(e) => onNameChange(e.target.value)}
              className="input-focus"
            />
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Player Status:</span>
              <Toggle
                pressed={editStatus === 'eliminated'}
                onPressedChange={(pressed) => {
                  onStatusChange(pressed ? 'eliminated' : 'alive');
                }}
                className="data-[state=on]:bg-red-500"
              >
                <Skull className="h-4 w-4 mr-2" />
                {editStatus === 'eliminated' ? 'Eliminated' : 'Alive'}
              </Toggle>
            </div>
            <div className="space-y-2">
              <label htmlFor="playerNumber" className="text-sm font-medium">
                Player Number (1-456):
              </label>
              <Input
                id="playerNumber"
                type="number"
                min="1"
                max="456"
                value={editNumber}
                onChange={(e) => onNumberChange(Number(e.target.value))}
                className="input-focus"
              />
            </div>
            <div className="flex gap-2">
              <Button
                onClick={onSave}
                className="flex-1 bg-squid-pink hover:bg-squid-pink/90 button-hover"
              >
                Save Changes
              </Button>
              <Button
                onClick={() => setIsDeleteDialogOpen(true)}
                variant="destructive"
                className="button-hover"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the player
              from the game.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                onDelete();
                setIsDeleteDialogOpen(false);
              }}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
