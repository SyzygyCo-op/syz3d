import * as DRMT from 'dreamt';
import * as THREE from 'three';
import {Object3DComponent, GltfUrlComponent, BoundingBoxComponent} from '../components';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

const tempBox3 = new THREE.Box3();

const tempVec3 = new THREE.Vector3();

export class LoaderSystem extends DRMT.System {
  static queries = {
    glftInit: {
      components: [GltfUrlComponent, DRMT.Not(Object3DComponent)]
    },
    glftChanged: {
      components: [GltfUrlComponent],
      listen: {
        changed: true
      }
    }
  }

  execute() {
    this.queries.glftInit.results.forEach(entityLoadGltf);
    this.queries.glftChanged.changed.forEach(entityReloadGltf);
  }
}

/** @param {DRMT.Entity} entity */
function entityLoadGltf (entity) {
  const url = entity.getComponent(GltfUrlComponent).value;
  const loader = new GLTFLoader()
  loader.load(url, onLoad, onProgress, onError);

  function onLoad (result) {
    tempBox3.setFromObject(result.scene);
    tempBox3.getSize(tempVec3);

    entity.addComponent(Object3DComponent, { value: result.scene } )
    entity.addComponent(BoundingBoxComponent, { value: tempVec3 })
  }

  function onProgress () {}

  function onError (error) {
    console.error("Error loading GLTF", url, error.toString());
  }
}

/** @param {DRMT.Entity} entity */
function entityReloadGltf (entity) {
  const url = entity.getComponent(GltfUrlComponent).value;
  const loader = new GLTFLoader()
  loader.load(url, onLoad, onProgress, onError);

  function onLoad (result) {
    tempBox3.setFromObject(result.scene);
    tempBox3.getSize(tempVec3);

    entity.getMutableComponent(Object3DComponent).value = result.scene;
    entity.getMutableComponent(BoundingBoxComponent).value = tempVec3;
  }

  function onProgress () {}

  function onError (error) {
    console.error("Error loading GLTF", url, error.toString());
  }
}
