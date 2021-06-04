import * as React from "react";

/** @type React.CSSProperties */
const style = { listStylePosition: "inside" }

/**
 * @typedef {{
 *   ordered?: boolean;
 * }} IProps
 * @type React.FunctionComponent<IProps>
 */
const _List = (props) => {
  return props.ordered ? (
    <ol style={{...style, listStyleType: "decimal"}}>{props.children}</ol>
  ) : (
    <ul style={{...style, listStyleType: "disc"}}>{props.children}</ul>
  );
};

/** @type React.FunctionComponent */
const Item = (props) => {
  return <li>{props.children}</li>;
};

/** @type {typeof _List & { Item: typeof Item }} */
export const List = Object.assign(_List, { Item });
