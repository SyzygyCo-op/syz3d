export function getPlayerId() {
  // @ts-ignore
  return parseInt(window.PLAYER_ID, 10);
}

export function getPlayerName() {
  // @ts-ignore
  return window.PLAYER_NAME;
}

export function getPlayerEntityId() {
  return `player:${getPlayerId()}`;
}

export function getRoomToken() {
  // @ts-ignore
  return window.ROOM_TOKEN;
}

export { debounceBoundFn } from "./async";

export { getForwardNormal } from "./math";
