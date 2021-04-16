import * as React from "react";
import ReactDOM from "react-dom";
import { ReactApp } from "./components/ReactApp";
import { world } from "../world";
import { StateSystem } from "../systems";

export function startReactApp() {
  const observable = world.getSystem(StateSystem).observable;
  console.log("starting React renderer");

  ReactDOM.render(
    <ReactApp state={observable} />,
    document.getElementById("game")
  );
}

if (module.hot) {
  module.hot.accept();
  if (module.hot.status() === "apply") {
    startReactApp();
  }
}
