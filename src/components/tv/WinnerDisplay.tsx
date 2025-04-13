
import React from "react";
import { Player } from "@/types/game";

interface WinnerDisplayProps {
  winner: Player;
}

export const WinnerDisplay: React.FC<WinnerDisplayProps> = ({ winner }) => {
  return (
    <div className="absolute top-1/4 left-0 right-0 text-center z-40">
      <div className="animate-bounce">
        <h2 className="text-8xl font-bold text-yellow-400 mb-4 drop-shadow-lg">
          WINNER!
        </h2>
        <h3 className="text-4xl font-bold text-white">
          {winner.name} #{winner.number}
        </h3>
      </div>
    </div>
  );
};
