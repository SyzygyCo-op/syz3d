import {PowerUpMachine} from './PowerUpMachine';
describe("PowerUpMachine", () => {
  /** @type PowerUpMachine */
  let sut;
  const maxPowerUps = 4;
  beforeEach(() => {
    sut = new PowerUpMachine(maxPowerUps);
  });
  test("result correlates to number of tick messages between a start message and a finish message", () => {
    const result0 = sut.result;
    sut.sendStart();
    sut.sendTick();
    const result1 = sut.result;
    sut.sendTick();
    const result2 = sut.result;
    sut.sendFinish();
    sut.sendTick();
    expect(result1 > result0).toBe(true)
    expect(result2 > result1).toBe(true)
  });
  test("ticks before start do not count", () => {
    sut.sendTick();
    sut.sendStart();
    expect(sut.result).toBe(0);
  });
  test("ticks after finish do not count", () => {
    sut.sendStart();
    sut.sendFinish();
    sut.sendTick();
    expect(sut.result).toBe(0);
  });
  test("result is between zero and one", () => {
    expect(sut.result).toBe(0)
    sut.sendStart();
    new Array(maxPowerUps * 2).fill(0).forEach(() => sut.sendTick())
    expect(sut.result).toBe(1)
  });
  test("is finished after recieve finish message", () => {
    sut.sendStart();
    sut.sendFinish();
    expect(sut.finished).toBe(true)
  });
  test("can be reset", () => {
    sut.sendStart();
    sut.sendTick();
    sut.sendFinish();
    sut.reset();
    expect(sut.result).toBe(0)
    expect(sut.finished).toBe(false)
  });
});
