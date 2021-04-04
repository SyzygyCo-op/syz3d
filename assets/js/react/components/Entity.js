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
  BoundingBoxComponent,
} from "../../components";
import { Html } from "@react-three/drei";
import { gameLoop } from '../../world';

const bumpMaxScale = new THREE.Vector3(2, 2, 2);
const bumpMinScale = new THREE.Vector3(1, 1, 1);

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


  const [object3d, setObject3d] = React.useState();
  gameLoop.useTick(() => {
    const compo = entity.getComponent(Object3DComponent);
    if (compo) {
      const value = compo.value;
      if (value !== object3d) {
        setObject3d(value);
      }
    }
  });

  /** @type [THREE.Vector3, (value: THREE.Vector3) => void] */
  const [boundingBox, setBoundingBox] = React.useState();
  gameLoop.useTick(() => {
    const compo = entity.getComponent(BoundingBoxComponent);
    if (compo) {
      /** @type THREE.Vector3 */
      const value = compo.value;
      if (value !== boundingBox) {
        setBoundingBox(value);
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

      // TODO is it necessary to have a RotationComponent now that there's an Object3DComponent?
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
    <group ref={ref} position={position} castShadow receiveShadow>
      <Html position-y={boundingBox && boundingBox.y}>
        <h3
          style={{
            transform: "translateX(-50%)",
          }}
        >
          {label}
        </h3>
      </Html>
      {object3d && <primitive object={object3d}/>}
    </group>
  );
};
