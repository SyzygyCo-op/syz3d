import { debounce } from "debounce";
import * as DRMT from "dreamt";
import { Euler, PerspectiveCamera, Vector3 } from "three";
import {
  BoundingBoxComponent,
  OwnershipComponent,
  PlayerTag,
  PositionComponent,
  RotationComponent,
} from "../components";
import { isMine } from "../utils";
import { StateSystem } from "./StateSystem";

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
    this.queries.players.results.forEach(this.followPlayerWithCamera);
  }

  /** @param {DRMT.Entity} entity */
  followPlayerWithCamera = (entity) => {
    if (isMine(entity)) {
      /** @type Vector3 */
      const position = entity.getComponent(PositionComponent).value;
      /** @type Euler */
      const lookDirection = entity.getComponent(RotationComponent).value;
      const box = entity.getComponent(BoundingBoxComponent).value;

      const cameraRelativeY = (box.y * 1) / 4;

      const setback = this.world.getSystem(StateSystem).observable
        .isUsing3rdPersonCamera
        ? 1
        : 0.01;

      DRMT.camera.apply3rdPersonView(
        this.camera,
        position,
        lookDirection,
        setback,
        (box.y * 5) / 8,
        box.x
      );

      this.camera.position.y += cameraRelativeY;
    }
  };
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
