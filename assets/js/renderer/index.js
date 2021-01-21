import * as React from "react";
import * as ECSY from "ecsy";
import ReactDOM from "react-dom";
import { RenderReactComponent, RenderR3FComponent } from "./components";
import { RenderState } from "dreamt";
import { ReactApp } from "./ReactApp";
import { EntityRenderConnector } from "dreamt";

export { RenderReactComponent, RenderR3FComponent };

/**
 * @param {RenderState} observables
 */
function renderToDom(observables) {
  ReactDOM.render(
    <ReactApp observables={observables} />,
    document.getElementById("game")
  );
}

/**
 * @param {ECSY.World} world
 */
export function setupRenderer(world) {
  new EntityRenderConnector(world, {
    renderToDom,
    components: {
      RenderR3FComponent,
      RenderReactComponent,
    },
  });
}
