
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Game } from "@/types/game";

interface GameCardProps {
  game: Game;
  onManage: (gameId: string) => void;
}

export const GameCard = ({ game, onManage }: GameCardProps) => {
  return (
    <Card className="p-6 card-hover">
      <div className="space-y-4">
        <div>
          <h3 className="text-xl font-semibold">{game.name}</h3>
          <p className="text-sm text-muted-foreground">
            Created {new Date(game.createdAt).toLocaleDateString()}
          </p>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm">
            {game.players.length} Players
          </span>
          <Button
            variant="outline"
            className="button-hover"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onManage(game.id);
            }}
          >
            Manage
          </Button>
        </div>
      </div>
    </Card>
  );
};
