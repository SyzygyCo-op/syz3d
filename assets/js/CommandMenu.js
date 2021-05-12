import { JumpCommand, MoveForwardCommand, TurnCommand } from "./commands";
import {
  PLAYER_RUN_ACCEL,
  PLAYER_TURN_ACCEL,
  PLAYER_WALK_ACCEL,
} from "./config";
import { uniq } from "lodash-es";

export class CommandMenu {
  static runForward = new MoveForwardCommand(PLAYER_RUN_ACCEL);
  static runBackward = new MoveForwardCommand(-PLAYER_RUN_ACCEL);
  static walkForward = new MoveForwardCommand(PLAYER_WALK_ACCEL);
  static walkBackward = new MoveForwardCommand(-PLAYER_WALK_ACCEL);
  static jump = new JumpCommand();
  static turnLeft = new TurnCommand(0, PLAYER_TURN_ACCEL);
  static turnRight = new TurnCommand(0, -PLAYER_TURN_ACCEL);

  static getRequiredComponents() {
    return uniq([
      ...MoveForwardCommand.getRequiredComponents(),
      ...JumpCommand.getRequiredComponents(),
      ...TurnCommand.getRequiredComponents(),
    ]);
  }
}
