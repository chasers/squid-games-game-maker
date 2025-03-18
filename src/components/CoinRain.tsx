
import { useEffect, useState } from "react";
import { Coins } from "lucide-react";
import { cn } from "@/lib/utils";

interface CoinRainProps {
  isActive: boolean;
}

export const CoinRain = ({ isActive }: CoinRainProps) => {
  const [coins, setCoins] = useState<{ id: number; left: number; speed: number; rotate: number; size: number }[]>([]);

  useEffect(() => {
    if (!isActive) {
      setCoins([]);
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

    return () => {
      clearInterval(coinInterval);
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
          <Coins 
            className="text-amber-500 drop-shadow-lg" 
            style={{ width: coin.size, height: coin.size }} 
            strokeWidth={1.5} // Thinner stroke for a more golden appearance
          />
        </div>
      ))}
    </div>
  );
};
