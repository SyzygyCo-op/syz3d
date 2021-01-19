import * as React from "react";
import { observer } from "mobx-react-lite";
import * as MOBX from "mobx";
import * as ECSY from "ecsy";
import { Canvas } from "react-three-fiber";
import { RenderReactComponent, RenderR3FComponent } from "./components";

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

export const ReactApp = observer(({ observables }) => {
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
});
