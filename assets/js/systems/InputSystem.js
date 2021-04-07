import * as DRMT from "dreamt";
import { Vector3 } from "three";
import { LocalPlayerTag, PositionComponent } from "../components";

export class InputSystem extends DRMT.System {
  static queries = {
    localPlayer: {
      components: [LocalPlayerTag],
    },
  };

  keyDownArrowLeft = false;
  keyDownArrowRight = false;

  init() {
    window.addEventListener("keydown", (evt) => {
      switch (evt.key) {
        case "Left": // IE/Edge specific value
        case "ArrowLeft":
          this.keyDownArrowLeft = true;
          break;
        case "Right": // IE/Edge specific value
        case "ArrowRight":
          this.keyDownArrowRight = true;
          break;
      }
    });
    window.addEventListener("keyup", (evt) => {
      switch (evt.key) {
        case "Left": // IE/Edge specific value
        case "ArrowLeft":
          this.keyDownArrowLeft = false;
          break;
        case "Right": // IE/Edge specific value
        case "ArrowRight":
          this.keyDownArrowRight = false;
          break;
      }
    });
    // If focus is lost before key is released, the up event will not fire
    window.addEventListener("blur", () => {
      this.keyDownArrowRight = false;
      this.keyDownArrowLeft = false;
    })
  }

  execute(delta, time) {
    this.queries.localPlayer.results.forEach((entity) => {
      if (this.keyDownArrowRight) {
        updatePosition(entity, 0.01, 0, 0);
      }
      if (this.keyDownArrowLeft) {
        updatePosition(entity, -0.01, 0, 0);
      }
    });
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
