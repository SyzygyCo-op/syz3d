import * as DRMT from "dreamt";
import {Euler} from "three";
import { SpinComponent, BumpComponent, RotationComponent } from "../components";

export class AnimationSystem extends DRMT.System {
  static queries = {
    spinners: {
      components: [SpinComponent, RotationComponent],
    },
    bumpers: {
      components: [BumpComponent],
    },
  };

  /**
   * @param {number} _delta
   * @param {number} time
   */
  execute(_delta, time) {
    this.queries.spinners.results.forEach((entity) => {
      const spin = entity.getComponent(SpinComponent).value;
      /** @type Euler */
      const rotation = entity.getMutableComponent(RotationComponent).value;
      rotation.set(rotation.x + spin[0], rotation.y + spin[1], rotation.z + spin[2]);
    });

    this.queries.bumpers.results.forEach((entity) => {
      const cBump = entity.getMutableComponent(BumpComponent);
      if (cBump.value < 1) {
        cBump.value += 0.01;
      }
    });
  }
}
