import * as DRMT from "dreamt";
import { Vector3, MathUtils, Euler } from "three";
import {
  AngularVelocityComponent,
  PositionComponent,
  RotationComponent,
  VelocityComponent,
} from "../components";

const PI_2 = Math.PI / 2;
const minPolarAngle = 0;
const maxPolarAngle = Math.PI;

export class AnimationSystem extends DRMT.System {
  static queries = {
    velocity: {
      components: [VelocityComponent, PositionComponent],
    },
    angularVelocity: {
      components: [AngularVelocityComponent, RotationComponent],
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
      const damping = Math.exp((-5 * delta) / 1000) - 1;
      velocity.addScaledVector(velocity, damping);
    });

    this.queries.angularVelocity.results.forEach((entity) => {
      /**
       * @type Euler
       */
      const angularVelocity = entity.getComponent(AngularVelocityComponent)
        .value;
      /**
       * @type Euler
       */
      const rotation = entity.getComponent(RotationComponent).value;

      const scale = delta / 1000;
      rotation.x = rotation.x + angularVelocity.x * scale;
      rotation.y = rotation.y + angularVelocity.y * scale;
      rotation.z = rotation.z + angularVelocity.z * scale;

      rotation.x = MathUtils.clamp(
        rotation.x,
        PI_2 - maxPolarAngle,
        PI_2 - minPolarAngle
      );

      // TODO move to PhysicsSystem, once that exists
      const damping = 0.5;

      angularVelocity.x = angularVelocity.x * damping;
      angularVelocity.y = angularVelocity.y * damping;
      angularVelocity.z = angularVelocity.z * damping;

    });
  }
}
