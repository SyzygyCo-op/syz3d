import * as ECSY from "ecsy";
import { Socket } from "phoenix";
import { LocalPlayerTag, PlayerComponent, PlayerR3F } from "./player";
import { RenderR3FComponent } from "./renderer";
import { PositionComponent, getRandomPosition } from "./position";
import { TextureComponent } from "./texture";
import { SpinComponent } from "./animation";

/**
 * @todo move to utilities file
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
  /** @type string[] */
  playerIdList = [];

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
    src.playerIdList.forEach((value, index) => {
      this.playerIdList[index] = value;
    });
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

    if (!eLocalPlayer) return;

    const cPlayer = eLocalPlayer.getComponent(PlayerComponent);
    if (!cPlayer) return;
    const localPlayerId = cPlayer.player_id;

    const cRoom = eLocalPlayer.getMutableComponent(RoomComponent);
    /** @type Room */
    const room = cRoom.value;

    const cTexture = eLocalPlayer.getComponent(TextureComponent);

    if (!this.channel) {
      const socket = new Socket("/socket", {
        params: {
          player_id: localPlayerId,
          texture: cTexture ? cTexture.url : "",
        },
      });
      socket.connect();

      const topic = `room:${room.id}`;
      this.channel = socket.channel(topic);
      this.channel.join();
    }

    this.channel.on("presence_state", (response) => {
      RoomSystem.handleJoins(response, room, this.world, localPlayerId);
    });

    this.channel.on("presence_diff", (response) => {
      RoomSystem.handleJoins(response.joins, room, this.world, localPlayerId);

      Object.keys(response.leaves).forEach((player_id) => {
        const entity = room.playerEntityMap.get(player_id);
        if (entity) {
          entity.remove();
        }
        /** @todo playerIdList needs to be updated, too. */
        room.playerEntityMap.delete(player_id);
      });
    });
  }

  /**
   * @param {object} joins info of players who just joined
   * @param {Room} room room they're joining
   * @param {ECSY.World} world
   * @param {string} localPlayerId
   */
  static handleJoins(joins, room, world, localPlayerId) {
    Object.keys(joins).forEach((player_id) => {
      if (player_id === localPlayerId || room.playerEntityMap.has(player_id)) {
        return;
      }

      const entity = world
        .createEntity(`player:${player_id}`)
        .addComponent(PlayerComponent, { player_id })
        .addComponent(PositionComponent, { value: getRandomPosition() })
        .addComponent(RenderR3FComponent, { value: PlayerR3F })
        .addComponent(SpinComponent, { value: [0, 0, 0] })
        .addComponent(TextureComponent, {
          url: joins[player_id].metas[0].texture,
        });

      room.playerEntityMap.set(player_id, entity);
      room.playerIdList.push(player_id);
    });
  }
}
