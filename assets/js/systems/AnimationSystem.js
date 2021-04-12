import * as DRMT from "dreamt";
import { Vector3 } from "three";
import { PositionComponent, VelocityComponent } from "../components";

export class AnimationSystem extends DRMT.System {
  static queries = {
    velocity: {
      components: [VelocityComponent, PositionComponent],
    },
  };

  /**
   * @param {number} delta
   * @param {number} time
   */
  execute(delta, time) {
    this.queries.velocity.results.forEach((entity) => {
      /**
       * @type Vector3
       */
      const velocity = entity.getComponent(VelocityComponent).value;
      /**
       * @type Vector3
       */
      const position = entity.getComponent(PositionComponent).value;

      position.addScaledVector(velocity, delta / 1000);

      // TODO move to PhysicsSystem, once that exists
      const damping = Math.exp(-5 * delta / 1000) - 1;
      velocity.addScaledVector(velocity, damping);
    });
  }
}
