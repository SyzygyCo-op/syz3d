import * as MOBX from "mobx";
import * as _ from "lodash-es";

/**
 * @namespace UserSettings
 * @typedef {{
 *   cameraSetback: number;
 *   shouldShowNameTags: boolean;
 *   shouldShowVirtualGamePad: boolean;
 *   shouldUse3rdPersonCamera: boolean;
 * }} UserSettings.IData
 *
 * @typedef {{ windowInnerWidth: number }} UserSettings.IEnv
 */

/** @extends UserSettings.IData */
export class UserSettings {
  static writableProperties = [
    "cameraSetback",
    "shouldShowNameTags",
    "shouldShowVirtualGamePad",
    "shouldUse3rdPersonCamera",
  ];

  shouldShowNameTags = true;
  cameraSetback = 2;

  /** @param {UserSettings.IEnv} env */
  constructor(env) {
    this.shouldShowVirtualGamePad = env.windowInnerWidth < 1200;
    this.shouldUse3rdPersonCamera = env.windowInnerWidth > 1200;
    MOBX.makeAutoObservable(this);
  }

  toggleNameTags() {
    this.shouldShowNameTags = !this.shouldShowNameTags;
  }

  /** @param {Partial<UserSettings.IData>} source */
  update(source) {
    Object.assign(
      this,
      _.defaults(_.pick(source, UserSettings.writableProperties), this)
    );
  }
}
