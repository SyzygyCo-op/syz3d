import * as DRMT from "dreamt";
import * as React from "react";
import {
  RotationTweenComponent,
  UILabelComponent,
  VisibleObject3DComponent,
  BoundingBoxComponent,
  ScaleComponent,
  PositionTweenComponent,
  PositionComponent,
  RotationComponent,
  CollisionBodyComponent,
} from "../../components";
import { gameLoop } from "../../world";
import { USE_TWEENING } from "../../config";
import { MovingObject3DRender } from "./MovingObject3DRender";
import { useThree } from "@react-three/fiber";
import { isMine } from "../../utils";
import {userSettings} from "../../state";

const debug = false;

/**
 * React-THREE-Fiber component that renders an entity.
 *
 * @type React.ComponentType<{entity: DRMT.Entity}>
 */
export const MovingObject3DEntity = ({ entity }) => {
  const entityId = React.useMemo(() => entity.id, [entity]);

  const isMyEntity = React.useMemo(() => isMine(entity), [entity]);

  const stateComponentMap = React.useMemo(
    () => ({
      label: UILabelComponent,
      object3d: VisibleObject3DComponent,
      boundingBox: BoundingBoxComponent,
      position: USE_TWEENING && !isMyEntity ? PositionTweenComponent : PositionComponent,
      rotation: USE_TWEENING && !isMyEntity ? RotationTweenComponent : RotationComponent,
      scale: ScaleComponent,
      collisionBody: CollisionBodyComponent
    }),
    [USE_TWEENING, isMyEntity]
  );

  const { camera } = useThree();

  const [isFar, setFar] = React.useState(true);

  const [
    { label, object3d, boundingBox, position, rotation, scale, collisionBody },
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
    if (position && label && userSettings.shouldShowNameTags) {
      const newValue = camera.position.distanceTo(position) > 5;
      if (newValue !== isFar) {
        setFar(newValue);
      }
    }
  });

  return (
    <MovingObject3DRender
      position={position}
      rotation={rotation}
      scale={scale}
      label={label}
      object3d={object3d}
      boundingBox={boundingBox}
      showNameTags={userSettings.shouldShowNameTags && !isFar}
      collisionBody={collisionBody}
    />
  );
};
