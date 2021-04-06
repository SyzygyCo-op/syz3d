import * as DRMT from "dreamt";
import * as THREE from "three";
import {
  Object3DComponent,
  GltfUrlComponent,
  BoundingBoxComponent,
} from "../components";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

const tempBox3 = new THREE.Box3();

const tempVec3 = new THREE.Vector3();

export class LoaderSystem extends DRMT.System {
  static queries = {
    glftUrls: {
      components: [GltfUrlComponent],
      listen: {
        added: true,
        changed: true,
      },
    },
  };

  execute() {
    this.queries.glftUrls.added.forEach(entityReloadGltf);
    this.queries.glftUrls.changed.forEach(entityReloadGltf);
  }
}

// TODO unit-test below code

const urlMap = new Map();
const gltfLoader = new GLTFLoader();

const cloneValue = ({ value }) => ({ value: value.clone() });

/**
 * @param {DRMT.Entity} entity
 */
async function entityReloadGltf(entity) {
  if (!entity.hasComponent(GltfUrlComponent)) {
    console.error("entity", entity.id, "was expected to have GltfUrlComponent");
    return;
  }

  const url = entity.getComponent(GltfUrlComponent).value;

  const result = await loadGltf(url);

  tempBox3.setFromObject(result.scene);
  tempBox3.getSize(tempVec3);

  upsertComponent(
    entity,
    Object3DComponent,
    { value: result.scene },
    cloneValue
  );
  upsertComponent(
    entity,
    BoundingBoxComponent,
    { value: tempVec3 },
    cloneValue
  );
}

/**
 * @param {string} url
 */
function loadGltf(url) {
  if (!urlMap.has(url)) {
    console.error("Looks like you forgot to call preloadGltf? url:", url);
  }
  return urlMap.get(url);
}

/**
 * @param {string} url
 */
export function preloadGltf(url) {
  return new Promise((resolve, reject) => {
    gltfLoader.load(url, onSuccess, onProgress, reject);

    function onSuccess(result) {
      urlMap.set(url, result);
    }

    function onProgress() {}

    function onError(error) {
      console.error("Error loading GLTF", url, error.toString());
      reject(error);
    }
  });
}

/**
 * @param {DRMT.Entity} entity
 * @param {DRMT.ComponentConstructor} Component
 * @param {any} data
 * @param {(data: any) => any} [clone]
 */
function upsertComponent(entity, Component, data, clone = (x) => x) {
  if (entity.hasComponent(Component)) {
    Object.assign(entity.getMutableComponent(Component), clone(data));
  } else {
    entity.addComponent(Component, data);
  }
}
