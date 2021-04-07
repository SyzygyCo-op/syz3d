import * as DRMT from "dreamt";
import * as React from "react";
import * as R3F from "react-three-fiber";
import {
  PositionComponent,
  RotationComponent,
  UILabelComponent,
  Object3DComponent,
  BoundingBoxComponent,
} from "../../components";
import { Html } from "@react-three/drei";
import { gameLoop } from "../../world";

const stateComponentMap = {
  label: UILabelComponent,
  object3d: Object3DComponent,
  boundingBox: BoundingBoxComponent,
};

const debug = false;

/**
 * React-THREE-Fiber component that renders an entity.
 *
 * @type React.ComponentType<{entity:  DRMT.Entity}>
 */
export const Entity = ({ entity }) => {

  const entityId = React.useMemo(() => entity.id, [entity]);
  React.useEffect(() => {
    if (debug) {
      console.log(
        "mounted",
        entityId,
        entity.getComponent(UILabelComponent).value
      );
      return () => console.log("unmounting", entityId);
    }
  }, []);

  const [
    { label, object3d, boundingBox },
    sync,
  ] = DRMT.useStateFromComponentMap(entity, stateComponentMap);

  React.useEffect(() => {
    if(debug) console.log("rerender", entityId, label, object3d, boundingBox);
  },[entity, label, object3d, boundingBox])

  if(debug) {
    console.count("render")
  }

  const ref = React.useRef(null);

  gameLoop.useTick(
    /**
     * @type any
     */ (sync)
  );

  const { camera } = R3F.useThree();

  // TODO position camera accounting for size of avatar bounding box
  camera.position.set(0, 0, 4);

  const position = entity.getComponent(PositionComponent).value;
  const rotation = entity.getComponent(RotationComponent).value;
  gameLoop.useTick(() => {
    if (ref.current) {
      ref.current.position.copy(position);
      ref.current.rotation.copy(rotation);
    }
  });

  return (
    <group ref={ref} castShadow receiveShadow>
      <Html position-y={boundingBox && boundingBox.y}>
        <h3
          style={{
            transform: "translateX(-50%)",
          }}
        >
          {label}
        </h3>
      </Html>
      {object3d && <primitive object={object3d} />}
    </group>
  );
};
