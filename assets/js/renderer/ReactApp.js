import * as React from "react";
import { observer } from "mobx-react-lite";
import * as ECSY from "ecsy";
import { Canvas } from "react-three-fiber";
import { RenderReactComponent, RenderR3FComponent } from "./components";
import { ObservableState } from "../observableState";

const EntityComponentSet = observer(
  /**
   * @param {{
   *   observableState: RenderState;
   *   ComponentType: ECSY.ComponentConstructor<
   *     ECSY.Component<{
   *       value: React.FunctionComponent<{ entity: ECSY.Entity }>;
   *     }>
   *   >;
   * }} props
   */
  ({ observableState, ComponentType }) => {
    return (
      <>
        {observableState.mapEntities(
          (entity, ECSComponent) => {
            const ReactComponent = /** @type any */ (ECSComponent).value;
            return (
              <ReactComponent
                entity={entity}
                key={entity.id}
                entityComponentMap={observableState.entityComponentMap}
              />
            );
          },
          { withComponent: ComponentType }
        )}
      </>
    );
  }
);

export const ReactApp = observer(
  /** @param {{ observableState: RenderState }} props */
  ({ observableState }) => {
    return (
      <div className="App">
        <EntityComponentSet
          observableState={observableState}
          ComponentType={RenderReactComponent}
        />
        <Canvas>
          <EntityComponentSet
            observableState={observableState}
            ComponentType={RenderR3FComponent}
          />
        </Canvas>
      </div>
    );
  }
);
