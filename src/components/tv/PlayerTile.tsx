
import React from "react";
import { Player } from "@/types/game";

interface PlayerTileProps {
  player: Player;
}

export const PlayerTile: React.FC<PlayerTileProps> = ({ player }) => {
  return (
    <div
      className={`aspect-square relative overflow-hidden rounded-lg ${
        player.status === 'eliminated' ? 'opacity-50 grayscale' : ''
      }`}
    >
      {player.photoUrl ? (
        <img
          src={player.photoUrl}
          alt={player.name}
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="w-full h-full bg-gray-800 flex items-center justify-center">
          <span className="text-6xl text-white">{player.number}</span>
        </div>
      )}
      <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-2">
        <div className="text-lg font-bold">{player.number}</div>
        <div className="text-sm truncate">{player.name}</div>
      </div>
    </div>
  );
};
