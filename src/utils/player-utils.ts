
export const transformPlayerData = (player: any) => ({
  id: player.id,
  name: player.name,
  status: player.status as 'alive' | 'eliminated',
  gameId: player.game_id,
  number: player.number,
  photoUrl: player.photo_url,
  losses: player.losses || 0 // Add losses, defaulting to 0 if not present
});
