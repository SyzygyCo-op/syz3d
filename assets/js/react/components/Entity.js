import * as DRMT from "dreamt";
import * as React from "react";
import * as THREE from "three";
import * as R3F from "react-three-fiber";
import {
  PositionComponent,
  TextureComponent,
  RotationComponent,
  BumpComponent,
  UILabelComponent,
} from "../../components";
import { Html } from "@react-three/drei";

/**
 * @type React.ComponentType<{entity:  DRMT.Entity}>
 */
export const MaterialR3F = ({ entity }) => {
  // TODO create a custom hook
  const [textureUrl, setTextureUrl] = React.useState(
    entity.getComponent(TextureComponent).url
  );
  R3F.useFrame(() => {
    const compo = entity.getComponent(TextureComponent);
    if (compo) {
      const newValue = compo.url;
      if (newValue !== textureUrl) {
        setTextureUrl(newValue);
      }
    }
  });

  const texture = R3F.useLoader(THREE.TextureLoader, textureUrl);

  return <meshBasicMaterial map={texture} />;
};

const bumpMaxScale = new THREE.Vector3(2, 2, 2);
const bumpMinScale = new THREE.Vector3(1, 1, 1);

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

  const position = cPosition ? cPosition.value : [0, 0, 0];
  return (
    <group position={position}>
      <Html>
        <h3>{label}</h3>
      </Html>
      <React.Suspense fallback={null}>
        <mesh ref={ref}>
          <boxBufferGeometry args={[1, 1, 1]} />
          <MaterialR3F entity={entity} />
        </mesh>
      </React.Suspense>
    </group>
  );
};
