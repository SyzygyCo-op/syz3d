import * as React from "react";
import { observer } from "mobx-react-lite";
import { Canvas } from "react-three-fiber";
import { RenderR3FComponent } from "./components";
import { ObservableState } from "../observableState";

const EntitySet = observer(
  /**
   * @param {{
   *   entities: ObservableState['entities'];
   * }} props
   */
  ({ entities }) => {
    const components = [];
    entities.forEach((entity) => {
      const ReactComponent = /**
       * @type any
       */ entity.getComponent(RenderR3FComponent).value;
      components.push(<ReactComponent entity={entity} key={entity.id} />);
    });
    return <>{components}</>;
  }
);

export const ReactApp = observer(
  /**
   * @param {{ observableState: ObservableState }} props
   */
  ({ observableState }) => {
    return (
      <div className="App">
        <Canvas>
          <EntitySet entities={observableState.entities} />
        </Canvas>
      </div>
    );
  }
);
