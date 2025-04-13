
import React from "react";
import { Button } from "@/components/ui/button";
import { SquidLogo } from "@/components/SquidLogo";
import { PartyPopper } from "lucide-react";

interface HeaderProps {
  gameName: string;
  onJoinClick: () => void;
  onCelebrationToggle: () => void;
  showCoinRain: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  gameName,
  onJoinClick,
  onCelebrationToggle,
  showCoinRain,
}) => {
  return (
    <div className="absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-squid-pink/20 to-transparent">
      <div className="container mx-auto">
        <div className="flex items-center justify-between">
          <SquidLogo />
          <div className="flex gap-2">
            <Button 
              onClick={onCelebrationToggle} 
              className="bg-yellow-500 hover:bg-yellow-600 shadow-lg shadow-yellow-500/20"
              variant="default"
            >
              <PartyPopper className="mr-2" />
              {showCoinRain ? "Stop Celebration" : "Celebrate"}
            </Button>
            <Button 
              onClick={onJoinClick}
              className="bg-squid-pink hover:bg-squid-pink/90 shadow-lg shadow-squid-pink/20"
            >
              Join Game
            </Button>
          </div>
        </div>
        <div className="mt-8 text-center">
          <h1 className="text-6xl font-bold text-white mb-2 tracking-tight">
            {gameName}
          </h1>
          <div className="h-1 w-32 bg-squid-pink mx-auto rounded-full opacity-50" />
        </div>
      </div>
    </div>
  );
};
