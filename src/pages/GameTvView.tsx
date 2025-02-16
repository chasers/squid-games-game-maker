
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Player } from "@/types/game";
import { supabase } from "@/integrations/supabase/client";
import { transformPlayerData } from "@/utils/player-utils";

const GameTvView = () => {
  const { gameId } = useParams();
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const { data: playersData, error } = await supabase
          .from('players')
          .select('*')
          .eq('game_id', gameId)
          .order('number', { ascending: true });

        if (error) throw error;

        if (playersData) {
          setPlayers(playersData.map(transformPlayerData));
        }
      } catch (error) {
        console.error('Error fetching players:', error);
      } finally {
        setLoading(false);
      }
    };

    if (gameId) {
      fetchPlayers();
    }
  }, [gameId]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-black p-8">
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
