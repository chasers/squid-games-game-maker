
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

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
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Player</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 pt-4">
          <Input
            placeholder="Player Name"
            value={newPlayerName}
            onChange={(e) => onNameChange(e.target.value)}
            className="input-focus"
          />
          <Button
            onClick={onAdd}
            className="w-full bg-squid-pink hover:bg-squid-pink/90 button-hover"
          >
            Add Player
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
