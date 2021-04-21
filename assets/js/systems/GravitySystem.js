import * as DRMT from "dreamt";
import { Vector3 } from "three";
import {
  MassComponent,
  OwnershipComponent,
  PositionComponent,
  VelocityComponent,
} from "../components";

export class GravitySystem extends DRMT.System {
  static queries = {
    entities: {
      components: [MassComponent, OwnershipComponent],
    },
  };

  /**
   * @param {number} delta
   * @param {number} time
   */
  execute(delta, time) {
    this.queries.entities.results.forEach((entity) => {
      if (
        entity.hasComponent(VelocityComponent) &&
        entity.hasComponent(PositionComponent)
      ) {
        /** @type Vector3 */
        const position = entity.getComponent(PositionComponent).value;
        /** @type Vector3 */
        const velocity = entity.getComponent(VelocityComponent).value;

        if (position.y > 0) {
          velocity.y -= delta / 20;
          velocity.y = Math.max(velocity.y, -delta / 5);
        }
        // TODO move to collisionsystem?
        position.y = Math.max(position.y, 0);
      }
    });
  }
}
