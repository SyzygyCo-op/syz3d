import * as React from "react";
import * as DRMT from "dreamt";
import { Vector3 } from "three";
import { CollisionMaterial } from "./CollisionMaterial";

/** @type React.ComponentType<{args: [Vector3, Vector3, number]}> */
export const Capsule = ({ args: [start, end, radius] }) => {
  const rotation = React.useMemo(calculateRotation, [start, end]);
  const middle = React.useMemo(calculateMiddle, [start, end]);

  return (
    <group>
      <mesh position={start}>
        <sphereBufferGeometry args={[radius, 32, 32]} />
        <CollisionMaterial />
      </mesh>
      <mesh position={end}>
        <sphereBufferGeometry args={[radius, 32, 32]} />
        <CollisionMaterial />
      </mesh>
      <mesh position={middle} rotation={rotation}>
        <cylinderBufferGeometry
          args={[radius, radius, length - radius * 2, 32]}
        />
        <CollisionMaterial />
      </mesh>
    </group>
  );

  function calculateRotation() {
    return DRMT.math.calculateEulerBetweenPoints(start, end);
  }

  function calculateMiddle() {
    return end.clone().sub(start).divideScalar(2).add(start);
  }
};
