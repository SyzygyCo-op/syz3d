import * as DRMT from "dreamt";
import * as React from "react";
import {
  RotationTweenComponent,
  UILabelComponent,
  Object3DComponent,
  BoundingBoxComponent,
  ScaleComponent,
  PositionTweenComponent,
  PositionComponent,
  RotationComponent,
} from "../../components";
import { Html } from "@react-three/drei";
import { gameLoop } from "../../world";
import {USE_TWEENING} from "../../config";
import {makeCopier} from "../../utils";

const stateComponentMap = {
  label: UILabelComponent,
  object3d: Object3DComponent,
  boundingBox: BoundingBoxComponent,
  position: USE_TWEENING ? PositionTweenComponent : PositionComponent,
  rotation: USE_TWEENING ? RotationTweenComponent : RotationComponent,
  scale: ScaleComponent,
};

const debug = false;

/**
 * React-THREE-Fiber component that renders an entity.
 *
 * @type React.ComponentType<{entity: DRMT.Entity} & import("../../state").ISettings>
 */
export const Entity = ({ entity, showNameTags }) => {
  const entityId = React.useMemo(() => entity.id, [entity]);

  // TODO make sure these are mostly only updating when the component mounts
  // perhaps just call `sync` in a mount-only effect
  const [
    {
      label,
      object3d,
      boundingBox,
      position,
      rotation,
      scale,
    },
    sync,
  ] = DRMT.useStateFromComponentMap(entity, stateComponentMap);

  const groupRef = React.useRef(null);

  React.useEffect(() => {
    if (debug) {
      console.log("mounted", entityId, label, object3d);
      return () => console.log("unmounting", entityId);
    }
  }, []);

  React.useEffect(() => {
    if (debug) console.log("rerender", entityId, label, object3d);
  }, [entity, label, object3d, boundingBox]);

  if (debug) {
    console.count("render");
  }

  gameLoop.useTick(/** @type any */ (sync));

  /** TODO
    * called when off screen?
    * */
  gameLoop.useTick(makeCopier(groupRef.current, "position", position));
  gameLoop.useTick(makeCopier(groupRef.current, "rotation", rotation));
  gameLoop.useTick(makeCopier(groupRef.current, "scale", scale));

  // TODO add user setting for whether to show labels

  return (
    <group ref={groupRef} castShadow receiveShadow>
      {label && showNameTags && (
        // TODO use distanceFactor prop
        <Html position-y={boundingBox && boundingBox.y} center>
          <address>{label}</address>
        </Html>
      )}
      {object3d && <primitive object={object3d} />}
    </group>
  )
};


