import * as React from "react";
import * as ECSY from "ecsy";
import ReactDOM from "react-dom";
import { RenderReactComponent, RenderR3FComponent } from "./components";
import { RenderState } from "dreamt";
import { ReactApp } from "./ReactApp";
import { world } from '../world';
import { StateSystem } from '../observableState';

export { RenderReactComponent, RenderR3FComponent };

// TODO stop using EntityRenderConnector and pattern after
// https://github.com/nikolajbaer/procgen-bhell/blob/main/src/systems/hud.js

export function startRenderObserver() {
  const observable = world.getSystem(StateSystem).observable;

  ReactDOM.render(
    <ReactApp observableState={observable} />,
    document.getElementById("game")
  );
}

