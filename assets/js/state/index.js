import * as DRMT from "dreamt";
import * as MOBX from "mobx";
import { Euler, Vector3 } from "three";
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
  position = new Vector3();
  velocity = new Vector3();
  rotation = new Euler();
  spin = [0, 0, 0];
}

export class Asset3D {
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
  new Asset3D("/3d/GrimReaper/preview.png", "/3d/GrimReaper/model.glb"),
  new Asset3D("/3d/PokemonHaunter/preview.png", "/3d/PokemonHaunter/model.glb"),
  new Asset3D("/3d/PokemonDratini/preview.png", "/3d/PokemonDratini/model.glb"),
  new Asset3D("/3d/ShenLong/preview.png", "/3d/ShenLong/model.glb"),
];
const assets = [...avatars, new Asset3D("", "/3d/RiverIsland/model.glb")];

export async function preloadAssets() {
  await Promise.all(assets.map((a) => a.preload()));
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

  localPlayer = MOBX.makeAutoObservable(
    new DRMT.DualModel(() => new PlayerState(), {
      debounceRequestMs: config.DEBOUNCE_MS_ON_CHANGE_INPUT,
    })
  );

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
    });
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
