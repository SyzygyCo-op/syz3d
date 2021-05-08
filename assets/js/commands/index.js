import * as DRMT from "dreamt";
import { RotationComponent, VelocityComponent } from "../components";
import { getForwardNormal } from "../utils";

export class Command {
  constructor() {}

  /**
   * @abstract
   * @param {DRMT.Entity} entity
   */
  execute(entity) {
    void entity;
  }
}

export class MoveCommand extends Command {
  /** @param {number} accel */
  constructor(accel) {
    super();
    this.accel = accel;
  }
  /** @param {DRMT.Entity} entity */
  execute(entity) {
    const rotation = entity.getMutableComponent(RotationComponent).value;
    const velocity = entity.getComponent(VelocityComponent).value;
    const forward = getForwardNormal(rotation);

    velocity.add(forward.multiplyScalar(this.accel));
  }
}
