import * as DRMT from "dreamt";
import * as MOBX from "mobx";
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
import { ObservableState } from "../state";
import { getPlayerEntityId } from "../utils";
import { Entity } from "../react/components";

export class StateSystem extends DRMT.System {
  static queries = {
    toRender: {
      components: [R3FComponent],
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
    * @type {import("dreamt/dist/Correspondent").IEntityComponentDiff?}
    */
  worldDiff = null;

  init() {
    this.correspondent = new DRMT.Correspondent(this.world)
      .registerComponent("is_player", PlayerTag, {
        read: () => {},
        write: (compo) => !!compo,
      })
      .registerComponent("player_name", UILabelComponent)
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
    this.worldDiffTimestamp = 0;
  }

  execute(delta, time) {
    const localPlayer = this.queries.localPlayer.results[0];

    if (queryHasChanges(this.queries.toRender)) {
      // TODO(refactor): action method
      MOBX.runInAction(() => {
        resetSet(
          this.observable.entitiesToRender,
          this.queries.toRender.results
        );
      });
    }

    if (localPlayer) {
      this.correspondent.registerEntity(getPlayerEntityId(), localPlayer);
    }

    if (time - this.worldDiffTimestamp >= 200) {
      const diff = this.correspondent.produceDiff(this.worldCache);
      if (!DRMT.Correspondent.isEmptyDiff(diff)) {
        this.worldDirty = true;
        this.worldDiff = diff;
        this.correspondent.updateCache(this.worldCache, diff);
        this.worldDiffTimestamp = time;
      } else {
        this.worldDirty = false;
      }
    }

    if (queryHasChanges(this.queries.localPlayer)) {
      this.observable.outputLocalPlayer(
        /**
         * @type any
         */ (this.correspondent.produceDiff({}))
      );
    }

    if (this.observable.localPlayerDirty) {
      this.correspondent.consumeDiff({
        upsert: {
          [getPlayerEntityId()]: this.observable.localPlayerIn,
        },
        remove: {},
      });

      // Make sure the spinner is shown for >=1 sec so user knows it's doing something
      this.observable.resetLocalPlayerDebounced();
    }
  }

  /**
   * @param {import("dreamt/dist/Correspondent").IEntityComponentDiff} diff
   * TODO make this interface easier to import
   */
  updateWorld(diff) {
    this.correspondent.consumeDiff(diff).updateCache(this.worldCache, diff);
  }
}

/**
 * @param {Set}   set
 * @param {any[]} source
 */
function resetSet(set, source) {
  set.clear();
  source.forEach((entity) => {
    set.add(entity);
  });
}
/**
 * @param {DRMT.System['queries'][""]} query
 */
function queryHasChanges(query) {
  return (
    (query.added && query.added.length > 0) ||
    (query.removed && query.removed.length > 0) ||
    (query.changed && query.changed.length > 0)
  );
}
