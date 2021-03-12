import * as DRMT from "dreamt";
import * as MOBX from "mobx";
import { RenderR3FComponent } from '../renderer/index';

class ObservableState {
  renderR3FEntities = new Set()

  constructor() {
    MOBX.makeAutoObservable(this);
  }
}

export class StateSystem extends DRMT.System {
  static queries = {
    renderR3F: {
      components: [ RenderR3FComponent ]
    },
  }

  observable = new ObservableState();

  execute(delta, time) {
    MOBX.runInAction(() => {
      this.queries.renderR3F.results.forEach((entity) => {
        this.observable.renderR3FEntities.add(entity);
      })
    })
  }
}
