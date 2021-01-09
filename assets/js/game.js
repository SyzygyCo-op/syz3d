import { World } from "ecsy";
import { RenderSystem, RenderR3FComponent } from "./renderer";
import { PlayerComponent, LocalPlayerTag } from "./player";
import { Room, RoomComponent, RoomSystem } from "./room";
import { PositionComponent } from "./position";

const world = new World()
  .registerComponent(RenderR3FComponent)
  .registerComponent(PositionComponent)
  .registerComponent(PlayerComponent)
  .registerComponent(LocalPlayerTag)
  .registerComponent(RoomComponent)
  .registerSystem(RoomSystem)
  .registerSystem(RenderSystem);

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
