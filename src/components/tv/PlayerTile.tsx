
import React from "react";
import { Player } from "@/types/game";

// Utility function to pad player number with leading zeros
const formatPlayerNumber = (number: number): string => {
  return number.toString().padStart(3, '0');
};

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
          <span className="text-6xl text-white">{formatPlayerNumber(player.number)}</span>
        </div>
      )}
      <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-2">
        <div className="text-lg font-bold">{formatPlayerNumber(player.number)}</div>
        <div className="text-sm truncate">{player.name}</div>
      </div>
      {/* Left-justify loss dots */}
      <div className="absolute bottom-1 left-1 flex space-x-1">
        {[...Array(player.losses)].map((_, index) => (
          <div 
            key={index} 
            className="w-2 h-2 bg-red-500 rounded-full"
          />
        ))}
      </div>
    </div>
  );
};
