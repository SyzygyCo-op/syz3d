import "../css/app.css";
import "phoenix_html";
import NProgress from "nprogress";
import { startWorldLoop } from "./world";
import { startRenderObserver } from './renderer';

NProgress.start();

startWorldLoop();
startRenderObserver();

NProgress.done();
