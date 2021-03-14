import * as DRMT from "dreamt";
import { Socket } from "phoenix";
import {
  PlayerTag,
  LocalPlayerTag,
  UILabelComponent,
  PlayerR3F,
} from "../player";
import { RenderReactComponent, RenderR3FComponent } from "../renderer";
import { WelcomeScreenReact } from "../welcome";
import { PositionComponent, getRandomPosition } from "../position";
import { TextureComponent } from "../texture";
import { SpinComponent, BumpComponent, RotationComponent } from "../animation";

function getPlayerId() {
  return (/** @type any */(window).PLAYER_ID);
}

function getPlayerEntityId() {
  return `player:${getPlayerId()}`;
}

function getRoomToken() {
  return (/** @type any */(window).ROOM_TOKEN);
}

export class RoomSystem extends DRMT.System {
  init() {
    const socket = new Socket("/socket");
    socket.connect({room_token: getRoomToken()});

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
      .registerComponent("avatar", RenderR3FComponent, {
        write: (compo) => !!compo,
        read: (compo) => {
          if (compo) {
            /**
             * @type any
             */ (compo).value = PlayerR3F;
          }
        },
      });
    this.worldCache = {};
    this.timeOfLastPush = 0;

    this.channel.on("init", (response) => {
      console.log("on init", response.body);
      this.correspondent.consumeDiff(response.body.world_diff)
        .updateCache(this.worldCache, response.body.world_diff);
    });
    this.channel.on("force_reload", () => {
      location.reload()
    });

    this.channel.on("world_diff", (response) => {
      this.correspondent
        .consumeDiff(response.body)
        .updateCache(this.worldCache, response.body);
    });

    this.channel.join().receive("ok", () => {
      console.log("connected!");
      if(this.localPlayerEntity) return; // TODO why?
      this.localPlayerEntity = this.world
        .createEntity(`${getPlayerEntityId()} (local)`)
        .addComponent(PlayerTag)
        .addComponent(LocalPlayerTag)
        .addComponent(PositionComponent, { value: getRandomPosition() })
        .addComponent(SpinComponent, { value: [0, 0.0007, 0.001] })
        .addComponent(RotationComponent, { value: [0, 0, 0] })
        .addComponent(RenderReactComponent, { value: WelcomeScreenReact })
        .addComponent(RenderR3FComponent, { value: PlayerR3F })
        .addComponent(UILabelComponent, { value: ""})
        .addComponent(TextureComponent, { url: '/images/water_texture.jpg'})
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

      const diff = this.correspondent.produceDiff(this.worldCache);

      if (
        time - this.timeOfLastPush >= 200 &&
        !DRMT.Correspondent.isEmptyDiff(diff)
      ) {
        this.channel.push("world_diff", { body: diff });
        this.correspondent.updateCache(this.worldCache, diff);
        this.timeOfLastPush = time;

      }
    }
  }
}
