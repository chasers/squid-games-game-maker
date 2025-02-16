
import { Button } from "@/components/ui/button";
import { LogOut, Plus, Target, Skull } from "lucide-react";
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
    <div className="flex flex-col space-y-4 mb-8">
      <div className="flex items-center justify-center space-x-2 mb-2">
        <Target className="h-8 w-8 text-squid-pink" />
        <Skull className="h-8 w-8 text-squid-pink" />
        <h1 className="text-4xl font-bold text-squid-pink">
          Squid Game Maker
        </h1>
      </div>
      
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-foreground">My Games</h2>
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
    </div>
  );
};
