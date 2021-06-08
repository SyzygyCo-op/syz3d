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
    expect(sut.resultOk).toBe(true)
  });
  test("is finished and in OK state after result reaches maxPowerUps", () => {
    sut.sendKeyDown();
    new Array(maxPowerUps).fill(0).forEach(() => sut.sendTick())
    expect(sut.finished).toBe(true)
    expect(sut.resultOk).toBe(true)
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

describe("PowerUpMachine: touchend path", () => {
  /** @type PowerUpMachine */
  let sut;
  const maxPowerUps = 4;
  beforeEach(() => {
    sut = new PowerUpMachine(maxPowerUps);
  });
  test("result correlates to number of tick messages between a touchend message and a touchstart message", () => {
    const result0 = sut.result;
    sut.sendTouchEnd();
    sut.sendTick();
    const result1 = sut.result;
    sut.sendTick();
    const result2 = sut.result;
    sut.sendTouchStart();
    sut.sendTick();
    expect(result1 > result0).toBe(true)
    expect(result2 > result1).toBe(true)
  });
  test("ticks before touchend do not count", () => {
    sut.sendTick();
    sut.sendTouchEnd();
    expect(sut.result).toBe(0);
  });
  test("ticks after touchstart do not count", () => {
    sut.sendKeyDown();
    sut.sendTouchStart();
    sut.sendTick();
    expect(sut.result).toBe(0);
  });
  test("is finished and in OK state after recieve touchstart if result <= maxPowerUps", () => {
    sut.sendTouchEnd();
    new Array(maxPowerUps).fill(0).forEach(() => sut.sendTick())
    sut.sendTouchStart();
    expect(sut.finished).toBe(true)
    expect(sut.resultOk).toBe(true)
  });
  test("is finished and in non-OK state when result exceeds maxPowerUps", () => {
    sut.sendTouchEnd();
    new Array(maxPowerUps + 1).fill(0).forEach(() => sut.sendTick())
    expect(sut.finished).toBe(true)
    expect(sut.resultOk).toBe(false)
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
