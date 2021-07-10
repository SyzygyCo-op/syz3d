import * as DRMT from "dreamt";
import * as THREE from "three";
import {
  VisibleGltfUrlComponent,
  VisibleObject3DComponent,
  CollisionGltfUrlComponent,
  CollisionObject3DComponent,
  BoundingBoxComponent,
} from "../components";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

const tempBox3 = new THREE.Box3();

const tempVec3 = new THREE.Vector3();

export class LoaderSystem extends DRMT.System {
  static queries = {
    glftUrls: {
      components: [VisibleGltfUrlComponent],
      listen: {
        added: true,
        changed: true,
      },
    },
    collisionGlftUrls: {
      components: [CollisionGltfUrlComponent],
      listen: {
        added: true,
        changed: true,
      },
    },
  };

  execute() {
    this.queries.glftUrls.added.forEach(entityReloadVisibleGltf);
    this.queries.glftUrls.changed.forEach(entityReloadVisibleGltf);
    this.queries.collisionGlftUrls.added.forEach(entityReloadCollisionGltf);
    this.queries.collisionGlftUrls.changed.forEach(entityReloadCollisionGltf);
  }
}

// TODO unit-test below code
// TODO(optimize) use InstancedMesh
// var dummy = new THREE.Object3D();
// gltf.scene.traverse(function (child) {
//   if (child.isMesh) {
//     var instancedMesh = new THREE.InstancedMesh(
//       child.geometry,
//       child.material,
//       1
//     );
//     instancedMesh.setMatrixAt(0, dummy.matrix);
//     instancedMesh.position.add(new THREE.Vector3(0.6, 0, 0));
//     scene.add(instancedMesh);
//   }
// });

const urlMap = new Map();
const gltfLoader = new GLTFLoader();

const cloneValue = ({ value }) => ({ value: value.clone() });

async function entityReloadVisibleGltf(entity){
  return await entityReloadGltf(entity, VisibleGltfUrlComponent, VisibleObject3DComponent)
}
async function entityReloadCollisionGltf(entity){
  return await entityReloadGltf(entity, CollisionGltfUrlComponent, CollisionObject3DComponent)
}

/**
 * @param {DRMT.Entity} entity
  * @param {DRMT.ComponentConstructor} UrlComponent
  * @param {DRMT.ComponentConstructor} Object3DComponent
 */
async function entityReloadGltf(entity, UrlComponent, Object3DComponent) {
  if (!entity.hasComponent(UrlComponent)) {
    console.error("entity", entity.id, "was expected to have", UrlComponent.name);
    return;
  }

  const url = /** @type any */(entity.getComponent(UrlComponent)).value;

  const result = await loadSceneFromGltf(url);

  tempBox3.setFromObject(result);
  tempBox3.getSize(tempVec3);

  upsertComponent(entity, Object3DComponent, { value: result }, cloneValue);
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
function loadSceneFromGltf(url) {
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
    gltfLoader.load(url, onSuccess, onProgress, onError);

    function onSuccess(result) {
      urlMap.set(url, result.scene);
      resolve(result.scene);
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
