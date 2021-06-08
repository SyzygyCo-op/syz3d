import * as React from "react";
import { zIndexes } from "../../../state/UILayering";
import { SideBar } from "./SideBar";
import { JoyStick, JoyStickMoveEvent } from "./JoyStick";
import { localPlayer } from "../../../localPlayer";
import { addStrafeVelocity, TurnCommand } from "../../../commands";
import { PlayerInternalsComponent } from "../../../components";
import { jumpStateMachine } from "../../../state";

export const VirtualGamePad = () => {
  return (
    <>
      <SideBar zIndex={zIndexes.virtualGamePad} side="left">
        <JoyStick onMove={handleLook} label="look/jump"
          onTouchEnd={handleJumpTouchEnd}
          onTouchStart={handleJumpTouchStart}
        />
      </SideBar>
      <SideBar zIndex={zIndexes.virtualGamePad} side="right">
        <JoyStick
          label="move"
          onMove={handleMove}
        />
      </SideBar>
    </>
  );

  /** @param {JoyStickMoveEvent} evt */
  function handleLook(evt) {
    TurnCommand.executePure(
      localPlayer,
      evt.yDistance * 0.8,
      -evt.xDistance * 0.8
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

  function handleJumpTouchEnd() {
    // TODO maybe physics system should tell the state machine when player is able to jump?
    if (
      localPlayer.getComponent(PlayerInternalsComponent).isTouchingStableSurface
    ) {
      jumpStateMachine.sendTouchEnd();
    }
  }
  function handleJumpTouchStart() {
    if (
      localPlayer.getComponent(PlayerInternalsComponent).isTouchingStableSurface
    ) {
      jumpStateMachine.sendTouchStart();
    }
  }
};
