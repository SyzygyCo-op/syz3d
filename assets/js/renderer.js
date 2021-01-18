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

const EntityComponentSet = observer(
  /**
   * @param {{entitySet: MOBX.ObservableSet<ECSY.Entity>, ComponentType: ECSY.ComponentConstructor<any>}} props
   */
  ({ entitySet, ComponentType }) => {
    return (
      <>
        {Array.from(entitySet).map((entity) => {
          const ECSComponent = entity.getComponent(ComponentType);
          const ReactComponent = ECSComponent && ECSComponent.value;
          return ReactComponent ? (
            <ReactComponent entity={entity} key={entity.id} />
          ) : null;
        })}
      </>
    );
  }
);

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
        <EntityComponentSet
          entitySet={observables.reactEntities}
          ComponentType={RenderReactComponent}
        />
      </div>
      <Canvas>
        <EntityComponentSet
          entitySet={observables.reactEntities}
          ComponentType={RenderR3FComponent}
        />
      </Canvas>
    </div>
  );
};

export class RenderSystem extends ECSY.System {
  /** @todo maybe there is a clean way to eliminate the duplication between React and R3F? Maybe split into two separate systems, each with their own ReactDOM.render call? */
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
