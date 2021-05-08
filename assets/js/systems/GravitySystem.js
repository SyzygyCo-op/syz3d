import * as DRMT from "dreamt";
import { Vector3 } from "three";
import {
  MassComponent,
  OwnershipComponent,
  PositionComponent,
  VelocityComponent,
} from "../components";
import {CollisionSystem} from "./CollisionSystem";

export class GravitySystem extends DRMT.System {
  static queries = {
    entities: {
      components: [
        MassComponent,
        OwnershipComponent,
        VelocityComponent,
        PositionComponent,
      ],
    },
  };

  /**
   * @param {number} delta
   * @param {number} time
   */
  execute(delta, time) {
    this.queries.entities.results.forEach((entity) => {
      /** @type Vector3 */
      const velocity = entity.getMutableComponent(VelocityComponent).value;

      if (this.world.getSystem(CollisionSystem).playerOnFloor) {
        velocity.y = 0;
      } else {
        velocity.y -= delta * 0.1;
        velocity.y = Math.max(velocity.y, -delta * 2);
      }
    });
  }
}
