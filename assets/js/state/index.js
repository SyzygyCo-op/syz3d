import * as DRMT from "dreamt";
import * as MOBX from "mobx";

class PlayerState {
  player_name = "";
  texture = "";
}

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
    Object.assign(this.localPlayerIn, data);
    this.localPlayerDirty = true;
    clearTimeout(this._resetDebounce);
    this._resetDebounce = null;
  }

  /**
   * @param {PlayerState} data
   */
  outputLocalPlayer(data) {
    Object.assign(this.localPlayerOut, data)
    this.localPlayerDirty = false;
  }

  resetLocalPlayer() {
    Object.assign(this.localPlayerIn, this.localPlayerOut)
    this.localPlayerDirty = false;
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
