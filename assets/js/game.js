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
import { TextureComponent } from "./texture";
import { SpinComponent, AnimationSystem } from "./animation";

const world = new World()
  .registerComponent(RenderR3FComponent)
  .registerComponent(RenderReactComponent)
  .registerComponent(PositionComponent)
  .registerComponent(TextureComponent)
  .registerComponent(PlayerComponent)
  .registerComponent(LocalPlayerTag)
  .registerComponent(RoomComponent)
  .registerComponent(SpinComponent)
  .registerSystem(RoomSystem)
  .registerSystem(RenderSystem)
  .registerSystem(AnimationSystem);

/**
 * @param {() => void} onLoadCompleted
 */
export async function handleMount(onLoadCompleted) {
  // Don't need RAF because react-three-fiber has its own render loop that
  // ensures flicker-free animation.
  let time = 0;
  let delta = 1000 / 60;
  setInterval(() => {
    world.execute(delta, time);
    time += delta;
  }, delta);

  const roomId = /** @type {any} window */ (window).ROOM_ID;

  const room = new Room(roomId);

  onLoadCompleted();
  world
    .createEntity("localPlayer")
    .addComponent(RoomComponent, { value: room })
    .addComponent(RenderReactComponent, { value: WelcomeScreenReact })
    .addComponent(LocalPlayerTag);
}
