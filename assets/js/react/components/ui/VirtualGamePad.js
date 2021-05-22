import * as React from "react";
import { zIndexes } from "../../../state/UILayering";
import { SideBar } from "./SideBar";
import { JoyStick, JoyStickMoveEvent } from "./JoyStick";
import { localPlayer } from "../../../localPlayer";
import {
  addStrafeVelocity,
  TurnCommand,
} from "../../../commands";
import { PlayerInternalsComponent } from "../../../components";
import { jumpPowerUpMachine } from "../../../state";
import { BIT_VIRTUAL_GAMEPAD } from "../../../state/PowerUpMachine";

export const VirtualGamePad = () => {
  return (
    <>
      <SideBar zIndex={zIndexes.virtualGamePad} side="left">
        <button
          style={{
            height: "10vw",
            backgroundColor: "rgba(255, 255, 255, 0.2)",
            textShadow: "1px 1px 1px rgba(0, 0, 0, 0.5)",
            textTransform: "uppercase",
          }}
          onTouchStart={handleStartJump}
          onTouchEnd={handleEndJump}
        >
          Jump
        </button>
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
      evt.yDistance * 0.2,
      -evt.xDistance * 0.2
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

  function handleStartJump() {
    if (
      localPlayer.getComponent(PlayerInternalsComponent)
        .isTouchingStableSurface &&
      !jumpPowerUpMachine.started
    ) {
      jumpPowerUpMachine.sendStart(BIT_VIRTUAL_GAMEPAD);
    }
  }

  function handleEndJump() {
    jumpPowerUpMachine.sendFinish(BIT_VIRTUAL_GAMEPAD);
  }
};
