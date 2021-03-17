import * as DRMT from "dreamt";
import * as MOBX from "mobx";
import { R3FComponent } from "../components"

export class ObservableState {
  /**
   * @type Set<DRMT.Entity>
   */
  entities = new Set();
  constructor() {
    MOBX.makeAutoObservable(this);
  }
}

