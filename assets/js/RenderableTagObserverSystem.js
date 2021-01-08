import { System, Entity } from "ecsy";
import RenderTagComponent from "./RenderTagComponent";
import * as mobx from "mobx";

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

  execute() {
    if (
      this.queries.renderTags.added.length > 0 ||
      this.queries.renderTags.removed.length > 0
    ) {
      this.setEntities(this.queries.renderTags.results);
    }
  }

  setEntities = mobx.action(
    /**
     * @param {Entity[]} entities
     */
    (entities) => {
      this.results.clear();
      entities.forEach((e) => this.results.add(e));
    }
  );

  /** @type {Set<Entity>} */
  results = mobx.observable.set();
}

export default ReactObserverSystem;
