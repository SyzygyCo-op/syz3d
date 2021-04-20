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
import { applyAngularVelocity, applyVelocity } from "./AnimationSystem";

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
      const tween = entity.getComponent(PositionTweenComponent).value;
      /** @type Vector3 */
      const end = entity.getComponent(PositionComponent).value;
      const duration = getNetworkFrameDuration();
      if (!isMine(entity)) {
        const start = entity.getComponent(PositionTweenStartComponent).value;
        if (time % duration === 0 && !start.equals(end)) {
          /** @type Vector3 */
          /** @type Vector3 */
          const velocity = entity.getComponent(VelocityComponent).value;
          const durationSeconds = duration / 1000;
          velocity.set(
            calcVelocity(start.x, end.x, durationSeconds),
            calcVelocity(start.y, end.y, durationSeconds),
            calcVelocity(start.z, end.z, durationSeconds)
          );
          start.copy(end);
        }

        applyVelocity(entity, PositionTweenComponent, delta);
      }
      if (time % duration === 0 && !tween.equals(end)) {
        tween.copy(end);
      }
    });
    this.queries.rotation.results.forEach((entity) => {
      /** @type Euler */
      const tween = entity.getComponent(RotationTweenComponent).value;
      /** @type Euler */
      const end = entity.getComponent(RotationComponent).value;
      const duration = getNetworkFrameDuration();
      if (!isMine(entity)) {
        /** @type Euler */
        const start = entity.getComponent(RotationTweenStartComponent).value;
        if (time % duration === 0 && !start.equals(end)) {
          /** @type Euler */
          const velocity = entity.getComponent(AngularVelocityComponent).value;
          const durationSeconds = duration / 1000;
          velocity.set(
            calcVelocity(start.x, end.x, durationSeconds),
            calcVelocity(start.y, end.y, durationSeconds),
            calcVelocity(start.z, end.z, durationSeconds),
            "YXZ"
          );
          start.copy(end);
        }

        applyAngularVelocity(entity, RotationTweenComponent, delta);
      }
      if (time % duration === 0 && !tween.equals(end)) {
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
