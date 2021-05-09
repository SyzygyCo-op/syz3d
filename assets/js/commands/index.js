import * as DRMT from "dreamt";
import { AngularVelocityComponent, RotationComponent, VelocityComponent } from "../components";
import { getForwardNormal } from "../utils";

export class Command {
  constructor() {}

  /**
   * @abstract
   * @param {DRMT.Entity} entity
   * @param {any[]} args
   */
  execute(entity, ...args) {
    void entity;
    void args;
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

export class JumpCommand extends Command {
  /**
   * @param {DRMT.Entity} entity
   * @param {number} accel
   */
  execute(entity, accel) {
    const velocity = entity.getMutableComponent(VelocityComponent).value;

    velocity.y = accel;
  }
}

export class TurnCommand extends Command {
  /**
   * @param {DRMT.Entity} entity
   * @param {number} xAccel
   * @param {number} yAccel
   */
  execute(entity, xAccel, yAccel) {
    const velocity = entity.getMutableComponent(AngularVelocityComponent).value;

    velocity.x += xAccel;
    velocity.y += yAccel;
  }
}
