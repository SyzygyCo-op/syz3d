import * as DRMT from "dreamt";
import { Socket } from "phoenix";
import { StateSystem } from "./StateSystem";
import { getRoomToken } from "../utils";

export class ClientSystem extends DRMT.System {
  _getState() {
    return this.world.getSystem(StateSystem);
  }

  /**
   * @param {DRMT.IEntityComponentDiff} diff
   */
  _updateWorld(diff) {
    this._getState().updateWorld(diff);
  }

  _worldIsDirty() {
    return this._getState().worldDirty;
  }

  _getWorldDiff() {
    return this._getState().diffForClient;
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
      // TODO display a modal before actually reloading?
      location.reload();
    });

    this.channel.on("world_diff", (response) => {
      this._updateWorld(response.body);
    });

    this.channel
      .join()
      .receive("ok", () => console.log("connected!"))
      .receive("error", (response) =>
        console.warn("connection error", response)
      );
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
