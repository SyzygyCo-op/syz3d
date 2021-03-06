import * as DRMT from "dreamt";
import * as React from "react";
import { useThree } from "@react-three/fiber";
import { userSettings } from "../../state";
import { world } from "../../world";
import { MovingObject3DEntity } from "./MovingObject3DEntity";
import { StationaryObject3DEntity } from "./StationaryObject3DEntity";
import { StateSystem } from "../../systems";
import { isMine, isPlayer } from "../../utils";
import { Sky } from "@react-three/drei";

export const Scene =
  /**
   * @param {{
   *   stationaryObject3DList: DRMT.Entity[];
   *   movingObject3DList: DRMT.Entity[];
   * }} props
   */
  ({ stationaryObject3DList, movingObject3DList }) => {
    const { gl } = useThree();

    React.useEffect(() => {
      world.getSystem(StateSystem).canvasElement = gl.domElement;
    }, []);

    return (
      <>
        <ambientLight args={[0x5a77aa]} />
        <directionalLight args={[0xff9999, 0.5]} position={[-1, 1, 2]} />
        <directionalLight args={[0x8888ff, 0.2]} position={[0, -1, 0]} />
        <directionalLight args={[0xffffaa, 1.2]} position={[-5, 25, 1]} />
        <fog attach="fog" args={[0xefefef, 0, 175]} />
        <Sky distance={45000} inclination={0.75} azimuth={0.25} />
        {stationaryObject3DList.map((entity) => {
          return <StationaryObject3DEntity entity={entity} key={entity.id} />;
        })}
        {movingObject3DList.filter(isEntityOccluded).map((entity) => {
          return <MovingObject3DEntity entity={entity} key={entity.id} />;
        })}
      </>
    );

    /** @param {DRMT.Entity} entity */
    function isEntityOccluded(entity) {
      return userSettings.shouldUse3rdPersonCamera
        ? true
        : isPlayer(entity)
        ? !isMine(entity)
        : true;
    }
  };
