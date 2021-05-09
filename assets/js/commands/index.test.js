import { Entity } from "dreamt";
import { Euler, Vector3 } from "three";
import { AngularVelocityComponent, RotationComponent, VelocityComponent } from "../components";
import { TurnCommand, MoveCommand, JumpCommand } from "./";

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
describe("TurnCommand", () => {
  it("adds to the angular velocity", () => {
    const entity = new Entity();
    const accelX = 5;
    const accelY = 5;
    const sut = new TurnCommand();

    entity
      .addComponent(AngularVelocityComponent, { value: new Euler() });

    sut.execute(entity, accelX, accelY);
    sut.execute(entity, accelX, accelY);

    /** @type {Vector3} */
    const velocity = entity.getComponent(AngularVelocityComponent).value;
    expect(velocity.x).toBe(accelX*2);
    expect(velocity.y).toBe(accelY*2);
  });
});
