import * as ECSY from "ecsy";

export class TextureComponent extends ECSY.Component {
  /** @type string */
  url;

  static schema = {
    url: { type: ECSY.Types.String },
  };
}
