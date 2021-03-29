import * as DRMT from 'dreamt';
import {GltfComponent, GltfUrlComponent} from '../components';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

export class LoaderSystem extends DRMT.System {
  static queries = {
    glftInit: {
      components: [GltfUrlComponent, DRMT.Not(GltfComponent)]
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

  function onLoad (value) {
    entity.addComponent(GltfComponent, { value } )
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

  function onLoad (value) {
    entity.getMutableComponent(GltfComponent).value = value;
  }

  function onProgress () {}

  function onError (error) {
    console.error("Error loading GLTF", url, error.toString());
  }
}
