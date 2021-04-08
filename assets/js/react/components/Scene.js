import * as DRMT from 'dreamt';
import * as React from 'react';
import {useThree} from 'react-three-fiber';
import { observer } from "mobx-react-lite";
import { ObservableState } from "../../state";
import {  world } from "../../world";
import { Entity } from "./Entity";
import {LocalPlayerTag} from "../../components";
import {CameraSystem, StateSystem} from '../../systems';

export const Scene = observer(
  /**
   * @param {{
   *   entities: ObservableState['entitiesToRender'];
   * }} props
   */
  ({ entities }) => {

    const { setDefaultCamera } = useThree();

    React.useEffect(() => {
      setDefaultCamera(world.getSystem(CameraSystem).camera);
      world.getSystem(StateSystem).isCameraReady = true;
    }, [])

    return (
      <>
        <ambientLight args={[0x6688cc]}/>
        <directionalLight args={[0xff9999, 0.5]} position={[-1, 1, 2]}/>
        <directionalLight args={[0x8888ff, 0.2]} position={[0, -1, 0]}/>
        <directionalLight args={[0xffffaa, 1.2]} position={[-5, 25, 1]}/>
        {entities.filter(remotePlayerWhenFirstPerson).map((entity) => {
          return <Entity entity={entity} key={entity.id} />;
        })}
      </>
    );

    /** @param {DRMT.Entity} entity */
    function remotePlayerWhenFirstPerson(entity) {
      return !entity.hasComponent(LocalPlayerTag)
    }
  }
)
