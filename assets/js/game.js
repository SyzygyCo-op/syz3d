import * as ECSY from "ecsy";
import { PlayerComponent, LocalPlayerTag } from "./player";
import { RoomComponent, RoomSystem } from "./room";
import { PositionComponent } from "./position";
import { WelcomeScreenReact } from "./welcome";
import { TextureComponent } from "./texture";
import { SpinComponent, AnimationSystem, BumpComponent } from "./animation";
import { setupRenderer, RenderReactComponent } from "./renderer";

const world = new ECSY.World()
  .registerComponent(PositionComponent)
  .registerComponent(TextureComponent)
  .registerComponent(PlayerComponent)
  .registerComponent(LocalPlayerTag)
  .registerComponent(RoomComponent)
  .registerComponent(SpinComponent)
  .registerComponent(BumpComponent)
  .registerSystem(RoomSystem)
  .registerSystem(AnimationSystem);

setupRenderer(world);

/**
 * @todo add a silly button, maybe a "cheers" or "say hi" button
 */

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

  onLoadCompleted();
  world
    .createEntity("localPlayer")
    .addComponent(RenderReactComponent, { value: WelcomeScreenReact })
    .addComponent(LocalPlayerTag);
}
