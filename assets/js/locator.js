import { provider } from "dreamt";
import * as THREE from "three";

const threeImports = ["Euler", "Plane", "Quaternion", "Vector3", "Vector4", "Line3", "Object3D"];

threeImports.forEach(
  (name) => {
    provider.set(/** @type any */(name), THREE[name]);
  }
);
