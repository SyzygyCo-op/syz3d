import * as DRMT from "dreamt";
import {
  StateSystem,
  ClientSystem,
  AnimationSystem,
  LoaderSystem,
  InputSystem,
  RoundingSystem,
  CameraSystem,
} from "./systems";
import * as components from "./components";
import { getPlayerName } from "./utils";
import { GAME_LOOP_FREQUENCY_HZ } from "./config";

// The order of registration determines order of execution
const systems = [
  LoaderSystem,
  InputSystem,
  AnimationSystem,
  CameraSystem,
  RoundingSystem,
  StateSystem,
  ClientSystem,
];

// TODO enable hot-reloading for systems etc
/**
 * @type DRMT.World
 */
export let world;

/**
 * @type DRMT.GameLoop
 */
export let gameLoop;

if (module.hot) {
  if (
    module.hot.data &&
    module.hot.data.components &&
    module.hot.data.components !== components
  ) {
    console.log("not able to hot swap entity components contructors");

    // Type library is a bit out of date...
    /**
     * @type any
     */ (module.hot).invalidate();
  } else {
    module.hot.accept();
  }

  module.hot.dispose(function (data) {
    console.log("pausing game loop");
    gameLoop.pause();
    data.entityMap = world.getSystem(StateSystem).correspondent._knownEntityMap;
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
    GAME_LOOP_FREQUENCY_HZ
    // { pauseOnWindowBlur: true }
  );
}

function reload() {
  world = module.hot.data.world;
  registerSystems();
  world.getSystem(StateSystem).correspondent._knownEntityMap =
    module.hot.data.entityMap;
  console.log(
    /**
     * @type any
     */ (world).stats()
  );

  gameLoop = module.hot.data.gameLoop;
  gameLoop.start();
}

function registerSystems() {
  systems.forEach((System) => {
    world.registerSystem(System);
    const sys = world.getSystem(System);
    // TODO remove if
    if (sys.restart) {
      sys.restart();
    }
  });
}
function unregisterSystems() {
  systems.forEach((System) => {
    const sys = world.getSystem(System);
    // TODO remove if
    if (sys.dispose) {
      sys.dispose();
    }
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
