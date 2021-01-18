import * as ECSY from "ecsy";
import * as MOBX from "mobx";
import * as React from "react";
import ReactDOM from "react-dom";
import { Canvas } from "react-three-fiber";
import { observer } from "mobx-react-lite";

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

const ReactApp = ({ observables }) => {
  /**
   * @type React.CSSProperties
   */
  const containerStyle = React.useMemo(
    () => ({
      display: "flex",
      flexDirection: "row",
    }),
    []
  );
  return (
    <div style={containerStyle}>
      <div>
        {Array.from(observables.reactEntities).map((entity) => {
          const ReactComponent = entity.getComponent(RenderReactComponent)
            .value;
          return <ReactComponent entity={entity} key={entity.id} />;
        })}
      </div>
      <Canvas>
        {Array.from(observables.r3fEntities).map((entity) => {
          const R3FComponent = entity.getComponent(RenderR3FComponent).value;
          return <R3FComponent entity={entity} key={entity.id} />;
        })}
      </Canvas>
    </div>
  );
};

export class RenderSystem extends ECSY.System {
  /** @todo maybe there is a clean way to eliminate the duplication between React and R3F? Maybe split into two separate systems, each with their own ReactDOM.render call? */
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
    const Observer = observer(ReactApp);
    ReactDOM.render(
      <Observer observables={this._observables} />,
      document.getElementById("game")
    );
  }

  /**
   * @param {number} delta
   * @param {number} time
   */
  execute(delta, time) {
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
   * @private
   * @todo Factor observables into separate class which is instantiated init()?
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
