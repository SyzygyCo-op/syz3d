import * as ECSY from "ecsy";

import * as React from "react";
import { PositionComponent } from "./position";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import { TextureComponent } from "./texture";
import * as RxJs from "rxjs";

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
 * @type React.ComponentType<{entity: ECSY.Entity, world: ECSY.World, time: RxJs.Subject}>
 */
export const PlayerR3F = ({ entity, time }) => {
  const { value: position } = entity.getComponent(PositionComponent);
  const player = entity.getComponent(PlayerComponent);

  const ref = React.useRef(null);

  React.useEffect(() => {
    const subscription = time.subscribe((currentTime) => {
      const rotation = /** @type THREE.Euler */ (ref.current &&
        ref.current.rotation);
      rotation.y = Math.PI * 2 * ((currentTime % 5000) / 5000);
      rotation.z = Math.PI * 2 * ((currentTime % 8000) / 8000);
    });
    return subscription.unsubscribe;
  }, [time]);

  return (
    <group position={position}>
      <Html>
        <h3>{player.player_id || "{anonymous}"}</h3>
      </Html>
      <mesh ref={ref}>
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
