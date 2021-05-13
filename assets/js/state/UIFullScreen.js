
import * as MOBX from "mobx";

export class UIFullScreen {
  isActive = false;
  /** @type {HTMLElement} */
  element;

  enabled() {
    return document.fullscreenEnabled;
  }

  request() {
    this.element.requestFullscreen().then(() => this.isActive = true)
  }

  exit() {
    document.exitFullscreen();
    this.isActive = false;
  }

  toggle() {
    if(this.isActive) {
      this.exit();
    } else {
      this.request();
    }
  }

  /** @param {HTMLElement} element */
  setElement(element) {
    this.element = element;
  }

  constructor() {
    MOBX.makeAutoObservable(this);
  }
}

