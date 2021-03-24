import * as DRMT from "dreamt";
import { StateSystem, ClientSystem, AnimationSystem } from "./systems";
import {
  UILabelComponent,
  LocalPlayerTag,
  PlayerTag,
  SpinComponent,
  RotationComponent,
  PositionComponent,
  TextureComponent,
  BumpComponent,
  R3FComponent,
} from "./components";
import { Entity } from "./react/components";
import { getPlayerEntityId, getPlayerName } from "./utils";

export const world = new DRMT.World()
  .registerComponent(PositionComponent)
  .registerComponent(TextureComponent)
  .registerComponent(UILabelComponent)
  .registerComponent(PlayerTag)
  .registerComponent(LocalPlayerTag)
  .registerComponent(SpinComponent)
  .registerComponent(RotationComponent)
  .registerComponent(BumpComponent)
  .registerComponent(R3FComponent)
  .registerSystem(AnimationSystem)
  .registerSystem(StateSystem)
  .registerSystem(ClientSystem);

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

export function createLocalPlayer() {
  world
    .createEntity(`${getPlayerEntityId()} (local)`)
    .addComponent(PlayerTag)
    .addComponent(LocalPlayerTag)
    .addComponent(UILabelComponent, { value: getPlayerName()})
    .addComponent(PositionComponent, {
      value: PositionComponent.randomValue(),
    })
    .addComponent(SpinComponent, { value: [0, 0.0007, 0.001] })
    .addComponent(RotationComponent, { value: [0, 0, 0] })
    .addComponent(R3FComponent, { value: Entity })
    .addComponent(TextureComponent, { url: "/images/water_texture.jpg" });
}
