import * as DRMT from "dreamt";
import { Vector3, MathUtils, Euler } from "three";
import {
  AngularVelocityComponent,
  OwnershipComponent,
  PositionComponent,
  RotationComponent,
  VelocityComponent,
} from "../components";
import { getForwardNormal, isPlayer, isMine } from "../utils";

const PI_2 = Math.PI / 2;
const minPolarAngle = 0;
const maxPolarAngle = Math.PI;

// TODO if not using a full-blown physics rig like Cannon, split in to multiple more focused systems, e.g. MovementSystem, GravitySystem, FrictionSystem, CollisionSystem

export class MovementSystem extends DRMT.System {
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
      if (isMine(entity)) {
        applyVelocity(entity, PositionComponent, delta);
      }
    });

    this.queries.angularVelocity.results.forEach((entity) => {
      if (isMine(entity)) {
        applyAngularVelocity(entity, RotationComponent, delta);
      }
    });

    this.queries.test.results.forEach((entity) => {
      if (isMine(entity) && !isPlayer(entity)) {
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

/**
 * @param {DRMT.Entity} entity
 * @param {typeof PositionComponent} PositionComponent
 * @param {number} delta
 */
export function applyVelocity(entity, PositionComponent, delta) {
  /** @type Vector3 */
  const velocity = entity.getComponent(VelocityComponent).value;
  /** @type Vector3 */
  const position = entity.getComponent(PositionComponent).value;

  if(velocity.x || velocity.y || velocity.z) {
    position.addScaledVector(velocity, delta / 1000);
  }

}

/**
 * @param {DRMT.Entity} entity
 * @param {typeof RotationComponent} RotationComponent
 * @param {number} delta
 */
export function applyAngularVelocity(entity, RotationComponent, delta) {
  /** @type Euler */
  const velocity = entity.getComponent(AngularVelocityComponent).value;
  /** @type Euler */
  const rotation = entity.getComponent(RotationComponent).value;

  if(velocity.x || velocity.y || velocity.z) {
    Vector3.prototype.addScaledVector.call(rotation, velocity, delta / 1000);
  }

  rotation.x = MathUtils.clamp(
    rotation.x,
    PI_2 - maxPolarAngle,
    PI_2 - minPolarAngle
  );
}
