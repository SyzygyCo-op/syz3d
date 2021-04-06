import * as DRMT from "dreamt";
import {
  PlayerTag,
  LocalPlayerTag,
  UILabelComponent,
  RenderToCanvasTag,
  PositionComponent,
  GltfUrlComponent,
  SpinComponent,
  BumpComponent,
  RotationComponent,
} from "../components";
import { ObservableState, PlayerState } from "../state";
import { getPlayerEntityId } from "../utils";

export class StateSystem extends DRMT.System {
  static queries = {
    toRender: {
      components: [RenderToCanvasTag],
      listen: {
        added: true,
        removed: true,
        changed: true, // Detect that any of the components on the query has changed
      },
    },
    localPlayer: {
      components: [LocalPlayerTag],
      listen: {
        added: true,
        removed: true,
        changed: true,
      },
    },
  };

  observable = new ObservableState();
  worldDirty = false;
  /**
   * @type {?DRMT.IEntityComponentDiff}
   */
  worldDiffFromLastFrame = null;

  init() {
    this.correspondent = new DRMT.Correspondent(this.world)
      .registerComponent("render_to_canvas", RenderToCanvasTag, {
        read: () => {},
        write: (compo) => !!compo,
      })
      .registerComponent("is_player", PlayerTag, {
        read: () => {},
        write: (compo) => !!compo,
      })
      .registerComponent("is_local", LocalPlayerTag, {
        read: () => {},
        write: (compo) => !!compo,
      })
      .registerComponent("player_name", UILabelComponent)
      .registerComponent("avatar_asset_url", GltfUrlComponent, {
        read: (compo, data) => {
          if (
            compo &&
            /**
             * @type any
             */ (compo).value !== data
          ) {
            /**
             * @type any
             */ (compo).value = data;
          }
        },
        write: (compo) =>
          compo &&
          /**
           * @type any
           */ (compo).value,
      })
      .registerComponent("bump", BumpComponent)
      .registerComponent("rotation", RotationComponent, {
        writeCache: (arr) => arr && arr.join(","),
      })
      .registerComponent("spin", SpinComponent, {
        writeCache: (arr) => arr && arr.join(","),
      })
      .registerComponent("position", PositionComponent, {
        writeCache: (arr) => arr && arr.join(","),
      });
    this.worldCache = {};
    this.worldDiffTimestamp = 0;
  }

  execute(delta, time) {
    if (this.queries.toRender.results.length > 0) {
      this.observable.setEntitiesToRender(this.queries.toRender.results);
    }

    if (time - this.worldDiffTimestamp >= 200) {
      const diff = this.correspondent.produceDiff(this.worldCache);
      if (!DRMT.Correspondent.isEmptyDiff(diff)) {
        this.worldDirty = true;
        this.worldDiffFromLastFrame = diff;
        this.correspondent.updateCache(this.worldCache, diff);
        this.worldDiffTimestamp = time;

        // TODO add target parameter
        const worldState = this.correspondent.produceDiff({});
        // TODO make methods for analyzing diffs
        const localPlayerData = worldState.upsert[getPlayerEntityId()];
        if (localPlayerData) {
          this.observable.localPlayer.setActual(
            /**
             * @type any
             */ (localPlayerData)
          );
        }
      } else {
        this.worldDirty = false;
      }
    }

    if (this.observable.localPlayer.isDirty) {
      this.correspondent.consumeDiff({
        // TODO make methods for sythesizing diffs
        upsert: {
          [getPlayerEntityId()]: this.observable.localPlayer.request
        },
        remove: {},
      });

      // Make sure the spinner is shown for >=1 sec so user knows it's doing something
      this.observable.localPlayer.clean();
    }
  }

  /**
   * @param {Partial<PlayerState>} partialPlayerData
   */
  createLocalPlayer(partialPlayerData) {
    this.correspondent
      .createEntity(getPlayerEntityId());
    this.observable.localPlayer.setRequestPart(partialPlayerData);
  }

  /**
   * @param {DRMT.IEntityComponentDiff} diff
   * TODO make this interface easier to import? or put StateSystem in library?
   */
  updateWorld(diff) {
    delete diff.upsert[getPlayerEntityId()];
    this.correspondent.consumeDiff(diff).updateCache(this.worldCache, diff);
  }
}

