import * as THREE from "three";
import * as ECSY from "ecsy";

export class TextureComponent extends ECSY.Component {
  /** @type string */
  url;

  static schema = {
    url: { type: ECSY.Types.String },
  };

  /**
   * @todo Having a method like this is textbook OOP, not ECS, but maybe fine
   * for now.
   *
   * @returns THREE.Texture
   */
  load() {
    return new THREE.TextureLoader().load(this.url);
  }
}
