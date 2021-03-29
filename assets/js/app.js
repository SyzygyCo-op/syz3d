import "../css/app.css";
import "reset-css";
import "phoenix_html";
import NProgress from "nprogress";
import { startWorldLoop, createLocalPlayer } from "./world";
import { startReactApp } from "./react";

NProgress.start();

startWorldLoop();
startReactApp();
createLocalPlayer();

NProgress.done();
