import "../css/app.scss";
import "phoenix_html";
import NProgress from "nprogress";
import { handleMount } from "./game";
import { configure } from "mobx";

configure({
  useProxies: "ifavailable",
});

NProgress.start();
handleMount((fn) => {
  NProgress.done();
});
