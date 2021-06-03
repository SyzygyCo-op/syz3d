import {UserSettings} from './UserSettings';

describe("UserSettings#new", () => {
  test("shows virtual game pad when window is narrow", () => {
    const sut = new UserSettings({
      windowInnerWidth: 1100
    });

    expect(sut.shouldShowVirtualGamePad).toBe(true)
  })
  test("uses 3rd person when window is wide", () => {
    const sut = new UserSettings({
      windowInnerWidth: 2000
    });

    expect(sut.shouldUse3rdPersonCamera).toBe(true)
  })
})

describe("UserSettings#update", () => {
  test("normal usage", () => {
    const sut = new UserSettings({
      windowInnerWidth: 2000
    });

    sut.update({cameraSetback: 42})

    expect(sut.cameraSetback).toBe(42);
  });
  test("ignores undefined keys in source", () => {
    const sut = new UserSettings({
      windowInnerWidth: 2000
    });

    let previous = Object.assign({}, sut);

    sut.update({
      shouldShowNameTags: false
    });

    expect(sut.shouldShowNameTags).toBe(false);
    expect(sut.shouldShowVirtualGamePad).toBe(previous.shouldShowVirtualGamePad);
    expect(sut.shouldUse3rdPersonCamera).toBe(previous.shouldUse3rdPersonCamera);

    previous = Object.assign({}, sut);

    sut.update({
      shouldShowVirtualGamePad: !sut.shouldShowVirtualGamePad
    })

    expect(sut.shouldShowNameTags).toBe(previous.shouldShowNameTags);
    expect(sut.shouldShowVirtualGamePad).toBe(!previous.shouldShowVirtualGamePad);
    expect(sut.shouldUse3rdPersonCamera).toBe(previous.shouldUse3rdPersonCamera);

    previous = Object.assign({}, sut);

    sut.update({
      shouldUse3rdPersonCamera: !sut.shouldUse3rdPersonCamera
    })

    expect(sut.shouldShowNameTags).toBe(previous.shouldShowNameTags);
    expect(sut.shouldShowVirtualGamePad).toBe(previous.shouldShowVirtualGamePad);
    expect(sut.shouldUse3rdPersonCamera).toBe(!previous.shouldUse3rdPersonCamera);
  });

  test("ignores unknown keys", () => {
    const sut = new UserSettings({
      windowInnerWidth: 2000
    });

    sut.update(/** @type any */(/** @type unknown */({foo: true})))

    expect(/** @type any */(sut).foo).not.toBeDefined();
  });
});
