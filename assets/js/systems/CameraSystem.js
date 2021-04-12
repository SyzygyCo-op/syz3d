import * as DRMT from "dreamt";
import { PerspectiveCamera } from "three";
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
  isCameraReady = false;

  init() {
    this.camera = new PerspectiveCamera();
  }

  execute(delta, time) {
    if(!this.isCameraReady && this.setDefaultCamera) {
      this.setDefaultCamera(this.camera);
      this.isCameraReady = true;
    }

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
      }
    }
  }
}
