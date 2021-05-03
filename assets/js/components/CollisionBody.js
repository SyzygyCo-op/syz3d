import * as DRMT from "dreamt";

export class CollisionBody {
  /** @type {"sphere" | "capsule"} */
  shape = "sphere";
  /** @type {any[]} */
  shapeArgs = [];
  /**
   * @type {number} restitution How bouncy the object is, normally a positive
   *   number, no maximum
   */
  restitutionFactor = 4;

  /**
   * @param {"sphere" | "capsule"} shape
   * @param {any[]} shapeArgs
  * @param {number} restitutionFactor
   */
  constructor(shape, shapeArgs, restitutionFactor) {
    this.shape = shape;
    this.shapeArgs = shapeArgs;
    this.restitutionFactor = restitutionFactor;
  }

  /** @param {CollisionBody} src */
  copy(src) {
    this.shape = src.shape;
    this.restitutionFactor = src.restitutionFactor;
    src.shapeArgs.forEach((arg) => {
      const clone = arg.clone ? arg.clone() : arg;
      this.shapeArgs.push(clone);
    });
    return this;
  }

  clone() {
    const result = new CollisionBody(this.shape, this.shapeArgs, this.restitutionFactor);
    result.copy(this);
    return result;
  }
}

const CollisionBodyType = DRMT.createType({
  name: "CollisionBody",
  default: new CollisionBody("sphere", [], 4),
  copy: DRMT.copyCopyable,
  clone: DRMT.cloneClonable,
});

export class CollisionBodyComponent extends DRMT.Component {
  static schema = {
    value: { type: CollisionBodyType },
  };
}
