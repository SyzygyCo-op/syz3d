import * as DRMT from "dreamt";
import { Euler, Object3D, Vector3 } from "three";
import {
  LocalPlayerTag,
  PositionComponent,
  RotationComponent,
  VelocityComponent,
} from "../components";
import {
  PLAYER_WALK_SPEED_MPS,
  PLAYER_RUN_SPEED_MPS,
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
  keyDownJump = false;
  keyDownShift = false;

  /**
   * @type HTMLCanvasElement
   */
  canvas = null;

  /**
   * @param {KeyboardEvent} evt
   */
  updateKeyDownState = (evt) => {
    const isDown = evt.type === "keydown";
    switch (evt.key) {
      case "a":
      case "A":
      case "Left":
      case "ArrowLeft":
        this.keyDownLeft = isDown;
        break;
      case "d":
      case "D":
      case "Right":
      case "ArrowRight":
        this.keyDownRight = isDown;
        break;
      case "w":
      case "W":
      case "Up":
      case "ArrowUp":
        this.keyDownUp = isDown;
        break;
      case "s":
      case "S":
      case "Down":
      case "ArrowDown":
        this.keyDownDown = isDown;
        break;
      case " ":
        this.keyDownJump = isDown;
        break;
      case "Shift":
        this.keyDownShift = isDown;
    }
  };

  init() {
    window.addEventListener("keydown", this.updateKeyDownState);
    window.addEventListener("keyup", this.updateKeyDownState);
    // If focus is lost before key is released, the up event will not fire
    window.addEventListener("blur", () => {
      this.keyDownRight = false;
      this.keyDownLeft = false;
      this.keyDownJump = false;
      this.keyDownShift = false;
    });

    document.addEventListener("mousedown", (evt) => {
      if (document.pointerLockElement) {
        document.exitPointerLock();
      } else if (evt.target === this.canvas) {
        this.canvas.requestPointerLock();
      }
    });

    document.body.addEventListener("mousemove", (event) => {
      if (document.pointerLockElement) {
        this.turnX = event.movementY / 200;
        this.turnY = event.movementX / 200;
      }
    });
  }

  /**
   * @param {number} delta
   * @param {number} _time
   */
  execute(delta, _time) {
    this.canvas = document.getElementsByTagName("canvas")[0];

    const rotationDelta = PLAYER_ROTATION_SPEED_MPS * (delta / 1000);

    const speed = this.keyDownShift ? PLAYER_WALK_SPEED_MPS : PLAYER_RUN_SPEED_MPS;

    this.queries.localPlayer.results.forEach((entity) => {
      if (this.keyDownLeft) {
        updateRotation(entity, 0.0, rotationDelta, 0);
      }
      if (this.keyDownRight) {
        updateRotation(entity, 0.0, -rotationDelta, 0);
      }
      if (this.keyDownUp) {
        const forwardVec = getForwardVector(entity, delta, speed);
        updatePosition(entity, forwardVec.x, forwardVec.y, forwardVec.z);
      }
      if (this.keyDownDown) {
        const forwardVec = getForwardVector(entity, delta, speed).multiplyScalar(-1);
        updatePosition(entity, forwardVec.x, forwardVec.y, forwardVec.z);
      }

      // Jumping and gravity
      if (
        entity.hasComponent(PositionComponent) &&
        entity.hasComponent(VelocityComponent)
      ) {
        const velocity = entity.getMutableComponent(VelocityComponent).value;
        const position = entity.getMutableComponent(PositionComponent).value;
        if (this.keyDownJump) {
          if (position.y <= 0) {
            velocity.y = 1;
          }
        }

        velocity.y -= 0.1;
        velocity.y = Math.max(velocity.y, -1);
        position.y += velocity.y;
        position.y = Math.max(position.y, 0);
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
 * @param {DRMT.Entity} entity
 * @param {number}      delta
 * @param {number}      speed
 */
function getForwardVector(entity, delta, speed) {
  if (entity.hasComponent(RotationComponent)) {
    const rotation = entity.getComponent(RotationComponent).value;

    tempObject3D.rotation.copy(rotation);
    tempObject3D.getWorldDirection(tempVec3);

    tempVec3.y = 0;
    tempVec3.normalize();
    tempVec3.multiplyScalar(speed * (delta / 1000));
  }

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
