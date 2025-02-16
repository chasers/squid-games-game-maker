
import { Button } from "@/components/ui/button";
import { DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

interface CreateGameDialogProps {
  newGameName: string;
  onNameChange: (value: string) => void;
  onCreateGame: () => void;
}

export const CreateGameDialog = ({
  newGameName,
  onNameChange,
  onCreateGame,
}: CreateGameDialogProps) => {
  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Create New Game</DialogTitle>
      </DialogHeader>
      <div className="space-y-4 pt-4">
        <Input
          placeholder="Game Name"
          value={newGameName}
          onChange={(e) => onNameChange(e.target.value)}
          className="input-focus"
        />
        <Button
          onClick={onCreateGame}
          className="w-full bg-squid-pink hover:bg-squid-pink/90 button-hover"
        >
          Create Game
        </Button>
      </div>
    </DialogContent>
  );
};
