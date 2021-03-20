import * as DRMT from "dreamt";
import { Socket } from "phoenix";
import {
  PlayerTag,
  LocalPlayerTag,
  UILabelComponent,
  R3FComponent,
  PositionComponent,
  TextureComponent,
  SpinComponent,
  BumpComponent,
  RotationComponent,
} from "../components";
import { Entity } from "../react/components";

function getPlayerId() {
  // @ts-ignore
  return window.PLAYER_ID;
}

function getPlayerEntityId() {
  return `player:${getPlayerId()}`;
}

function getRoomToken() {
  // @ts-ignore
  return window.ROOM_TOKEN;
}

export class ClientSystem extends DRMT.System {
  init() {
    const socket = new Socket("/socket", {
      params: { room_token: getRoomToken() },
    });
    socket.connect();

    const roomSlug = /**
     * @type {any} window
     */ (window).ROOM_SLUG;
    const topic = `room:${roomSlug}`;
    this.channel = socket.channel(topic);

    this.correspondent = new DRMT.Correspondent(this.world)
      .registerComponent("is_player", PlayerTag, {
        read: () => {},
        write: (compo) => !!compo,
      })
      .registerComponent("label", UILabelComponent)
      .registerComponent("texture", TextureComponent, {
        read: (compo, data) => {
          console.log("reading texture", compo, data);
          if (compo) {
            /**
             * @type any
             */ (compo).url = data;
          }
        },
        write: (compo) =>
          compo &&
          /**
           * @type any
           */ (compo).url,
      })
      .registerComponent("bump", BumpComponent)
      .registerComponent("rotation", RotationComponent, {
        // Only send initial value
        writeCache: (arr) => !!arr,
      })
      .registerComponent("spin", SpinComponent, {
        writeCache: (arr) => arr && arr.join(","),
      })
      .registerComponent("position", PositionComponent, {
        writeCache: (arr) => arr && arr.join(","),
      })
      .registerComponent("avatar", R3FComponent, {
        write: (compo) => !!compo,
        read: (compo) => {
          if (compo) {
            /**
             * @type any
             */ (compo).value = Entity;
          }
        },
      });
    this.worldCache = {};
    this.timeOfLastPush = 0;

    this.channel.on("init", (response) => {
      console.log("on init", response.body);
      this.correspondent
        .consumeDiff(response.body.world_diff)
        .updateCache(this.worldCache, response.body.world_diff);
    });
    this.channel.on("force_reload", () => {
      location.reload();
    });

    this.channel.on("world_diff", (response) => {
      this.correspondent
        .consumeDiff(response.body)
        .updateCache(this.worldCache, response.body);
    });

    this.channel.join().receive("ok", () => {
      console.log("connected!");
      if (this.localPlayerEntity) return; // TODO why?
      this.localPlayerEntity = this.world
        .createEntity(`${getPlayerEntityId()} (local)`)
        .addComponent(PlayerTag)
        .addComponent(LocalPlayerTag)
        .addComponent(PositionComponent, {
          value: PositionComponent.randomValue(),
        })
        .addComponent(SpinComponent, { value: [0, 0.0007, 0.001] })
        .addComponent(RotationComponent, { value: [0, 0, 0] })
        .addComponent(R3FComponent, { value: Entity })
        .addComponent(UILabelComponent, { value: "" })
        .addComponent(TextureComponent, { url: "/images/water_texture.jpg" });
    });
  }

  /**
   * @param {number} time
   */
  execute(_delta, time) {
    if (this.localPlayerEntity) {
      this.correspondent.registerEntity(
        getPlayerEntityId(),
        this.localPlayerEntity
      );

      if (time - this.timeOfLastPush >= 200) {
        const diff = this.correspondent.produceDiff(this.worldCache);
        if (!DRMT.Correspondent.isEmptyDiff(diff)) {
          this.channel.push("world_diff", { body: diff });
          this.correspondent.updateCache(this.worldCache, diff);
          this.timeOfLastPush = time;
        }
      }
    }
  }
}
