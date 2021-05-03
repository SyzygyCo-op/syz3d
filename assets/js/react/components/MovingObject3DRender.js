import * as React from "react";
import { gameLoop } from "../../world";
import { Object3D, Vector3, Group, Euler } from "three";
import { Html } from "@react-three/drei";
import { CollisionBody } from "../../components/CollisionBody";
import { Capsule } from "./Capsule";

const collisionBodyRenderMap = {
  capsule: Capsule,
};

/**
 * @type React.ComponentType<{position: Vector3, rotation: Euler, scale:
 *   Vector3, label: string, object3d: Object3D, boundingBox: Vector3,
 *   collisionBody: CollisionBody} & import("../../state").ISettings>
 */
export const MovingObject3DRender = ({
  position,
  rotation,
  scale,
  label,
  object3d,
  boundingBox,
  showNameTags,
  collisionBody,
}) => {
  const positionGroupRef = React.useRef(null);
  const rotationScaleGroupRef = React.useRef(null);
  gameLoop.useTick(() => {
    if (positionGroupRef.current) {
      /** @type Group */
      const group = positionGroupRef.current;
      position && group.position.copy(position);
    }
    if (rotationScaleGroupRef.current) {
      /** @type Group */
      const group = rotationScaleGroupRef.current;
      rotation && group.rotation.copy(rotation);
      scale && group.scale.copy(scale);
    }
  });

  const CollisionBody =
    collisionBody && collisionBodyRenderMap[collisionBody.shape];

  return (
    <group ref={positionGroupRef}>
      <group ref={rotationScaleGroupRef}>
        {label && showNameTags && (
          <Html
            position-y={boundingBox && boundingBox.y}
            center
            distanceFactor={3}
          >
            <address>{label}</address>
          </Html>
        )}
        {object3d && <primitive object={object3d} />}
      </group>
      {collisionBody && <CollisionBody args={collisionBody.shapeArgs} />}
    </group>
  );
};
