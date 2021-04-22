import * as DRMT from "dreamt";
import { Euler, Vector3 } from "three";
import {
  AngularVelocityComponent,
  OwnershipComponent,
  PlayerTag,
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
import { getForwardNormal, isMine } from "../utils";

export class InputSystem extends DRMT.System {
  static queries = {
    players: {
      components: [PlayerTag, OwnershipComponent],
    },
  };

  keyDownLeft = false;
  keyDownRight = false;
  keyDownUp = false;
  keyDownDown = false;
  keyDownJump = false;
  keyDownShift = false;

  /** @type HTMLCanvasElement */
  canvasElement = null;

  /** @param {KeyboardEvent} evt */
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
      case "n":
      case "N":
        !isDown && this.toggleShowNameTags();
    }
  };

  init() {
    window.addEventListener("keydown", this.updateKeyDownState);
    window.addEventListener("keyup", this.updateKeyDownState);
    window.addEventListener("blur", this.handleWindowBlur);

    document.addEventListener("mousedown", this.handleMouseDown);

    // TODO only bind this when pointer is locked
    document.body.addEventListener("mousemove", this.handleMouseMove);
  }

  dispose() {
    window.removeEventListener("keydown", this.updateKeyDownState);
    window.removeEventListener("keyup", this.updateKeyDownState);
    window.removeEventListener("blur", this.handleWindowBlur);

    document.removeEventListener("mousedown", this.handleMouseDown);

    document.body.removeEventListener("mousemove", this.handleMouseMove);
  }

  handleWindowBlur = (evt) => {
    // If focus is lost before key is released, the up event will not fire
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
    const localPlayer = this.getLocalPlayer();
    if (
      document.pointerLockElement &&
      localPlayer &&
      localPlayer.hasComponent(AngularVelocityComponent)
    ) {
      var movementX =
        event.movementX || event.mozMovementX || event.webkitMovementX || 0;
      var movementY =
        event.movementY || event.mozMovementY || event.webkitMovementY || 0;

      /** @type Euler */
      const angularVelocity = localPlayer.getComponent(AngularVelocityComponent)
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
    const entity = this.getLocalPlayer();
    const state = this.world.getSystem(StateSystem);

    const hasVelocity = entity.hasComponent(VelocityComponent);
    const hasRotation = entity.hasComponent(RotationComponent);
    const hasAngularVelocity = entity.hasComponent(AngularVelocityComponent);

    this.canvasElement = state.canvasElement;
    if (!state.observable.openModalId) {
      if (hasAngularVelocity) {
        /** @type Euler */
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
        /** @type Vector3 */
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
        }
      }
    }
  }
  toggleShowNameTags() {
    const state = this.world.getSystem(StateSystem).observable;
    state.updateSettings({ showNameTags: !state.showNameTags });
  }
  getLocalPlayer() {
    return this.queries.players.results.find(isMine);
  }
}

let jumpPrepTimer = 0;
let jumpRestTimer = 0;

/** @param {boolean} keyIsDown TODO test jumping logic */
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
