import * as React from "react";
import * as ECSY from "ecsy";
import { PlayerComponent, PlayerFormReact, PlayerR3F } from "./player";
import { RoomComponent } from "./room";
import { TextureComponent } from "./texture";
import { RenderR3FComponent, RenderReactComponent } from "./renderer";
import { PositionComponent } from "./position";
import { SpinComponent } from "./animation";
import { replaceComponent } from "./utils";
import { OverlayControlsReact } from "./OverlayControls";

/**
 * @type React.ComponentType<{entity: ECSY.Entity}>
 */
export const WelcomeScreenReact = ({ entity }) => {
  const [playerName, setPlayerName] = React.useState("");
  const cRoom = entity.getComponent(RoomComponent);

  /** @todo make method/function for this */
  const numberOfRemotePlayers = cRoom.value.playerEntityMap.size;
  const playerIsDefined = entity.hasComponent(PlayerComponent);

  React.useEffect(() => {
    if (numberOfRemotePlayers === 0 && playerIsDefined) {
      replaceComponent(entity, RenderR3FComponent, { value: PlayerR3F });
      replaceComponent(entity, PositionComponent, { value: [0, 0, 0] });
      replaceComponent(entity, SpinComponent, { value: [0, 0, 0] });
    } else {
      entity.removeComponent(RenderR3FComponent);
    }
  }, [entity, numberOfRemotePlayers, playerIsDefined]);

  return (
    <div>
      <h1>{!playerIsDefined ? "Welcome to Syz!" : `Welcome ${playerName}!`}</h1>
      <PlayerFormReact
        onSubmit={handleSubmit}
        onClose={playerIsDefined && handleClose}
      />
      {playerIsDefined && numberOfRemotePlayers === 0 && (
        <p>
          Looks like you are the only one here right now, but that's sure to
          change soon. Feel free to keep customizing your avatar in the
          meantime.
        </p>
      )}
      {playerIsDefined && numberOfRemotePlayers > 0 && (
        <p>Hey look, it's {cRoom.value.playerIdList.join(" and ")}!</p>
      )}
    </div>
  );

  /** @param {{player_id: string, texture: string}} data
   */
  function handleSubmit({ player_id, texture }) {
    replaceComponent(entity, PlayerComponent, { player_id });
    replaceComponent(entity, TextureComponent, { url: texture });
    replaceComponent(entity, RenderR3FComponent, { value: PlayerR3F });

    setPlayerName(player_id);
  }

  function handleClose() {
    replaceComponent(entity, RenderReactComponent, {
      value: OverlayControlsReact,
    });
  }
};
