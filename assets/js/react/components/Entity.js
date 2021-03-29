import * as DRMT from "dreamt";
import * as React from "react";
import * as THREE from "three";
import * as R3F from "react-three-fiber";
import {
  PositionComponent,
  RotationComponent,
  BumpComponent,
  UILabelComponent,
  Object3DComponent,
} from "../../components";
import { Html, useGLTF } from "@react-three/drei";

const bumpMaxScale = new THREE.Vector3(2, 2, 2);
const bumpMinScale = new THREE.Vector3(1, 1, 1);
const tempBBox = new THREE.Box3();
const tempBBoxSizeVec3 = new THREE.Vector3();

/**
 * React-THREE-Fiber component that renders an entity.
 *
 * @type React.ComponentType<{entity:  DRMT.Entity, world: DRMT.World}>
 */
export const Entity = ({ entity }) => {
  const cPosition = entity.getComponent(PositionComponent);

  const [label, setLabel] = React.useState(
    entity.getComponent(UILabelComponent).value
  );
  R3F.useFrame(() => {
    const compo = entity.getComponent(UILabelComponent);
    if (compo) {
      const newValue = compo.value;
      if (newValue !== label) {
        setLabel(newValue);
      }
    }
  });

  const [object3DUrl, setObject3DUrl] = React.useState(
    entity.getComponent(Object3DComponent).url
  );
  R3F.useFrame(() => {
    const compo = entity.getComponent(Object3DComponent);
    if (compo) {
      const url = compo.url;
      if (url !== object3DUrl) {
        setObject3DUrl(url);
      }
    }
  });

  const gltf = useGLTF(object3DUrl);

  const ref = React.useRef(null);

  R3F.useFrame(() => {
    if (ref.current) {
      const rotation = /**
       * @type THREE.Euler
       */ (ref.current.rotation);
      const scale = /**
       * @type THREE.Vector3
       */ (ref.current.scale);

      const cRotation = entity.getComponent(RotationComponent);
      const cBump = entity.getComponent(BumpComponent);
      if (cRotation) {
        rotation.set.apply(rotation, cRotation.value);
      }

      if (cBump) {
        const alpha =
          cBump.value < 0.5
            ? Math.pow(cBump.value * 2, 2)
            : Math.pow((cBump.value - 0.5) * 2, 2);
        const v = cBump.value < 0.5 ? bumpMaxScale : bumpMinScale;
        scale.lerp(v, alpha);
      }
    }
  });

  const { camera } = R3F.useThree();

  camera.position.set(0, 0, 2);

  const position = cPosition ? cPosition.value : [0, 0, 0];
  tempBBox.setFromObject(gltf.scene);
  tempBBox.getSize(tempBBoxSizeVec3);

  return (
    <group position={position} castShadow receiveShadow>
      <Html position={[0, tempBBoxSizeVec3.y, 0]}>
        <h3
          style={{
            transform: "translateX(-50%)",
          }}
        >
          {label}
        </h3>
      </Html>
      <primitive object={gltf.scene} ref={ref} />
    </group>
  );
};
