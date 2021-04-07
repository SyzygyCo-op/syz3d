import "../css/app.css";
import "reset-css";
import "phoenix_html";
import NProgress from "nprogress";
import { gameLoop, createLocalPlayer } from "./world";
import { startReactApp } from "./react";
import { preloadAvatars } from "./state";
import { configure } from "mobx";

configure({
  enforceActions: "always",
  computedRequiresReaction: true,
  reactionRequiresObservable: true,
  // Sometimes Systems need to access observables
  observableRequiresReaction: false,
  useProxies: "never"
});

NProgress.start();

preloadAvatars();

gameLoop.start();
createLocalPlayer();
startReactApp();

NProgress.done();
