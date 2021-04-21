import * as DRMT from "dreamt";
import { Vector3, MathUtils, Euler } from "three";
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
        const velocity = entity.getComponent(VelocityComponent).value;
        velocity.addScaledVector(velocity, -1 * friction.linear);
      }

      if (entity.hasComponent(AngularVelocityComponent)) {
        /** @type Euler */
        const velocity = entity.getComponent(AngularVelocityComponent).value;
        const damping = -1 * friction.angular;
        velocity.x += velocity.x * damping;
        velocity.y += velocity.y * damping;
        velocity.z += velocity.z * damping;
      }
    });
  }
}

