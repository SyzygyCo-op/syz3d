import * as DRMT from "dreamt";
import * as MOBX from "mobx";
import { Triangle } from "three";
import * as config from "../config";
import { preloadGltf } from "../systems/LoaderSystem";
import { PowerUpMachine } from "./PowerUpMachine";
import { UIFullScreen } from "./UIFullScreen";
import { UserSettings } from "./UserSettings";

export * as keyMap from './KeyMap';

export class PlayerState {
  is_player = true;
  render_to_canvas = true;
  label = "";
  /** @type string? */
  visible_gltf_url = null;
  position = [0, 0, 0];
  rotation = [0, 0, 0, "YXZ"];
  scale = [1, 1, 1];
}

export class Asset3D {
  previewImageUrl = "/images/missing_asset_preview.png";
  /** @type string? */
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
  new Asset3D("/images/squirrel-1-preview.png", "/3d/squirrel-1.glb"),
];
const assets = [
  ...avatars,
  new Asset3D("", "/3d/game.glb"),
  new Asset3D("", "/3d/collision.glb"),
  new Asset3D("", "/3d/example-collision-world.glb"),
];

export async function preloadAssets() {
  await Promise.all(assets.map((a) => a.preload()));
}

export const userSettings = new UserSettings({windowInnerWidth: window.innerWidth});

export const uiFullScreen = new UIFullScreen();

/** @typedef {"EDIT_MY_AVATAR" | "SETTINGS" | "HELP" | "WELCOME"} ModalID */
export class ObservableState {
  /** @type {null | ModalID} */
  openModalId = null;

  /** @type Triangle[] */
  debugCollisionTriangles = [];

  /** @param {Triangle[]} triangles */
  setDebugCollisionTriangles(triangles) {
    DRMT.copyArray(triangles, this.debugCollisionTriangles);
  }

  localPlayer = MOBX.makeAutoObservable(
    new DRMT.DualModel(() => new PlayerState(), {
      debounceRequestMs: config.DEBOUNCE_MS_ON_CHANGE_INPUT,
    })
  );

  constructor() {
    MOBX.makeAutoObservable(this);
  }

  /** @param {Partial<PlayerState>} partialPlayerData */
  createLocalPlayer(partialPlayerData) {
    this.localPlayer.setRequestPart(partialPlayerData);
  }

  /** @type Set<DRMT.Entity> */
  _stationaryObject3DList = new Set();
  // TODO copy-pasta
  /** @type Set<DRMT.Entity> */
  _movingObject3DList = new Set();

  get stationaryObject3DList() {
    const ret = [];
    for (const e of this._stationaryObject3DList) {
      ret.push(e);
    }
    return ret;
  }

  get movingObject3DList() {
    const ret = [];
    for (const e of this._movingObject3DList) {
      ret.push(e);
    }
    return ret;
  }

  /** @param {DRMT.Entity[]} entities */
  setStationaryObject3DList(entities) {
    entities.forEach((entity) => {
      this._stationaryObject3DList.add(entity);
    });
  }

  /** @param {DRMT.Entity[]} entities */
  setMovingObject3DList(entities) {
    entities.forEach((entity) => {
      this._movingObject3DList.add(entity);
    });
  }

  /** @param {DRMT.Entity[]} entities */
  resetStationaryObject3DList(entities) {
    this._stationaryObject3DList.clear();
    this.setStationaryObject3DList(entities);
  }

  /** @param {DRMT.Entity[]} entities */
  resetMovingObject3DList(entities) {
    this._movingObject3DList.clear();
    this.setMovingObject3DList(entities);
  }

  /** @param {ModalID} modalId */
  setOpenModal(modalId) {
    this.openModalId = modalId;
  }
}

export const correspondentCache = DRMT.Correspondent.createEmptyBox();
export const entityStore = DRMT.Correspondent.createEntityStore();

export const jumpStateMachine = new PowerUpMachine(7);
