import * as MOBX from "mobx";
import * as ECSY from "ecsy";

export class RenderState {
  /** @type {MOBX.ObservableSet<ECSY.Entity>} */
  entities = MOBX.observable.set();

  update = MOBX.action(
    /**
     * @param {ECSY.Entity[]} reactEntities
     * @param {ECSY.Entity[]} r3fEntities
     */
    (reactEntities, r3fEntities) => {
      this.entities.clear();
      reactEntities.forEach((e) => this.entities.add(e));
      r3fEntities.forEach((e) => this.entities.add(e));
    }
  );
}
