import * as DRMT from "dreamt";
import { PerspectiveCamera } from "three";
import {
  LocalPlayerTag,
  PositionComponent,
  RotationComponent,
} from "../components";
import { StateSystem } from "./StateSystem";

export class CameraSystem extends DRMT.System {
  static queries = {
    localPlayer: {
      components: [LocalPlayerTag],
    },
  };

  init() {
    this.camera = new PerspectiveCamera();
  }

  execute(delta, time) {
    const localPlayer = this.queries.localPlayer.results[0];
    if (this.world.getSystem(StateSystem).isCameraReady) {
      if (localPlayer.hasComponent(PositionComponent)) {
        const position = localPlayer.getComponent(PositionComponent).value;
        this.camera.position.copy(position);
      }
      if (localPlayer.hasComponent(RotationComponent)) {
        const rotation = localPlayer.getComponent(RotationComponent).value;
        this.camera.rotation.copy(rotation);
        this.camera.rotation.y += Math.PI;
      }
    }
  }
}
