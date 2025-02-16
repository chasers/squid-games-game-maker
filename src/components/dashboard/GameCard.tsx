
import { Game } from "@/types/game";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { FaTv } from "react-icons/fa";

interface GameCardProps {
  game: Game;
  onManage: (gameId: string) => void;
}

export const GameCard = ({ game, onManage }: GameCardProps) => {
  const tvViewUrl = `/tv/game/${game.id}`;

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div>
          <h3 className="text-2xl font-bold">{game.name}</h3>
          <p className="text-sm text-muted-foreground">
            Created on {format(new Date(game.createdAt), 'MMM d, yyyy')}
          </p>
          <p className="text-sm text-muted-foreground">
            Status: {game.status}
          </p>
        </div>

        <div>
          <p className="font-medium">
            {game.players.length} Player{game.players.length !== 1 ? 's' : ''}
          </p>
          <p className="text-sm text-muted-foreground">
            {game.players.filter(p => p.status === 'alive').length} Alive
          </p>
        </div>

        <div className="flex gap-4">
          <Button onClick={() => onManage(game.id)}>
            Manage Game
          </Button>
          <Link to={tvViewUrl} target="_blank">
            <Button variant="outline">
              <FaTv className="mr-2 h-4 w-4" />
              TV View
            </Button>
          </Link>
        </div>
      </div>
    </Card>
  );
};
