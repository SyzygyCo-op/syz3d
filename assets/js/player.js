import * as ECSY from "ecsy";

export class LocalPlayerTag extends ECSY.TagComponent {}

export class PlayerComponent extends ECSY.Component {
  static schema = {
    player_id: { type: ECSY.Types.String },
  };
}
