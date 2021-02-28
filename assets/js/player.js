import * as ECSY from "ecsy";

import * as React from "react";
import { PositionComponent } from "./position";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import { TextureComponent } from "./texture";
import * as R3F from "react-three-fiber";
import { BumpComponent, RotationComponent } from "./animation";

export class PlayerTag extends ECSY.TagComponent {}
export class LocalPlayerTag extends ECSY.TagComponent {}

export class UILabelComponent extends ECSY.Component {
  static schema = {
    value: { type: ECSY.Types.String },
  };
}

/**
 * @type React.ComponentType<{entity:  ECSY.Entity}>
 */
export const MaterialR3F = ({ entity }) => {
  // TODO create a custom hook
  const [textureUrl, setTextureUrl] = React.useState(
    entity.getComponent(TextureComponent).url
  );
  R3F.useFrame(() => {
    const newValue = entity.getComponent(TextureComponent).url;
    if (newValue !== textureUrl) {
      setTextureUrl(newValue);
    }
  });

  const texture = R3F.useLoader(THREE.TextureLoader, textureUrl);

  return <meshBasicMaterial map={texture} />;
};

const bumpMaxScale = new THREE.Vector3(2, 2, 2);
const bumpMinScale = new THREE.Vector3(1, 1, 1);
/**
 * @type React.ComponentType<{entity:  ECSY.Entity, world: ECSY.World}>
 */
export const PlayerR3F = ({ entity }) => {
  const cPosition = entity.getComponent(PositionComponent);
  const [label, setLabel] = React.useState(
    entity.getComponent(UILabelComponent).value
  );
  R3F.useFrame(() => {
    const newValue = entity.getComponent(UILabelComponent).value;
    if (newValue !== label) {
      setLabel(newValue);
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

/**
 * @param {{
 *   onSubmit: (data: { player_id: string; texture: string }) => void;
 *   onClose: () => void;
 * }} props
 */
export const PlayerFormReact = (props) => {
  return (
    <form onSubmit={handleSubmit}>
      <label>
        What should your name tag say?
        <input name="player_id" type="text" placeholder="Samuel L. Jackson" />
      </label>
      <label>
        Choose a texture (for your avatar.)
        <select name="texture" defaultValue="">
          <option value="/images/water_texture.jpg">Water</option>
          <option value="/images/lava_texture.jpg">Lava</option>
        </select>
      </label>
      <input type="submit" value="Save" />
      {props.onClose && (
        <input type="button" value="Let's go!" onClick={props.onClose} />
      )}
    </form>
  );

  /**
   * @param {React.FormEvent} evt
   */
  function handleSubmit(evt) {
    evt.preventDefault();
    const data = new FormData(
      /**
       * @type any
       */ (evt.target)
    );
    /**
     * @type string
     */
    const player_id = /**
     * @type string
     */ (data.get("player_id"));
    const texture = /**
     * @type string
     */ (data.get("texture"));
    props.onSubmit({ player_id, texture });
  }
};
