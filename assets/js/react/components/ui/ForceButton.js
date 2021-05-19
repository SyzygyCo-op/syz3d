import * as React from "react";

/** @type {ForceButtonPressEvent} */
const pressEvent = {
  intensity: 0,
};

/**
 * @typedef {{ intensity: number }} ForceButtonPressEvent
 * @type React.FunctionComponent<{onPress: (evt: ForceButtonPressEvent) => void}>
 */
export const ForceButton = (props) => {
  return (
    <button
      style={{
        height: "10vw",
        backgroundColor: "rgba(255, 255, 255, 0.2)",
        textShadow: "1px 1px 1px rgba(0, 0, 0, 0.5)",
        textTransform: "uppercase",
        userSelect: "none",
      }}
      onTouchStart={handleTouchStart}
      onMouseDown={handleMouseDown}
    >
      {props.children}
    </button>
  );

  /** @param {React.TouchEvent} evt */
  function handleTouchStart(evt) {
    // TODO handle any touch that isn't being handled already
    const touch = /** @type Touch */ (evt.targetTouches[0]);
    pressEvent.intensity = touch.force || 1;
    props.onPress(pressEvent);
  }

  /** @param {React.MouseEvent} evt */
  function handleMouseDown(evt) {
    evt.preventDefault()
    pressEvent.intensity = 1;
    props.onPress(pressEvent);
  }
};
