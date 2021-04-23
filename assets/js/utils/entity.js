import {Entity} from 'dreamt';
import {getPlayerId} from '.';
import {OwnershipComponent, PlayerTag} from '../components';

/** @param {Entity} entity */
export function isPlayer(entity) {
  return entity.hasComponent(PlayerTag);
}

export function hasOwner(entity) {
  return entity.hasComponent(OwnershipComponent);
}

/** @param {Entity} entity */
export function isMine(entity) {
  return entity.getComponent(OwnershipComponent).value === getPlayerId();
}

