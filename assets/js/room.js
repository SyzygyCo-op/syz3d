import * as ECSY from "ecsy";
import { Socket } from "phoenix";
import { LocalPlayerTag, PlayerComponent, PlayerR3F } from "./player";
import { RenderR3FComponent } from "./renderer";
import { PositionComponent, getRandomPosition } from "./position";
import { TextureComponent } from "./texture";
import { SpinComponent, BumpComponent } from "./animation";
import { copyMap, replaceComponent } from "./utils";

/** @param {any} cBump */
function hasBump(cBump) {
  return !!cBump && cBump.value < 1;
}

export class Room {
  /**
   * @param {string} id
   */
  constructor(id) {
    this.id = id;
  }

  playerEntityMap = new Map();
  networkedComponents = new Map();
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
    copyMap(this.networkedComponents, src.networkedComponents);
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

    const cBump = eLocalPlayer.getComponent(BumpComponent);

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

    const previousTextureUrl = room.networkedComponents.get("TextureComponent");

    const previousHasBump = room.networkedComponents.get("BumpComponent");

    // Sync networked components
    if (
      previousTextureUrl &&
      (cTexture.url !== previousTextureUrl ||
        hasBump(cBump) !== previousHasBump)
    ) {
      this.channel.push("change_avatar", {
        body: {
          texture_url: cTexture.url,
          has_bump: hasBump(cBump),
          player_id: localPlayerId,
        },
      });
    }

    this.channel.on("change_avatar", (response) => {
      if (response.body.player_id === localPlayerId) return;

      const entity = room.playerEntityMap.get(response.body.player_id);

      if (
        entity &&
        entity.getComponent(TextureComponent).url !== response.body.texture_url
      ) {
        replaceComponent(entity, TextureComponent, {
          url: response.body.texture_url,
        });
      }
      if (
        entity &&
        hasBump(entity.getComponent(BumpComponent)) !== response.body.has_bump
      ) {
        replaceComponent(entity, BumpComponent, { value: 0 });
      }
    });

    room.networkedComponents.set("TextureComponent", cTexture.url);
    room.networkedComponents.set("BumpComponent", hasBump(cBump));
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
