import * as React from "react";
import { gameLoop } from "../../../world";

/**
 * @typedef {{
 *   dominantDirection: "left" | "right" | "up" | "down";
 *   angle: number;
 *   xDistance: number;
 *   yDistance: number;
 * }} JoyStickMoveEvent
 * @type React.FunctionComponent<{onMove: (evt: JoyStickMoveEvent) => void}>
 */
export const JoyStick = (props) => {
  const radius = "10vw";
  const [active, setActive] = React.useState(false);
  const moveEventRef = React.useRef(null);
  const containerRef = React.useRef(null);
  const stickRef = React.useRef(null);

  gameLoop.useTick(() => {
    if (moveEventRef.current) {
      props.onMove(moveEventRef.current);
      setStickStyle(
        stickRef.current.style,
        moveEventRef.current.xDistance,
        moveEventRef.current.yDistance
      );
    } else {
      setStickStyle(stickRef.current.style, 0, 0);
    }
  });

  return (
    <div
      ref={containerRef}
      style={{
        width: radius,
        height: radius,
        backgroundColor: "rgba(255, 255, 255, 0.2)",
        borderRadius: radius,
        position: "relative",
      }}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseMove={handleMouseMove}
    >
      <div
        ref={stickRef}
        style={{
          width: "1vw",
          height: "1vw",
          backgroundColor: "black",
          borderRadius: "1vw",
          border: "1px solid white",
          position: "absolute",
          transform: "translate(-50%, -50%)",
        }}
      />
    </div>
  );

  /** @param {React.MouseEvent} evt */
  function handleMouseDown(evt) {
    setActive(true);
    if (evt.target === containerRef.current) {
      moveEventRef.current = getMoveEventForMouseEvent(evt);
    }
  }
  function handleMouseUp() {
    setActive(false);
    moveEventRef.current = null;
  }

  /** @param {React.MouseEvent} evt */
  function handleMouseMove(evt) {
    if (active && evt.target === containerRef.current) {
      moveEventRef.current = getMoveEventForMouseEvent(evt);
    }
  }
};

/**
 * @param {React.CSSProperties} style
 * @param {number} xDistance
 * @param {number} yDistance
 */
function setStickStyle(style, xDistance, yDistance) {
  style.left = `${(xDistance + 1) * 50}%`;
  style.top = `${(yDistance + 1) * 50}%`;
}

/** @type JoyStickMoveEvent */
const moveEvent = {
  dominantDirection: "left",
  angle: 0,
  xDistance: 0,
  yDistance: 0,
};

const PI_2 = Math.PI * 2;
/** @type JoyStickMoveEvent["dominantDirection"][] */
const directions = ["left", "up", "right", "down"];

/**
 * @param {number} a
 * @param {number} b
 * @returns {number}
 */
function absMin(a, b) {
  return a > 0 ? Math.min(a, b) : Math.max(a, b);
}

/**
 * @param {React.MouseEvent} evt
 * @returns {JoyStickMoveEvent}
 */
export function getMoveEventForMouseEvent(evt) {
  const target = /** @type any */ (evt.target);
  const offset = getElementOffset(target, evt.clientX, evt.clientY);
  const center = getElementHalfExtents(target);
  const xDistance = (offset.x - center.x) / center.x;
  const yDistance = (offset.y - center.y) / center.y;
  const angle = Math.atan2(yDistance, xDistance);
  const index = Math.floor((angle / PI_2 + 5 / 8) * 4) % 4;

  moveEvent.dominantDirection = directions[index];
  moveEvent.angle = angle;
  moveEvent.xDistance = absMin(xDistance, Math.cos(angle));
  moveEvent.yDistance = absMin(yDistance, Math.sin(angle));

  return moveEvent;
}

/**
 * @param {HTMLElement} elem
 * @param {number} clientX
 * @param {number} clientY
 * @returns {{ x: number; y: number }}
 */
function getElementOffset(elem, clientX, clientY) {
  const rect = elem.getBoundingClientRect();
  return {
    x: clientX - rect.left,
    y: clientY - rect.top,
  };
}
/**
 * @param {HTMLElement} elem
 * @returns {{ x: number; y: number }}
 */
function getElementHalfExtents(elem) {
  const rect = elem.getBoundingClientRect();
  return {
    x: rect.width / 2,
    y: rect.height / 2,
  };
}
