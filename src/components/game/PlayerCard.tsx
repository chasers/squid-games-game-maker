
import { Player } from "@/types/game";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Pencil } from "lucide-react";

// Utility function to pad player number with leading zeros
const formatPlayerNumber = (number: number): string => {
  return number.toString().padStart(3, '0');
};

interface PlayerCardProps {
  player: Player;
  onEdit: (player: Player) => void;
  onPhotoUpload: (playerId: string, file: File) => void;
}

export const PlayerCard = ({ player, onEdit, onPhotoUpload }: PlayerCardProps) => {
  return (
    <Card
      className={`p-6 card-hover ${
        player.status === 'eliminated' ? 'opacity-75' : ''
      }`}
    >
      <div className="space-y-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className={`text-xl font-semibold ${
              player.status === 'eliminated' ? 'line-through' : ''
            }`}>
              {player.name}
            </h3>
            <p className={`text-sm ${
              player.status === 'eliminated' 
                ? 'text-red-500' 
                : 'text-green-500'
            }`}>
              Status: {player.status}
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              Player #{formatPlayerNumber(player.number)}
            </p>
            <div className="flex items-center mt-1 space-x-1">
              <span className="text-sm text-muted-foreground">Losses:</span>
              <div className="flex space-x-1">
                {[...Array(player.losses || 0)].map((_, index) => (
                  <div 
                    key={index} 
                    className="w-2 h-2 bg-red-500 rounded-full"
                  />
                ))}
                {player.losses === 0 && <span className="text-sm text-muted-foreground">0</span>}
              </div>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onEdit(player)}
          >
            <Pencil className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex flex-col items-center space-y-2">
          {player.photoUrl && (
            <img
              src={player.photoUrl}
              alt={player.name}
              className={`w-20 h-20 rounded-full object-cover ${
                player.status === 'eliminated' ? 'grayscale' : ''
              }`}
            />
          )}
          <Input
            type="file"
            accept="image/*"
            className="max-w-[200px]"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                onPhotoUpload(player.id, file);
              }
            }}
          />
        </div>
      </div>
    </Card>
  );
};
