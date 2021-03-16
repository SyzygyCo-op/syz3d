import "../css/app.css";
import "phoenix_html";
import NProgress from "nprogress";
import { startWorldLoop } from "./world";
import { startReactApp } from './renderer';

NProgress.start();

startWorldLoop();
startReactApp();

NProgress.done();
