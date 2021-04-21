import * as DRMT from 'dreamt';
import * as React from 'react';
import {useThree} from 'react-three-fiber';
import { ObservableState, ISettings } from "../../state";
import {  world } from "../../world";
import { Entity } from "./Entity";
import {LocalPlayerTag} from "../../components";
import {CameraSystem, StateSystem} from '../../systems';

export const Scene = (
  /**
   * @param {{
   *   entities: ObservableState['entitiesToRender'];
   * } & ISettings} props
   */
  ({ entities, showNameTags }) => {

    const { setDefaultCamera, gl } = useThree();

    React.useEffect(() => {
      world.getSystem(CameraSystem).setDefaultCamera = setDefaultCamera;
      world.getSystem(StateSystem).canvasElement = gl.domElement;
    }, [])

    return (
      <>
        <ambientLight args={[0x6688cc]}/>
        <directionalLight args={[0xff9999, 0.5]} position={[-1, 1, 2]}/>
        <directionalLight args={[0x8888ff, 0.2]} position={[0, -1, 0]}/>
        <directionalLight args={[0xffffaa, 1.2]} position={[-5, 25, 1]}/>
        {entities.filter(remotePlayerWhenFirstPerson).map((entity) => {
          return <Entity entity={entity} showNameTags={showNameTags} key={entity.id} />;
        })}
      </>
    );

    /** @param {DRMT.Entity} entity */
    function remotePlayerWhenFirstPerson(entity) {
      return !entity.hasComponent(LocalPlayerTag)
    }
  }
)
