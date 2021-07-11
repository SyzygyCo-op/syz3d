import * as DRMT from "dreamt";
import { Euler, Vector3 } from "three";
import { AngularVelocityComponent, PositionComponent, RotationComponent, VelocityComponent } from "../components";

/**
 * @param {number} num
 */
function round(num) {
  return Math.round(num * 1000) / 1000;
}

/** @param {Vector3 | Euler} vectorOrEuler */
function round3(vectorOrEuler) {
  vectorOrEuler.x = round(vectorOrEuler.x);
  vectorOrEuler.y = round(vectorOrEuler.y);
  vectorOrEuler.z = round(vectorOrEuler.z);
}

/** @param {DRMT.ComponentConstructor} Component */
function thunk(Component) {
  return roundComponent;
  /** @param {DRMT.Entity} entity */
  function roundComponent(entity) {
    const value = /** @type any */(entity.getComponent(Component)).value
    round3(value);
  }
}

export class RoundingSystem extends DRMT.System {
  static queries = {
    position: {
      components: [PositionComponent],
    },
    rotation: {
      components: [RotationComponent],
    },
    velocity: {
      components: [VelocityComponent],
    },
    angularVelocity: {
      components: [AngularVelocityComponent],
    },
  };

  execute(_delta, _time) {
    this.queries.position.results.forEach(thunk(PositionComponent));
    this.queries.rotation.results.forEach(thunk(RotationComponent));
    this.queries.velocity.results.forEach(thunk(VelocityComponent));
    this.queries.angularVelocity.results.forEach(thunk(AngularVelocityComponent));
  }
}
