import * as React from "react";
import { gameLoop } from "../../world";
import { Object3D, Vector3, Group, Euler } from "three";
import { Html } from "@react-three/drei";

/**
 * @type React.ComponentType<{position: Vector3, rotation: Euler, scale:
 *   Vector3, label: string, object3d: Object3D, boundingBox: Vector3} &
 *   import("../../state").ISettings>
 */
export const MovingObject3DRender = ({
  position,
  rotation,
  scale,
  label,
  object3d,
  boundingBox,
  showNameTags,
}) => {
  const groupRef = React.useRef(null);
  gameLoop.useTick(() => {
    if (groupRef.current) {
      /** @type Group */
      const group = groupRef.current;
      position &&
        group.position.copy(position);
      rotation &&
        group.rotation.copy(rotation);
      scale && group.scale.copy(scale);
    }
  });

  return (
    <group ref={groupRef}>
      {label && showNameTags && (
        <Html position-y={boundingBox && boundingBox.y} center distanceFactor={3}>
          <address>{label}</address>
        </Html>
      )}
      {object3d && <primitive object={object3d} />}
    </group>
  );
};
