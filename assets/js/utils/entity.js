import {Entity} from 'dreamt';
import {getPlayerId} from '.';
import {OwnershipComponent, PlayerTag} from '../components';

/** @param {Entity} entity */
export function isPlayer(entity) {
  return entity.hasComponent(PlayerTag);
}

/** @param {Entity} entity */
function getOwner(entity) {
  return entity.hasComponent(OwnershipComponent)
    ? entity.getComponent(OwnershipComponent).value
    : null;
}

/** @param {Entity} entity */
export function isMine(entity) {
  return getOwner(entity) !== null && getOwner(entity) === getPlayerId();
}

