import * as DRMT from "dreamt";
import * as MOBX from "mobx";
import { R3FComponent, UILabelComponent, LocalPlayerTag } from "../components";
import { ObservableState } from "../state";

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

  init() {
    this.correspondent = new DRMT.Correspondent(this.world).registerComponent(
      "player_name",
      UILabelComponent
    );
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
      this.correspondent.registerEntity("local_player", localPlayer);
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
          local_player: this.observable.localPlayerIn,
        },
        remove: {},
      });

      // Make sure the spinner is shown for >=1 sec so user knows it's doing something
      this.observable.resetLocalPlayerDebounced();
    }
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
