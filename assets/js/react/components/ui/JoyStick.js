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
  const isActiveRef = React.useRef(false);
  const moveEventRef = React.useRef(createMoveEvent());
  const containerRef = React.useRef(null);
  const stickRef = React.useRef(null);

  // TODO should useTick take deps list?
  gameLoop.useTick(() => {
    /** @type {HTMLDivElement} */
    const stick = stickRef.current;
    /** @type {HTMLDivElement} */
    const container = containerRef.current;
    if (isActiveRef.current) {
      props.onMove(moveEventRef.current);
      setStickStyle(
        stick.style,
        moveEventRef.current.xDistance,
        moveEventRef.current.yDistance
      );
      stick.setAttribute("aria-valuetext", getValueText(moveEventRef.current));
      container.setAttribute("aria-pressed", "true");
    } else {
      setStickStyle(stickRef.current.style, 0, 0);
      stick.setAttribute("aria-valuetext", "");
      container.setAttribute("aria-pressed", "false");
    }
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
    if (selection) {
      selection.removeAllRanges();
    }
  }

  /** @param {React.MouseEvent} evt */
  function handleMouseDown(evt) {
    isActiveRef.current = true;
    if (evt.target === containerRef.current) {
      updateMoveEventWithMouseEvent(moveEventRef.current, evt);
    }
  }
  function handleMouseUp() {
    isActiveRef.current = false;
  }

  /** @param {React.MouseEvent} evt */
  function handleMouseMove(evt) {
    if (isActiveRef.current && evt.target === containerRef.current) {
      updateMoveEventWithMouseEvent(moveEventRef.current, evt);
    }
  }

  /** @param {React.TouchEvent} evt */
  function handleTouchStart(evt) {
    isActiveRef.current = true;
    updateMoveEventWithTouchEvent(moveEventRef.current, evt, containerRef.current);
  }
  function handleTouchEnd() {
    isActiveRef.current = false;
  }

  /** @param {React.TouchEvent} evt */
  function handleTouchMove(evt) {
    updateMoveEventWithTouchEvent(moveEventRef.current, evt, containerRef.current);
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

/** @returns JoyStickMoveEvent */
export const createMoveEvent = () => ({
  dominantDirection: /** @type JoyStickMoveEvent["dominantDirection"] */ ("left"),
  angle: 0,
  xDistance: 0,
  yDistance: 0,
});

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
 * @param {JoyStickMoveEvent} evt
 * @param {number} clientX
 * @param {number} clientY
 * @param {HTMLElement} element
 * @returns {JoyStickMoveEvent}
 */
export function updateMoveEvent(evt, clientX, clientY, element) {
  const offset = getElementOffset(element, clientX, clientY);
  const center = getElementHalfExtents(element);
  const xDistance = (offset.x - center.x) / center.x;
  const yDistance = (offset.y - center.y) / center.y;
  const angle = Math.atan2(yDistance, xDistance);
  const index = Math.floor((angle / PI_2 + 5 / 8) * 4) % 4;

  evt.dominantDirection = directions[index];
  evt.angle = angle;
  evt.xDistance = absMin(xDistance, Math.cos(angle));
  evt.yDistance = absMin(yDistance, Math.sin(angle));

  return evt;
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

/**
 * @param {JoyStickMoveEvent} moveEvent
 * @param {React.MouseEvent} mouseEvent
 */
function updateMoveEventWithMouseEvent(moveEvent, mouseEvent) {
  return updateMoveEvent(
    moveEvent,
    mouseEvent.clientX,
    mouseEvent.clientY,
    /** @type any */ (mouseEvent.target)
  );
}
/**
 * @param {JoyStickMoveEvent} moveEvent
 * @param {React.TouchEvent} touchEvent
 * @param {HTMLElement} target
 */
function updateMoveEventWithTouchEvent(moveEvent, touchEvent, target) {
  const touch = touchEvent.touches.item(0);
  return touch
    ? updateMoveEvent(moveEvent, touch.clientX, touch.clientY, /** @type any */ (target))
    : null;
}
