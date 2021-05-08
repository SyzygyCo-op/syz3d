import * as DRMT from "dreamt";
import { Vector3, MathUtils, Euler } from "three";
import {
  AngularVelocityComponent,
  PositionComponent,
  RotationComponent,
  VelocityComponent,
} from "../components";
import { isMine } from "../utils";

const PI_2 = Math.PI / 2;
const minPolarAngle = Math.PI / 32;
const maxPolarAngle = Math.PI * 30 / 32;

export class MovementSystem extends DRMT.System {
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
      if (isMine(entity)) {
        applyVelocity(entity, PositionComponent, delta);
      }
    });

    this.queries.angularVelocity.results.forEach((entity) => {
      if (isMine(entity)) {
        applyAngularVelocity(entity, RotationComponent, delta);
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
