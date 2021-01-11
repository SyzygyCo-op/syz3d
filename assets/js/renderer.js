import * as ECSY from "ecsy";
import * as MOBX from "mobx";
import * as React from "react";
import ReactDOM from "react-dom";
import { Canvas } from "react-three-fiber";
import { observer } from "mobx-react-lite";
import * as RxJs from "rxjs";

export class RenderR3FComponent extends ECSY.Component {
  static schema = {
    value: { type: ECSY.Types.Ref },
  };
}
export class RenderReactComponent extends ECSY.Component {
  static schema = {
    value: { type: ECSY.Types.Ref },
  };
}

export class RenderSystem extends ECSY.System {
  static queries = {
    r3f: {
      components: [RenderR3FComponent],
      listen: {
        added: true,
        removed: true,
      },
    },
    react: {
      components: [RenderReactComponent],
      listen: {
        added: true,
        removed: true,
      },
    },
  };

  init() {
    const App = observer(() => {
      /**
       * @type React.CSSProperties
       */
      const overlayStyle = React.useMemo(
        () => ({
          position: "fixed",
          top: "0",
          left: "0",
          zIndex: 1,
        }),
        []
      );
      return (
        <>
          <div style={overlayStyle}>
            {Array.from(this._observables.reactEntities).map((entity) => {
              const ReactComponent = entity.getComponent(RenderReactComponent)
                .value;
              return (
                <ReactComponent
                  entity={entity}
                  world={this.world}
                  key={entity.id}
                />
              );
            })}
          </div>
          <Canvas>
            {Array.from(this._observables.r3fEntities).map((entity) => {
              const R3FComponent = entity.getComponent(RenderR3FComponent)
                .value;
              return (
                <R3FComponent
                  entity={entity}
                  world={this.world}
                  time={this._time}
                  key={entity.id}
                />
              );
            })}
          </Canvas>
        </>
      );
    });

    ReactDOM.render(<App />, document.getElementById("game"));
  }

  /**
   * @param {number} delta
   * @param {number} time
   */
  execute(delta, time) {
    MOBX.runInAction(() => {
      this._time.next(time);
    });
    if (
      this.queries.r3f.added.length > 0 ||
      this.queries.r3f.removed.length > 0 ||
      this.queries.react.added.length > 0 ||
      this.queries.react.removed.length > 0
    ) {
      this._updateObservables();
    }
  }

  /**
   * Wasn't sure how else to acheive pushing updates to elements within a
   * React component _without_ causing React to re-render, which causes
   * flicker.
   * @private
   */
  _time = new RxJs.Subject();

  /**
   * @private
   */
  _updateObservables = MOBX.action(() => {
    this._observables.r3fEntities.clear();
    this._observables.reactEntities.clear();
    this.queries.r3f.results.forEach((e) =>
      this._observables.r3fEntities.add(e)
    );
    this.queries.react.results.forEach((e) =>
      this._observables.reactEntities.add(e)
    );
  });

  /**
   * @private
   */
  _observables = {
    /** @type {MOBX.ObservableSet<ECSY.Entity>} */
    r3fEntities: MOBX.observable.set(),
    /** @type {MOBX.ObservableSet<ECSY.Entity>} */
    reactEntities: MOBX.observable.set(),
  };
}
