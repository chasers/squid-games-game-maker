
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface AddPlayerDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  newPlayerName: string;
  onNameChange: (name: string) => void;
  onAdd: () => void;
}

export const AddPlayerDialog = ({
  isOpen,
  onOpenChange,
  newPlayerName,
  onNameChange,
  onAdd,
}: AddPlayerDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
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
              value={newPlayerName}
              onChange={(e) => onNameChange(e.target.value)}
              className="col-span-3"
            />
          </div>
        </div>
        <Button onClick={onAdd}>
          Add Player
        </Button>
      </DialogContent>
    </Dialog>
  );
};
