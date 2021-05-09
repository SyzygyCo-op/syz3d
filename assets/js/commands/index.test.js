import { Entity } from "dreamt";
import { Euler, Vector3 } from "three";
import { RotationComponent, VelocityComponent } from "../components";
import { MoveCommand, JumpCommand } from "./";

describe("MoveCommand", () => {
  it("sets the velocity to running in whatever direction it's looking", () => {
    const entity = new Entity();
    const yRot = Math.PI / 4;
    const accel = 5;
    const lookDirection = new Euler(0, yRot, 0);
    const sut = new MoveCommand(accel);

    entity
      .addComponent(RotationComponent, { value: lookDirection })
      .addComponent(VelocityComponent, { value: new Vector3() });

    sut.execute(entity);

    /** @type {Vector3} */
    const velocity = entity.getComponent(VelocityComponent).value;
    expect(velocity.x).toBe(Math.cos(yRot) * accel);
    expect(velocity.z).toBe(Math.sin(yRot) * accel);
  });
});
describe("JumpCommand", () => {
  it("sets the velocity to straight up", () => {
    const entity = new Entity();
    const accel = 5;
    const sut = new JumpCommand();

    entity
      .addComponent(VelocityComponent, { value: new Vector3() });

    sut.execute(entity, accel);

    /** @type {Vector3} */
    const velocity = entity.getComponent(VelocityComponent).value;
    expect(velocity.y).toBe(accel);
  });
});
