import * as React from "react";
import * as ECSY from "ecsy";
import { PlayerComponent, PlayerFormReact } from "./player";
import { RoomComponent } from "./room";

/**
 * @type React.ComponentType<{entity: ECSY.Entity, world: ECSY.World}>
 */
export const WelcomeScreenReact = ({ entity, world }) => {
  const [playerName, setPlayerName] = React.useState("");
  const cRoom = entity.getComponent(RoomComponent);
  return !playerName ? (
    <>
      <h1>Welcome to Syz!</h1>
      <p>What should your name tag say?</p>
      <PlayerFormReact onSubmit={handleSubmit} />
    </>
  ) : cRoom.value.playerEntityMap.size === 0 ? (
    <>
      <h1>Welcome {playerName}!</h1>
      <p>Looks like you are the only one here right now.</p>
    </>
  ) : null;

  /** @param {{player_id: string}} data
   */
  function handleSubmit({ player_id }) {
    entity.addComponent(PlayerComponent, { player_id });
    setPlayerName(player_id);
  }
};
