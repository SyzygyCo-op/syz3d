import * as DRMT from "dreamt";
import { Euler, Object3D, Vector3 } from "three";
import {
  LocalPlayerTag,
  PositionComponent,
  RotationComponent,
} from "../components";
import {
  GAME_LOOP_FREQUENCY_HZ,
  PLAYER_SPEED_MPS,
  PLAYER_ROTATION_SPEED_MPS,
} from "../config";

export class InputSystem extends DRMT.System {
  static queries = {
    localPlayer: {
      components: [LocalPlayerTag],
    },
  };

  keyDownLeft = false;
  keyDownRight = false;
  keyDownUp = false;
  keyDownDown = false;

  /**
   * @param {KeyboardEvent} evt
   */
  updateKeyDownState = (evt) => {
    const isDown = evt.type === "keydown";
    switch (evt.key) {
      case "a":
      case "Left": // IE/Edge specific value
      case "ArrowLeft":
        this.keyDownLeft = isDown;
        break;
      case "d":
      case "Right": // IE/Edge specific value
      case "ArrowRight":
        this.keyDownRight = isDown;
        break;
      case "w":
      case "Up": // IE/Edge specific value
      case "ArrowUp":
        this.keyDownUp = isDown;
        break;
      case "s":
      case "Down": // IE/Edge specific value
      case "ArrowDown":
        this.keyDownDown = isDown;
        break;
    }
  };

  init() {
    window.addEventListener("keydown", this.updateKeyDownState);
    window.addEventListener("keyup", this.updateKeyDownState);
    // If focus is lost before key is released, the up event will not fire
    window.addEventListener("blur", () => {
      this.keyDownRight = false;
      this.keyDownLeft = false;
    });

    document.addEventListener("mousedown", () => {
      if (document.pointerLockElement === document.body) {
        document.exitPointerLock();
      } else {
        document.body.requestPointerLock();
      }
    });

    document.body.addEventListener("mousemove", (event) => {
      if (document.pointerLockElement === document.body) {
        this.turnX = event.movementY / 200;
        this.turnY = event.movementX / 200;
      }
    });
  }

  execute(delta, time) {
    this.queries.localPlayer.results.forEach((entity) => {
      if (this.keyDownLeft) {
        updateRotation(
          entity,
          0.0,
          PLAYER_ROTATION_SPEED_MPS / GAME_LOOP_FREQUENCY_HZ,
          0
        );
      }
      if (this.keyDownRight) {
        updateRotation(
          entity,
          0.0,
          -PLAYER_ROTATION_SPEED_MPS / GAME_LOOP_FREQUENCY_HZ,
          0
        );
      }
      if (this.keyDownUp) {
        const rotation = entity.getComponent(RotationComponent).value;
        const forwardVec = getForwardVector(rotation);
        updatePosition(entity, forwardVec.x, forwardVec.y, forwardVec.z);
      }
      if (this.keyDownDown) {
        const rotation = entity.getComponent(RotationComponent).value;
        const forwardVec = getForwardVector(rotation).multiplyScalar(-1);
        updatePosition(entity, forwardVec.x, forwardVec.y, forwardVec.z);
      }

      updateRotation(entity, this.turnX, this.turnY, 0);
      this.turnY = 0;
      this.turnX = 0;
    });
  }
}

const tempVec3 = new Vector3();
const tempObject3D = new Object3D();
/**
 * @param {Euler} playerRotation
 */
function getForwardVector(playerRotation) {
  tempObject3D.rotation.copy(playerRotation);
  tempObject3D.getWorldDirection(tempVec3);
  tempVec3.y = 0;
  tempVec3.normalize();
  tempVec3.multiplyScalar(PLAYER_SPEED_MPS / GAME_LOOP_FREQUENCY_HZ);

  return tempVec3;
}

/**
 * @param {DRMT.Entity} entity
 */
function updateRotation(entity, deltaX, deltaY, deltaZ) {
  if (entity.hasComponent(RotationComponent)) {
    /**
     * @type Euler
     */
    const rotation = entity.getMutableComponent(RotationComponent).value;
    rotation.set(rotation.x + deltaX, rotation.y + deltaY, rotation.z + deltaZ);
  }
}

/**
 * @param {DRMT.Entity} entity
 */
function updatePosition(entity, deltaX, deltaY, deltaZ) {
  if (entity.hasComponent(PositionComponent)) {
    /**
     * @type Vector3
     */
    const position = entity.getMutableComponent(PositionComponent).value;
    position.set(position.x + deltaX, position.y + deltaY, position.z + deltaZ);
  }
}
