import {PowerUpMachine} from './PowerUpMachine';
describe("PowerUpMachine: keydown path", () => {
  /** @type PowerUpMachine */
  let sut;
  const maxPowerUps = 4;
  beforeEach(() => {
    sut = new PowerUpMachine(maxPowerUps);
  });
  test("result correlates to number of tick messages between a keydown message and a keyup message", () => {
    const result0 = sut.result;
    sut.sendKeyDown();
    sut.sendTick();
    const result1 = sut.result;
    sut.sendTick();
    const result2 = sut.result;
    sut.sendKeyUp();
    sut.sendTick();
    expect(result1 > result0).toBe(true)
    expect(result2 > result1).toBe(true)
  });
  test("ticks before keydown do not count", () => {
    sut.sendTick();
    sut.sendKeyDown();
    expect(sut.result).toBe(0);
  });
  test("ticks after keyup do not count", () => {
    sut.sendKeyDown();
    sut.sendKeyUp();
    sut.sendTick();
    expect(sut.result).toBe(0);
  });
  test("result is between zero and one", () => {
    sut.sendKeyDown();
    new Array(maxPowerUps * 2).fill(0).forEach(() => sut.sendTick())
    expect(sut.result).toBe(1)
  });
  test("is finished and in OK state after recieve keyup message", () => {
    sut.sendKeyDown();
    sut.sendKeyUp();
    expect(sut.finished).toBe(true)
    expect(sut.state).toBe(PowerUpMachine.STATE_OK)
  });
  test("is finished and in OK state after result reaches maxPowerUps", () => {
    sut.sendKeyDown();
    new Array(maxPowerUps).fill(0).forEach(() => sut.sendTick())
    expect(sut.finished).toBe(true)
    expect(sut.state).toBe(PowerUpMachine.STATE_OK)
  });
  test("can be reset", () => {
    sut.sendKeyDown();
    sut.sendTick();
    sut.sendKeyUp();
    sut.reset();
    expect(sut.result).toBe(0)
    expect(sut.finished).toBe(false)
  });
});

