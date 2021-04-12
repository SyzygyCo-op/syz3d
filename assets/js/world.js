import * as DRMT from "dreamt";
import {
  StateSystem,
  ClientSystem,
  AnimationSystem,
  LoaderSystem,
  InputSystem,
  RoundingSystem,
  CameraSystem
} from "./systems";
import {
  UILabelComponent,
  LocalPlayerTag,
  PlayerTag,
  SpinComponent,
  RotationComponent,
  PositionComponent,
  VelocityComponent,
  BumpComponent,
  RenderToCanvasTag,
  Object3DComponent,
  BoundingBoxComponent,
  GltfUrlComponent,
} from "./components";
import { getPlayerName } from "./utils";
import { GAME_LOOP_FREQUENCY_HZ } from "./config";
import {Vector3} from "three";

export const world = new DRMT.World()
  .registerComponent(PositionComponent)
  .registerComponent(VelocityComponent)
  .registerComponent(RotationComponent)
  .registerComponent(GltfUrlComponent)
  .registerComponent(Object3DComponent)
  .registerComponent(BoundingBoxComponent)
  .registerComponent(UILabelComponent)
  .registerComponent(PlayerTag)
  .registerComponent(LocalPlayerTag)
  .registerComponent(SpinComponent)
  .registerComponent(BumpComponent)
  .registerComponent(RenderToCanvasTag)
  .registerSystem(LoaderSystem)
  .registerSystem(InputSystem)
  .registerSystem(RoundingSystem)
  .registerSystem(AnimationSystem)
  .registerSystem(CameraSystem)
  .registerSystem(StateSystem)
  .registerSystem(ClientSystem)

export const gameLoop = new DRMT.GameLoop(
  world.execute.bind(world),
  GAME_LOOP_FREQUENCY_HZ,
  // { pauseOnWindowBlur: true }
);

export function createLocalPlayer() {
  world.getSystem(StateSystem).createLocalPlayer({
    player_name: getPlayerName(),
    position: new Vector3(0, 5, 0),
    glft_url: "/3d/PokemonHaunter/model.glb",
  });
}
