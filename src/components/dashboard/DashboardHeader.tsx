
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { Plus } from "lucide-react";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";

interface DashboardHeaderProps {
  onOpenCreateGame: () => void;
  onLogout: () => void;
  isCreateGameOpen: boolean;
}

export const DashboardHeader = ({
  onOpenCreateGame,
  onLogout,
  isCreateGameOpen,
}: DashboardHeaderProps) => {
  return (
    <div className="flex justify-between items-center">
      <h1 className="text-3xl font-bold text-squid-pink">My Games</h1>
      <div className="flex gap-4">
        <Dialog open={isCreateGameOpen} onOpenChange={onOpenCreateGame}>
          <DialogTrigger asChild>
            <Button className="bg-squid-pink hover:bg-squid-pink/90 button-hover">
              <Plus className="mr-2 h-4 w-4" />
              New Game
            </Button>
          </DialogTrigger>
        </Dialog>
        <Button
          variant="outline"
          onClick={onLogout}
          className="button-hover"
        >
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </div>
    </div>
  );
};
