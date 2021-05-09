import * as DRMT from "dreamt";
import { Vector3Type } from '../types';

/**
 * The latest position according to the server, which is used as the target
 * value when transitioning from the previously reported position using
 * PositionTweenComponent and PositionTweenStartComponent.
 *
 * @see PositionTweenComponent
 * @see PositionTweenStartComponent
 */
export class PositionComponent extends DRMT.Component {
  static schema = {
    value: { type: Vector3Type },
  };
}
/** @see PositionComponent */
export class PositionTweenComponent extends DRMT.Component {
  static schema = {
    value: { type: Vector3Type },
  };
}
/** @see PositionComponent */
export class PositionTweenStartComponent extends DRMT.Component {
  static schema = {
    value: { type: Vector3Type },
  };
}
