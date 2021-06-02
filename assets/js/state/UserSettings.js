import * as MOBX from "mobx";

export class UserSettings {
  shouldShowNameTags = false;
  cameraSetback = 2;
  shouldShowVirtualGamePad = window.innerWidth < 1200;
  shouldUse3rdPersonCamera = window.innerWidth > 1200;

  constructor() {
    MOBX.makeAutoObservable(this);
  }

  toggleNameTags() {
    this.shouldShowNameTags = !this.shouldShowNameTags;
  }

  update(values) {
    this.shouldShowNameTags = values.shouldShowNameTags;
    this.shouldShowVirtualGamePad = values.shouldShowVirtualGamePad;
    this.shouldUse3rdPersonCamera = values.shouldUse3rdPersonCamera;
  }
}
