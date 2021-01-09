import { Socket, Presence } from "phoenix";
import RoomModel from "./RoomModel";

/**
 * @param {Set<any>} target
 * @param {Set<any> | Array<any>} source
 */
function copySet(target, source) {
  source.forEach((value) => {
    target.add(value);
  });
}

/**
 * @param {Set<any>} target
 * @param {Set<any> | Array<any>} setA
 * @param {Set<any> | Array<any>} setB
 */
function copyDiff(target, setA, setB) {
  copySet(target, setA);

  setB.forEach((value) => {
    target.delete(value);
  });
}

/**
 */
// function getPresenceSet(presense) {
//   return new Set(presense.list().map((player) => player.metas[0].player_id));
// }

/**
 * @typedef {{player_id: string}} Player
 * @typedef {{player_id?: string, onSync?: (plist: Player[]) => void, onLeave?: (idlist: string[]) => void}} Options
 * @param {RoomModel} room
 * @param {string} player_id
 */
export function joinRoomChannel(room, player_id) {
  const socket = new Socket("/socket", {
    params: {
      player_id,
    },
  });
  socket.connect();

  const topic = `room:${room.id}`;
  const channel = socket.channel(topic);
  channel.join();

  const presense = new Presence(channel);

  presense.onSync(() => {
    const playerList = presense.list();
    playerList.forEach((player) => {
      const meta = player.metas[0];

      room.playersJoining.add(meta.player_id);
      room.playersPresent.add(meta.player_id);
      room.playersLeaving.delete(meta.player_id);
    });
  });

  presense.onLeave(() => {
    const playersPresentFresh = presense
      .list()
      .map((player) => player.metas[0].player_id);

    copyDiff(room.playersLeaving, room.playersPresent, playersPresentFresh);

    room.playersLeaving.forEach((player_id) => {
      room.playersPresent.delete(player_id);
      room.playersJoining.delete(player_id);
    });
  });
}
