import * as React from "react";
import { zIndexes } from "../../../state/UILayering";
import { SideBar } from "./SideBar";
import { JoyStick, JoyStickMoveEvent } from "./JoyStick";
import { localPlayer } from "../../../localPlayer";
import { addStrafeVelocity, TurnCommand } from "../../../commands";
import { CommandMenu } from "../../../CommandMenu";
import { ForceButton, ForceButtonPressEvent } from "./ForceButton";
import { PLAYER_MAX_JUMP_ACCEL } from "../../../config";
import { PlayerInternalsComponent } from "../../../components";

export const VirtualGamePad = () => {
  return (
    <>
      <SideBar zIndex={zIndexes.virtualGamePad} side="left">
        <ForceButton onPress={handleJump}>Jump</ForceButton>
        <JoyStick onMove={handleLook} label="look" />
      </SideBar>
      <SideBar zIndex={zIndexes.virtualGamePad} side="right">
        <JoyStick onMove={handleMove} label="move" />
      </SideBar>
    </>
  );

  /** @param {JoyStickMoveEvent} evt */
  function handleLook(evt) {
    TurnCommand.executePure(
      localPlayer,
      evt.yDistance * 0.1,
      -evt.xDistance * 0.5
    );
  }

  /** @param {JoyStickMoveEvent} evt */
  function handleMove(evt) {
    addStrafeVelocity(
      localPlayer,
      Math.PI / 2 - evt.angle,
      -Math.hypot(evt.xDistance, evt.yDistance)
    );
  }

  /** @param {ForceButtonPressEvent} evt */
  function handleJump(evt) {
    if (
      localPlayer.getComponent(PlayerInternalsComponent).isTouchingStableSurface
    ) {
      CommandMenu.jump.execute(
        localPlayer,
        evt.intensity * PLAYER_MAX_JUMP_ACCEL
      );
    }
  }
};
