
import { Player } from "@/types/game";
import { PlayerCard } from "@/components/game/PlayerCard";

interface PlayerGridProps {
  players: Player[];
  onEditPlayer: (player: Player) => void;
  onPhotoUpload: (playerId: string, file: File) => void;
}

export const PlayerGrid = ({
  players,
  onEditPlayer,
  onPhotoUpload,
}: PlayerGridProps) => {
  const activePlayers = players.filter(player => !player.removed);
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {activePlayers.map((player) => (
        <PlayerCard
          key={player.id}
          player={player}
          onEdit={onEditPlayer}
          onPhotoUpload={onPhotoUpload}
        />
      ))}
    </div>
  );
};
