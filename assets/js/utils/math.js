import {Object3D, Vector3, Euler} from "three";

const tempVec3 = new Vector3();
const tempObject3D = new Object3D();
/**
 * @param {Euler}  facingAngle
 */
export function getForwardNormal(facingAngle) {
  tempObject3D.rotation.copy(facingAngle);
  tempObject3D.getWorldDirection(tempVec3);

  tempVec3.y = 0;
  tempVec3.normalize();

  return tempVec3;
}
