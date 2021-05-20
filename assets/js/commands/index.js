import * as DRMT from "dreamt";
import { Euler } from "three";
import {
  AngularVelocityComponent,
  RotationComponent,
  VelocityComponent,
} from "../components";
import { getForwardNormal } from "../utils";

export class Command {
  /**
   * @abstract
   * @type DRMT.ComponentConstructor[]
   */
  static _requiredComponents;
  static getRequiredComponents() {
    return this._requiredComponents;
  }
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

/**
 * @param {DRMT.Entity} entity
 * @param {number} yAngle
 * @param {number} magnitude
 */
export function addVelocity(entity, yAngle, magnitude) {
  const velocity = entity.getMutableComponent(VelocityComponent).value;
  const forward = getForwardNormal(0, yAngle, 0);

  velocity.add(forward.multiplyScalar(magnitude));
}

/**
 * @param {DRMT.Entity} entity
 * @param {number} yAngle
 * @param {number} magnitude
 */
export function addStrafeVelocity(entity, yAngle, magnitude) {
  const rotation = entity.getComponent(RotationComponent).value;

  addVelocity(entity, rotation.y + yAngle, magnitude)
}

export class MoveForwardCommand extends Command {
  static _requiredComponents = [RotationComponent, VelocityComponent];

  /** @param {number} accel */
  constructor(accel) {
    super();
    this.accel = accel;
  }
  /** @param {DRMT.Entity} entity */
  execute(entity) {
    /** @type Euler */
    const rotation = entity.getComponent(RotationComponent).value;

    addVelocity(entity, rotation.y, this.accel);
  }
}

export class JumpCommand extends Command {
  static _requiredComponents = [VelocityComponent];
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
  static _requiredComponents = [AngularVelocityComponent];
  /**
   * @param {number} xAccel
   * @param {number} yAccel
   */
  constructor(xAccel, yAccel) {
    super();
    this.xAccel = xAccel;
    this.yAccel = yAccel;
  }

  /** @param {DRMT.Entity} entity */
  execute(entity) {
    TurnCommand.executePure(entity, this.xAccel, this.yAccel);
  }
  /**
   * @param {DRMT.Entity} entity
   * @param {number} xAccel
   * @param {number} yAccel
   */
  static executePure(entity, xAccel, yAccel) {
    const velocity = entity.getMutableComponent(AngularVelocityComponent).value;

    velocity.x += xAccel;
    velocity.y += yAccel;
  }
}
