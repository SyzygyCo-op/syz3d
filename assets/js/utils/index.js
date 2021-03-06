import { GAME_LOOP_DURATION, GAME_LOOPS_PER_NETWORK_FRAME } from "../config";

export { debounceBoundFn } from "./async";

export { getForwardNormal, isOnCamera } from "./math";

export { isPlayer, isMine, hasOwner } from "./entity";

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

/** Amount of time between each exchange of data with the server, in miliseconds */
export function getNetworkFrameDuration() {
  return GAME_LOOP_DURATION * GAME_LOOPS_PER_NETWORK_FRAME;
}
