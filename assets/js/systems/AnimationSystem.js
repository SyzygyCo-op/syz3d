import * as DRMT from "dreamt";
import { Vector3, MathUtils, Euler } from "three";
import {
  AngularVelocityComponent,
  OwnershipComponent,
  PositionComponent,
  RotationComponent,
  VelocityComponent,
} from "../components";
import { getForwardNormal, getPlayerId } from "../utils";

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
    test: {
      components: [OwnershipComponent],
    },
  };

  /**
   * @param {number} delta
   * @param {number} time
   */
  execute(delta, time) {
    this.queries.velocity.results.forEach((entity) => {
      if (
        entity.hasComponent(OwnershipComponent) &&
        entity.getComponent(OwnershipComponent).value !== getPlayerId()
      ) {
        return;
      }

      /** @type Vector3 */
      const velocity = entity.getComponent(VelocityComponent).value;
      /** @type Vector3 */
      const position = entity.getComponent(PositionComponent).value;

      position.addScaledVector(velocity, delta / 1000);

      // TODO move to PhysicsSystem, once that exists
      const damping = Math.exp((-5 * delta) / 1000) - 1;
      velocity.addScaledVector(velocity, damping);

      velocity.y -= delta / 20;
      velocity.y = Math.max(velocity.y, -delta / 5);
    });

    this.queries.angularVelocity.results.forEach((entity) => {
      if (
        entity.hasComponent(OwnershipComponent) &&
        entity.getComponent(OwnershipComponent).value !== getPlayerId()
      ) {
        return;
      }

      /** @type Euler */
      const angularVelocity = entity.getComponent(AngularVelocityComponent)
        .value;
      /** @type Euler */
      const rotation = entity.getComponent(RotationComponent).value;

      const scale = delta / 1000;
      rotation.x = rotation.x + angularVelocity.x * scale;
      rotation.y = rotation.y + angularVelocity.y * scale;
      rotation.z = rotation.z + angularVelocity.z * scale;

      // TODO move to PhysicsSystem, once that exists
      // TODO use a DampingComponent?
      const damping = 0.5;

      if (!entity.hasComponent(OwnershipComponent)) {
        rotation.x = MathUtils.clamp(
          rotation.x,
          PI_2 - maxPolarAngle,
          PI_2 - minPolarAngle
        );
        angularVelocity.x = angularVelocity.x * damping;
        angularVelocity.y = angularVelocity.y * damping;
        angularVelocity.z = angularVelocity.z * damping;
      }
    });

    this.queries.test.results.forEach((entity) => {
      const owningPlayerId = entity.getComponent(OwnershipComponent).value;
      if (owningPlayerId === getPlayerId()) {
        if (!entity.hasComponent(VelocityComponent)) {
          entity.addComponent(VelocityComponent);
        }
        if (!entity.hasComponent(AngularVelocityComponent)) {
          entity.addComponent(AngularVelocityComponent, {
            value: new Euler(
              0,
              Math.random() * 0.7 + 0.5,
              Math.random() * 0.7 + 0.5
            ),
          });
        }
        /** @type Vector3 */
        const velocity = entity.getComponent(VelocityComponent).value;
        /** @type Euler */
        const rotation = entity.getComponent(RotationComponent).value;

        velocity.copy(getForwardNormal(rotation).multiplyScalar(3));
      }
    });
  }
}
