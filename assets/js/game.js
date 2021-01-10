import { World } from "ecsy";
import {
  RenderSystem,
  RenderR3FComponent,
  RenderReactComponent,
} from "./renderer";
import { PlayerComponent, LocalPlayerTag } from "./player";
import { Room, RoomComponent, RoomSystem } from "./room";
import { PositionComponent } from "./position";
import { WelcomeScreenReact } from "./welcome";

const world = new World()
  .registerComponent(RenderR3FComponent)
  .registerComponent(RenderReactComponent)
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

  const roomId = /** @type {any} window */ (window).ROOM_ID;

  const room = new Room(roomId);

  onLoadCompleted();
  world
    .createEntity("localPlayer")
    .addComponent(RoomComponent, { value: room })
    .addComponent(RenderReactComponent, { value: WelcomeScreenReact })
    .addComponent(LocalPlayerTag);
}
