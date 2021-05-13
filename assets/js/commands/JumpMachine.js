import { GAME_LOOP_DURATION, PLAYER_MAX_JUMP_ACCEL } from "../config";

// TODO use components to store this state
let prepTimer = 0;
let restTimer = 0;
const maxPrep = 4;
const sqrtMaxPrep = 2;

/** @param {boolean} keyIsDown TODO test jumping logic, refactor to FSM */
export function getJumpIntensity(keyIsDown) {
  let retval = 0;

  const isRested = restTimer > 0;

  const isMaxedOut = prepTimer == maxPrep;
  const isPrepped = isMaxedOut || (prepTimer > 0 && !keyIsDown);
  const isNonZero = isRested && isPrepped;

  if (isNonZero) {
    retval = (Math.sqrt(prepTimer) * PLAYER_MAX_JUMP_ACCEL) / sqrtMaxPrep;
    prepTimer = 0;
    restTimer = 0;
  }

  if (keyIsDown && !isNonZero) {
    prepTimer = Math.min(maxPrep, prepTimer + 1);
  }

  if (!keyIsDown) {
    prepTimer = 0;
  }

  if (!keyIsDown && !isNonZero) {
    restTimer += 1;
  }

  return retval;
}
