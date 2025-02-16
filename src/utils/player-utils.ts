
export const generateRandomNumber = () => {
  return Math.floor(Math.random() * 456) + 1;
};

export const transformPlayerData = (player: any) => ({
  id: player.id,
  name: player.name,
  status: player.status as 'alive' | 'eliminated',
  gameId: player.game_id,
  number: player.number,
  photoUrl: player.photo_url
});
