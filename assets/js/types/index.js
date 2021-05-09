import * as THREE from "three";
import * as DRMT from "dreamt";

export const Object3DType = DRMT.createType({
  name: "Object3D",
  default: new THREE.Object3D(),
  copy: DRMT.copyCopyable,
  clone: DRMT.cloneClonable,
});
export const Vector3Type = DRMT.createType({
  name: "Vector3",
  default: new THREE.Vector3(),
  copy: DRMT.copyCopyable,
  clone: DRMT.cloneClonable,
});
export const YawPitchRollType = DRMT.createType({
  name: "Euler",
  // Use YXZ order to enable translating mouse movement to YAW and PITCH
  default: new THREE.Euler(0, 0, 0, "YXZ"),
  copy: DRMT.copyCopyable,
  clone: DRMT.cloneClonable,
});
