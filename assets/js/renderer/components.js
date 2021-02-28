import * as DRMT from "dreamt";

/** @todo rename to R3FComponent */
export class RenderR3FComponent extends DRMT.Component {
  static schema = {
    value: { type: DRMT.Types.Ref },
  };
}

/** @todo rename to ReactDOMComponent */
export class RenderReactComponent extends DRMT.Component {
  static schema = {
    value: { type: DRMT.Types.Ref },
  };
}
