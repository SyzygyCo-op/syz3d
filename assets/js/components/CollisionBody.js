import * as DRMT from "dreamt";

export class CollisionBody {
  /** @type {"sphere" | "capsule"} */
  type = "sphere";
  /** @type {number[]} */
  args = [];

  /**
   * @param {"sphere" | "capsule"} type
   * @param {number[]} args
   */
  constructor(type, args) {
    this.type = type;
    this.args = args;
  }

  /** @param {CollisionBody} src */
  copy(src) {
    this.type = src.type;
    DRMT.copyArray(src.args, this.args);
    return this;
  }

  clone() {
    const result = new CollisionBody(this.type, this.args);
    result.copy(this);
    return result;
  }
}

const CollisionBodyType = DRMT.createType({
  name: "CollisionBody",
  default: new CollisionBody("sphere", []),
  copy: DRMT.copyCopyable,
  clone: DRMT.cloneClonable,
});

export class CollisionBodyComponent extends DRMT.Component {
  static schema = {
    value: { type: CollisionBodyType },
  };
}
