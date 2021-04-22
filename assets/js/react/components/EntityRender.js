import * as React from "react";
import { gameLoop } from "../../world";
import { makeCopier } from "../../utils";
import { Object3D, Vector3 } from "three";
import { Html } from "@react-three/drei";
import {useThree} from "@react-three/fiber";
/**
 * @type React.ComponentType<{position: Vector3, rotation: Vector3, scale:
 *   Vector3, label: string, object3d: Object3D, boundingBox: Vector3} &
 *   import("../../state").ISettings>
 */
export const EntityRender = ({
  position,
  rotation,
  scale,
  label,
  object3d,
  boundingBox,
  showNameTags,
}) => {
  const groupRef = React.useRef(null);
  /** TODO called when off screen? */
  gameLoop.useTick(makeCopier(groupRef.current, "position", position));
  gameLoop.useTick(makeCopier(groupRef.current, "rotation", rotation));
  gameLoop.useTick(makeCopier(groupRef.current, "scale", scale));

  return (
    <group ref={groupRef} castShadow receiveShadow>
      {label && showNameTags && (
        // TODO use distanceFactor prop
        <Html position-y={boundingBox && boundingBox.y} center distanceFactor={3}>
          <address>{label}</address>
        </Html>
      )}
      {object3d && <primitive object={object3d} />}
    </group>
  );
};
