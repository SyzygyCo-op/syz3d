import {Object3D, Vector3, Euler, PerspectiveCamera} from "three";

const v1 = new Vector3();
const v2 = new Vector3();
const v3 = new Vector3();
const o1 = new Object3D();

const DEGREES_TO_RADIANS = Math.PI / 180;

/**
 * @param {number}  x
 * @param {number}  y
 * @param {number}  z
  * @param {string?} order
 */
export function getForwardNormal(x, y, z, order = 'YXZ') {
  o1.rotation.set(x, y, z, order)
  o1.getWorldDirection(v1);

  v1.y = 0;
  v1.normalize();

  return v1;
}

/** @param {Vector3} objectPos
  * @param {PerspectiveCamera} camera
  */
export function isOnCamera(objectPos, camera) {
  const cameraPos = v1.setFromMatrixPosition(camera.matrixWorld)
  const deltaCamObj = objectPos.sub(cameraPos)
  const camDir = camera.getWorldDirection(v3)
  return deltaCamObj.angleTo(camDir) > Math.PI / 2
}

