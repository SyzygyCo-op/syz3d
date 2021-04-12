import * as DRMT from "dreamt";
import { Euler, Vector3 } from "three";
import { PositionComponent, RotationComponent } from "../components";

// TODO for wire format use something like Protobufs instead of JSON

/**
 * @param {number} num
 */
function round(num) {
  return Math.round(num * 1000) / 1000;
}

export class RoundingSystem extends DRMT.System {
  static queries = {
    positions: {
      components: [PositionComponent],
    },
    rotations: {
      components: [RotationComponent],
    },
  };

  execute(_delta, _time) {
    this.queries.positions.results.forEach((entity) => {
      /**
       * @type Vector3
       */
      const position = entity.getComponent(PositionComponent).value;
      position.x = round(position.x);
      position.y = round(position.y);
      position.z = round(position.z);
    });
    this.queries.rotations.results.forEach((entity) => {
      /**
       * @type Euler
       */
      const rotation = entity.getComponent(RotationComponent).value;
      rotation.x = round(rotation.x);
      rotation.y = round(rotation.y);
      rotation.z = round(rotation.z);
    });
  }
}
