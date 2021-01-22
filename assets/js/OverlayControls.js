import * as React from "react";
import * as ECSY from "ecsy";
import { WelcomeScreenReact } from "./welcome";
import { replaceComponent } from "./utils";
import { RenderReactComponent } from "./renderer";

/**
 * @type React.ComponentType<{entity: ECSY.Entity}>
 */
export const OverlayControlsReact = ({ entity }) => {
  return (
    <div>
      <button onClick={handleClickEdit}>customize avatar</button>
    </div>
  );

  function handleClickEdit() {
    replaceComponent(entity, RenderReactComponent, {
      value: WelcomeScreenReact,
    });
  }
};
