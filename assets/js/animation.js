import * as ECSY from "ecsy";

export class SpinComponent extends ECSY.Component {
  static schema = {
    value: { type: ECSY.Types.Array },
  };
}

export class AnimationSystem extends ECSY.System {
  static queries = {
    spinners: {
      components: [SpinComponent],
    },
  };

  /**
   * @param {number} _delta
   * @param {number} time
   */
  execute(_delta, time) {
    this.queries.spinners.results.forEach((entity) => {
      const rotation = entity.getMutableComponent(SpinComponent).value;
      rotation[1] = Math.PI * 2 * ((time % 5000) / 5000);
      rotation[2] = Math.PI * 2 * ((time % 8000) / 8000);
    });
  }
}
