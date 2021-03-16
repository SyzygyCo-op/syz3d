import "../css/app.css";
import "phoenix_html";
import NProgress from "nprogress";
import { startWorldLoop } from "./world";
import { startReactApp } from "./react";

NProgress.start();

startWorldLoop();
startReactApp();

NProgress.done();
