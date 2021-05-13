import * as DRMT from "dreamt";
import { Euler, Vector3 } from "three";
import {
  PlayerTag,
  UILabelComponent,
  PositionComponent,
  GltfUrlComponent,
  BumpComponent,
  RotationComponent,
  VelocityComponent,
  AngularVelocityComponent,
  ScaleComponent,
  OwnershipComponent,
  FrictionComponent,
  MassComponent,
  Object3DComponent,
  CollisionBodyComponent,
  UseGlftForCollisionTag,
  PlayerInternalsComponent,
} from "../components";
import { entityStore, ObservableState, PlayerState } from "../state";
import {
  isMine,
  getNetworkFrameDuration,
  getPlayerEntityId,
  getPlayerId,
  hasOwner,
} from "../utils";
import { correspondentCache } from "../state";
import { CollisionBody } from "../components/CollisionBody";

export class StateSystem extends DRMT.System {
  static queries = {
    stationaryObject3D: {
      components: [
        Object3DComponent,
        DRMT.Not(VelocityComponent),
        DRMT.Not(AngularVelocityComponent),
        DRMT.Not(UseGlftForCollisionTag),
      ],
      listen: {
        removed: true,
      },
    },
    movingObject3D: {
      components: [
        Object3DComponent,
        VelocityComponent,
        AngularVelocityComponent,
        OwnershipComponent,
      ],
      listen: {
        removed: true,
      },
    },
    players: {
      components: [PlayerTag, OwnershipComponent],
    },
  };

  observable = new ObservableState();
  worldDirty = false;
  diffForClient = DRMT.Correspondent.createEmptyDiff();

  /** @type HTMLCanvasElement */
  canvasElement = null;

  init() {
    this.correspondent = new DRMT.Correspondent(this.world, {
      entityStore: entityStore,
      isMine: (entity) => hasOwner(entity) && isMine(entity),
    })
      .registerComponent("is_player", PlayerTag, {
        read: () => {},
        write: (compo) => !!compo,
      })
      .registerComponent("use_gltf_for_collision", UseGlftForCollisionTag, {
        read: () => {},
        write: (compo) => !!compo,
      })
      .registerComponent("label", UILabelComponent)
      .registerComponent("glft_url", GltfUrlComponent, {
        read: (compo, data) => {
          if (compo) {
            /** @type any */ (compo).value = data;
          }
        },
        write: (compo) => compo && /** @type any */ (compo).value,
      })
      .registerComponent("owner", OwnershipComponent, {
        read: (compo, data) => {
          if (compo) {
            /** @type any */ (compo).value = data;
          }
        },
        write: (compo) => compo && /** @type any */ (compo).value,
      })
      .registerComponent("position", PositionComponent, {
        read: /** @param {DRMT.Component<any> & { value: Vector3 }} component */ (
          component,
          data
        ) => {
          if (component) {
            // TODO should share a vector instance since ECSY copies the value?
            component.value = component.value || new Vector3();
            component.value.set.apply(component.value, data);
          }
        },
        write: /** @param {DRMT.Component<any> & { value: Vector3 }} compo */ (
          compo
        ) => {
          return compo && compo.value && compo.value.toArray();
        },
        writeCache: (data) => {
          return JSON.stringify(data);
        },
      })
      .registerComponent("rotation", RotationComponent, {
        read: /** @param {DRMT.Component<any> & { value: Euler }} component */ (
          component,
          data
        ) => {
          if (component) {
            component.value = component.value || new Euler();
            component.value.set.apply(component.value, data);
          }
        },
        write: /** @param {DRMT.Component<any> & { value: Euler }} compo */ (
          compo
        ) => {
          return compo && compo.value && compo.value.toArray();
        },
        writeCache: (data) => {
          return JSON.stringify(data);
        },
      })
      .registerComponent("scale", ScaleComponent, {
        read: /** @param {DRMT.Component<any> & { value: Vector3 }} component */ (
          component,
          data
        ) => {
          if (component) {
            component.value = component.value || new Vector3();
            component.value.set.apply(component.value, data);
          }
        },
        write: /** @param {DRMT.Component<any> & { value: Vector3 }} compo */ (
          compo
        ) => {
          return compo && compo.value && compo.value.toArray();
        },
        writeCache: (data) => {
          return JSON.stringify(data);
        },
      })
      .registerComponent("bump", BumpComponent);
    this.worldCache = correspondentCache;
  }

