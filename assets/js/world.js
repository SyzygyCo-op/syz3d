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
  Object3DComponent,
  BoundingBoxComponent,
  GltfUrlComponent,
} from "./components";
import { getPlayerName } from "./utils";
import { GAME_LOOP_MIN_FREQUENCY_HZ } from "./config";

export const world = new DRMT.World()
  .registerComponent(PositionComponent)
  .registerComponent(GltfUrlComponent)
  .registerComponent(Object3DComponent)
  .registerComponent(BoundingBoxComponent)
  .registerComponent(UILabelComponent)
  .registerComponent(PlayerTag)
  .registerComponent(LocalPlayerTag)
  .registerComponent(SpinComponent)
  .registerComponent(RotationComponent)
  .registerComponent(BumpComponent)
  .registerComponent(RenderToCanvasTag)
  .registerSystem(ClientSystem)
  .registerSystem(LoaderSystem)
  .registerSystem(AnimationSystem)
  .registerSystem(StateSystem);

export const gameLoop = new DRMT.GameLoop(
  world.execute.bind(world),
  GAME_LOOP_MIN_FREQUENCY_HZ,
  { pauseOnWindowBlur: true }
);

export function createLocalPlayer() {
  world.getSystem(StateSystem).createLocalPlayer({
    player_name: getPlayerName(),
    spin: [0, 0.0001, 0],
    avatar_asset_url: "/3d/PokemonHaunter/model.glb",
  });
}
