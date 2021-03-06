import * as DRMT from "dreamt";
import {
  OwnershipComponent,
  PlayerInternalsComponent,
  PlayerTag,
} from "../components";
import { StateSystem } from "./StateSystem";
import { jumpStateMachine, userSettings } from "../state";
import { CommandMenu } from "../CommandMenu";
import { TurnCommand } from "../commands";
import { PLAYER_MAX_JUMP_ACCEL } from "../config";
import { isMine } from "../utils";

export class InputSystem extends DRMT.System {
  static queries = {
    players: {
      components: [
        PlayerTag,
        OwnershipComponent,
        ...CommandMenu.getRequiredComponents(),
      ],
    },
  };

  keyDownLeft = false;
  keyDownRight = false;
  keyDownUp = false;
  keyDownDown = false;
  keyDownJump = false;
  keyWasDownJump = false;
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
        !isDown && userSettings.toggleNameTags();
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
    } else if (
      evt.target === this.canvasElement &&
      this.canvasElement.requestPointerLock
    ) {
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
    // TODO use localPlayer
    const entity = this.getLocalPlayer();
    const state = this.world.getSystem(StateSystem);

    this.canvasElement = state.canvasElement;
    // TODO(perf) also check if any key at all is pressed
    if (entity && !state.observable.openModalId) {
      if (this.keyDownLeft) {
        CommandMenu.turnLeft.execute(entity);
      }
      if (this.keyDownRight) {
        CommandMenu.turnRight.execute(entity);
      }

      if (this.keyDownUp) {
        this.keyDownShift
          ? CommandMenu.walkForward.execute(entity)
          : CommandMenu.runForward.execute(entity);
      }
      if (this.keyDownDown) {
        this.keyDownShift
          ? CommandMenu.walkBackward.execute(entity)
          : CommandMenu.runBackward.execute(entity);
      }

      // Jumping and gravity
      // TODO move to jump system
      if (
        entity.getComponent(PlayerInternalsComponent).isTouchingStableSurface
      ) {
        if (this.keyDownJump && !this.keyWasDownJump) {
          jumpStateMachine.sendKeyDown();
        }

        if (!this.keyDownJump && this.keyWasDownJump) {
          jumpStateMachine.sendKeyUp();
        }

        if (jumpStateMachine.finished) {
          if (jumpStateMachine.resultOk) {
            CommandMenu.jump.execute(
              entity,
              jumpStateMachine.result * PLAYER_MAX_JUMP_ACCEL
            );
          }
          jumpStateMachine.reset();
        }
        jumpStateMachine.sendTick();
      }
    }
    this.keyWasDownJump = this.keyDownJump;
  }
  getLocalPlayer() {
    return this.queries.players.results.find(isMine);
  }
}
