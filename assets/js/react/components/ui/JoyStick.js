import * as React from "react";
import { gameLoop } from "../../../world";

/**
 * @typedef {{
 *   dominantDirection: "left" | "right" | "up" | "down";
 *   angle: number;
 *   xDistance: number;
 *   yDistance: number;
 * }} JoyStickMoveEvent
 * @type React.FunctionComponent<{label: String, onMove: (evt:
 *   JoyStickMoveEvent) => void}>
 */
export const JoyStick = (props) => {
  const radius = "30vw";
  const stickRadius = "3vw";
  const [active, setActive] = React.useState(false);
  const moveEventRef = React.useRef(null);
  const containerRef = React.useRef(null);
  const stickRef = React.useRef(null);

  gameLoop.useTick(() => {
    /** @type {HTMLDivElement} */
    const stick = stickRef.current;
    if (moveEventRef.current) {
      props.onMove(moveEventRef.current);
      setStickStyle(
        stick.style,
        moveEventRef.current.xDistance,
        moveEventRef.current.yDistance
      );
    } else {
      setStickStyle(stickRef.current.style, 0, 0);
    }
    stick.setAttribute("aria-valuetext", getValueText(moveEventRef.current));
  });

  return (
    <label
      style={{
        textAlign: "center",
        textTransform: "uppercase",
        textShadow: "1px 1px 1px rgba(0, 0, 0, 0.5)",
        userSelect: "none",
      }}
      onTouchMove={clearTextSelection}
    >
      {props.label}
      <div
        role="button"
        aria-pressed={active}
        ref={containerRef}
        style={{
          width: radius,
          height: radius,
          borderRadius: radius,
          backgroundColor: "rgba(255, 255, 255, 0.2)",
          position: "relative",
          userSelect: "none",
        }}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div
          role="slider"
          ref={stickRef}
          style={{
            width: stickRadius,
            height: stickRadius,
            borderRadius: stickRadius,
            backgroundColor: "black",
            border: "1px solid white",
            position: "absolute",
            transform: "translate(-50%, -50%)",
            userSelect: "none",
          }}
        />
      </div>
    </label>
  );

  function clearTextSelection() {
    const selection = window.getSelection();
    if(selection) {
      selection.removeAllRanges();
    }
  }

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

  /** @param {React.TouchEvent} evt */
  function handleTouchStart(evt) {
    setActive(true);
    moveEventRef.current = getMoveEventForTouchEvent(evt, containerRef.current);
  }
  function handleTouchEnd() {
    setActive(false);
    moveEventRef.current = null;
  }

  /** @param {React.TouchEvent} evt */
  function handleTouchMove(evt) {
    moveEventRef.current = getMoveEventForTouchEvent(evt, containerRef.current);
  }
};

/** @param {JoyStickMoveEvent} evt */
function getValueText(evt) {
  return evt ? `${evt.xDistance}, ${evt.yDistance}` : `0, 0`;
}

/**
 * @param {CSSStyleDeclaration} style
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
 * @param {number} clientX
 * @param {number} clientY
 * @param {HTMLElement} target
 * @returns {JoyStickMoveEvent}
 */
export function getMoveEvent(clientX, clientY, target) {
  const offset = getElementOffset(target, clientX, clientY);
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

/** @param {React.MouseEvent} evt */
function getMoveEventForMouseEvent(evt) {
  return getMoveEvent(evt.clientX, evt.clientY, /** @type any */ (evt.target));
}
/**
 * @param {React.TouchEvent} evt
 * @param {HTMLElement} target
 */
function getMoveEventForTouchEvent(evt, target) {
  const touch = evt.touches.item(0);
  return touch
    ? getMoveEvent(touch.clientX, touch.clientY, /** @type any */ (target))
    : null;
}
