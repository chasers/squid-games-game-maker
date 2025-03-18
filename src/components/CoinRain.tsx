
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface CoinRainProps {
  isActive: boolean;
}

export const CoinRain = ({ isActive }: CoinRainProps) => {
  const [coins, setCoins] = useState<{ id: number; left: number; speed: number; rotate: number; size: number }[]>([]);
  const [piledCoins, setPiledCoins] = useState<{ id: number; left: number; bottom: number; rotate: number; size: number }[]>([]);

  useEffect(() => {
    if (!isActive) {
      setCoins([]);
      setPiledCoins([]);
      return;
    }

    // Create initial coins with larger sizes
    const initialCoins = Array.from({ length: 30 }, (_, i) => ({
      id: i,
      left: Math.random() * 100, // random position across width (%)
      speed: 3 + Math.random() * 4, // random speed
      rotate: Math.random() * 360, // random rotation
      size: 32 + Math.random() * 32, // random size between 32-64px (bigger than before)
    }));

    setCoins(initialCoins);

    // Animation interval to add more coins
    const coinInterval = setInterval(() => {
      if (isActive) {
        setCoins(prev => [
          ...prev,
          {
            id: Date.now(),
            left: Math.random() * 100,
            speed: 3 + Math.random() * 4,
            rotate: Math.random() * 360,
            size: 32 + Math.random() * 32, // random size between 32-64px (bigger than before)
          }
        ]);
      }
    }, 300);

    // Create interval to add piled up coins at the bottom
    const pileInterval = setInterval(() => {
      if (isActive) {
        const newCoin = {
          id: Date.now() + 1000, // Make sure IDs are unique
          left: Math.random() * 100,
          bottom: Math.random() * 10, // Random height from bottom (0-10%)
          rotate: Math.random() * 45 - 22.5, // Random rotation between -22.5 and 22.5 degrees
          size: 32 + Math.random() * 32,
        };
        
        setPiledCoins(prev => [...prev].concat(newCoin).slice(-100)); // Keep max 100 coins in the pile
      }
    }, 200);

    return () => {
      clearInterval(coinInterval);
      clearInterval(pileInterval);
    };
  }, [isActive]);

  if (!isActive) return null;

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-50">
      {coins.map((coin) => (
        <div
          key={coin.id}
          className="absolute top-0 animate-fall"
          style={{
            left: `${coin.left}%`,
            animationDuration: `${coin.speed}s`,
            transform: `rotate(${coin.rotate}deg)`,
          }}
        >
          <div
            className="rounded-full bg-gradient-to-br from-yellow-300 to-amber-500 flex items-center justify-center shadow-lg"
            style={{ 
              width: coin.size, 
              height: coin.size,
              border: '2px solid #FFC107'
            }}
          >
            <span 
              className="text-amber-800 font-bold"
              style={{ 
                fontSize: `${coin.size * 0.5}px`,
                textShadow: '0px 1px 2px rgba(0,0,0,0.1)'
              }}
            >
              $
            </span>
          </div>
        </div>
      ))}
      
      {/* Piled up coins at the bottom */}
      {piledCoins.map((coin) => (
        <div
          key={coin.id}
          className="absolute z-[51] animate-bounce-small"
          style={{
            left: `${coin.left}%`,
            bottom: `${coin.bottom}%`,
            transform: `rotate(${coin.rotate}deg)`,
          }}
        >
          <div
            className="rounded-full bg-gradient-to-br from-yellow-300 to-amber-500 flex items-center justify-center shadow-lg"
            style={{ 
              width: coin.size, 
              height: coin.size,
              border: '2px solid #FFC107'
            }}
          >
            <span 
              className="text-amber-800 font-bold"
              style={{ 
                fontSize: `${coin.size * 0.5}px`,
                textShadow: '0px 1px 2px rgba(0,0,0,0.1)'
              }}
            >
              $
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};
