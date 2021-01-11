import * as ECSY from "ecsy";

export class PositionComponent extends ECSY.Component {
  static schema = {
    value: { type: ECSY.Types.Array },
  };
}
export function getRandomPosition() {
  return [Math.random() * 4 - 2, Math.random() * 4 - 2, Math.random() * 2 - 1];
}
