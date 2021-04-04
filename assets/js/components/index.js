import * as DRMT from 'dreamt'
import * as THREE from 'three'

export class PlayerTag extends DRMT.TagComponent {}

export class LocalPlayerTag extends DRMT.TagComponent {}

/** Stores a URL pointing to a GLTF/GLB file */
export class GltfUrlComponent extends DRMT.Component {
  static schema = {
    value: { type: DRMT.Types.String },
  };
}

const Object3DType = DRMT.createType({
  name: "Object3D",
  default: new THREE.Object3D(),
  copy: DRMT.copyCopyable,
  clone: DRMT.cloneClonable
});
export class Object3DComponent extends DRMT.Component {
  static schema = {
    value: { type: Object3DType },
  };
}

const Vector3Type = DRMT.createType({
  name: "Vector3",
  default: new THREE.Vector3(),
  copy: DRMT.copyCopyable,
  clone: DRMT.cloneClonable
});
export class BoundingBoxComponent extends DRMT.Component {
  static schema = {
    value: { type: Vector3Type }
  };
}

export class UILabelComponent extends DRMT.Component {
  static schema = {
    value: { type: DRMT.Types.String },
  };
}

export class RenderToCanvasTag extends DRMT.TagComponent {}

export class RotationComponent extends DRMT.Component {
  static schema = {
    value: { type: DRMT.Types.Array },
  };
}

export class SpinComponent extends DRMT.Component {
  static schema = {
    value: { type: DRMT.Types.Array },
  };
}

export class BumpComponent extends DRMT.Component {
  static schema = {
    value: { type: DRMT.Types.Number },
  };
}

export class PositionComponent extends DRMT.Component {
  static schema = {
    value: { type: DRMT.Types.Array },
  };

  static randomValue() {
    return [Math.random() * 2 - 1, Math.random() * 2 - 1, Math.random() * 2];
  }
}
