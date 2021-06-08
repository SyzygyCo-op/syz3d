
// TODO replace TURN_* with STRAFE_*
// TODO use this as source of truth in InputSystem
// TODO add settings (*) and help (?) key maps
const mapping = {
  "MOVE_FORWARD": ["W", "↑"],
  "TURN_LEFT": ["A", "←"],
  "MOVE_BACKWARD": ["S", "↓"],
  "TURN_RIGHT": ["D", "→"],
  "JUMP": ["SPACEBAR"],
  "SLOW_DOWN": ["SHIFT"],
  "TOGGLE_NAMETAGS": ["N"],
};

export function getActions() {
  return Object.keys(mapping);
}

/** @param {string} actionName */
export function getHumanReadableName(actionName) {
  return actionName.replace("_", " ").toLowerCase();
}

/** @param {string} actionName */
export function getKeyNames(actionName) {
  return mapping[actionName];
}
