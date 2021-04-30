import * as DRMT from "dreamt";
import { Sphere, Vector3 } from "three";
import {
  OwnershipComponent,
  PositionComponent,
  VelocityComponent,
  AngularVelocityComponent,
  CollisionBodyComponent,
  UseGlftForCollisionTag,
  Object3DComponent,
} from "../components";
import { Octree } from "three/examples/jsm/math/Octree";
import { isMine } from "../utils";

const sphereCollider = new Sphere(new Vector3(), 0);

export class CollisionSystem extends DRMT.System {
  static queries = {
    staticBodies: {
      components: [
        UseGlftForCollisionTag,
        Object3DComponent,
        DRMT.Not(VelocityComponent),
        DRMT.Not(AngularVelocityComponent),
      ],
      listen: {
        added: true,
      },
    },
    dynamicBodies: {
      components: [
        CollisionBodyComponent,
        PositionComponent,
        VelocityComponent,
        OwnershipComponent,
      ],
    },
  };

  init() {
    this.octree = new Octree();
  }

  /**
   * @param {number} delta
   * @param {number} time
   */
  execute(delta, time) {
    this.addObject3DColliders(this.queries.staticBodies.added);
    this.queries.dynamicBodies.results.forEach((entity) => {
      if (isMine(entity)) {
        /** @type Vector3 */
        const position = entity.getComponent(PositionComponent).value;
        const radius = entity.getComponent(CollisionBodyComponent).value.args[0];
        sphereCollider.center.copy(position);
        sphereCollider.radius = radius;
        const result = this.octree.sphereIntersect(sphereCollider);

        this.playerOnFloor = false;

        if (result) {
          this.playerOnFloor = result.normal.y > 0;

          position.add(result.normal.multiplyScalar(result.depth * 0.5));
        }
      }
    });
  }

  reinit() {
    this.addObject3DColliders(this.queries.staticBodies.results);
  }

  /** @param {DRMT.Entity[]} entities */
  addObject3DColliders(entities) {
    entities.forEach((entity) => {
      console.log("adding", entity.name, "to collision octree");
      const object3d = entity.getComponent(Object3DComponent).value;
      this.octree.fromGraphNode(object3d);
      console.log("finished adding", entity.name, "to collision octree");
    });
  }
}
