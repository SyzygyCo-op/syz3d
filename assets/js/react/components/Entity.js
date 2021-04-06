import * as DRMT from "dreamt";
import * as React from "react";
// import * as THREE from "three";
import * as R3F from "react-three-fiber";
import {
  PositionComponent,
  // BumpComponent,
  UILabelComponent,
  Object3DComponent,
  BoundingBoxComponent,
} from "../../components";
import { Html } from "@react-three/drei";
import { gameLoop } from "../../world";

// const bumpMaxScale = new THREE.Vector3(2, 2, 2);
// const bumpMinScale = new THREE.Vector3(1, 1, 1);

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

  const ref = React.useRef(null);

  gameLoop.useTick(
    /**
     * @type any
     */ (sync)
  );

  // gameLoop.useTick(() => {
  //   // console.log("tick", entity.id);
  //   if (ref.current) {
  //     const scale = /**
  //      * @type THREE.Vector3
  //      */ (ref.current.scale);

  //     const cBump = entity.getComponent(BumpComponent);

  //     if (cBump) {
  //       const alpha =
  //         cBump.value < 0.5
  //           ? Math.pow(cBump.value * 2, 2)
  //           : Math.pow((cBump.value - 0.5) * 2, 2);
  //       const v = cBump.value < 0.5 ? bumpMaxScale : bumpMinScale;
  //       scale.lerp(v, alpha);
  //     }
  //   }
  // });

  const { camera } = R3F.useThree();

  // TODO position camera accounting for size of avatar bounding box
  camera.position.set(0, 0, 4);

  const cPosition = entity.getComponent(PositionComponent);
  const position = cPosition ? cPosition.value : [0, 0, 0];

  return (
    <group ref={ref} position={position} castShadow receiveShadow>
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
