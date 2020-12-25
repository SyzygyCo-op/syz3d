import { Subject } from "rxjs";
import { System, Entity } from "ecsy";
import RenderTagComponent from "./RenderTagComponent";

class ReactObserverSystem extends System {
  static queries = {
    renderTags: {
      components: [RenderTagComponent],
      listen: {
        added: true,
        removed: true,
      },
    },
  };

  static subject = new Subject();

  /**
   * @param {(entities: Entity[]) => void} fn
   */
  static subscribe(fn) {
    return ReactObserverSystem.subject.subscribe(fn);
  }

  execute() {
    if (
      this.queries.renderTags.added.length > 0 ||
      this.queries.renderTags.removed.length > 0
    ) {
      ReactObserverSystem.subject.next(this.queries.renderTags.results);
    }
  }
}

export default ReactObserverSystem;
