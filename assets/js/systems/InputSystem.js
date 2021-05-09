import * as DRMT from "dreamt";
import {
  OwnershipComponent,
  PlayerTag,
} from "../components";
import {
  PLAYER_WALK_ACCEL,
  PLAYER_RUN_ACCEL,
  PLAYER_TURN_ACCEL,
  GAME_LOOP_DURATION,
} from "../config";
import { StateSystem } from "./StateSystem";
import { isMine } from "../utils";
import { CollisionSystem } from "./CollisionSystem";
import { MoveCommand, JumpCommand, TurnCommand } from "../commands";
import { uniq } from 'lodash-es';

export class InputSystem extends DRMT.System {
  static queries = {
    players: {
      components: [
        PlayerTag,
        OwnershipComponent,
        ...uniq([
          ...MoveCommand.getRequiredComponents(),
          ...JumpCommand.getRequiredComponents(),
          ...TurnCommand.getRequiredComponents()
        ])
      ],
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
        break;
      case "n":
      case "N":
        !isDown && this.toggleShowNameTags();
    }
  };

  init() {
    this.runForward = new MoveCommand(PLAYER_RUN_ACCEL);
    this.runBackward = new MoveCommand(-PLAYER_RUN_ACCEL);
    this.walkForward = new MoveCommand(PLAYER_WALK_ACCEL);
    this.walkBackward = new MoveCommand(-PLAYER_WALK_ACCEL);
    this.jump = new JumpCommand();
    this.turnLeft = new TurnCommand(0, PLAYER_TURN_ACCEL);
    this.turnRight = new TurnCommand(0, -PLAYER_TURN_ACCEL);

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
    if (document.pointerLockElement && localPlayer) {
      var movementX =
        event.movementX || event.mozMovementX || event.webkitMovementX || 0;
      var movementY =
        event.movementY || event.mozMovementY || event.webkitMovementY || 0;

      TurnCommand.executePure(localPlayer, movementY * 0.04, -movementX * 0.04);
    }
  };

  /**
   * @param {number} delta
   * @param {number} _time
   */
  execute(delta, _time) {
    const entity = this.getLocalPlayer();
    const state = this.world.getSystem(StateSystem);

    this.canvasElement = state.canvasElement;
    // TODO(perf) also check if any key at all is pressed
    if (entity && !state.observable.openModalId) {

      if (this.keyDownLeft) {
        this.turnLeft.execute(entity)
      }
      if (this.keyDownRight) {
        this.turnRight.execute(entity)
      }

      if (this.keyDownUp) {
        this.keyDownShift
          ? this.walkForward.execute(entity)
          : this.runForward.execute(entity);
      }
      if (this.keyDownDown) {
        this.keyDownShift
          ? this.walkBackward.execute(entity)
          : this.runBackward.execute(entity);
      }

      // Jumping and gravity
      if (this.world.getSystem(CollisionSystem).playerOnFloor) {
        this.jump.execute(entity, getJumpIntensity(this.keyDownJump));
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

/** @param {boolean} keyIsDown TODO test jumping logic, refactor to FSM */
function getJumpIntensity(keyIsDown) {
  let retval = 0;

  const isRested = jumpRestTimer > 0;

  const maxPrep = 4;

  const isMaxedOut = jumpPrepTimer == maxPrep;
  const isPrepped = isMaxedOut || (jumpPrepTimer > 0 && !keyIsDown);
  const isNonZero = isRested && isPrepped;

  if (isNonZero) {
    retval = Math.sqrt(jumpPrepTimer) * 32;
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
