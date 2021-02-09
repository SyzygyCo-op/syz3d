import "../css/app.css";
import "phoenix_html";
import NProgress from "nprogress";
import { handleMount } from "./game";

NProgress.start();
handleMount(() => {
  NProgress.done();
});
