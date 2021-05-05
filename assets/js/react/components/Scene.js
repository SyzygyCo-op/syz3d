import * as DRMT from "dreamt";
import * as React from "react";
import { useThree } from "@react-three/fiber";
import { ISettings } from "../../state";
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
   * } & ISettings} props
   */
  ({ stationaryObject3DList, movingObject3DList, showNameTags }) => {
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
        <fog attach="fog" args={[0xddeeff, 2, 40]} />
        <Sky
          distance={450000} // Camera distance (default=450000)
          sunPosition={[0, 1, 0]} // Sun position normal (defaults to inclination and azimuth if not set)
          inclination={0} // Sun elevation angle from 0 to 1 (default=0)
          azimuth={0.25} // Sun rotation around the Y axis from 0 to 1 (default=0.25)
        />
        {stationaryObject3DList.map((entity) => {
          return <StationaryObject3DEntity entity={entity} key={entity.id} />;
        })}
        {movingObject3DList.filter(isEntityOccluded).map((entity) => {
          return (
            <MovingObject3DEntity
              entity={entity}
              showNameTags={showNameTags}
              key={entity.id}
            />
          );
        })}
      </>
    );

    /** @param {DRMT.Entity} entity */
    function isEntityOccluded(entity) {
      const isUsing3rdPersonCamera = world.getSystem(StateSystem).observable
        .isUsing3rdPersonCamera;

      return isUsing3rdPersonCamera
        ? true
        : isPlayer(entity)
        ? !isMine(entity)
        : true;
    }
  };