  execute(delta, time) {
    const stationaryObject3DResults = this.queries.stationaryObject3D.results;
    const movingObject3DResults = this.queries.movingObject3D.results;

    if (this.queries.stationaryObject3D.removed.length > 0) {
      this.observable.resetStationaryObject3DList(stationaryObject3DResults);
    } else if (
      stationaryObject3DResults.length >
      this.observable.stationaryObject3DList.length
    ) {
      this.observable.setStationaryObject3DList(stationaryObject3DResults);
    }

    if (this.queries.movingObject3D.removed.length > 0) {
      this.observable.resetMovingObject3DList(movingObject3DResults);
    } else if (
      movingObject3DResults.length > this.observable.movingObject3DList.length
    ) {
      this.observable.setMovingObject3DList(movingObject3DResults);
    }

    this.worldDirty = false;
    if (time % getNetworkFrameDuration() === 0) {
      const diff = this.correspondent.produceDiff(this.worldCache);
      if (!DRMT.Correspondent.isEmptyDiff(diff)) {
        this.worldDirty = true;
        Object.assign(this.diffForClient, diff);
        this.correspondent.updateCache(this.worldCache, diff);

        const worldState = this.correspondent.produceDiff({});
        const localPlayerData = DRMT.Correspondent.getUpsert(
          worldState,
          getPlayerEntityId()
        );
        // TODO seems like a seperate correspondent is needed for the UI
        if (
          (localPlayerData &&
            localPlayerData.label !==
              this.observable.localPlayer.actual.label) ||
          localPlayerData.glft_url !==
            this.observable.localPlayer.actual.glft_url
        ) {
          this.observable.localPlayer.setActual(
            /** @type any */ (localPlayerData)
          );
        }
      }
    }

    if (this.observable.localPlayer.isDirty) {
      const changesFromLocalUser = DRMT.Correspondent.setUpsert(
        DRMT.Correspondent.createEmptyDiff(),
        getPlayerEntityId(),
        this.observable.localPlayer.request
      );
      this.correspondent.consumeDiff(changesFromLocalUser);

      // Make sure the spinner is shown for >=1 sec so user knows it's doing something
      this.observable.localPlayer.clean();
    }
  }

  /** @param {Partial<PlayerState>} partialPlayerData */
  createLocalPlayer(partialPlayerData) {
    const player = this.correspondent
      .createEntity(getPlayerEntityId())
      .addComponent(PlayerTag) // TODO remove
      .addComponent(PlayerInternalsComponent, {
        isTouchingStableSurface: false,
      })
      .addComponent(VelocityComponent)
      .addComponent(AngularVelocityComponent)
      .addComponent(OwnershipComponent, { value: getPlayerId() })
      .addComponent(FrictionComponent, {
        linear: 0.08,
        angular: 0.2,
      })
      .addComponent(MassComponent, { value: 1 })
      .addComponent(CollisionBodyComponent, {
        value: new CollisionBody(
          "capsule",
          [new Vector3(0, 0, 0), new Vector3(0, 0.1, 0), 0.3],
          4
        ),
      });
    this.observable.createLocalPlayer(partialPlayerData);
    return player;
  }

  getLocalPlayer() {
    return this.queries.players.results.find(isMine);
  }

  /** @param {DRMT.IEntityComponentDiff} diff */
  updateWorld(diff) {
    // TODO change this vvv if the server ever becomes authoritative
    // TODO add method for removing entities from a diff
    delete diff.upsert[getPlayerEntityId()];
    // TODO need a method for knowing if the diff actually would make a difference
    // useful for when the systems are hot reloaded
    this.correspondent.consumeDiff(diff).updateCache(this.worldCache, diff);
  }

  reinit() {
    this.correspondent.registerEntity(
      getPlayerEntityId(),
      this.getLocalPlayer()
    );
  }
}
