import * as React from "react";
import { gameLoop } from "../../../world";

/** @type {ForceButtonPressEvent} */
const pressEvent = {
  intensity: 0,
};

/**
 * @typedef {{ intensity: number }} ForceButtonPressEvent
 * @type React.FunctionComponent<{onPress: (evt: ForceButtonPressEvent) => void,
 *   getNextIntensity: (isDown: boolean) => number}>
 */
export const ForceButton = (props) => {
  const intensityRef = React.useRef(0);
  const isDownRef = React.useRef(false);
  gameLoop.useTick(() => {
    intensityRef.current = props.getNextIntensity(isDownRef.current);
    if (intensityRef.current > 1) {
      props.onPress(pressEvent);
    }
  });
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
      onTouchEnd={handleTouchEnd}
    >
      {props.children}
    </button>
  );

  function handleTouchStart() {
    isDownRef.current = true;
  }

  function handleTouchEnd() {
    props.onPress(pressEvent);
    isDownRef.current = false;
  }
};
