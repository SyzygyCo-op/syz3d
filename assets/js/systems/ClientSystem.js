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
  RotationComponent,
} from "../components";
import { Entity } from "../react/components";
import { StateSystem } from "./StateSystem";
import { getPlayerEntityId, getRoomToken } from "../utils";

export class ClientSystem extends DRMT.System {
  _getState() {
    return this.world.getSystem(StateSystem);
  }

  /**
   * @param {import("dreamt/dist/Correspondent").IEntityComponentDiff} diff
   */
  _updateWorld(diff) {
    this._getState().updateWorld(diff)
  }

  _worldIsDirty() {
    return this._getState().worldDirty;
  }

  _getWorldDiff() {
    return this._getState().worldDiff;
  }

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

    this.channel.on("init", (response) => {
      this._updateWorld(response.body.world_diff);
    });
    this.channel.on("force_reload", () => {
      location.reload();
    });

    this.channel.on("world_diff", (response) => {
      this._updateWorld(response.body);
    });

    this.channel.join().receive("ok", () => {
      // TODO the backend should create the player entity and send it in a diff like any other
      // entity
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
    if (this._worldIsDirty()) {
      this.channel.push("world_diff", { body: this._getWorldDiff() });
    }
  }
}
