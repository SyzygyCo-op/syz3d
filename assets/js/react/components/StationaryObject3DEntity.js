
import * as DRMT from "dreamt";
import * as React from "react";
import {Object3D, Mesh, Material} from "three";
import {
  Object3DComponent,
  ScaleComponent,
  PositionComponent,
  RotationComponent,
  UseGlftForCollisionTag,
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

  const isForCollision = React.useMemo(()=>entity.hasComponent(UseGlftForCollisionTag), [entity])

  React.useEffect(sync, [entity]);

  return object3d && <primitive object={isForCollision ? setCollisionMaterial(object3d) : object3d} position={position} rotation={rotation} scale={scale}/>
};

/** @param {Object3D} object3d */
function setCollisionMaterial(object3d) {
  object3d.traverse((child) => {
    if(child.type === "Mesh") {
      const mesh = /** @type Mesh */(child);
      const material =/** @type Material */(/** @type any */(mesh.material).length ? mesh.material[0] : mesh.material);

      material.transparent = true;
      material.opacity = 0.5;
    }
  })

  return object3d
}
