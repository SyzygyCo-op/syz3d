import * as DRMT from "dreamt";
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
import {RenderR3FComponent} from "./renderer";
import {StateSystem} from "./observableState"

export const world = new DRMT.World()
  .registerComponent(PositionComponent)
  .registerComponent(TextureComponent)
  .registerComponent(UILabelComponent)
  .registerComponent(PlayerTag)
  .registerComponent(LocalPlayerTag)
  .registerComponent(SpinComponent)
  .registerComponent(RotationComponent)
  .registerComponent(BumpComponent)
  .registerComponent(RenderR3FComponent)
  .registerSystem(AnimationSystem)
  .registerSystem(StateSystem)
  .registerSystem(RoomSystem);

export function startWorldLoop() {
  // Don't need RAF because react-three-fiber has its own render loop that
  // ensures flicker-free animation.
  let time = 0;
  let delta = 1000 / 60;
  setInterval(() => {
    world.execute(delta, time);
    time += delta;
  }, delta);
}
