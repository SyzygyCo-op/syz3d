import { Socket, Presence } from "phoenix";

/**
 * @typedef {{player_id: string}} Player
 * @typedef {{player_id?: string, onJoin?: (plist: Player[]) => void, onLeave?: (idlist: string[]) => void}} Options
 * @param {string} roomId
 * @param {Options} options
 */
export function joinRoom(roomId, options = {}) {
  const socket = new Socket("/socket", {
    params: {
      player_id: options.player_id || "Anonymous",
    },
  });
  socket.connect();

  const topic = `room:${roomId}`;
  const channel = socket.channel(topic);
  channel.join();

  const presense = new Presence(channel);
  const playerIdSet = new Set();

  presense.onJoin(() => {
    const playerList = presense.list();
    const dedupedList = [];

    playerList.forEach((player) => {
      const meta = player.metas[0];

      if (!playerIdSet.has(meta.player_id)) {
        dedupedList.push(meta);
        playerIdSet.add(meta.player_id);
      }
    });

    options.onJoin && options.onJoin(dedupedList);
  });

  presense.onLeave(() => {
    const newSet = new Set();
    const dedupedList = [];

    presense.list().forEach((player) => {
      const meta = player.metas[0];
      newSet.add(meta.player_id);
    });

    // calculate difference
    playerIdSet.forEach((id) => {
      if (!newSet.has(id)) {
        dedupedList.push(id);
      }
    });

    dedupedList.forEach((id) => playerIdSet.delete(id));
    options.onLeave && options.onLeave(dedupedList);
  });
}
