import "../css/app.css";
import "reset-css";
import "phoenix_html";
import NProgress from "nprogress";
import "./locator";
import { gameLoop, world } from "./world";
import { startReactApp } from "./react";
import { preloadAssets } from "./state";
import { configure } from "mobx";
import {StateSystem} from "./systems";


configure({
  enforceActions: "always",
  computedRequiresReaction: true,
  reactionRequiresObservable: true,
  // Sometimes Systems need to access observables
  observableRequiresReaction: false,
  useProxies: "never",
});

NProgress.start();

console.info("preloading assets");

preloadAssets().then(() => {
  console.info("starting game loop");
  gameLoop.start();
  world.getSystem(StateSystem).observable.setOpenModal("WELCOME")

  startReactApp();

  NProgress.done();
});

