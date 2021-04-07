import * as DRMT from "dreamt";
import * as MOBX from "mobx";
import * as config from "../config";
import { preloadGltf } from "../systems/LoaderSystem";

export class PlayerState {
  is_player = true;
  render_to_canvas = true;
  player_name = "";
  /**
   * @type string?
   */
  glft_url = null;
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

  preload() {
    return preloadGltf(this.assetUrl);
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

export async function preloadAvatars() {
  await Promise.all(avatars.map((a) => a.preload()));
}

/**
 * @typedef {'EDIT_MY_AVATAR' | 'SETTINGS'} ModalID
 */

export class ObservableState {
  /**
   * @type DRMT.Entity[]
   */
  entitiesToRender = [];

  /**
   * @type {null | ModalID}
   */
  openModalId = null;

  localPlayer = new DRMT.DualModel(() => new PlayerState(), {
    debounceRequestMs: config.DEBOUNCE_MS_ON_CHANGE_INPUT,
  });

  constructor() {
    MOBX.makeAutoObservable(this);
  }

  /**
   * @param {Partial<PlayerState>} partialPlayerData
   */
  createLocalPlayer(partialPlayerData) {
    this.localPlayer.setRequestPart(partialPlayerData);
  }

  /**
   * @param {DRMT.Entity[]} entities
   */
  setEntitiesToRender(entities) {
    entities.forEach((entity, index) => {
      this.entitiesToRender[index] = entity;
    })
  }

  /**
   * @param {DRMT.Entity[]} entities
   */
  resetEntitiesToRender(entities) {
    this.entitiesToRender.length = 0;
    this.setEntitiesToRender(entities);
  }

  /**
   * @param {ModalID} modalId
   */
  setOpenModal(modalId) {
    this.openModalId = modalId;
  }
}

