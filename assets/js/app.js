import "../css/app.css";
import "reset-css";
import "phoenix_html";
import NProgress from "nprogress";
import { gameLoop, createLocalPlayer } from "./world";
import { startReactApp } from "./react";

NProgress.start();

gameLoop.start();
createLocalPlayer();
startReactApp();

NProgress.done();
