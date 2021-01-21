import * as ECSY from "ecsy";

/** @todo rename to R3FComponent */
export class RenderR3FComponent extends ECSY.Component {
  static schema = {
    value: { type: ECSY.Types.Ref },
  };
}

/** @todo rename to ReactDOMComponent */
export class RenderReactComponent extends ECSY.Component {
  static schema = {
    value: { type: ECSY.Types.Ref },
  };
}
