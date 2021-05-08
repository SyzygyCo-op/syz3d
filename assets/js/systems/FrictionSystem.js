import * as DRMT from "dreamt";
import { Vector3, Euler } from "three";
import {
  FrictionComponent,
  AngularVelocityComponent,
  OwnershipComponent,
  VelocityComponent,
} from "../components";

export class FrictionSystem extends DRMT.System {
  static queries = {
    entities: {
      components: [
        FrictionComponent,
        OwnershipComponent,
        VelocityComponent,
        AngularVelocityComponent,
      ],
    },
  };

  /**
   * @param {number} delta
   * @param {number} time
   */
  execute(delta, time) {
    this.queries.entities.results.forEach((entity) => {
      const friction = entity.getComponent(FrictionComponent);
      /** @type Vector3 */
      const velocity = entity.getMutableComponent(VelocityComponent).value;
      /** @type Euler */
      const angularVelocity = entity.getMutableComponent(AngularVelocityComponent).value;

      // TODO(perf) do these if statements really help?
      if (velocity.x || velocity.y || velocity.z) {
        velocity.addScaledVector(velocity, -1 * friction.linear);
      }

      if (angularVelocity.x || angularVelocity.y || angularVelocity.z) {
        Vector3.prototype.addScaledVector.call(
          angularVelocity,
          angularVelocity,
          -1 * friction.angular
        );
      }
    });
  }
}
