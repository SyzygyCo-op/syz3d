import * as DRMT from "dreamt";
import {Vector3Type, Object3DType, YawPitchRollType} from '../types';

export {CollisionBodyComponent} from './CollisionBody';

export class PlayerTag extends DRMT.TagComponent {}


export * from './PositionComponent';

export class VelocityComponent extends DRMT.Component {
  static schema = {
    value: { type: Vector3Type },
  };
}
/** Larger value => more friction */
export class FrictionComponent extends DRMT.Component {
  static schema = {
    linear: { type: DRMT.Types.Number },
    angular: { type: DRMT.Types.Number },
  };
}
export class RotationComponent extends DRMT.Component {
  static schema = {
    value: { type: YawPitchRollType },
  };
}
export class RotationTweenComponent extends DRMT.Component {
  static schema = {
    value: { type: YawPitchRollType },
  };
}
export class RotationTweenStartComponent extends DRMT.Component {
  static schema = {
    value: { type: YawPitchRollType },
  };
}
export class AngularVelocityComponent extends DRMT.Component {
  static schema = {
    value: { type: YawPitchRollType },
  };
}
export class ScaleComponent extends DRMT.Component {
  static schema = {
    value: { type: Vector3Type },
  };
}
export class MassComponent extends DRMT.Component {
  static schema = {
    value: { type: DRMT.Types.Number },
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

export class UseGlftForCollisionTag extends DRMT.TagComponent {}


export class BoundingBoxComponent extends DRMT.Component {
  static schema = {
    value: { type: Vector3Type },
  };
}

export class UILabelComponent extends DRMT.Component {
  static schema = {
    value: { type: DRMT.Types.String },
  };
}

export class BumpComponent extends DRMT.Component {
  static schema = {
    value: { type: DRMT.Types.Number },
  };
}

export class OwnershipComponent extends DRMT.Component {
  static schema = {
    value: { type: DRMT.Types.Number },
  };
}
