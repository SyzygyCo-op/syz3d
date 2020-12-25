import * as THREE from "three";
import { World, Entity, Component, Types } from "ecsy";
import ReactObserverSystem from "./RenderableTagObserverSystem";
import RenderTagComponent from "./RenderTagComponent";
import * as React from "react";
import ReactDOM from "react-dom";
import { Canvas } from "react-three-fiber";
import { Html } from "@react-three/drei";
import { joinRoom } from "./room";

class Position extends Component {}
Position.schema = {
  value: { type: Types.Array },
};

class Player extends Component {}
Player.schema = {
  player_id: { type: Types.String },
};

const world = new World()
  .registerComponent(RenderTagComponent)
  .registerComponent(Position)
  .registerComponent(Player)
  .registerSystem(ReactObserverSystem);

const texture = new THREE.TextureLoader().load("/images/crate.gif");

// TODO refactor using Redux or similar

const App = () => {
  /** @type [Entity[], (e: Entity[]) => void] */
  const [entities, setEntities] = React.useState([]);

  React.useEffect(() => {
    const sub = ReactObserverSystem.subscribe((entities) => {
      // The spread operator is necessary for React to, erm, react.
      setEntities([...entities]);
    });
    return () => sub.unsubscribe();
  }, [setEntities]);

  return (
    <Canvas>
      {entities.map((entity) => {
        const { value: position } = entity.getComponent(Position);
        const player = entity.getComponent(Player);
        console.log(player);

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
};

ReactDOM.render(<App />, document.getElementById("game"));

/**
 * @param {() => void} onLoadCompleted
 */
export async function handleMount(onLoadCompleted) {
  setInterval(() => world.execute(1000 / 60), 1000 / 60);

  const player_id = window.prompt("what is your name?", "Karl");
  const roomId = /** @type {any} window */ (window).ROOM_ID;

  onLoadCompleted();
  let playerEntities = {};
  joinRoom(roomId, {
    player_id,
    onJoin,
    onLeave,
  });

  /**
   * @param {any[]} plist
   */
  function onJoin(plist) {
    plist.forEach((player) => {
      playerEntities[player.player_id] = world
        .createEntity()
        .addComponent(RenderTagComponent)
        .addComponent(Position, { value: getRandomPosition() })
        .addComponent(Player, player);
    });
  }

  /**
   * @param {any[]} plist
   */
  function onLeave(plist) {
    plist.forEach((player) => {
      playerEntities[player.player_id].remove();
      delete playerEntities[player.player_id];
    });
  }
}

function getRandomPosition() {
  return [Math.random() * 4 - 2, Math.random() * 4 - 2, Math.random() * 4 - 2];
}