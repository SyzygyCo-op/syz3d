import * as DRMT from 'dreamt'

export class PlayerTag extends DRMT.TagComponent {}

export class LocalPlayerTag extends DRMT.TagComponent {}

export class UILabelComponent extends DRMT.Component {
  static schema = {
    value: { type: DRMT.Types.String },
  };
}

export class R3FComponent extends DRMT.Component {
  static schema = {
    value: { type: DRMT.Types.Ref },
  };
}

export class RotationComponent extends DRMT.Component {
  static schema = {
    value: { type: DRMT.Types.Array },
  };
}

export class SpinComponent extends DRMT.Component {
  static schema = {
    value: { type: DRMT.Types.Array },
  };
}

export class BumpComponent extends DRMT.Component {
  static schema = {
    value: { type: DRMT.Types.Number },
  };
}

export class TextureComponent extends DRMT.Component {
  /** @type string */
  url;

  static schema = {
    url: { type: DRMT.Types.String },
  };
}

export class PositionComponent extends DRMT.Component {
  static schema = {
    value: { type: DRMT.Types.Array },
  };

  static randomValue() {
    return [Math.random() * 2 - 1, Math.random() * 2 - 1, Math.random() * 2];
  }
}
