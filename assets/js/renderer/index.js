import * as React from "react";
import ReactDOM from "react-dom";
import { RenderR3FComponent } from "./components";
import { ReactApp } from "./ReactApp";
import { world } from '../world';
import { StateSystem } from '../observableState';

export { RenderR3FComponent };

// TODO stop using EntityRenderConnector and pattern after
// https://github.com/nikolajbaer/procgen-bhell/blob/main/src/systems/hud.js

export function startRenderObserver() {
  const observable = world.getSystem(StateSystem).observable;

  ReactDOM.render(
    <ReactApp observableState={observable} />,
    document.getElementById("game")
  );
}

