import {PowerUpMachine, BIT_VIRTUAL_GAMEPAD, BIT_KEYBOARD} from './PowerUpMachine';
describe("JumpStateMachine", () => {
  /** @type PowerUpMachine */
  let sut;
  const maxPowerUps = 4;
  beforeEach(() => {
    sut = new PowerUpMachine(maxPowerUps);
  });
  test("result correlates to number of tick messages between a start message and a finish message", () => {
    const result0 = sut.result;
    sut.sendTick();
    const result0B = sut.result;
    sut.sendStart(BIT_VIRTUAL_GAMEPAD);
    sut.sendTick();
    const result1 = sut.result;
    sut.sendTick();
    const result2 = sut.result;
    sut.sendFinish(BIT_VIRTUAL_GAMEPAD);
    sut.sendTick();
    const result2B = sut.result;
    expect(result1 > result0).toBe(true)
    expect(result2 > result1).toBe(true)
    expect(result0).toEqual(result0B);
    expect(result2).toEqual(result2B);
  });
  test("result is between zero and one", () => {
    expect(sut.result).toBe(0)
    sut.sendStart(BIT_VIRTUAL_GAMEPAD);
    new Array(maxPowerUps + 1).fill(0).forEach(() => sut.sendTick())
    expect(sut.result).toBe(1)
  });
  test("finishes when result reaches 1", () => {
    sut.sendStart(BIT_VIRTUAL_GAMEPAD);
    new Array(maxPowerUps + 1).fill(0).forEach(() => sut.sendTick())
    expect(sut.finished).toBe(true)
  });
  test("finishes when recieves corresponding finish messages", () => {
    sut.sendStart(BIT_VIRTUAL_GAMEPAD);
    sut.sendStart(BIT_KEYBOARD);
    sut.sendFinish(BIT_VIRTUAL_GAMEPAD);
    expect(sut.finished).toBe(false)
    sut.sendFinish(BIT_KEYBOARD);
    expect(sut.finished).toBe(true)
  });
  test("can be reset", () => {
    sut.sendStart(BIT_KEYBOARD);
    sut.sendTick();
    sut.sendFinish(BIT_KEYBOARD);
    sut.reset();
    expect(sut.result).toBe(0)
    expect(sut.finished).toBe(false)
  });
});
