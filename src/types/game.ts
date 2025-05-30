
export interface Player {
  id: string;
  name: string;
  photoUrl?: string;
  status: 'alive' | 'eliminated';
  gameId: string;
  number: number;
  removed?: boolean;
  losses: number; // Added losses field
}

export interface Game {
  id: string;
  name: string;
  createdAt: string;
  ownerId: string;
  status: 'pending' | 'in-progress' | 'completed';
  players: Player[];
  joinPassword?: string;
}
