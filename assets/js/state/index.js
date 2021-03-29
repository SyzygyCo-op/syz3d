import * as DRMT from "dreamt";
import * as MOBX from "mobx";

class PlayerState {
  player_name = "";
  avatar_asset_url = null;
}

export class GameAsset {
  previewImageUrl = "/images/missing_asset_preview.png";
  assetUrl = null;

  /** @param {string} previewImageUrl
    * @param {string} assetUrl
    */
  constructor(previewImageUrl, assetUrl) {
    this.previewImageUrl = previewImageUrl;
    this.assetUrl = assetUrl;
  }
}

export const avatars = [
  new GameAsset(
    "/3d/GrimReaper/preview.png",
    "/3d/GrimReaper/model-fixed.glb"
  ),
  new GameAsset(
    "/3d/PokemonHaunter/preview.png",
    "/3d/PokemonHaunter/model-fixed.glb"
  ),
]



/**
 * @typedef {'EDIT_MY_AVATAR' | 'SETTINGS'} ModalID
 */

export class ObservableState {
  /**
   * @type Set<DRMT.Entity>
   */
  entitiesToRender = new Set();

  /**
   * @type {null | ModalID}
   */
  openModalId = null;

  // TODO tests, also find the right abstraction to reduce LoC
  localPlayerOut = MOBX.makeAutoObservable(new PlayerState());
  localPlayerIn = MOBX.makeAutoObservable(new PlayerState());
  localPlayerDirty = false;
  /**
   * @type any?
   */
  _localPlayerInDebounce = null;
  /**
   * @type any?
   */
  _resetDebounce = null;

  /**
   * @param {PlayerState} data
   */
  inputLocalPlayer(data) {
    clearTimeout(this._localPlayerInDebounce);
    this._localPlayerInDebounce = setTimeout(() => {
      this.inputLocalPlayerSync(data);
    }, 800);
  }

  /**
   * @param {PlayerState} data
   */
  inputLocalPlayerSync(data) {
    this.localPlayerIn = data;
    this.localPlayerDirty = true;
    clearTimeout(this._resetDebounce);
    this._resetDebounce = null;
  }

  /**
   * @param {PlayerState} data
   */
  outputLocalPlayer(data) {
    this.localPlayerOut = data;
  }

  resetLocalPlayer() {
    this.localPlayerIn = this.localPlayerOut;
    this.localPlayerDirty = false;
  }

  reconcileLocalPlayer() {
    Object.keys(this.localPlayerOut).forEach((key)=>{
      if(!this.localPlayerIn[key]) {
        this.localPlayerIn[key] = this.localPlayerOut[key];
      }
    })
  }

  resetLocalPlayerDebounced() {
    if (!this._resetDebounce) {
      this._resetDebounce = setTimeout(() => {
        this.resetLocalPlayer();
      }, 1000);
    }
  }

  constructor() {
    MOBX.makeAutoObservable(this);
  }

  /**
   * @param {ModalID} modalId
   */
  setOpenModal(modalId) {
    this.openModalId = modalId;
  }
}
