import "../css/app.scss";
import "phoenix_html";
import NProgress from "nprogress";
import { handleMount } from "./game";

NProgress.start();
handleMount((fn) => {
  NProgress.done();
});
