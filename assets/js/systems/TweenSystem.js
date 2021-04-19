import * as DRMT from "dreamt";
import { Vector3 } from "three";
import {
  OwnershipComponent,
  PositionComponent,
  PositionTweenComponent,
  PositionTweenStartComponent,
  VelocityComponent,
} from "../components";
import { getNetworkFrameDuration, isMine } from "../utils";
import { applyVelocity } from "./AnimationSystem";

export class TweenSystem extends DRMT.System {
  static queries = {
    maybePosition: {
      components: [
        OwnershipComponent,
        PositionComponent,
        DRMT.Not(PositionTweenComponent),
        DRMT.Not(PositionTweenStartComponent),
        DRMT.Not(VelocityComponent),
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
  };

  execute(delta, time) {
    const duration = getNetworkFrameDuration();
    this.queries.maybePosition.results.forEach((entity) => {
      /** @type Vector3 */
      entity.addComponent(PositionTweenComponent);
      entity.addComponent(PositionTweenStartComponent);
      entity.addComponent(VelocityComponent);
    });
    this.queries.position.results.forEach((entity) => {
      /** @type Vector3 */
      const tween = entity.getComponent(PositionTweenComponent).value;
      /** @type Vector3 */
      const end = entity.getComponent(PositionComponent).value;
      if (!isMine(entity)) {
        const start = entity.getComponent(PositionTweenStartComponent).value;
        const velocity = entity.getComponent(VelocityComponent).value;
        velocity
          .copy(end)
          .sub(start)
          .multiplyScalar(1000 / duration);

        applyVelocity(entity, PositionTweenComponent, delta)

        if (time % duration === 0) {
          start.copy(end);
        }
      } else {
        // No tweening necessary for local entities
        tween.copy(end);
      }
    });
  }
}

