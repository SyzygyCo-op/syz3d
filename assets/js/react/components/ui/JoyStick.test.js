import { getMoveEvent } from "./JoyStick";

jest.mock("../../../world", () => ({
  gameLoop: {
    useTick: () => {}
  }
}))

/**
 * @param {number} top
 * @param {number} left
 * @param {number} width
 * @param {number} height
 * @returns Partial<HTMLDivElement>
 */
function getTarget(top, left, width, height) {
  const getBoundingClientRect = () =>
    /** @type DOMRect */ ({ top, left, width, height });
  return ({ getBoundingClientRect });
}

describe("getMoveEventForMouseEvent", () => {
  test("angle", () => {
    const top = 10;
    const left = 5;
    const width = 12;
    const height = 12;
    const clientX = left + width / 2 + 1;
    const clientY = top + height / 2 + 1;
    const target = getTarget(
      top,
      left,
      width,
      height,
    );
    const evt = getMoveEvent(clientX, clientY, /** @type any */(target));

    expect(evt.angle).toBe(Math.PI / 4);
  });
  test("distance ratios", () => {
    const top = 10;
    const left = 5;
    const width = 24;
    const height = 24;
    const clientX = left + width / 2 + 3;
    const clientY = top + height / 2 + 4;
    const target = getTarget(
      top,
      left,
      width,
      height,
    );
    const evt = getMoveEvent(clientX, clientY, /** @type any */(target));

    expect(evt.xDistance).toBe(1 / 4);
    expect(evt.yDistance).toBe(1 / 3);
  });
  test("move outside circle but within box", () => {
    const top = 10;
    const left = 5;
    const width = 24;
    const height = 24;
    const clientX = left + width / 2 + 12;
    const clientY = top + height / 2 + 12;
    const target = getTarget(
      top,
      left,
      width,
      height,
    );
    const evt = getMoveEvent(clientX, clientY, /** @type any */(target));

    expect(evt.xDistance).toBeCloseTo(Math.cos(Math.PI / 4));
    expect(evt.yDistance).toBeCloseTo(Math.sin(Math.PI / 4));
  });
  test("dominantDirection: left", () => {
    const top = 10;
    const left = 5;
    const width = 12;
    const height = 12;
    const clientX = left + 1;
    const clientY = top + height / 2;
    const target = getTarget(
      top,
      left,
      width,
      height,
    );
    const evt = getMoveEvent(clientX, clientY, /** @type any */(target));

    expect(evt.dominantDirection).toBe("left");
  });
  test("dominantDirection: right", () => {
    const top = 10;
    const left = 5;
    const width = 12;
    const height = 12;
    const clientX = left + width - 1;
    const clientY = top + height / 2;
    const target = getTarget(
      top,
      left,
      width,
      height,
    );
    const evt = getMoveEvent(clientX, clientY, /** @type any */(target));

    expect(evt.dominantDirection).toBe("right");
  });
  test("dominantDirection: up", () => {
    const top = 10;
    const left = 5;
    const width = 12;
    const height = 12;
    const clientX = left + width / 2;
    const clientY = top + 1;
    const target = getTarget(
      top,
      left,
      width,
      height,
    );
    const evt = getMoveEvent(clientX, clientY, /** @type any */(target));

    expect(evt.dominantDirection).toBe("up");
  });
  test("dominantDirection: down", () => {
    const top = 10;
    const left = 5;
    const width = 12;
    const height = 12;
    const clientX = left + width / 2;
    const clientY = top + height - 1;
    const target = getTarget(
      top,
      left,
      width,
      height,
    );
    const evt = getMoveEvent(clientX, clientY, /** @type any */(target));

    expect(evt.dominantDirection).toBe("down");
  });
});
