import { StateSystem } from "./systems";
import { getPlayerName } from "./utils";
import { world } from "./world";

// TODO put in services directory and use Service Locator pattern
console.log("creating local player");
export const localPlayer = world.getSystem(StateSystem).createLocalPlayer({
  label: getPlayerName(),
  visible_gltf_url: "/3d/squirrel-1.glb",
  position: [0, 3, 0],
  scale: [0.4, 0.4, 0.4]
});
