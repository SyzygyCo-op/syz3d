import * as ECSY from "ecsy";
import { UILabelComponent, LocalPlayerTag, PlayerTag } from "./player";
import { RoomSystem } from "./room";
import { PositionComponent } from "./position";
import { TextureComponent } from "./texture";
import {
  SpinComponent,
  RotationComponent,
  AnimationSystem,
  BumpComponent,
} from "./animation";
import { setupRenderer } from "./renderer";

const world = new ECSY.World()
  .registerComponent(PositionComponent)
  .registerComponent(TextureComponent)
  .registerComponent(UILabelComponent)
  .registerComponent(PlayerTag)
  .registerComponent(LocalPlayerTag)
  .registerComponent(SpinComponent)
  .registerComponent(RotationComponent)
  .registerComponent(BumpComponent)
  .registerSystem(AnimationSystem);

setupRenderer(world);

world.registerSystem(RoomSystem);

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
}
