
import { useState } from "react";
import { useParams } from "react-router-dom";
import { Player } from "@/types/game";
import { CoinRain } from "@/components/CoinRain";
import { useGameData } from "@/hooks/tv/use-game-data";
import { useJoinGame } from "@/hooks/tv/use-join-game";
import { usePlayerSubscription } from "@/hooks/tv/use-player-subscription";
import { Header } from "@/components/tv/Header";
import { PlayerGrid } from "@/components/tv/PlayerGrid";
import { WinnerDisplay } from "@/components/tv/WinnerDisplay";
import { JoinGameDialog } from "@/components/tv/JoinGameDialog";

const GameTvView = () => {
  const { gameId } = useParams();
  const { game, players, loading, setPlayers } = useGameData(gameId);
  const [showCoinRain, setShowCoinRain] = useState(false);

  // Handle player state updates
  const handleAddPlayer = (newPlayer: Player) => {
    setPlayers(current => [...current, newPlayer]);
  };

  const handleUpdatePlayer = (updatedPlayer: Player) => {
    setPlayers(current => 
      current.map(player => 
        player.id === updatedPlayer.id ? updatedPlayer : player
      )
    );
  };

  const handleDeletePlayer = (deletedPlayerId: string) => {
    setPlayers(current => 
      current.filter(player => player.id !== deletedPlayerId)
    );
  };

  // Set up real-time player updates
  usePlayerSubscription(
    gameId,
    handleAddPlayer,
    handleUpdatePlayer,
    handleDeletePlayer
  );

  // Join game functionality
  const { 
    isJoinDialogOpen, 
    setIsJoinDialogOpen, 
    handleJoinGame 
  } = useJoinGame(game, gameId || '', handleAddPlayer);

  // Calculate who is alive
  const alivePlayers = players.filter(player => player.status === 'alive');
  const automaticCoinRain = alivePlayers.length === 1;

  const toggleCoinRain = () => {
    setShowCoinRain(prev => !prev);
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-black p-8">
      <CoinRain isActive={showCoinRain || automaticCoinRain} />

      <Header 
        gameName={game?.name || "Game"} 
        onJoinClick={() => setIsJoinDialogOpen(true)}
        onCelebrationToggle={toggleCoinRain}
        showCoinRain={showCoinRain}
      />

      {automaticCoinRain && alivePlayers.length > 0 && (
        <WinnerDisplay winner={alivePlayers[0]} />
      )}

      <PlayerGrid players={players} />

      <JoinGameDialog
        isOpen={isJoinDialogOpen}
        onOpenChange={setIsJoinDialogOpen}
        onJoin={handleJoinGame}
      />
    </div>
  );
};

export default GameTvView;
