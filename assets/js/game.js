import * as THREE from "three";
import { World } from "ecsy";
import ReactObserverSystem from "./RenderableTagObserverSystem";
import RenderTagComponent from "./RenderTagComponent";
import * as React from "react";
import ReactDOM from "react-dom";
import { Canvas } from "react-three-fiber";
import { Html } from "@react-three/drei";
import { observer } from "mobx-react-lite";
import { PlayerComponent, LocalPlayerTag } from "./player";
import { Room, RoomComponent, RoomSystem } from "./room";
import { PositionComponent } from "./position";

const world = new World()
  .registerComponent(RenderTagComponent)
  .registerComponent(PositionComponent)
  .registerComponent(PlayerComponent)
  .registerComponent(LocalPlayerTag)
  .registerComponent(RoomComponent)
  .registerSystem(RoomSystem)
  .registerSystem(ReactObserverSystem);

const texture = new THREE.TextureLoader().load("/images/crate.gif");

const App = observer(() => {
  const observerSystem = world.getSystem(ReactObserverSystem);

  return (
    <Canvas>
      {Array.from(observerSystem.results).map((entity) => {
        const { value: position } = entity.getComponent(PositionComponent);
        const player = entity.getComponent(PlayerComponent);

        return (
          <group position={position} key={entity.id}>
            <Html>
              <h3>{player.player_id || "IDK"}</h3>
            </Html>
            <mesh>
              <boxBufferGeometry args={[1, 1, 1]} />
              <meshBasicMaterial map={texture} />
            </mesh>
          </group>
        );
      })}
    </Canvas>
  );
});

ReactDOM.render(<App />, document.getElementById("game"));

/**
 * @param {() => void} onLoadCompleted
 */
export async function handleMount(onLoadCompleted) {
  setInterval(() => {
    world.execute(1000 / 60);
  }, 1000 / 60);

  const player_id = window.prompt("what is your name?", "Karl");
  const roomId = /** @type {any} window */ (window).ROOM_ID;

  const room = new Room(roomId);

  onLoadCompleted();
  world
    .createEntity("localPlayer")
    .addComponent(RoomComponent, { value: room })
    .addComponent(PlayerComponent, { player_id })
    .addComponent(LocalPlayerTag);
}
