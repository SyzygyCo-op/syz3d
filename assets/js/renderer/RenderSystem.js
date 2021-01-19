import * as ECSY from "ecsy";
import * as MOBX from "mobx";
import * as React from "react";
import ReactDOM from "react-dom";
import { RenderReactComponent, RenderR3FComponent } from "./components";
import { ReactApp } from "./ReactApp";
import { RenderState } from "./RenderState";

export class RenderSystem extends ECSY.System {
  static queries = {
    react: {
      components: [RenderReactComponent],
      listen: {
        added: true,
        removed: true,
        changed: true,
      },
    },
    r3f: {
      components: [RenderR3FComponent],
      listen: {
        added: true,
        removed: true,
        changed: true,
      },
    },
  };

  init() {
    ReactDOM.render(
      <ReactApp observables={this._state} />,
      document.getElementById("game")
    );
  }

  /**
   * @param {number} delta
   * @param {number} time
   */
  execute(delta, time) {
    if (
      this.queries.react.added.length > 0 ||
      this.queries.react.removed.length > 0 ||
      this.queries.react.changed.length > 0 ||
      this.queries.r3f.added.length > 0 ||
      this.queries.r3f.removed.length > 0 ||
      this.queries.r3f.changed.length > 0
    ) {
      this._state.update(this.queries.react.results, this.queries.r3f.results);
    }
  }

  /**
   * @private
   */
  _state = new RenderState();
}
