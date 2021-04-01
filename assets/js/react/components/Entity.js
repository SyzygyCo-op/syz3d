import * as DRMT from "dreamt";
import * as React from "react";
import * as THREE from "three";
import * as R3F from "react-three-fiber";
import {
  PositionComponent,
  RotationComponent,
  BumpComponent,
  UILabelComponent,
  GltfComponent,
} from "../../components";
import { Html } from "@react-three/drei";
import { gameLoop } from '../../world';

const bumpMaxScale = new THREE.Vector3(2, 2, 2);
const bumpMinScale = new THREE.Vector3(1, 1, 1);
const tempBBox = new THREE.Box3();
const tempBBoxSizeVec3 = new THREE.Vector3();

/**
 * React-THREE-Fiber component that renders an entity.
 *
 * @type React.ComponentType<{entity:  DRMT.Entity}>
 */
export const Entity = ({ entity }) => {
  const cPosition = entity.getComponent(PositionComponent);

  const [label, setLabel] = React.useState(
    entity.getComponent(UILabelComponent).value
  );

  gameLoop.useTick(() => {
    const compo = entity.getComponent(UILabelComponent);
    if (compo) {
      const newValue = compo.value;
      if (newValue !== label) {
        setLabel(newValue);
      }
    }
  });


  const [gltf, setGltf] = React.useState();
  gameLoop.useTick(() => {
    const compo = entity.getComponent(GltfComponent);
    if (compo) {
      const value = compo.value;
      if (value !== gltf) {
        setGltf(value);
        tempBBox.setFromObject(value.scene);
        tempBBox.getSize(tempBBoxSizeVec3);
      }
    }
  });

  const ref = React.useRef(null);

  gameLoop.useTick(() => {
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

  // TODO position camera accounting for size of avatar bounding box
  camera.position.set(0, 0, 4);

  const position = cPosition ? cPosition.value : [0, 0, 0];


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
      { gltf && <primitive object={gltf.scene} ref={ref} />}
    </group>
  );
};
