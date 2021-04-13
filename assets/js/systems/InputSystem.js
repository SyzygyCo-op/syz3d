import * as DRMT from "dreamt";
import { Euler, MathUtils, Object3D, Vector3 } from "three";
import {
  AngularVelocityComponent,
  LocalPlayerTag,
  PositionComponent,
  RotationComponent,
  VelocityComponent,
} from "../components";
import {
  PLAYER_WALK_ACCEL,
  PLAYER_RUN_ACCEL,
  PLAYER_TURN_ACCEL,
} from "../config";
import { StateSystem } from "./StateSystem";

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
  canvasElement = null;

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
      case "Backspace":
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
      } else if (evt.target === this.canvasElement) {
        this.canvasElement.requestPointerLock();
      }
    });

    document.body.addEventListener("mousemove", this.onMouseMove);
  }

  onMouseMove = (event) => {
    if (
      document.pointerLockElement &&
      this.localPlayer &&
      this.localPlayer.hasComponent(AngularVelocityComponent)
    ) {
      var movementX =
        event.movementX || event.mozMovementX || event.webkitMovementX || 0;
      var movementY =
        event.movementY || event.mozMovementY || event.webkitMovementY || 0;

      /**
       * @type Euler
       */
      const angularVelocity = this.localPlayer.getComponent(AngularVelocityComponent)
        .value;

      angularVelocity.x += movementY * 0.04;
      angularVelocity.y -= movementX * 0.04;

    }
  };

  /**
   * @param {number} delta
   * @param {number} _time
   */
  execute(delta, _time) {
    this.canvasElement = this.world.getSystem(StateSystem).canvasElement;

    const entity = (this.localPlayer = this.queries.localPlayer.results[0]);

    const hasVelocity = entity.hasComponent(VelocityComponent);
    const hasRotation = entity.hasComponent(RotationComponent);
    const hasAngularVelocity = entity.hasComponent(AngularVelocityComponent);

    if (hasAngularVelocity) {
      /**
       * @type Euler
       */
      const angularVelocity = entity.getComponent(AngularVelocityComponent).value;

      if (this.keyDownLeft) {
        angularVelocity.y += PLAYER_TURN_ACCEL;
      }
      if (this.keyDownRight) {
        angularVelocity.y -= PLAYER_TURN_ACCEL;
      }
    }

    if (hasVelocity && hasRotation) {
      /**
       * @type Vector3
       */
      const velocity = entity.getComponent(VelocityComponent).value;
      const rotation = entity.getComponent(RotationComponent).value;

      if (this.keyDownUp || this.keyDownDown) {
        const accel = this.keyDownShift
          ? PLAYER_WALK_ACCEL
          : PLAYER_RUN_ACCEL;
        const forward = getForwardNormal(rotation);

        if (this.keyDownUp) {
          velocity.add(forward.multiplyScalar(accel));
        }
        if (this.keyDownDown) {
          velocity.add(forward.multiplyScalar(-accel));
        }
      }

      // Jumping and gravity
      if (
        entity.hasComponent(PositionComponent) &&
        entity.hasComponent(VelocityComponent)
      ) {
        const velocity = entity.getComponent(VelocityComponent).value;
        const position = entity.getComponent(PositionComponent).value;

        if (position.y <= 0) {
          velocity.y = getJumpIntensity(this.keyDownJump);
        }

        velocity.y -= 0.1;
        velocity.y = Math.max(velocity.y, -1);
        position.y += velocity.y;
        position.y = Math.max(position.y, 0);
      }
    }
  }
}

const tempVec3 = new Vector3();
const tempObject3D = new Object3D();
/**
 * @param {Euler}  facingAngle
 */
function getForwardNormal(facingAngle, speed) {
  tempObject3D.rotation.copy(facingAngle);
  tempObject3D.getWorldDirection(tempVec3);

  tempVec3.y = 0;
  tempVec3.normalize();

  return tempVec3;
}

let jumpPrepTimer = 0;
let jumpRestTimer = 0;

/**
 * @param {boolean} keyIsDown  TODO test jumping logic
 */
function getJumpIntensity(keyIsDown) {
  let retval = 0;

  const isRested = jumpRestTimer > 0;

  const maxPrep = 4;

  const isMaxedOut = jumpPrepTimer == maxPrep;
  const isPrepped = isMaxedOut || (jumpPrepTimer > 0 && !keyIsDown);
  const isNonZero = isRested && isPrepped;

  if (isNonZero) {
    retval = Math.sqrt(jumpPrepTimer) * 0.5;
    jumpPrepTimer = 0;
    jumpRestTimer = 0;
  }

  if (keyIsDown && !isNonZero) {
    jumpPrepTimer = Math.min(4, jumpPrepTimer + 1);
  }

  if (!keyIsDown) {
    jumpPrepTimer = 0;
  }

  if (!keyIsDown && !isNonZero) {
    jumpRestTimer += 1;
  }

  return retval;
}
