
import React from "react";
import { Player } from "@/types/game";
import { PlayerTile } from "./PlayerTile";

interface PlayerGridProps {
  players: Player[];
}

export const PlayerGrid: React.FC<PlayerGridProps> = ({ players }) => {
  return (
    <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 mt-48">
      {players.map((player) => (
        <PlayerTile key={player.id} player={player} />
      ))}
    </div>
  );
};
