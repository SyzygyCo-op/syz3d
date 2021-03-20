import "../css/app.css";
import "phoenix_html";
import NProgress from "nprogress";
import { startWorldLoop } from "./world";
import { startReactApp } from "./react";

import 'reset-css';

NProgress.start();

startWorldLoop();
startReactApp();

NProgress.done();
