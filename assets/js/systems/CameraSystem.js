import { debounce } from "debounce";
import * as DRMT from "dreamt";
import { Camera, PerspectiveCamera } from "three";
import {
  BoundingBoxComponent,
  LocalPlayerTag,
  PositionComponent,
  RotationComponent,
} from "../components";

export class CameraSystem extends DRMT.System {
  static queries = {
    localPlayer: {
      components: [LocalPlayerTag],
    },
  };

  /** @type {(camera: PerspectiveCamera) => void | null} */
  setDefaultCamera = null;
  isCameraReady = true;

  init() {
    this.camera = new PerspectiveCamera(
      50,
      window.innerWidth / window.innerHeight
    );
    addResizeHandler(this.camera);
  }

  execute(delta, time) {
    this.localPlayer = this.queries.localPlayer.results[0];

    if (this.isCameraReady && this.localPlayer) {
      if (this.localPlayer.hasComponent(PositionComponent)) {
        const position = this.localPlayer.getComponent(PositionComponent).value;
        this.camera.position.copy(position);
      }

      if (this.localPlayer.hasComponent(RotationComponent)) {
        const rotation = this.localPlayer.getComponent(RotationComponent).value;
        this.camera.rotation.copy(rotation);
        this.camera.rotation.y += Math.PI;
        this.camera.rotation.x *= -1;
      }

      if (this.localPlayer.hasComponent(BoundingBoxComponent)) {
        const box = this.localPlayer.getComponent(BoundingBoxComponent).value;
        // Generically position the camera at 3/4 the avatar's height
        this.camera.position.y += (box.y / 4) * 3;
        // TODO is camera positioned to far in front of player?
      }
    }
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
