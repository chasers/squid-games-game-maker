
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { FaTv, FaKey, FaArrowLeft } from "react-icons/fa";

interface GameHeaderProps {
  gameName: string;
  gameId: string;
  onSetPasswordClick: () => void;
  onAddPlayerClick: () => void;
}

export const GameHeader = ({
  gameName,
  gameId,
  onSetPasswordClick,
  onAddPlayerClick,
}: GameHeaderProps) => {
  const tvViewUrl = `/tv/game/${gameId}`;

  return (
    <div className="flex justify-between items-center">
      <div className="flex items-center gap-4">
        <Link to="/dashboard">
          <Button variant="outline" size="icon">
            <FaArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-4xl font-bold">{gameName}</h1>
      </div>
      <div className="flex gap-4">
        <Button onClick={onSetPasswordClick} variant="outline">
          <FaKey className="mr-2 h-4 w-4" />
          Set Join Password
        </Button>
        <Link to={tvViewUrl} target="_blank">
          <Button variant="outline">
            <FaTv className="mr-2 h-4 w-4" />
            TV View
          </Button>
        </Link>
        <Button onClick={onAddPlayerClick}>
          Add Player
        </Button>
      </div>
    </div>
  );
};
