import * as DRMT from "dreamt";
import { Euler, Vector3 } from "three";
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
  GAME_LOOP_DURATION,
} from "../config";
import { StateSystem } from "./StateSystem";
import { getForwardNormal } from "../utils";

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
    window.addEventListener("blur", this.handleMouseDown);

    document.addEventListener("mousedown", this.handleMouseDown);

    document.body.addEventListener("mousemove", this.handleMouseMove);
  }

  dispose() {
    window.removeEventListener("keydown", this.updateKeyDownState);
    window.removeEventListener("keyup", this.updateKeyDownState);
    // If fremoves is lost before key is released, the up event will not fire
    window.removeEventListener("blur", this.handleMouseDown);

    document.removeEventListener("mousedown", this.handleMouseDown);

    document.body.removeEventListener("mousemove", this.handleMouseMove);
  }

  handleBlurWindow = () => {
      this.keyDownRight = false;
      this.keyDownLeft = false;
      this.keyDownJump = false;
      this.keyDownShift = false;
    };

  handleMouseDown = (evt) => {
    if (document.pointerLockElement || this._hasPointerLock) {
      document.exitPointerLock();
      this._hasPointerLock = false;
    } else if (evt.target === this.canvasElement) {
      this.canvasElement.requestPointerLock();
      this._hasPointerLock = true;
    }
  };

  handleMouseMove = (event) => {
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
      const angularVelocity = this.localPlayer.getComponent(
        AngularVelocityComponent
      ).value;

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
      const angularVelocity = entity.getComponent(AngularVelocityComponent)
        .value;

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
        const accel = this.keyDownShift ? PLAYER_WALK_ACCEL : PLAYER_RUN_ACCEL;
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
      }
    }
  }
}

let jumpPrepTimer = 0;
let jumpRestTimer = 0;

/**
 * @param {boolean} keyIsDown
  * TODO test jumping logic
 */
function getJumpIntensity(keyIsDown) {
  let retval = 0;

  const isRested = jumpRestTimer > 0;

  const maxPrep = 4;

  const isMaxedOut = jumpPrepTimer == maxPrep;
  const isPrepped = isMaxedOut || (jumpPrepTimer > 0 && !keyIsDown);
  const isNonZero = isRested && isPrepped;

  if (isNonZero) {
    retval = Math.sqrt(jumpPrepTimer) * 7;
    jumpPrepTimer = 0;
    jumpRestTimer = 0;
  }

  if (keyIsDown && !isNonZero) {
    jumpPrepTimer = Math.min(0.5 * GAME_LOOP_DURATION, jumpPrepTimer + 1);
  }

  if (!keyIsDown) {
    jumpPrepTimer = 0;
  }

  if (!keyIsDown && !isNonZero) {
    jumpRestTimer += 1;
  }

  return retval;
}

