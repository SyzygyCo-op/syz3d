import { Euler, Object3D, Quaternion, Vector3 } from "three";

const PI_2 = Math.PI / 2;
const minPolarAngle = 0;
const maxPolarAngle = Math.PI;
const moveableEuler = new Euler(0, 0, 0, "YXZ");
const moveableQuaternion = new Quaternion();

/**
 * @param {number} movementX
 * @param {number} movementY
 */
export function moveMoveableEuler(movementX, movementY) {
  moveableEuler.setFromQuaternion(moveableQuaternion);

  moveableEuler.y -= movementX;
  moveableEuler.x += movementY;

  moveableEuler.x = Math.max(
    PI_2 - maxPolarAngle,
    Math.min(PI_2 - minPolarAngle, moveableEuler.x)
  );

  moveableQuaternion.setFromEuler(moveableEuler);

  return moveableEuler;
}

/**
  * @param {Euler} euler
  */
export function setMoveableEuler(euler) {
  moveableEuler.copy(euler);
  moveableQuaternion.setFromEuler(euler);
}

