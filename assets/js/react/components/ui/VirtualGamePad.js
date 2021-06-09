import * as React from "react";
import { zIndexes } from "../../../state/UILayering";
import { SideBar } from "./SideBar";
import { JoyStick, JoyStickMoveEvent } from "./JoyStick";
import { localPlayer } from "../../../localPlayer";
import { addStrafeVelocity, TurnCommand } from "../../../commands";
import { PlayerInternalsComponent } from "../../../components";
import { jumpStateMachine } from "../../../state";
import { gameLoop } from "../../../world";
import { UpOutlined, DownOutlined } from "@ant-design/icons";

export const VirtualGamePad = () => {
  const [moveFactor, setMoveFactor] = React.useState(0);

  gameLoop.useTick(() => {
    moveFactor && addStrafeVelocity(localPlayer, 0, moveFactor);
  });
  return (
    <>
      <SideBar zIndex={zIndexes.virtualGamePad} side="left">
        <JoyStick
          onMove={handleLook}
          label="turn/jump"
          onTouchEnd={handleJumpTouchEnd}
          onTouchStart={handleJumpTouchStart}
        />
      </SideBar>
      <SideBar zIndex={zIndexes.virtualGamePad} side="right">
        <button
          style={{
            height: "10vw",
            backgroundColor: "rgba(255, 255, 255, 0.2)",
            textShadow: "1px 1px 1px rgba(0, 0, 0, 0.5)",
            textTransform: "uppercase",
          }}
          onTouchStart={handleStartMoveForward}
          onTouchEnd={handleEndMoveForward}
        >
          <UpOutlined/>
        </button>
        <button
          style={{
            height: "10vw",
            backgroundColor: "rgba(255, 255, 255, 0.2)",
            textShadow: "1px 1px 1px rgba(0, 0, 0, 0.5)",
            textTransform: "uppercase",
          }}
          onTouchStart={handleStartMoveBackward}
          onTouchEnd={handleEndMoveBackward}
        >
          <DownOutlined/>
        </button>
      </SideBar>
    </>
  );

  function handleStartMoveForward() {
    setMoveFactor(1);
  }
  function handleEndMoveForward() {
    setMoveFactor(0);
  }
  function handleStartMoveBackward() {
    setMoveFactor(-1);
  }
  function handleEndMoveBackward() {
    setMoveFactor(0);
  }

  /** @param {JoyStickMoveEvent} evt */
  function handleLook(evt) {
    TurnCommand.executePure(
      localPlayer,
      evt.yDistance * 0.8,
      -evt.xDistance * 0.8
    );
  }

  function handleJumpTouchEnd() {
    // TODO maybe physics system should tell the state machine when player is able to jump?
    // TODO also maybe isTouchingStableSurface should be part of the top-level state?
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
