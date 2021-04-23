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
import { gameLoop } from "../../world";
import { USE_TWEENING } from "../../config";
import {EntityRender} from "./EntityRender";
import {useThree} from "@react-three/fiber";

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

  const { camera } = useThree();

  const [ isFar, setFar ] = React.useState(true);

  // TODO make sure these are mostly only updating when the component mounts
  // perhaps just call `sync` in a mount-only effect
  const [
    { label, object3d, boundingBox, position, rotation, scale },
    sync,
  ] = DRMT.useStateFromComponentMap(entity, stateComponentMap);

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

  gameLoop.useTick(() => {
    if(position && label && showNameTags) {
      const newValue = camera.position.distanceTo(position) > 5;
      if(newValue !== isFar) {
        setFar(newValue);
      }
    }
  })

  return (
    <EntityRender position={position} rotation={rotation} scale={scale} label={label} object3d={object3d} boundingBox={boundingBox} showNameTags={showNameTags && !isFar} />
  );
};

