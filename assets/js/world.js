import * as DRMT from "dreamt";
import {
  StateSystem,
  ClientSystem,
  MovementSystem,
  TweenSystem,
  LoaderSystem,
  InputSystem,
  RoundingSystem,
  CameraSystem,
  FrictionSystem,
} from "./systems";
import * as components from "./components";
import { getPlayerName } from "./utils";
import { GAME_LOOP_DURATION, USE_TWEENING } from "./config";
// The order of registration determines order of execution
const systems = [
  LoaderSystem,
  InputSystem,
  MovementSystem,
  FrictionSystem,
  ...(USE_TWEENING ? [TweenSystem] : []),
  CameraSystem,
  RoundingSystem,
  StateSystem,
  ClientSystem,
];


/** @type DRMT.World */
export let world;

/** @type DRMT.GameLoop */
export let gameLoop;

if (module.hot) {
  if (
    module.hot.data &&
    module.hot.data.components &&
    module.hot.data.components !== components
  ) {
    console.log("not able to hot swap entity components contructors");

    // Type library is a bit out of date...
    /** @type any */ (module.hot).invalidate();
  } else {
    module.hot.accept();
  }

  module.hot.dispose(function (data) {
    console.log("pausing game loop");
    gameLoop.pause();
    unregisterSystems();

    data.world = world;
    data.gameLoop = gameLoop;
    data.components = components;
  });

  module.hot.status() === "apply" ? reload() : initialize();
}

if (process.env.NODE_ENV !== "development") {
  initialize();
}

function initialize() {
  world = new DRMT.World();
  Object.values(components).forEach((Component) =>
    world.registerComponent(Component)
  );
  registerSystems();

  gameLoop = new DRMT.GameLoop(
    world.execute.bind(world),
    GAME_LOOP_DURATION
    // { pauseOnWindowBlur: true }
  );
}

function reload() {
  world = module.hot.data.world;
  registerSystems();
  console.log(/** @type any */ (world).stats());

  gameLoop = module.hot.data.gameLoop;
  gameLoop.start();
}

function registerSystems() {
  systems.forEach((System) => {
    world.registerSystem(System);
    const sys = world.getSystem(System);
    // TODO remove if
    sys.reinit();
  });
}
function unregisterSystems() {
  systems.forEach((System) => {
    const sys = world.getSystem(System);
    // TODO remove if
    sys.dispose();
    world.unregisterSystem(System);
  });
}

export function createLocalPlayer() {
  console.log("creating local player");
  world.getSystem(StateSystem).createLocalPlayer({
    label: getPlayerName(),
    glft_url: "/3d/PokemonHaunter/model.glb",
  });
}
