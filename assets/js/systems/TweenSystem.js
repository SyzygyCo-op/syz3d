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

const v1 = new Vector3();
const v2 = new Vector3();
const v3 = new Vector3();

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
    const duration = getNetworkFrameDuration();
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
      if (!isMine(entity)) {
        const start = entity.getComponent(PositionTweenStartComponent).value;
        const velocity = entity.getComponent(VelocityComponent).value;
        velocity
          .copy(end)
          .sub(start)
          .multiplyScalar(1000 / duration);

        applyVelocity(entity, PositionTweenComponent, delta);

        if (time % duration === 0) {
          start.copy(end);
          tween.copy(end);
        }
      } else {
        // No tweening necessary for local entities
        tween.copy(end);
      }
    });
    this.queries.rotation.results.forEach((entity) => {
      /** @type Euler */
      const tween = entity.getComponent(RotationTweenComponent).value;
      /** @type Euler */
      const end = entity.getComponent(RotationComponent).value;
      if (!isMine(entity)) {
        /** @type Euler */
        const start = entity.getComponent(RotationTweenStartComponent).value;
        /** @type Euler */
        const velocity = entity.getComponent(AngularVelocityComponent).value;
        velocity.toVector3(v1);
        start.toVector3(v2);
        end.toVector3(v3);
        v1.copy(v3)
          .sub(v2)
          .multiplyScalar(1000 / duration);

        velocity.setFromVector3(v1, "YXZ");

        applyAngularVelocity(entity, RotationTweenComponent, delta);

        if (time % duration === 0) {
          start.copy(end);
          tween.copy(end);
        }
      } else {
        // No tweening necessary for local entities
        tween.copy(end);
      }
    });
  }
}
