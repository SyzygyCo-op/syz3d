
export function getPlayerId() {
  // @ts-ignore
  return window.PLAYER_ID;
}

export function getPlayerEntityId() {
  return `player:${getPlayerId()}`;
}

export function getRoomToken() {
  // @ts-ignore
  return window.ROOM_TOKEN;
}
