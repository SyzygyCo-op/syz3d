import * as DRMT from "dreamt";

export class CollisionBody {
  /** @type {"sphere" | "capsule"} */
  type = "sphere";
  /** @type {any[]} */
  args = [];

  /**
   * @param {"sphere" | "capsule"} type
   * @param {any[]} args
   */
  constructor(type, args) {
    this.type = type;
    this.args = args;
  }

  /** @param {CollisionBody} src */
  copy(src) {
    this.type = src.type;
    src.args.forEach((arg) => {
      const clone = arg.clone ? arg.clone() : arg;
      this.args.push(clone);
    })
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
