import * as MOBX from "mobx";

export class UserSettings {
  shouldShowNameTags = false;
  shouldUse3rdPersonCamera = true;

  constructor() {
    MOBX.makeAutoObservable(this);
  }

  toggleNameTags() {
    this.shouldShowNameTags = !this.shouldShowNameTags;
  }

  update(values) {
    this.shouldShowNameTags = values.shouldShowNameTags;
  }

}
