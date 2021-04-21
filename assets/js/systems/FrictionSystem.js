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
      components: [FrictionComponent, OwnershipComponent],
    },
  };

  /**
   * @param {number} delta
   * @param {number} time
   */
  execute(delta, time) {
    this.queries.entities.results.forEach((entity) => {
      const friction = entity.getComponent(FrictionComponent);
      if (entity.hasComponent(VelocityComponent)) {
        /** @type Vector3 */
        const velocity = entity.getComponent(VelocityComponent).value;
        if (velocity.x || velocity.y || velocity.z) {
          velocity.addScaledVector(velocity, -1 * friction.linear);
        }
      }

      if (entity.hasComponent(AngularVelocityComponent)) {
        /** @type Euler */
        const velocity = entity.getComponent(AngularVelocityComponent).value;
        if (velocity.x || velocity.y || velocity.z) {
          Vector3.prototype.addScaledVector.call(velocity, velocity, -1 * friction.angular)
        }
      }
    });
  }
}
