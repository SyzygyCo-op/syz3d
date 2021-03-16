import * as DRMT from "dreamt";
import * as MOBX from "mobx";
import { RenderR3FComponent } from "../renderer/index";

export class ObservableState {
  /**
   * @type Set<DRMT.Entity>
   */
  entities = new Set();
  constructor() {
    MOBX.makeAutoObservable(this);
  }
}

export class StateSystem extends DRMT.System {
  static queries = {
    entities: {
      components: [RenderR3FComponent],
      listen: {
        added: true,
        removed: true,
        changed: true, // Detect that any of the components on the query (Box, Transform) has changed
      },
    },
  };

  observable = new ObservableState();

  execute(delta, time) {
    if (queryHasChanges(this.queries.entities)) {
      MOBX.runInAction(() => {
        resetSet(this.observable.entities, this.queries.entities.results);
      });
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