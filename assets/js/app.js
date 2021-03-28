import "../css/app.css";
import "reset-css";
import "phoenix_html";
import NProgress from "nprogress";
import { startWorldLoop, createLocalPlayer } from "./world";
import { startReactApp, preload } from "./react";

NProgress.start();

startWorldLoop();
preload();
startReactApp();
createLocalPlayer();

NProgress.done();
