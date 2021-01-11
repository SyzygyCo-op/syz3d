import * as React from "react";
import * as ECSY from "ecsy";
import { PlayerComponent, PlayerFormReact } from "./player";
import { RoomComponent } from "./room";
import { TextureComponent } from "./texture";

/**
 * @type React.ComponentType<{entity: ECSY.Entity, world: ECSY.World}>
 */
export const WelcomeScreenReact = ({ entity }) => {
  const [playerName, setPlayerName] = React.useState("");
  const cRoom = entity.getComponent(RoomComponent);
  return !playerName ? (
    <>
      <h1>Welcome to Syz!</h1>
      <PlayerFormReact onSubmit={handleSubmit} />
    </>
  ) : cRoom.value.playerEntityMap.size === 0 ? (
    <>
      <h1>Welcome {playerName}!</h1>
      <p>
        Looks like you are the only one here right now, but that's sure to
        change soon.
      </p>
    </>
  ) : null;

  /** @param {{player_id: string, texture: string}} data
   */
  function handleSubmit({ player_id, texture }) {
    entity.addComponent(PlayerComponent, { player_id });
    if (texture) {
      entity.addComponent(TextureComponent, { url: texture });
    }
    setPlayerName(player_id);
  }
};
