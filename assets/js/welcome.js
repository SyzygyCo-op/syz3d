import * as React from "react";
import * as DRMT from "dreamt";
import { UILabelComponent, PlayerFormReact } from "./player";
import { TextureComponent } from "./texture";
import { RenderReactComponent } from "./renderer";
import { OverlayControlsReact } from "./OverlayControls";

/**
 * @type React.ComponentType<{  "entity": DRMT.Entity,
 *                              entityComponentMap: Map<string,
 *                              Set<DRMT.Entity>>
 *                              }>
 * @example
 *
 */
export const WelcomeScreenReact = ({ entity, entityComponentMap }) => {
  const [playerName, setPlayerName] = React.useState("");
  const [numberOfRemotePlayers, setNumberOfRemotePlayers] = React.useState(0);

  const playerIsDefined = entity.hasComponent(UILabelComponent);

  // TODO(fix) MobX doesn't have a way of knowing about changes inside this
  // map because it's a plain vanilla map?
  React.useEffect(()=> {
    setNumberOfRemotePlayers(entityComponentMap.get("PlayerTag")?.size || 0);
  });

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
    </div>
  );

  /**
   * @param {{ player_id: string; texture: string }} data
   */
  function handleSubmit({ player_id, texture }) {
    DRMT.updateComponent(entity, UILabelComponent, { value: player_id });
    DRMT.updateComponent(entity, TextureComponent, { url: texture });

    setPlayerName(player_id);
  }

  function handleClose() {
    DRMT.updateComponent(entity, RenderReactComponent, {
      value: OverlayControlsReact,
    });
  }
};

