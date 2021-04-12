import * as DRMT from "dreamt";
import { Euler, Vector3 } from "three";
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
  VelocityComponent,
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
  };

  observable = new ObservableState();
  worldDirty = false;
  diffForClient = DRMT.Correspondent.createEmptyDiff();

  /** @type HTMLCanvasElement */
  canvasElement = null;

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
      .registerComponent("player_name", UILabelComponent)
      .registerComponent("glft_url", GltfUrlComponent, {
        read: (compo, data) => {
          if (compo) {
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
      .registerComponent("position", PositionComponent, {
        read: /**
         * @param {DRMT.Component<any> & { value: Vector3 }} compo
         */ (compo, data) => {
          if (compo && compo.value) {
            const localPosition = compo.value;
            localPosition.set.apply(localPosition, data);
          }
        },
        write: /**
         * @param {DRMT.Component<any> & { value: Vector3 }} compo
         */ (compo) => {
          return compo && compo.value && compo.value.toArray();
        },
        writeCache: (data) => {
          return JSON.stringify(data);
        },
      })
      .registerComponent("rotation", RotationComponent, {
        read: /**
         * @param {DRMT.Component<any> & { value: Euler }} compo
         */ (compo, data) => {
          if (compo && compo.value) {
            const localRotation = compo.value;
            localRotation.set.apply(localRotation, data);
          }
        },
        write: /**
         * @param {DRMT.Component<any> & { value: Euler }} compo
         */ (compo) => {
          return compo && compo.value && compo.value.toArray();
        },
        writeCache: (data) => {
          return JSON.stringify(data);
        },
      })
      .registerComponent("bump", BumpComponent)
      .registerComponent("spin", SpinComponent, {
        writeCache: (arr) => arr && arr.join(","),
      });
    this.worldCache = {};
    this.worldDiffTimestamp = 0;
  }

  execute(delta, time) {
    const entitiesToRender = this.queries.toRender.results;
    if (this.queries.toRender.removed.length > 0) {
      this.observable.resetEntitiesToRender(entitiesToRender);
    } else {
      this.observable.setEntitiesToRender(entitiesToRender);
    }

    this.worldDirty = false;
    if (time - this.worldDiffTimestamp >= 200) {
      const diff = this.correspondent.produceDiff(this.worldCache);
      if (!DRMT.Correspondent.isEmptyDiff(diff)) {
        this.worldDirty = true;
        Object.assign(this.diffForClient, diff);
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
      }
    }

    if (this.observable.localPlayer.isDirty) {
      this.correspondent.consumeDiff({
        // TODO make methods for sythesizing diffs
        upsert: {
          [getPlayerEntityId()]: this.observable.localPlayer.request,
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
      .createEntity(getPlayerEntityId())
      .addComponent(LocalPlayerTag)
      .addComponent(VelocityComponent);
    this.observable.createLocalPlayer(partialPlayerData);
  }

  /**
   * @param {DRMT.IEntityComponentDiff} diff
   */
  updateWorld(diff) {
    // TODO change this vvv if the server ever becomes authoritative
    delete diff.upsert[getPlayerEntityId()];
    this.correspondent.consumeDiff(diff).updateCache(this.worldCache, diff);
  }
}
