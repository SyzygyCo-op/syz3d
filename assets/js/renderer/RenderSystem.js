import * as ECSY from "ecsy";
import * as MOBX from "mobx";
import * as React from "react";
import ReactDOM from "react-dom";
import { RenderReactComponent, RenderR3FComponent } from "./components";
import { ReactApp } from "./ReactApp";

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
      <ReactApp observables={this._observables} />,
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
      this._updateObservables();
    }
  }

  /**
   * @private
   * @todo Factor observables into separate class which is instantiated init()?
   */
  _updateObservables = MOBX.action(() => {
    this._observables.reactEntities.clear();
    this.queries.react.results.forEach((e) =>
      this._observables.reactEntities.add(e)
    );
    this.queries.r3f.results.forEach((e) =>
      this._observables.reactEntities.add(e)
    );
  });

  /**
   * @private
   */
  _observables = {
    /** @type {MOBX.ObservableSet<ECSY.Entity>} */
    reactEntities: MOBX.observable.set(),
  };
}
