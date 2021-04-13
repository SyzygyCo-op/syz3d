import * as DRMT from 'dreamt'
import * as THREE from 'three'

export class PlayerTag extends DRMT.TagComponent {}

export class LocalPlayerTag extends DRMT.TagComponent {}


const Object3DType = DRMT.createType({
  name: "Object3D",
  default: new THREE.Object3D(),
  copy: DRMT.copyCopyable,
  clone: DRMT.cloneClonable
});
const Vector3Type = DRMT.createType({
  name: "Vector3",
  default: new THREE.Vector3(),
  copy: DRMT.copyCopyable,
  clone: DRMT.cloneClonable
});
const YawPitchRollType = DRMT.createType({
  name: "Euler",
  // Use YXZ order to enable translating mouse movement to YAW and PITCH
  default: new THREE.Euler(0, 0, 0, "YXZ"),
  copy: DRMT.copyCopyable,
  clone: DRMT.cloneClonable
});

export class PositionComponent extends DRMT.Component {
  static schema = {
    value: { type: Vector3Type },
  };
}
export class VelocityComponent extends DRMT.Component {
  static schema = {
    value: { type: Vector3Type },
  };
}
export class RotationComponent extends DRMT.Component {
  static schema = {
    value: { type: YawPitchRollType },
  };
}
export class AngularVelocityComponent extends DRMT.Component {
  static schema = {
    value: { type: YawPitchRollType },
  };
}

/** Stores a URL pointing to a GLTF/GLB file */
export class GltfUrlComponent extends DRMT.Component {
  static schema = {
    value: { type: DRMT.Types.String },
  };
}

export class Object3DComponent extends DRMT.Component {
  static schema = {
    value: { type: Object3DType },
  };
}


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

export class BumpComponent extends DRMT.Component {
  static schema = {
    value: { type: DRMT.Types.Number },
  };
}

