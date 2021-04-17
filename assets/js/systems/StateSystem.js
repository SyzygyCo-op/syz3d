import * as DRMT from "dreamt";
import { Euler, Vector3 } from "three";
import {
  PlayerTag,
  LocalPlayerTag,
  UILabelComponent,
  RenderToCanvasTag,
  PositionComponent,
  GltfUrlComponent,
  BumpComponent,
  RotationComponent,
  VelocityComponent,
  AngularVelocityComponent,
  ScaleComponent,
  OwnershipComponent,
} from "../components";
import { entityStore, ObservableState, PlayerState } from "../state";
import { getPlayerEntityId, getPlayerId } from "../utils";
import { correspondentCache } from "../state";

export class StateSystem extends DRMT.System {
  static queries = {
    toRender: {
      components: [RenderToCanvasTag],
      listen: {
        removed: true,
      },
    },
    localPlayer: {
      components: [LocalPlayerTag],
    },
  };

  observable = new ObservableState();
  worldDirty = false;
  diffForClient = DRMT.Correspondent.createEmptyDiff();

  /**
   * @type HTMLCanvasElement
   */
  canvasElement = null;

  init() {
    this.correspondent = new DRMT.Correspondent(this.world, {
      entityStore: entityStore,
      isMine: (entity) =>
        entity.hasComponent(OwnershipComponent) &&
        entity.getComponent(OwnershipComponent).value === getPlayerId(),
    })
      .registerComponent("render_to_canvas", RenderToCanvasTag, {
        read: () => {},
        write: (compo) => !!compo,
      })
      .registerComponent("is_player", PlayerTag, {
        read: () => {},
        write: (compo) => !!compo,
      })
      .registerComponent("label", UILabelComponent)
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
      .registerComponent("owner", OwnershipComponent, {
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
         * @param {DRMT.Component<any> & { value: Vector3 }} component
         */ (component, data) => {
          if (component) {
            component.value = component.value || new Vector3();
            component.value.set.apply(component.value, data);
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
         * @param {DRMT.Component<any> & { value: Euler }} component
         */ (component, data) => {
          if (component) {
            component.value = component.value || new Euler();
            component.value.set.apply(component.value, data);
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
      .registerComponent("scale", ScaleComponent, {
        read: /**
         * @param {DRMT.Component<any> & { value: Vector3 }} component
         */ (component, data) => {
          if (component) {
            component.value = component.value || new Vector3();
            component.value.set.apply(component.value, data);
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
      .registerComponent("bump", BumpComponent);
    this.worldCache = correspondentCache;
    this.worldDiffTimestamp = 0;
  }

  execute(delta, time) {
    const entitiesToRender = this.queries.toRender.results;
    if (this.queries.toRender.removed.length > 0) {
      this.observable.resetEntitiesToRender(entitiesToRender);
    } else if (
      this.queries.toRender.results.length >
      this.observable.entitiesToRender.length
    ) {
      this.observable.setEntitiesToRender(entitiesToRender);
    }

    this.worldDirty = false;
    if (time - this.worldDiffTimestamp >= 100) {
      const diff = this.correspondent.produceDiff(this.worldCache);
      if (!DRMT.Correspondent.isEmptyDiff(diff)) {
        this.worldDirty = true;
        Object.assign(this.diffForClient, diff);
        this.correspondent.updateCache(this.worldCache, diff);
        this.worldDiffTimestamp = time;

        // TODO add target parameter
        const worldState = this.correspondent.produceDiff({});
        // TODO add methods for analyzing diffs
        // use getUpsert
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
        // use setUpsert and createEmptyDiff
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
      .addComponent(VelocityComponent)
      .addComponent(AngularVelocityComponent);
    this.observable.createLocalPlayer(partialPlayerData);
  }

  /**
   * @param {DRMT.IEntityComponentDiff} diff
   */
  updateWorld(diff) {
    // TODO change this vvv if the server ever becomes authoritative
    delete diff.upsert[getPlayerEntityId()];
    // TODO need a method for knowing if the diff actually would make a difference
    // useful for when the systems are hot reloaded
    this.correspondent.consumeDiff(diff).updateCache(this.worldCache, diff);
  }

  reinit() {
    this.correspondent.registerEntity(
      getPlayerEntityId(),
      this.queries.localPlayer.results[0]
    );
  }
}
