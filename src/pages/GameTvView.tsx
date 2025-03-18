import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Player, Game } from "@/types/game";
import { supabase } from "@/integrations/supabase/client";
import { transformPlayerData } from "@/utils/player-utils";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { generateRandomNumber } from "@/utils/player-utils";
import { SquidLogo } from "@/components/SquidLogo";
import { CoinRain } from "@/components/CoinRain";

const transformGameData = (gameData: any): Game => {
  return {
    id: gameData.id,
    name: gameData.name,
    createdAt: gameData.created_at,
    ownerId: gameData.owner_id,
    status: gameData.status,
    joinPassword: gameData.join_password,
    players: [] // Players will be set separately
  };
};

const GameTvView = () => {
  const { gameId } = useParams();
  const [players, setPlayers] = useState<Player[]>([]);
  const [game, setGame] = useState<Game | null>(null);
  const [loading, setLoading] = useState(true);
  const [isJoinDialogOpen, setIsJoinDialogOpen] = useState(false);
  const [joinPassword, setJoinPassword] = useState("");
  const [playerName, setPlayerName] = useState("");
  const [selectedPhoto, setSelectedPhoto] = useState<File | null>(null);

  const alivePlayers = players.filter(player => player.status === 'alive');
  const showCoinRain = alivePlayers.length === 1;

  useEffect(() => {
    const fetchGameAndPlayers = async () => {
      try {
        const [gameResponse, playersResponse] = await Promise.all([
          supabase
            .from('games')
            .select('*')
            .eq('id', gameId)
            .single(),
          supabase
            .from('players')
            .select('*')
            .eq('game_id', gameId)
            .order('number', { ascending: true })
        ]);

        if (gameResponse.error) throw gameResponse.error;
        if (playersResponse.error) throw playersResponse.error;

        if (gameResponse.data) {
          const transformedGame = transformGameData(gameResponse.data);
          setGame(transformedGame);
        }

        if (playersResponse.data) {
          setPlayers(playersResponse.data.map(transformPlayerData));
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (gameId) {
      fetchGameAndPlayers();
    }
  }, [gameId]);

  const handlePhotoUpload = async (playerId: string, file: File) => {
    try {
      const fileExt = file.name.split('.').pop();
      const filePath = `${playerId}-${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('player-photos')
        .upload(filePath, file, {
          upsert: true,
          cacheControl: '3600'
        });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('player-photos')
        .getPublicUrl(filePath);

      const { data: updatedPlayer, error: updateError } = await supabase
        .from('players')
        .update({ photo_url: publicUrl })
        .eq('id', playerId)
        .select()
        .single();

      if (updateError) throw updateError;
      
      if (updatedPlayer) {
        return transformPlayerData(updatedPlayer);
      }
    } catch (error) {
      console.error('Photo upload error:', error);
      throw error;
    }
  };

  const handleJoinGame = async () => {
    if (!game || !gameId) return;

    if (game.joinPassword !== joinPassword) {
      toast({
        title: "Error",
        description: "Incorrect password",
        variant: "destructive",
      });
      return;
    }

    try {
      const { data: newPlayer, error } = await supabase
        .from('players')
        .insert([{
          name: playerName,
          game_id: gameId,
          number: generateRandomNumber(),
          status: 'alive'
        }])
        .select()
        .single();

      if (error) throw error;

      if (newPlayer) {
        let updatedPlayer = transformPlayerData(newPlayer);
        
        if (selectedPhoto) {
          try {
            updatedPlayer = await handlePhotoUpload(newPlayer.id, selectedPhoto);
          } catch (uploadError) {
            toast({
              title: "Warning",
              description: "Joined game but failed to upload photo",
              variant: "destructive",
            });
          }
        }

        setPlayers(prev => [...prev, updatedPlayer]);
        setIsJoinDialogOpen(false);
        setJoinPassword("");
        setPlayerName("");
        setSelectedPhoto(null);
        toast({
          title: "Success",
          description: "Successfully joined the game!",
        });
      }
    } catch (error) {
      console.error('Error joining game:', error);
      toast({
        title: "Error",
        description: "Failed to join the game",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-black p-8">
      <CoinRain isActive={showCoinRain} />

      <div className="absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-squid-pink/20 to-transparent">
        <div className="container mx-auto">
          <div className="flex items-center justify-between">
            <SquidLogo />
            <Button 
              onClick={() => setIsJoinDialogOpen(true)}
              className="bg-squid-pink hover:bg-squid-pink/90 shadow-lg shadow-squid-pink/20"
            >
              Join Game
            </Button>
          </div>
          <div className="mt-8 text-center">
            <h1 className="text-6xl font-bold text-white mb-2 tracking-tight">
              {game?.name}
            </h1>
            <div className="h-1 w-32 bg-squid-pink mx-auto rounded-full opacity-50" />
          </div>
        </div>
      </div>

      {showCoinRain && (
        <div className="absolute top-1/4 left-0 right-0 text-center z-40">
          <div className="animate-bounce">
            <h2 className="text-8xl font-bold text-yellow-400 mb-4 drop-shadow-lg">
              WINNER!
            </h2>
            <h3 className="text-4xl font-bold text-white">
              {alivePlayers[0]?.name} #{alivePlayers[0]?.number}
            </h3>
          </div>
        </div>
      )}

      <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 mt-48">
        {players.map((player) => (
          <div
            key={player.id}
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
        ))}
      </div>

      <Dialog open={isJoinDialogOpen} onOpenChange={setIsJoinDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Join Game</DialogTitle>
            <DialogDescription>
              Enter your name and the game password to join.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                className="col-span-3"
                placeholder="Enter your name"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="joinPassword" className="text-right">
                Password
              </Label>
              <Input
                id="joinPassword"
                type="password"
                value={joinPassword}
                onChange={(e) => setJoinPassword(e.target.value)}
                className="col-span-3"
                placeholder="Enter game password"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="photo" className="text-right">
                Photo
              </Label>
              <Input
                id="photo"
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setSelectedPhoto(file);
                  }
                }}
                className="col-span-3"
              />
            </div>
          </div>
          <Button onClick={handleJoinGame}>
            Join Game
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default GameTvView;
