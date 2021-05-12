import * as React from "react";

/** @type React.FunctionComponent<{side: "left" | "right", zIndex: number}> */
export const SideBar = (props) => {
  return (
    <>
      <div
        style={{
          padding: "5vw",
          position: "fixed",
          maxWidth: "50%",
          height: "100%",
          [props.side]: 0,
          zIndex: props.zIndex
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: props.side === "left" ? "row" : "row-reverse",
            height: "100%",
          }}
        >
          <div
            style={{ display: "flex", flexDirection: "column", height: "100%", justifyContent: "flex-end" }}
          >
            {props.children}
          </div>
        </div>
      </div>
    </>
  );
};
