import { debounce } from "debounce";
import * as DRMT from "dreamt";
import { PerspectiveCamera } from "three";
import {
  BoundingBoxComponent,
  OwnershipComponent,
  PlayerTag,
  PositionComponent,
  RotationComponent,
} from "../components";
import { isMine } from "../utils";

export class CameraSystem extends DRMT.System {
  static queries = {
    players: {
      components: [
        PlayerTag,
        OwnershipComponent,
        BoundingBoxComponent,
        PositionComponent,
        RotationComponent,
      ],
    },
  };

  init() {
    this.camera = new PerspectiveCamera(
      50,
      window.innerWidth / window.innerHeight
    );
    addResizeHandler(this.camera);
  }

  execute(delta, time) {
    this.queries.players.results.forEach((entity) => {
      if (isMine(entity)) {
        const position = entity.getComponent(PositionComponent).value;
        const rotation = entity.getComponent(RotationComponent).value;
        const box = entity.getComponent(BoundingBoxComponent).value;
        this.camera.position.copy(position);

        this.camera.rotation.copy(rotation);
        this.camera.rotation.y += Math.PI;
        this.camera.rotation.x *= -1;

        // Generically position the camera at 3/4 the avatar's height
        this.camera.position.y += (box.y / 4) * 3;
        // TODO is camera positioned too far in front of player?
      }
    });
  }
}

/** @param {PerspectiveCamera} camera */
function addResizeHandler(camera) {
  window.addEventListener(
    "resize",
    debounce(() => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
    }, 200)
  );
}
