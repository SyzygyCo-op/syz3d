import * as React from "react";
import ReactDOM from "react-dom";
import { RenderR3FComponent } from "./components";
import { ReactApp } from "./ReactApp";
import { world } from '../world';
import { StateSystem } from '../observableState';

export { RenderR3FComponent };

export function startReactApp() {
  const observable = world.getSystem(StateSystem).observable;

  ReactDOM.render(
    <ReactApp observableState={observable} />,
    document.getElementById("game")
  );
}

