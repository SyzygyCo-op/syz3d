import * as DRMT from "dreamt";
import { Sphere, Triangle, Vector3 } from "three";
import {
  OwnershipComponent,
  PositionComponent,
  VelocityComponent,
  AngularVelocityComponent,
  CollisionBodyComponent,
  UseGlftForCollisionTag,
  Object3DComponent,
} from "../components";
import { Octree } from "three-stdlib";
import { isMine } from "../utils";
import { Capsule } from "three/examples/jsm/math/Capsule";
import {CollisionBody} from "../components/CollisionBody";

const sphereCollider = new Sphere(new Vector3(), 0);
const capsuleCollider = new Capsule(new Vector3(), new Vector3(), 0);

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
        const position = entity.getMutableComponent(PositionComponent).value;
        /** @type Vector3 */
        const velocity = entity.getMutableComponent(VelocityComponent).value;
      /** @type CollisionBody */
        const body = entity.getComponent(CollisionBodyComponent).value;
        capsuleCollider.start.copy(body.shapeArgs[0]).add(position);
        capsuleCollider.end.copy(body.shapeArgs[1]).add(position);
        capsuleCollider.radius = body.shapeArgs[2];
        const result = this.octree.capsuleIntersect(capsuleCollider);

        this.playerOnFloor = false;

        if (result) {
          this.playerOnFloor = result.normal.y > 0;

          /** @type Vector3 */
          const collision = result.normal.multiplyScalar(result.depth);
          // console.log(collision.x, collision.z);
          position.add(collision);
          velocity.add(collision.multiplyScalar(delta * body.restitutionFactor))
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


// TODO add these as methods to Octree class
/**
  * @param {Octree} octree
  */
function getAllTriangles(octree) {
  const result = [];
  getAllTrianglesInPlace(result, octree)
  return result;
}

/** @param {Triangle[]} result
  * @param {Octree} octree
  */
function getAllTrianglesInPlace(result, octree) {
  octree.triangles.forEach((tri) => {
    result.push(tri);
  })
  octree.subTrees.forEach((sub) => {
    getAllTrianglesInPlace(result, sub);
  })
}
