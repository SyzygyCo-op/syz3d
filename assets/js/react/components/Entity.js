import * as DRMT from "dreamt";
import * as React from "react";
import {
  PositionComponent,
  RotationComponent,
  UILabelComponent,
  Object3DComponent,
  BoundingBoxComponent,
  ScaleComponent,
} from "../../components";
import { Html } from "@react-three/drei";
import { gameLoop } from "../../world";
import { Group } from "three";

const stateComponentMap = {
  label: UILabelComponent,
  object3d: Object3DComponent,
  boundingBox: BoundingBoxComponent,
  position: PositionComponent,
  rotation: RotationComponent,
  scale: ScaleComponent,
};

const debug = false;

/**
 * React-THREE-Fiber component that renders an entity.
 *
 * @type React.ComponentType<{entity:  DRMT.Entity}>
 */
export const Entity = ({ entity }) => {
  const entityId = React.useMemo(() => entity.id, [entity]);

  const [
    { label, object3d, boundingBox, position, rotation, scale },
    sync,
  ] = DRMT.useStateFromComponentMap(entity, stateComponentMap);

  React.useEffect(() => {
    if (debug) {
      console.log("mounted", entityId, label);
      return () => console.log("unmounting", entityId);
    }
  }, []);

  React.useEffect(() => {
    if (debug) console.log("rerender", entityId, label, object3d, boundingBox);
  }, [entity, label, object3d, boundingBox]);

  if (debug) {
    console.count("render");
  }

  const ref = React.useRef(null);

  gameLoop.useTick(
    /**
     * @type any
     */ (sync)
  );

  gameLoop.useTick(() => {
    if (ref.current) {
      /**
       * @type Group
       */
      const group = ref.current;
      position && group.position.copy(position);
      rotation && group.rotation.copy(rotation);
      scale && group.scale.copy(scale);
    }
  });

  return (
    <group ref={ref} castShadow receiveShadow>
      {label && (
        <Html position-y={boundingBox && boundingBox.y}>
          <h3
            style={{
              transform: "translateX(-50%)",
            }}
          >
            {label}
          </h3>
        </Html>
      )}
      {object3d && <primitive object={object3d} />}
    </group>
  );
};
