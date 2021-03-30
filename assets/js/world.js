import * as DRMT from "dreamt";
import {
  StateSystem,
  ClientSystem,
  AnimationSystem,
  LoaderSystem,
} from "./systems";
import {
  UILabelComponent,
  LocalPlayerTag,
  PlayerTag,
  SpinComponent,
  RotationComponent,
  PositionComponent,
  BumpComponent,
  RenderToCanvasTag,
  GltfComponent,
  GltfUrlComponent,
} from "./components";
import { getPlayerName } from "./utils";

export const world = new DRMT.World()
  .registerComponent(PositionComponent)
  .registerComponent(GltfUrlComponent)
  .registerComponent(GltfComponent)
  .registerComponent(UILabelComponent)
  .registerComponent(PlayerTag)
  .registerComponent(LocalPlayerTag)
  .registerComponent(SpinComponent)
  .registerComponent(RotationComponent)
  .registerComponent(BumpComponent)
  .registerComponent(RenderToCanvasTag)
  .registerSystem(LoaderSystem)
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
  world.getSystem(StateSystem).createLocalPlayer({
    player_name: getPlayerName(),
    spin: [0, 0.001, 0],
    avatar_asset_url: "/3d/PokemonHaunter/model.glb",
  })
}
