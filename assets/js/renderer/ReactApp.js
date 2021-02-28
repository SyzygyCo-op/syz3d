import * as React from "react";
import { observer } from "mobx-react-lite";
import * as MOBX from "mobx";
import * as ECSY from "ecsy";
import { Canvas } from "react-three-fiber";
import { RenderReactComponent, RenderR3FComponent } from "./components";
import { RenderState } from "dreamt";

const EntityComponentSet = observer(
  /**
   * @param {{
   *   observables: RenderState;
   *   ComponentType: ECSY.ComponentConstructor<
   *     ECSY.Component<{
   *       value: React.FunctionComponent<{ entity: ECSY.Entity }>;
   *     }>
   *   >;
   * }} props
   */
  ({ observables, ComponentType }) => {
    return (
      <>
        {observables.mapEntities(
          (entity, ECSComponent) => {
            const ReactComponent = /** @type any */ (ECSComponent).value;
            return (
              <ReactComponent
                entity={entity}
                key={entity.id}
                entityComponentMap={observables.entityComponentMap}
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
  /** @param {{ observables: RenderState }} props */
  ({ observables }) => {
    return (
      <div className="App">
        <EntityComponentSet
          observables={observables}
          ComponentType={RenderReactComponent}
        />
        <Canvas>
          <EntityComponentSet
            observables={observables}
            ComponentType={RenderR3FComponent}
          />
        </Canvas>
      </div>
    );
  }
);
