import * as ECSY from "ecsy";

import * as React from "react";
import { PositionComponent } from "./position";
import { Html } from "@react-three/drei";
import * as THREE from "three";

export class LocalPlayerTag extends ECSY.TagComponent {}

export class PlayerComponent extends ECSY.Component {
  static schema = {
    player_id: { type: ECSY.Types.String },
  };
}

const texture = new THREE.TextureLoader().load("/images/crate.gif");

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
        <meshBasicMaterial map={texture} />
      </mesh>
    </group>
  );
};

/**
 * @param {{onSubmit: (data: {player_id: string}) => void}} props
 */
export const PlayerFormReact = (props) => {
  return (
    <form onSubmit={handleSubmit}>
      <input name="player_id" type="text" placeholder="Samuel L. Jackson" />
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
    props.onSubmit({ player_id });
  }
};
