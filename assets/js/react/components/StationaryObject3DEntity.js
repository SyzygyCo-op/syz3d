
import * as DRMT from "dreamt";
import * as React from "react";
import {
  Object3DComponent,
  ScaleComponent,
  PositionComponent,
  RotationComponent,
} from "../../components";

const stateComponentMap = {
  object3d: Object3DComponent,
  position: PositionComponent,
  rotation: RotationComponent,
  scale: ScaleComponent,
};

/**
 * React-THREE-Fiber component that renders an entity.
 *
 * @type React.ComponentType<{entity: DRMT.Entity}>
 */
export const StationaryObject3DEntity = ({ entity }) => {
  const [
    { object3d, position, rotation, scale },
    sync,
  ] = DRMT.useStateFromComponentMap(entity, stateComponentMap);

  React.useEffect(sync, [entity]);

  return object3d && <primitive object={object3d} position={position} rotation={rotation} scale={scale}/>
};

