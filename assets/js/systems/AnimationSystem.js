import * as DRMT from "dreamt";
import { SpinComponent, RotationComponent, BumpComponent, Object3DComponent } from "../components";

export class AnimationSystem extends DRMT.System {
  static queries = {
    spinners: {
      components: [SpinComponent, Object3DComponent],
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
      const rotation = /** @type any */(entity.getComponent(RotationComponent)).value;
      const object3d = entity.getMutableComponent(Object3DComponent).value;
      object3d.rotation.set(rotation[0], rotation[1] + getSpinAt(time, spin[1]), rotation[2] + getSpinAt(time, spin[2]));
    });

    this.queries.bumpers.results.forEach((entity) => {
      const cBump = entity.getMutableComponent(BumpComponent);
      if (cBump.value < 1) {
        cBump.value += 0.01;
      }
    });
  }
}
/**
 * @param {number} time
 * @param {number} radiansPerTimeUnit
 * @returns number radians
 */
function getSpinAt(time, radiansPerTimeUnit) {
  return Math.PI * time * radiansPerTimeUnit;
}
