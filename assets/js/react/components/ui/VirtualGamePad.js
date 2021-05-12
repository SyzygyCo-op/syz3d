import * as React from "react";
import { zIndexes } from "../../../state/UILayering";
import { SideBar } from "./SideBar";
import { JoyStick, JoyStickMoveEvent } from "./JoyStick";
import {localPlayer} from "../../../localPlayer";
import {TurnCommand} from "../../../commands";

export const VirtualGamePad = () => {
  return (
    <>
      <SideBar zIndex={zIndexes.virtualGamePad} side="left">
        <JoyStick onMove={handleLook} />
      </SideBar>
    </>
  );

  /** @param {JoyStickMoveEvent} evt */
  function handleLook(evt) {
    // TODO this API should be more intuitive
    TurnCommand.executePure(localPlayer, evt.yDistance * 0.5, -evt.xDistance * 1.5)
  }
};
