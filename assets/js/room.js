import * as ECSY from "ecsy";
import { Socket } from "phoenix";
import { LocalPlayerTag, PlayerComponent } from "./player";
import RenderTagComponent from "./RenderTagComponent";
import { PositionComponent, getRandomPosition } from "./position";

/**
 * @param {Map<any, any>} target
 * @param {Map<any, any>} source
 */
function copyMap(target, source) {
  source.forEach((value, key) => {
    target.set(key, value);
  });
}

export class Room {
  /**
   * @param {string} id
   */
  constructor(id) {
    this.id = id;
  }

  playerEntityMap = new Map();

  clone() {
    const theClone = new Room(this.id);
    theClone.copy(this);
    return theClone;
  }

  /**
   * @param {Room} src
   */
  copy(src) {
    this.id = src.id;
    copyMap(this.playerEntityMap, src.playerEntityMap);
    return this;
  }
}

const RoomType = ECSY.createType({
  name: "Room",
  default: new Room("unnamed room"),
  copy: ECSY.copyCopyable,
  clone: ECSY.cloneClonable,
});

export class RoomComponent extends ECSY.Component {
  static schema = {
    value: {
      type: RoomType,
    },
  };
}

export class RoomSystem extends ECSY.System {
  static queries = {
    localPlayer: {
      components: [LocalPlayerTag],
    },
  };

  execute() {
    const eLocalPlayer = this.queries.localPlayer.results[0];

    if (eLocalPlayer) {
      const cPlayer = eLocalPlayer.getComponent(PlayerComponent);
      const cRoom = eLocalPlayer.getMutableComponent(RoomComponent);
      /** @type Room */
      const room = cRoom.value;
      const localPlayerId = cPlayer.player_id;

      if (!this.channel) {
        const socket = new Socket("/socket", {
          params: {
            player_id: localPlayerId,
          },
        });
        socket.connect();

        const topic = `room:${room.id}`;
        this.channel = socket.channel(topic);
        this.channel.join();
      }

      this.channel.on("presence_state", (response) => {
        RoomSystem.handleJoins(
          Object.keys(response),
          room,
          this.world,
          localPlayerId
        );
      });

      this.channel.on("presence_diff", (response) => {
        RoomSystem.handleJoins(
          Object.keys(response.joins),
          room,
          this.world,
          localPlayerId
        );

        Object.keys(response.leaves).forEach((player_id) => {
          const entity = room.playerEntityMap.get(player_id);
          if (entity) {
            entity.remove();
          }
          room.playerEntityMap.delete(player_id);
        });
      });
    }
  }

  /**
   * @param {string[]} joins ids of players who just joined
   * @param {Room} room room they're joining
   * @param {ECSY.World} world
   * @param {string} localPlayerId
   */
  static handleJoins(joins, room, world, localPlayerId) {
    joins.forEach((player_id) => {
      if (player_id === localPlayerId || room.playerEntityMap.has(player_id)) {
        return;
      }

      const entity = world
        .createEntity(`player:${player_id}`)
        .addComponent(PlayerComponent, { player_id })
        .addComponent(PositionComponent, { value: getRandomPosition() })
        .addComponent(RenderTagComponent);

      room.playerEntityMap.set(player_id, entity);
    });
  }
}
