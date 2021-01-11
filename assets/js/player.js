import * as ECSY from "ecsy";

import * as React from "react";
import { PositionComponent } from "./position";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import { TextureComponent } from "./texture";

export class LocalPlayerTag extends ECSY.TagComponent {}

export class PlayerComponent extends ECSY.Component {
  static schema = {
    player_id: { type: ECSY.Types.String },
  };
}

/**
 * @type React.ComponentType<{entity: ECSY.Entity}>
 */
export const MaterialR3F = ({ entity }) => {
  const cTexture = entity.getComponent(TextureComponent);

  const props = {};
  if (cTexture) {
    props.map = cTexture.load();
  }

  return <meshBasicMaterial {...props} />;
};

/**
 * @type React.ComponentType<{entity: ECSY.Entity, world: ECSY.World}>
 */
export const PlayerR3F = ({ entity }) => {
  const { value: position } = entity.getComponent(PositionComponent);
  const player = entity.getComponent(PlayerComponent);

  return (
    <group position={position}>
      <Html>
        <h3>{player.player_id || "IDK"}</h3>
      </Html>
      <mesh>
        <boxBufferGeometry args={[1, 1, 1]} />
        <MaterialR3F entity={entity} />
      </mesh>
    </group>
  );
};

/**
 * @param {{onSubmit: (data: {player_id: string, texture: string}) => void}} props
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
      <input type="submit" value="Let's go!" />
    </form>
  );

  /**
   * @param {React.FormEvent} evt
   */
  function handleSubmit(evt) {
    evt.preventDefault();
    const data = new FormData(/** @type any */ (evt.target));
    /** @type string */
    const player_id = /** @type string */ (data.get("player_id"));
    const texture = /** @type string */ (data.get("texture"));
    props.onSubmit({ player_id, texture });
  }
};
