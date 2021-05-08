import * as DRMT from "dreamt";
import { Vector3, Euler } from "three";
import {
  OwnershipComponent,
  PositionComponent,
  PositionTweenComponent,
  PositionTweenStartComponent,
  RotationComponent,
  RotationTweenComponent,
  RotationTweenStartComponent,
  VelocityComponent,
  AngularVelocityComponent,
} from "../components";
import { getNetworkFrameDuration, isMine } from "../utils";
import { applyAngularVelocity, applyVelocity } from "./MovementSystem";

// TODO unit tests
export class TweenSystem extends DRMT.System {
  static queries = {
    positionSetup: {
      components: [
        OwnershipComponent,
        PositionComponent,
        DRMT.Not(PositionTweenComponent),
        DRMT.Not(PositionTweenStartComponent),
        DRMT.Not(VelocityComponent),
      ],
    },
    rotationSetup: {
      components: [
        OwnershipComponent,
        RotationComponent,
        DRMT.Not(RotationTweenComponent),
        DRMT.Not(RotationTweenStartComponent),
        DRMT.Not(AngularVelocityComponent),
      ],
    },
    position: {
      components: [
        VelocityComponent,
        OwnershipComponent,
        PositionComponent,
        PositionTweenComponent,
        PositionTweenStartComponent,
      ],
    },
    rotation: {
      components: [
        AngularVelocityComponent,
        OwnershipComponent,
        RotationComponent,
        RotationTweenComponent,
        RotationTweenStartComponent,
      ],
    },
  };

  execute(delta, time) {
    this.queries.positionSetup.results.forEach((entity) => {
      entity.addComponent(PositionTweenComponent);
      entity.addComponent(PositionTweenStartComponent);
      entity.addComponent(VelocityComponent);
    });
    this.queries.rotationSetup.results.forEach((entity) => {
      entity.addComponent(RotationTweenComponent);
      entity.addComponent(RotationTweenStartComponent);
      entity.addComponent(AngularVelocityComponent);
    });
    this.queries.position.results.forEach((entity) => {
      /** @type Vector3 */
      const tween = entity.getMutableComponent(PositionTweenComponent).value;
      /** @type Vector3 */
      const end = entity.getComponent(PositionComponent).value;
      const duration = getNetworkFrameDuration();
      if (!isMine(entity)) {
        /** @type Vector3 */
        const start = entity.getMutableComponent(PositionTweenStartComponent).value;
        /** @type Vector3 */
        const velocity = entity.getMutableComponent(VelocityComponent).value;
        const durationSeconds = duration / 1000;
        velocity.set(
          calcVelocity(start.x, end.x, durationSeconds),
          calcVelocity(start.y, end.y, durationSeconds),
          calcVelocity(start.z, end.z, durationSeconds)
        );
        if (shouldUpdateIntegralValue(start, end, time, duration)) {
          start.copy(end);
        }

        applyVelocity(entity, PositionTweenComponent, delta);
      }
      if (shouldUpdateIntegralValue(tween, end, time, duration)) {
        tween.copy(end);
      }
    });
    this.queries.rotation.results.forEach((entity) => {
      /** @type Euler */
      const tween = entity.getMutableComponent(RotationTweenComponent).value;
      /** @type Euler */
      const end = entity.getComponent(RotationComponent).value;
      const duration = getNetworkFrameDuration();
      if (!isMine(entity)) {
        /** @type Euler */
        const start = entity.getMutableComponent(RotationTweenStartComponent).value;
        /** @type Euler */
        const velocity = entity.getMutableComponent(AngularVelocityComponent).value;
        const durationSeconds = duration / 1000;
        velocity.set(
          calcVelocity(start.x, end.x, durationSeconds),
          calcVelocity(start.y, end.y, durationSeconds),
          calcVelocity(start.z, end.z, durationSeconds),
          "YXZ"
        );
        if (shouldUpdateIntegralValue(start, end, time, duration)) {
          start.copy(end);
        }

        applyAngularVelocity(entity, RotationTweenComponent, delta);
      }
      if (shouldUpdateIntegralValue(tween, end, time, duration)) {
        tween.copy(end);
      }
    });
  }
}

/**
 * @param {number} start
 * @param {number} end
 * @param {number} duration In seconds
 */
function calcVelocity(start, end, duration) {
  return (end - start) / duration;
}

/**
 * @param {Vector3 | Euler} integralValue
 * @param {Vector3 | Euler} endIntegralValue
 * @param {number} time
 * @param {number} intervalDuration
 */
function shouldUpdateIntegralValue(
  integralValue,
  endIntegralValue,
  time,
  intervalDuration
) {
  return time % intervalDuration === 0;
}
