import * as DRMT from "dreamt";
import * as MOBX from "mobx";
import * as config from "../config";
import { debounceBoundFn } from "../utils";

export class PlayerState {
  render_to_canvas = true;
  player_name = "";
  /**
   * @type string?
   */
  avatar_asset_url = null;
  position = [0, 0, 0];
  rotation = [0, 0, 0];
  spin = [0, 0, 0];
}

export class GameAsset {
  previewImageUrl = "/images/missing_asset_preview.png";
  /**
   * @type string?
   */
  assetUrl = null;

  /**
   * @param {string} previewImageUrl
   * @param {string} assetUrl
   */
  constructor(previewImageUrl, assetUrl) {
    this.previewImageUrl = previewImageUrl;
    this.assetUrl = assetUrl;
  }
}

export const avatars = [
  new GameAsset("/3d/GrimReaper/preview.png", "/3d/GrimReaper/model.glb"),
  new GameAsset(
    "/3d/PokemonHaunter/preview.png",
    "/3d/PokemonHaunter/model.glb"
  ),
  new GameAsset("/3d/ShenLong/preview.png", "/3d/ShenLong/model.glb"),
];

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
  localPlayerOut = new PlayerState();
  localPlayerIn = new PlayerState();
  localPlayerInDirty = false;

  /**
   * @param {DRMT.Entity[]} entities
   */
  setEntitiesToRender(entities) {
    replaceSetContents(this.entitiesToRender, entities);
  }

  inputLocalPlayerDebounced = debounceBoundFn(
    this.inputLocalPlayerSync,
    this,
    config.DEBOUNCE_MS_ON_CHANGE_INPUT
  );

  /**
   * @param {PlayerState} data
   */
  inputLocalPlayerSync(data) {
    this.localPlayerIn = data;
    this.localPlayerInDirty = true;
  }

  /**
   * @param {Partial<PlayerState>} data
   */
  inputPartialLocalPlayer(data) {
    const completeData = Object.assign({}, this.localPlayerIn, data);
    this.inputLocalPlayerSync(
      /**
       * @type any
       */ (completeData)
    );
  }

  /**
   * @param {PlayerState} data
   */
  outputLocalPlayer(data) {
    this.localPlayerOut = data;
  }

  resetLocalPlayer() {
    this.localPlayerIn = this.localPlayerOut;
    this.localPlayerInDirty = false;
  }

  reconcileLocalPlayer() {
    Object.keys(this.localPlayerOut).forEach((key) => {
      if (!this.localPlayerIn[key]) {
        this.localPlayerIn[key] = this.localPlayerOut[key];
      }
    });
  }

  resetLocalPlayerDebounced = debounceBoundFn(
    this.resetLocalPlayer,
    this,
    config.DEBOUNCE_MS_ON_SAVE_INPUT
  );

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

/**
 * @param {Set}   set
 * @param {any[]} source
 */
function replaceSetContents(set, source) {
  set.clear();
  source.forEach((entity) => {
    set.add(entity);
  });
}
