import * as ECSY from "ecsy";

export class RotationComponent extends ECSY.Component {
  static schema = {
    value: { type: ECSY.Types.Array },
  };
}

export class SpinComponent extends ECSY.Component {
  static schema = {
    value: { type: ECSY.Types.Array },
  };
}

/** @param {number} time
  * @param {number} radiansPerTimeUnit
  * @returns number radians
  */
function getSpinAt(time, radiansPerTimeUnit) {
  return Math.PI * time * radiansPerTimeUnit;
}

export class BumpComponent extends ECSY.Component {
  static schema = {
    value: { type: ECSY.Types.Number },
  };
}

export class AnimationSystem extends ECSY.System {
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
      const rotation = entity.getMutableComponent(RotationComponent).value;
      rotation[1] = getSpinAt(time, spin[1]);
      rotation[2] = getSpinAt(time, spin[2]);
    });

    this.queries.bumpers.results.forEach((entity) => {
      const cBump = entity.getMutableComponent(BumpComponent);
      if (cBump.value < 1) {
        cBump.value += 0.01;
      }
    });
  }
}
