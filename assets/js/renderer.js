import * as ECSY from "ecsy";
import * as MOBX from "mobx";
import * as React from "react";
import ReactDOM from "react-dom";
import { Canvas } from "react-three-fiber";
import { observer } from "mobx-react-lite";

export class RenderR3FComponent extends ECSY.Component {
  static schema = {
    value: { type: ECSY.Types.Ref },
  };
}

export class RenderSystem extends ECSY.System {
  init() {
    const App = observer(() => {
      return (
        <Canvas>
          {Array.from(this.results).map((entity) => {
            const R3F = entity.getComponent(RenderR3FComponent).value;
            return <R3F entity={entity} key={entity.id} />;
          })}
        </Canvas>
      );
    });

    ReactDOM.render(<App />, document.getElementById("game"));
  }

  static queries = {
    r3f: {
      components: [RenderR3FComponent],
      listen: {
        added: true,
        removed: true,
      },
    },
  };

  execute() {
    if (
      this.queries.r3f.added.length > 0 ||
      this.queries.r3f.removed.length > 0
    ) {
      this.setEntities(this.queries.r3f.results);
    }
  }

  setEntities = MOBX.action(
    /**
     * @param {ECSY.Entity[]} entities
     */
    (entities) => {
      this.results.clear();
      entities.forEach((e) => this.results.add(e));
    }
  );

  /** @type {Set<ECSY.Entity>} */
  results = MOBX.observable.set();
}
