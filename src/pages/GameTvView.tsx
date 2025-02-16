
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Player, Game } from "@/types/game";
import { supabase } from "@/integrations/supabase/client";
import { transformPlayerData } from "@/utils/player-utils";

const GameTvView = () => {
  const { gameId } = useParams();
  const [players, setPlayers] = useState<Player[]>([]);
  const [game, setGame] = useState<Game | null>(null);
  const [loading, setLoading] = useState(true);

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
          setGame(gameResponse.data);
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

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-black p-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white text-center">
          {game?.name}
        </h1>
      </div>
      <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
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
    </div>
  );
};

export default GameTvView;
